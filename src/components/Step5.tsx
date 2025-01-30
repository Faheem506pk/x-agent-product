import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAtom } from 'jotai';
import { selectedContentAtom } from '@/store/apiStore';

const Step5 = () => {
  const [selectedContent] = useAtom(selectedContentAtom);

  // Initialize the defaultText with selectedContent values
  const defaultText = `${selectedContent.hook}\n\n${selectedContent.story}\n\n${selectedContent.cta}`;

  const [text, setText] = useState(defaultText);
  const [showButtons, setShowButtons] = useState(false);
  const [approvedText, setApprovedText] = useState('');

  useEffect(() => {
    // Determine if buttons should be shown based on whether the text has been modified
    setShowButtons(text !== approvedText && text !== defaultText);
  }, [text, approvedText, defaultText]);

  const handleApprove = () => {
    // Show toast notification for approval
    toast.success('Content has been approved!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    setApprovedText(text);
    setShowButtons(false);
  };

  const handleReject = () => {
    // Show toast notification for rejection
    // Show toast notification for rejection
    toast.error('Changes have been rejected!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    setText(approvedText || defaultText);
    setShowButtons(false);
  };

  return (
    <div>
      <div className="space-y-4">
        <div className="rounded-2xl ">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-medium">Final Review</h3>
            {showButtons && (
              <div className="space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600"
                  onClick={handleReject}
                >
                  <X className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button
                  size="sm"
                  variant="default"
                  className="bg-green-600"
                  onClick={handleApprove}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </div>
            )}
          </div>

          <textarea
            className="max-h-[260px] min-h-[220px] w-full rounded border p-4 text-sm focus:ring-2 focus:ring-blue-500 2xl:max-h-[300px] 2xl:min-h-[250px]"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default Step5;
