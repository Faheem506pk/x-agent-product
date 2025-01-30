import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ChevronRight,
  BookOpen,
  Search,
  Lightbulb,
  PenTool,
  Edit3,
} from 'lucide-react';

import Loading from '@/components/utils/loading';
import { useAtom } from 'jotai';
import {
  activeStepAtom,
  loadingAtom,
  pdfContentAtom,
  selectedThreadAtom,
  loadingMessageAtom,
  isStepValidAtom,
} from '@/store/apiStore';
import { analyze, research, ideation, generate } from '@/core/api';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import Step4 from './components/Step4';
import Step5 from './components/Step5';
// Setting the worker source manually
import { IdeationOutput, generateOutput } from '@/lib/type';

const ContentCreationUX = () => {
  const [activeStep, setActiveStep] = useAtom(activeStepAtom);
  const [loading, setLoading] = useAtom(loadingAtom);
  const [parsedanalyzed, setParsedAnalyzed] = useState(''); // [analyzedOutput]
  const [loadingMessage, setLoadingMessage] = useAtom(loadingMessageAtom);
  const [alltrends, SetAllTrend] = useState('');
  const [SelectedThread] = useAtom(selectedThreadAtom);
  const [isStepValid] = useAtom(isStepValidAtom);
  const [researchOutput, setResearchOutput] = useState({
    trends: [''],
    market_insights: [''],
  });

  const [ideationOutput, setIdeationOutput] = useState<IdeationOutput>();
  const [generateOutput, setGenerateOutput] = useState<generateOutput>();
  const [_content] = useAtom(pdfContentAtom);

  const handleNextStep = async () => {
    try {
      setLoading(true);
      console.debug(`Step: ${activeStep}`);

      if (activeStep === 0) {
        setLoadingMessage(
          'Analyzing pillar content to find trends and keywords on X',
        );
        const analyzeResp = await analyze({ input_value: _content?.content });
        const analyzedOutput =
          analyzeResp.data?.outputs?.[0]?.outputs?.[0]?.results?.message?.text;
        if (analyzeResp.status !== 200 || !analyzedOutput) {
          throw new Error('Error analyzing content');
        }
        console.debug('Analyzed Output: ', analyzedOutput);

        const analyzedOutputJSON = JSON.parse(
          analyzedOutput.replace(/^```json\n?|```$/g, '').trim(),
        );
        console.debug('Research Output JSON: ', analyzedOutputJSON);
        setParsedAnalyzed(analyzedOutputJSON);
        setLoadingMessage(
          'Discovering trending content on X based on pillar content',
        );

        const researchResp = await research({
          input_value: JSON.stringify(analyzedOutputJSON),
        });
        const researchOutputData =
          researchResp.data?.outputs?.[0]?.outputs?.[0]?.results?.message?.text;
        if (researchResp.status !== 200 || !researchOutputData) {
          throw new Error('Error finding trends on X');
        }
        console.debug('Research Output: ', researchOutputData);

        const researchOutputLines = researchOutputData.split('\n');

        // Extract "Trending threads"
        const trendingThreadsIndex = researchOutputLines.findIndex(
          (line: string) => line.includes('### Trending threads'),
        );

        let trends: string[] = [];
        if (trendingThreadsIndex !== -1) {
          const trendsRaw = researchOutputLines[trendingThreadsIndex + 1];
          SetAllTrend(trendsRaw);
          trends = trendsRaw.split(',').map((tag: string) => `#${tag.trim()}`);
        } else {
          console.warn('Trending threads section not found.');
        }

        // Extract "Market Insights"
        const insightsStartIndex = researchOutputLines.findIndex(
          (line: string) => line.includes('### Marking Insights'),
        );
        const insightsEndIndex = researchOutputLines.findIndex(
          (line: string) =>
            line.includes('# Market Opportunities') ||
            line.includes('# Market Challenges'),
        );
        let marketInsights: string[] = [];
        if (insightsStartIndex !== -1) {
          marketInsights = researchOutputLines
            .slice(
              insightsStartIndex + 1,
              insightsEndIndex === -1 ? undefined : insightsEndIndex,
            )
            .filter((line: string) => line.trim() && !line.startsWith('#'))
            .map((line: string) => line.replace(/^\* /, '').trim());
        } else {
          console.warn('Market Insights section not found.');
        }

        // Set the research output
        setResearchOutput({
          trends: trends.length ? trends : ['No trending topics available'],
          market_insights: marketInsights.length
            ? marketInsights
            : ['No market insights available'],
        });
      } else if (activeStep === 1) {
        setLoadingMessage(' ');
        const requestBody = {
          tweaks: {
            'TextInput-HrRJ6': {
              input_value: JSON.stringify({ parsedanalyzed }),
            },
            'TextInput-nCK7J': {
              input_value: alltrends,
            },
          },
        };

        const ideationResp = await ideation(requestBody);
        console.debug(ideationResp);
        const ideationResult =
          ideationResp.data?.outputs?.[0]?.outputs?.[0]?.results?.message?.data
            ?.text;

        if (ideationResp.status !== 200 || !ideationResult) {
          throw new Error('Error generating ideas');
        }

        console.debug('Ideation Output: ', ideationResult);
        const parsedIdeationOutput: IdeationOutput = JSON.parse(ideationResult);
        setIdeationOutput(parsedIdeationOutput);
      } else if (activeStep === 2) {
        setLoadingMessage(' ');
        const requestBody = {
          tweaks: {
            'TextInput-3ONqe': {
              input_value: JSON.stringify({ parsedanalyzed }),
            },
            'TextInput-KHboB': {
              input_value: SelectedThread,
            },
          },
        };

        const generateResp = await generate(requestBody);
        console.debug(generateResp);

        const generateResult =
          generateResp.data?.outputs?.[0]?.outputs?.[0]?.results?.message?.data
            ?.text;

        if (generateResp.status !== 200 || !generateResult) {
          throw new Error('Error generating ideas');
        }

        console.debug('Generate Output: ', generateResult);
        const parsedgenerateOutput: generateOutput = JSON.parse(generateResult);
        setGenerateOutput(parsedgenerateOutput);
      }
      // Proceed to the next step after postPdfContent completes
      setActiveStep((prevStep) => prevStep + 1);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('An unknown error occurred');
      }
      setActiveStep(0);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: '1. Content Import',
      icon: <BookOpen className="h-6 w-6" />,
      content: <Step1 />,
    },

    {
      title: '2. Research Trends',
      icon: <Search className="h-6 w-6" />,
      content: <Step2 researchOutput={researchOutput} />,
    },
    {
      title: '3. Generate Ideas',
      icon: <Lightbulb className="h-6 w-6" />,
      content: <Step3 ideationOutput={ideationOutput} />,
    },
    {
      title: '4. Write Content',
      icon: <PenTool className="h-6 w-6" />,
      content: <Step4 generateOutput={generateOutput} />,
    },
    {
      title: '5. Edit & Refine',
      icon: <Edit3 className="h-6 w-6" />,
      content: <Step5 />,
    },
  ];
  const renderLoadingScreen = () => {
    return <Loading text={loadingMessage} />;
  };
  return (
    <div className="flex min-h-screen w-full items-center justify-center  p-4">
      <Card className="max-h-[100vh] w-full max-w-3xl ">
        <CardHeader>
          <CardTitle>Content Creation Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <div className="space-y-5">
              {/* Progress Steps */}
              <div className="mb-8 flex justify-center">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className={`flex flex-col items-center space-y-2 ${
                      index === activeStep ? 'text-blue-600' : 'text-gray-400'
                    }`}
                    // onClick={() => setActiveStep(index)}
                  >
                    <div className="flex items-center">
                      {/* Icon */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`rounded-full p-2 ${
                            index === activeStep ? 'bg-blue-100' : 'bg-gray-100'
                          }`}
                        >
                          {step.icon}
                        </div>

                        {/* Title */}
                        <span className="w-20 text-center text-xs">
                          {step.title}
                        </span>
                      </div>
                      {/* Dotted Line in between */}
                      {index !== steps.length - 1 && (
                        <div className="mx-2 h-px w-8 border-t-2 border-dotted border-gray-400"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {loading ? (
                renderLoadingScreen()
              ) : (
                // Content Area
                <div className="max-h-[50vh] min-h-[50vh] overflow-y-auto px-3 py-2 2xl:max-h-[70vh] 2xl:min-h-[65vh]">
                  {steps[activeStep].content}
                </div>
              )}

              {/* Navigation */}
              <div>
                <div className="flex justify-between">
                  {activeStep !== steps.length - 1 && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() =>
                          setActiveStep(Math.max(0, activeStep - 1))
                        }
                        disabled={
                          activeStep === 0 || activeStep === steps.length - 1
                        }
                      >
                        Back
                      </Button>

                      <Button
                        onClick={handleNextStep}
                        disabled={
                          !isStepValid || activeStep === steps.length - 1
                        }
                      >
                        {activeStep === 3 ? 'Final Review' : 'Next'}
                        {activeStep === 3 ? (
                          ''
                        ) : (
                          <ChevronRight className="ml-2 h-4 w-4" />
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default ContentCreationUX;
