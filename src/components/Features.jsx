export function Features() {
  return (
    <div className="container mx-auto px-4 mt-16">
      <h2 className="text-2xl font-semibold mb-8 text-center">Key Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <FeatureButton>AI-Powered Summaries</FeatureButton>
        <FeatureButton>Interactive Quizzes</FeatureButton>
        <FeatureButton>Question Generation</FeatureButton>
      </div>
      <div className="flex justify-center">
        <FeatureButton className="md:w-1/3">
          Personalized Study Recommendations
        </FeatureButton>
      </div>
    </div>
  );
}

function FeatureButton({ children, className = "" }) {
  return (
    <button 
      className={`w-full bg-[#2A2A2A] text-white rounded-lg py-3 px-6 hover:bg-[#3A3A3A] transition-colors ${className}`}
    >
      {children}
    </button>
  );
}

