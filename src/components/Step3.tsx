import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAtom } from 'jotai';
import { isStepValidAtom, selectedThreadAtom } from '@/store/apiStore';
import { ThreadIdea, IdeationOutput } from '@/lib/type';
// Setting the worker source manually

interface Step3Props {
  ideationOutput?: IdeationOutput; // Make it optional
}

const Step3 = ({ ideationOutput }: Step3Props) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [, setIsStepValid] = useAtom(isStepValidAtom);
  const [, setSelectedThread] = useAtom(selectedThreadAtom);

  useEffect(() => {
    setSelectedItem(null); // Reset the selected item
    setIsStepValid(false);
    setSelectedThread(null);
  }, []);

  const handleSelect = (thread: ThreadIdea) => {
    setSelectedItem(thread.suggested_title); // Set selected thread title
    setIsStepValid(true); // Mark step as valid after selection
    setSelectedThread(thread.suggested_title); // Store the selected thread in the atom
  };

  // Check if ideationOutput and thread_ideas are defined before rendering
  if (!ideationOutput || !ideationOutput.thread_ideas) {
    return <div>No ideation output available</div>; // Handle null/undefined case
  }

  return (
    <div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Content Ideas</h3>
          {/* <Button size="sm" variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Ideas
          </Button> */}
        </div>
        <div className="space-y-2">
          {ideationOutput.thread_ideas.map((thread) => (
            <div
              key={thread.suggested_title}
              className={`my-2 flex items-center justify-between rounded-2xl p-3 ${
                selectedItem === thread.suggested_title
                  ? 'bg-blue-100'
                  : 'bg-slate-100'
              }`}
            >
              <div>
                <h4 className="font-medium">{thread.suggested_title}</h4>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleSelect(thread)}
              >
                Select
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Step3;
