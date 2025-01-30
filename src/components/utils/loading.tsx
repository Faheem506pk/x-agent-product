interface LoadingProps {
  text?: string | null; // Allow text to be string or null
}

const Loading: React.FC<LoadingProps> = ({ text = null }) => {
  // Default to null
  return (
    <div className="flex min-h-[50vh] w-full flex-col items-center justify-center p-4 2xl:min-h-[50vh]">
      <div className="flex space-x-2">
        <div className="h-3 w-3 animate-bounce rounded-full bg-black"></div>
        <div className="h-3 w-3 animate-bounce rounded-full bg-black delay-200"></div>
        <div className="delay-400 h-3 w-3 animate-bounce rounded-full bg-black"></div>
      </div>
      {text && <p>{text}</p>} {/* Display the text if provided */}
    </div>
  );
};

export default Loading;
