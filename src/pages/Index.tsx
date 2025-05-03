
import React, { useState, useEffect } from "react";
import TopBar from "@/components/TopBar";
import Sidebar from "@/components/Sidebar";
import InputBox from "@/components/InputBox";
import ResultsDisplay from "@/components/ResultsDisplay";
import AnalyticsPanel from "@/components/AnalyticsPanel";
import { useToast } from "@/hooks/use-toast";

const MOCK_RESULTS = [
  {
    id: 1,
    title: "AI Advancements Transform Media Landscape in 2025",
    snippet:
      "Recent developments in AI technology have radically changed how news is consumed. Leading companies are now leveraging natural language processing to analyze vast amounts of news data in real-time, providing users with personalized insights.",
    source: "TechCrunch",
    sourceUrl: "#",
    imageUrl: "https://images.unsplash.com/photo-1677442135066-8d0d49e11384?q=80&w=800&auto=format&fit=crop",
    timestamp: "2 hours ago",
    sentiment: "positive" as const,
  },
  {
    id: 2,
    title: "Global Markets React to New Economic Policies",
    snippet:
      "Stock markets worldwide showed mixed reactions to the implementation of new economic policies aimed at curbing inflation. Analysts are divided on the potential long-term impacts, with some predicting a stabilization period followed by growth.",
    source: "Financial Times",
    sourceUrl: "#",
    timestamp: "5 hours ago",
    sentiment: "neutral" as const,
  },
  {
    id: 3,
    title: "Climate Change: New Study Reveals Accelerating Impact",
    snippet:
      "A comprehensive study published yesterday indicates that the effects of climate change are accelerating faster than previously predicted. The research highlights the urgent need for more aggressive carbon reduction strategies globally.",
    source: "Reuters",
    sourceUrl: "#",
    imageUrl: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?q=80&w=800&auto=format&fit=crop",
    timestamp: "1 day ago",
    sentiment: "negative" as const,
  },
  {
    id: 4,
    title: "Innovation in Renewable Energy Storage Solutions",
    snippet:
      "Breakthrough technology in energy storage has been announced by researchers, potentially solving one of the biggest challenges in renewable energy adoption. The new storage method could make solar and wind power more reliable for consistent energy needs.",
    source: "ScienceDaily",
    sourceUrl: "#",
    timestamp: "3 hours ago",
    sentiment: "positive" as const,
  },
];

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [analyticsPanelCollapsed, setAnalyticsPanelCollapsed] = useState(true);
  const [currentTopic, setCurrentTopic] = useState<string | undefined>();
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const { toast } = useToast();

  const handleSearch = (input: string) => {
    setShowWelcome(false);
    setIsLoading(true);
    setCurrentTopic(input);
    setAnalyticsPanelCollapsed(false);
    
    // Simulate API call
    setTimeout(() => {
      setResults(MOCK_RESULTS);
      setIsLoading(false);
      
      toast({
        title: "Analysis Complete",
        description: `Summarized ${MOCK_RESULTS.length} sources about "${input}"`,
      });
    }, 2000);
  };

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      <TopBar />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Results Area - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4">
            {showWelcome ? (
              <div className="h-full flex flex-col items-center justify-center max-w-lg mx-auto text-center">
                <div className="bg-gradient-to-r from-tunei-primary to-tunei-purple rounded-full p-6 mb-6">
                  <span className="text-4xl font-bold text-white">T</span>
                </div>
                <h1 className="text-3xl font-bold mb-4">Welcome to Tunei</h1>
                <p className="text-lg text-muted-foreground mb-8">
                  Your AI-powered media intelligence platform. Get personalized, real-time insights across the internet.
                </p>
                <p className="text-sm text-muted-foreground">
                  Start by entering a topic or question below
                </p>
                <div className="animate-bounce mt-8">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground"
                  >
                    <path d="M12 5v14M19 12l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            ) : isLoading ? (
              <div className="h-full flex flex-col items-center justify-center">
                <div className="relative w-16 h-16">
                  <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                  <div className="absolute top-1 left-1 right-1 bottom-1 rounded-full border-4 border-t-transparent border-r-primary border-b-transparent border-l-transparent animate-spin" style={{ animationDuration: "1.5s" }}></div>
                </div>
                <p className="mt-4 text-muted-foreground">Analyzing sources about "{currentTopic}"...</p>
              </div>
            ) : (
              <ResultsDisplay results={results} />
            )}
          </div>
          
          {/* Input Box - Fixed at bottom */}
          <div className="border-t border-border p-4">
            <InputBox onSubmit={handleSearch} isLoading={isLoading} />
          </div>
        </div>
        
        {/* Analytics Panel */}
        <AnalyticsPanel isCollapsed={analyticsPanelCollapsed} topic={currentTopic} />
      </div>
    </div>
  );
};

export default Index;
