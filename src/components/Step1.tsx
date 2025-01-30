import { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { Edit, Upload } from 'lucide-react';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useSetAtom } from 'jotai'; // Import useSetAtom
import { pdfContentAtom, isStepValidAtom } from '@/store/apiStore'; // Import the atom
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const MAX_FILE_SIZE_MB = 2;

const Step1 = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [userText, setUserText] = useState('');
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [, setExtractedData] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const setPdfContent = useSetAtom(pdfContentAtom);
  const setIsStepValid = useSetAtom(isStepValidAtom);

  const validateStep = () => {
    const isValid = !!uploadedFile || !!userText.trim();
    setIsStepValid(isValid); // Update the atom
  };

  useEffect(() => {
    validateStep(); // Validate whenever the component loads or changes
  }, [uploadedFile, userText]);

  useEffect(() => {
    setUploadedFile(null);
    setPdfDataUrl(null);
    setUserText('');
    setIsProcessing(false);
    setExtractedData(null);
    setPdfContent(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const removePdf = () => {
    setUploadedFile(null);
    setPdfDataUrl(null);
    setUserText('');
    setIsProcessing(false);
    setExtractedData(null);
    setPdfContent(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const extractTextFromPdf = async (dataUrl: string) => {
    try {
      const pdf = await pdfjs.getDocument(dataUrl).promise;
      let fullText = '';

      // Extract text from each page
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }

      // Create JSON structure with extracted data
      const extractedJson = {
        fileName: uploadedFile?.name || 'unnamed.pdf',
        extractionDate: new Date().toISOString(),
        pageCount: pdf.numPages,
        content: fullText,
        metadata: {
          title: uploadedFile?.name.replace('.pdf', ''),
          size: uploadedFile?.size,
          type: uploadedFile?.type,
        },
      };

      setExtractedData(JSON.stringify(extractedJson, null, 2));
      setPdfContent(extractedJson);
      return extractedJson;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw error;
    }
  };

  const handlePdfUpload = async (file: File) => {
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(
        `File size exceeds ${MAX_FILE_SIZE_MB}MB. Please upload a smaller file.`,
      );
      return;
    }

    setIsProcessing(true);
    setUploadedFile(file);
    validateStep();
    try {
      const reader = new FileReader();
      const dataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
      setPdfDataUrl(dataUrl);
      await extractTextFromPdf(dataUrl);
    } catch (error) {
      console.error('Error processing PDF:', error);
      alert('Error processing PDF. Please try again with a different file.');
      removePdf();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUserTextChange = (text: string) => {
    setUserText(text);
    validateStep();
    // Update pdfContentAtom with the user text
    const userTextJson = {
      fileName: 'userText.txt', // Set a default file name
      extractionDate: new Date().toISOString(),
      pageCount: 1, // Since it's user input, we can assume it's a single "page"
      content: text,
      metadata: {
        title: 'User Text Content',
        size: text.length,
        type: 'text/plain',
      },
    };
    setPdfContent(userTextJson); // Update the atom with user input content
  };

  return (
    <div>
      <div className="space-y-6">
        {/* Upload/Drag and Drop Section */}
        <div className="flex h-[250px] flex-col items-center justify-center rounded-2xl bg-slate-100 p-4">
          <div className="mb-4 flex items-center">
            <Upload className="mr-2 h-5 w-5 text-blue-600" />
            <h3 className="font-medium">
              Upload or Drag & Drop File (.pdf only, max 2MB)
            </h3>
          </div>
          <div
            className={`flex cursor-pointer items-center justify-center rounded-2xl border-2 border-dotted ${
              uploadedFile || userText ? 'border-gray-300' : 'border-blue-500'
            } p-6 hover:bg-blue-50`}
            onClick={() => {
              if (!userText && !uploadedFile && !isProcessing) {
                fileInputRef.current?.click();
              }
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (!userText && !uploadedFile && !isProcessing) {
                const file = e.dataTransfer.files[0];
                if (file && file.type === 'application/pdf') {
                  handlePdfUpload(file);
                } else {
                  alert('Only .pdf files are allowed.');
                }
              }
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            {isProcessing ? (
              <p className="text-blue-600">Processing PDF...</p>
            ) : uploadedFile ? (
              <div className="flex flex-col items-center">
                {pdfDataUrl && (
                  <div className="mb-2 h-10 overflow-hidden">
                    <Document
                      file={pdfDataUrl}
                      error={
                        <p className="text-sm text-red-500">
                          Error loading preview
                        </p>
                      }
                      loading={
                        <p className="text-sm text-blue-500">Loading...</p>
                      }
                    >
                      <Page
                        pageNumber={1}
                        height={40}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                      />
                    </Document>
                  </div>
                )}
                <p className="text-sm text-blue-600">{uploadedFile.name}</p>
              </div>
            ) : userText ? (
              <p className="text-blue-600">
                File upload disabled while writing
              </p>
            ) : (
              <p className="text-blue-600">
                Drag & Drop your .pdf file here or click to upload
              </p>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && file.type === 'application/pdf') {
                handlePdfUpload(file);
              } else if (file) {
                alert('Only .pdf files are allowed.');
              }
            }}
            disabled={isProcessing}
          />
          {uploadedFile && !isProcessing && (
            <div className="mt-4 flex space-x-2">
              <Button variant="outline" onClick={removePdf}>
                Remove
              </Button>
            </div>
          )}
        </div>

        {/* Extracted Data Display */}
        {/* {extractedData && (
          <div className="rounded-2xl bg-slate-100 p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <Edit className="mr-2 h-5 w-5 text-blue-600" />
                <h3 className="font-medium">Extracted Data</h3>
              </div>
              <Button
                variant="outline"
                onClick={downloadJson}
                className="flex items-center"
              >
                <Download className="mr-2 h-4 w-4" />
                Download JSON
              </Button>
            </div>
            <pre className="max-h-96 overflow-auto rounded bg-white p-4 text-sm">
              {extractedData}
            </pre>
          </div>
        )} */}

        {/* Text Area */}
        <div className="rounded-2xl bg-slate-100 p-4">
          <div className="mb-4 flex items-center">
            <Edit className="mr-2 h-5 w-5 text-blue-600" />
            <h3 className="font-medium">Write Text</h3>
          </div>
          <textarea
            className="w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Write your content here..."
            value={userText}
            onChange={(e) => handleUserTextChange(e.target.value)}
            disabled={!!uploadedFile || isProcessing}
          ></textarea>
          {userText && (
            <p className="mt-2 text-sm text-blue-600">
              Writing mode active. File upload disabled.
            </p>
          )}
        </div>

        {/* Analysis Status */}
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <p className="text-sm text-blue-700">
            The system will automatically analyze your content to determine:
          </p>
          <ul className="ml-5 mt-2 list-disc text-sm text-blue-600">
            <li>Writing style and tone</li>
            <li>Target market characteristics</li>
            <li>Content themes and patterns</li>
            <li>Brand voice elements</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Step1;
