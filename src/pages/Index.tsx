import React, { useState, useEffect } from "react";
import TopBar from "@/components/TopBar";
import Sidebar from "@/components/Sidebar";
import InputBox from "@/components/InputBox";
import ResultsDisplay from "@/components/ResultsDisplay";
import AnalyticsPanel from "@/components/AnalyticsPanel";
import { toast } from "sonner";
import { fetchRssFeeds, processRssItems, RssItem } from "../services/rssService";
import { processAnalytics, AnalyticsData } from "../services/analyticsService";
import { generateSummary } from "../services/aiService";
import { exportToPDF } from "../services/exportService";

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [analyticsPanelCollapsed, setAnalyticsPanelCollapsed] = useState(true);
  const [currentTopic, setCurrentTopic] = useState<string | undefined>();
  const [results, setResults] = useState<RssItem[]>([]);
  const [allItems, setAllItems] = useState<RssItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Initialize data on component mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        const items = await fetchRssFeeds();
        if (items.length > 0) {
          setAllItems(items);
          setIsInitialLoad(false);
        }
      } catch (error) {
        console.error("Failed to initialize data:", error);
        setIsInitialLoad(false);
      }
    };
    
    initializeData();
  }, []);

  const handleSearch = async (input: string) => {
    setShowWelcome(false);
    setIsLoading(true);
    setCurrentTopic(input);
    setAnalyticsPanelCollapsed(false);
    
    try {
      // If we haven't loaded any items yet or need fresh data
      if (allItems.length === 0) {
        const freshItems = await fetchRssFeeds();
        setAllItems(freshItems);
      }
      
      // Process items based on search term
      const filteredResults = processRssItems(allItems, input);
      setResults(filteredResults);
      
      // Generate analytics from results
      const analytics = processAnalytics(filteredResults);
      setAnalyticsData(analytics);
      
      // Generate AI summary (in production, this would connect to Azure OpenAI)
      const summary = await generateSummary(filteredResults);
      
      toast.success(`Found ${filteredResults.length} sources about "${input}"`);
    } catch (error) {
      console.error("Error during search:", error);
      toast.error("There was an error processing your search. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (results.length === 0) return;
    
    setIsExporting(true);
    await exportToPDF(results, currentTopic);
    setIsExporting(false);
  };

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      <TopBar 
        onExportPDF={handleExportPDF}
        isExporting={isExporting}
        hasResults={results.length > 0}
      />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Results Area - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4">
            {showWelcome ? (
              <div className="h-full flex flex-col items-center justify-center max-w-lg mx-auto text-center">
                <div className="bg-gradient-to-r from-primary to-accent rounded-full p-6 mb-6">
                  <img 
                    src="/lovable-uploads/2095d46f-4c23-4a22-a63b-a183bfc5247e.png" 
                    alt="Tunei Logo" 
                    className="h-10 w-10"
                  />
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
              <ResultsDisplay results={results} searchTerm={currentTopic} />
            )}
          </div>
          
          {/* Input Box - Fixed at bottom */}
          <div className="border-t border-border p-4">
            <InputBox onSubmit={handleSearch} isLoading={isLoading} />
          </div>
        </div>
        
        {/* Analytics Panel */}
        <AnalyticsPanel 
          isCollapsed={analyticsPanelCollapsed} 
          setIsCollapsed={setAnalyticsPanelCollapsed}
          topic={currentTopic} 
          data={analyticsData}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Index;
