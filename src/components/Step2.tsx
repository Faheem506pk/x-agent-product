interface Step2Props {
  researchOutput: {
    trends: string[];
    market_insights: string[];
  };
}

const Step2 = ({ researchOutput }: Step2Props) => {
  let parsedData;
  try {
    parsedData = researchOutput || null;
  } catch (error) {
    console.error('Error processing research output:', error);
  }

  return (
    <div>
      <div className="space-y-6">
        {/* Trending Topics Section */}
        <div className="rounded-2xl bg-slate-50 p-6 shadow-lg">
          <h3 className="mb-4 text-xl font-semibold text-gray-800">
            Trending Topics
          </h3>
          <div className="space-y-2">
            {parsedData?.trends && parsedData.trends.length > 0 ? (
              <ul className="list pb-2 pl-2 text-gray-700">
                {parsedData.trends.map((trend: string, index: number) => (
                  <li key={index} className="text-base">
                    {trend}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No trends data available</p>
            )}
          </div>
        </div>

        {/* Market Insights Section */}
        <div className="rounded-2xl bg-slate-50 p-6 shadow-lg">
          <h3 className="mb-4 text-xl font-semibold text-gray-800">
            Market Insights
          </h3>
          <div className="space-y-2">
            {parsedData?.market_insights &&
            parsedData.market_insights.length > 0 ? (
              <ul className="list-disc pl-6 text-gray-700">
                {parsedData.market_insights.map(
                  (insight: string, index: number) => (
                    <li key={index} className="text-base">
                      {insight}
                    </li>
                  ),
                )}
              </ul>
            ) : (
              <p className="text-gray-500">No market insights available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2;
