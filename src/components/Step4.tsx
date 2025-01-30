import { Button } from '@/components/ui/button';
import { useAtom } from 'jotai';
import {
  selectedThreadAtom,
  selectedContentAtom,
  loadingMessageAtom,
} from '@/store/apiStore';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { generateOutput } from '@/lib/type';
import { edit } from '@/core/api';

interface Step4Props {
  generateOutput?: generateOutput; // Make it optional
}

const Step4 = ({ generateOutput }: Step4Props) => {
  const [SelectedThread] = useAtom(selectedThreadAtom);
  const [toneAccuracy, setToneAccuracy] = useState('');
  const [contentQuality, setContentQuality] = useState('');
  const [loading, setLoading] = useState(false);

  const [selectedContent, setSelectedContent] = useAtom(selectedContentAtom);
  const [, setLoadingMessage] = useAtom(loadingMessageAtom);
  const [improvement, setImprovement] = useState({
    hook: false,
    examples: false,
    flow: false,
    cta: false,
  });
  const [additionalComments, setAdditionalComments] = useState('');
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (generateOutput) {
      // Use a functional update to avoid potential stale closure issues
      setSelectedContent(() => ({
        hook: generateOutput?.hook || 'No hook available.',
        story: generateOutput?.story || 'No story available.',
        cta: generateOutput?.cta || 'No call-to-action available.',
      }));
    }
  }, [generateOutput]); // Remove setSelectedContent from dependencies

  useEffect(() => {
    const isHookSelected =
      improvement.hook ||
      improvement.examples ||
      improvement.flow ||
      improvement.cta;
    setIsValid(isHookSelected);
  }, [improvement]);

  const resetForm = () => {
    setToneAccuracy('');
    setContentQuality('');
    setImprovement({
      hook: false,
      examples: false,
      flow: false,
      cta: false,
    });
    setAdditionalComments('');
  };

  const handleSubmit = async () => {
    const feedback = {
      What_needs_improvement: Object.entries(improvement)
        .filter(([_, value]) => value)
        .map(([key]) => key),
      Tone_Accuracy: toneAccuracy || null,
      Content_Quality: contentQuality || null,
      Additional_Comments: additionalComments || null,
    };
    setLoadingMessage('We are improving this content... ');
    const requestBody = {
      tweaks: {
        'TextInput-qp57q': { input_value: selectedContent.hook },
        'TextInput-ZGgvn': { input_value: selectedContent.cta },
        'TextInput-8Y188': { input_value: selectedContent.story },
        'TextInput-6wyUR': { input_value: JSON.stringify(feedback) },
      },
    };

    try {
      setLoading(true);
      const editResp = await edit(requestBody);
      setLoading(false);
      resetForm();

      const editResult =
        editResp.data?.outputs?.[0]?.outputs?.[0]?.results?.message?.data?.text;

      if (editResp.status !== 200 || !editResult) {
        throw new Error('Error generating ideas');
      }

      const parsededitOutput: generateOutput = JSON.parse(editResult);
      console.debug('parsededit Output: ', parsededitOutput);
      if (
        !parsededitOutput ||
        !parsededitOutput.hook ||
        !parsededitOutput.story ||
        !parsededitOutput.cta
      ) {
        console.error('Invalid parsed output', parsededitOutput);
        throw new Error('Invalid output format');
      }

      setSelectedContent({
        hook: parsededitOutput.hook || 'No hook available.',
        story: parsededitOutput.story || 'No story available.',
        cta: parsededitOutput.cta || 'No call-to-action available.',
      });

      // console.debug('Edit Response:', parsededitOutput.hook);
      // console.debug('Edit Result:', parsededitOutput.story);
      console.debug('Parsed Edit Output:', parsededitOutput.cta);
      // console.debug('selectedContent Output:', selectedContent);
    } catch (error) {
      toast.error('Failed to submit feedback');
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="space-y-4">
        <div className="rounded-2xl bg-slate-100 p-4">
          <h3 className="mb-2 font-medium">
            {SelectedThread} : Which One's Your Favorite?
          </h3>
          <div className="space-y-3">
            {/* Dynamically Render Hook */}
            <div className="rounded border bg-white p-3">
              <p className="font-medium">🪝 Hook</p>
              <p className="text-sm text-gray-700">{selectedContent.hook}</p>
            </div>

            {/* Dynamically Render Story */}
            <div className="rounded border bg-white p-3">
              <p className="font-medium">📖 Story</p>
              <p className="text-sm text-gray-700">{selectedContent.story}</p>
            </div>

            {/* Dynamically Render CTA */}
            <div className="rounded border bg-white p-3">
              <p className="font-medium">🎯 CTA</p>
              <p className="text-sm text-gray-700">{selectedContent.cta}</p>
            </div>
          </div>

          <div className="space-y-4 border-t pt-4">
            <h4 className="text-sm font-medium">
              How can we improve this content?
            </h4>

            {/* Specific Elements Feedback */}
            <div className="rounded border bg-white p-3">
              <label className="mb-2 block text-sm font-medium">
                What needs improvement?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={improvement.hook}
                    onChange={() =>
                      setImprovement((prev) => ({
                        ...prev,
                        hook: !prev.hook,
                      }))
                    }
                  />
                  <span className="text-sm">Hook</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={improvement.flow}
                    onChange={() =>
                      setImprovement((prev) => ({
                        ...prev,
                        flow: !prev.flow,
                      }))
                    }
                  />
                  <span className="text-sm">Flow</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={improvement.cta}
                    onChange={() =>
                      setImprovement((prev) => ({
                        ...prev,
                        cta: !prev.cta,
                      }))
                    }
                  />
                  <span className="text-sm">Call to Action</span>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {/* Tone Feedback */}
              <div className="rounded border bg-white p-3">
                <label className="mb-2 block text-sm font-medium">
                  Tone Accuracy
                </label>
                <select
                  className={`w-full rounded border p-2 text-sm ${
                    !isValid ? 'cursor-not-allowed bg-gray-200' : ''
                  }`}
                  value={toneAccuracy}
                  disabled={!isValid}
                  onChange={(e) => setToneAccuracy(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="too_formal">Too Formal</option>
                  <option value="too_casual">Too Casual</option>
                  <option value="too_aggressive">Too Aggressive</option>
                  <option value="perfect">Just Right</option>
                </select>
              </div>

              {/* Content Quality */}
              <div className="rounded border bg-white p-3">
                <label className="mb-2 block text-sm font-medium">
                  Content Quality
                </label>
                <select
                  className={`w-full rounded border p-2 text-sm ${
                    !isValid ? 'cursor-not-allowed bg-gray-200' : ''
                  }`}
                  value={contentQuality}
                  disabled={!isValid}
                  onChange={(e) => setContentQuality(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="too_basic">Too Basic</option>
                  <option value="too_complex">Too Complex</option>
                  <option value="too_long">Too Long</option>
                  <option value="too_short">Too Short</option>
                  <option value="perfect">Just Right</option>
                </select>
              </div>
            </div>

            {/* Detailed Feedback */}
            <div className="rounded border bg-white p-3">
              <label className="mb-2 block text-sm font-medium">
                Additional Feedback
              </label>
              <textarea
                className={`h-24 w-full resize-none rounded border p-2 text-sm ${
                  !isValid ? 'cursor-not-allowed bg-gray-200' : ''
                }`}
                placeholder="Please provide specific suggestions for improvement..."
                value={additionalComments}
                disabled={!isValid}
                onChange={(e) => setAdditionalComments(e.target.value)}
              />
            </div>

            {/* Submit Feedback */}
            <div className="flex justify-end space-x-2">
              <Button
                variant="default"
                size="sm"
                className="bg-blue-600"
                onClick={handleSubmit}
                disabled={!isValid || loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-white"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-white delay-200"></div>
                    <div className="delay-400 h-2 w-2 animate-bounce rounded-full bg-white"></div>
                  </div>
                ) : (
                  'Regenerate'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step4;
