import React, { useState, useEffect } from "react";
import TopBar from "@/components/TopBar";
import Sidebar from "@/components/Sidebar";
import InputBox from "@/components/InputBox";
import ResultsDisplay from "@/components/ResultsDisplay";
import AnalyticsPanel from "@/components/AnalyticsPanel";
import { toast } from "sonner";
import { fetchRssFeeds, processRssItems, RssItem } from "../services/rssService";
import { processAnalytics, AnalyticsData } from "../services/analyticsService";
import { generateSummary, generateKenyaMockContent } from "../services/aiService";
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
  const [aiGeneratedArticle, setAiGeneratedArticle] = useState<string | undefined>();
  const [aiTopics, setAiTopics] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"sources" | "article">("sources");
  const [apiError, setApiError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Initialize data on component mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        console.log("Initializing data...");
        const items = await fetchRssFeeds();
        console.log(`Fetched ${items.length} items during initialization`);
        
        if (items.length > 0) {
          setAllItems(items);
          setApiError(null);
        } else {
          setApiError("No data could be fetched from the configured sources.");
        }
      } catch (error) {
        console.error("Failed to initialize data:", error);
        setApiError("Failed to fetch data from sources.");
      } finally {
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    };
    
    initializeData();
  }, [retryCount]); // Add retryCount to dependencies to allow manual refresh

  const handleSearch = async (input: string) => {
    setShowWelcome(false);
    setIsLoading(true);
    setCurrentTopic(input);
    setAnalyticsPanelCollapsed(false);
    setViewMode("sources"); // Reset to sources view for new searches
    setApiError(null);
    
    try {
      console.log(`Processing search for: "${input}"`);
      
      // Special handling for William Ruto or Kenya searches
      const isKenyaRelatedSearch = 
        input.toLowerCase().includes('ruto') || 
        input.toLowerCase().includes('kenya') ||
        input.toLowerCase().includes('william');
      
      // If we haven't loaded any items yet or need fresh data
      let itemsToProcess = allItems;
      if (allItems.length === 0) {
        console.log("No pre-loaded items, fetching fresh data...");
        const freshItems = await fetchRssFeeds();
        setAllItems(freshItems);
        itemsToProcess = freshItems;
      }
      
      console.log(`Processing ${itemsToProcess.length} items for search term: "${input}"`);
      
      // Process items based on search term
      let filteredResults = processRssItems(itemsToProcess, input);
      console.log(`Found ${filteredResults.length} items matching search term`);
      
      // Special handling for Kenya-related searches
      if (isKenyaRelatedSearch && filteredResults.length === 0) {
        console.log("Kenya-related search with no results, generating mock data");
        // Generate Kenya-specific mockup article
        const mockData = generateKenyaMockContent(input);
        
        // Create a synthetic result since we don't have real data
        const syntheticResult: RssItem = {
          id: "synthetic-1",
          title: mockData.article.split("\n\n")[0], // Use headline as title
          description: mockData.summary,
          content: mockData.article,
          link: "https://nation.africa/kenya/",
          publishDate: new Date().toISOString(),
          imageUrl: "https://via.placeholder.com/800x400?text=Kenya+News",
          source: "Tunei AI News",
          sentiment: "neutral",
          categories: mockData.topics
        };
        
        filteredResults = [syntheticResult];
        console.log("Generated synthetic result for Kenya-related search");
        
        // Use the mock article directly
        setAiGeneratedArticle(mockData.article);
        setAiTopics(mockData.topics);
        setResults(filteredResults);
        
        // Generate analytics from synthetic result
        const analytics = processAnalytics(filteredResults);
        setAnalyticsData(analytics);
        
        // Switch to article view
        setViewMode("article");
        toast.success(`Generated an AI article about "${input}"`);
      } else {
        // Standard processing for non-Kenya searches or Kenya searches with results
        setResults(filteredResults);
        
        // Generate analytics from results
        const analytics = processAnalytics(filteredResults);
        setAnalyticsData(analytics);
        
        // Generate AI summary
        console.log("Generating AI summary...");
        const summary = await generateSummary(filteredResults);
        
        if (summary) {
          console.log("AI summary generated successfully");
          setAiGeneratedArticle(summary.article);
          setAiTopics(summary.topics);
          
          // If results are found, toggle to article view automatically
          if (filteredResults.length > 0) {
            setViewMode("article");
            toast.success(`Generated an AI article about "${input}" from ${filteredResults.length} sources`);
          } else {
            // Even with no direct matches, show article view if we have a generated article
            if (summary.article) {
              setViewMode("article");
              toast.info(`Limited sources found for "${input}", but we've generated an article using available data.`);
            } else {
              toast.warning(`No sources found for "${input}". Please try a different search term.`);
            }
          }
        } else {
          console.error("Failed to generate summary");
          toast.error("Could not generate an AI article. Please try a different search term.");
        }
      }
    } catch (error) {
      console.error("Error during search:", error);
      setApiError("There was an error processing your search. Please try again.");
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

  const toggleViewMode = () => {
    setViewMode(prev => prev === "sources" ? "article" : "sources");
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setApiError(null);
    toast.info("Refreshing data sources...");
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
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 relative">
                      <img 
                        src="/tunei-logo.png" 
                        alt="Tunei Logo" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>
                <h1 className="text-3xl font-bold mb-4">Welcome to Tunei</h1>
                <p className="text-lg text-muted-foreground mb-8">
                  Your AI-powered media intelligence platform. Get personalized, real-time insights and AI-generated news articles.
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
                <p className="mt-2 text-xs text-muted-foreground">Generating AI article...</p>
              </div>
            ) : apiError ? (
              <div className="h-full flex flex-col items-center justify-center max-w-lg mx-auto text-center">
                <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full p-6 mb-6">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold mb-4">API Connection Error</h2>
                <p className="mb-6">{apiError}</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Try searching again or with a different topic.
                </p>
                <button 
                  onClick={handleRetry} 
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
                >
                  Refresh Data Sources
                </button>
              </div>
            ) : (
              <ResultsDisplay 
                results={results} 
                searchTerm={currentTopic} 
                aiGeneratedArticle={aiGeneratedArticle}
                topics={aiTopics}
                viewMode={viewMode}
                onToggleViewMode={toggleViewMode}
              />
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
