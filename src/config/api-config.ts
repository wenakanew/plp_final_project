
// API Configuration
// NOTE: These are placeholder values and API keys are not directly exposed in frontend code
// In production, these would be handled securely through a backend service like Supabase

export const apiConfig = {
  // Azure OpenAI Configuration
  azureOpenAI: {
    isEnabled: false, // Set to true when properly configured on the backend
    endpoint: import.meta.env.VITE_AZURE_OPENAI_ENDPOINT || "",
    deploymentName: import.meta.env.VITE_DEPLOYMENT_NAME || "gpt-4o",
    apiVersion: import.meta.env.VITE_API_VERSION || "2024-12-01-preview"
  },
  
  // Social Media APIs
  twitter: {
    isEnabled: false, // Set to true when properly configured on the backend
  },
  
  // Telegram Configuration
  telegram: {
    isEnabled: false, // Set to true when properly configured on the backend
    channels: import.meta.env.VITE_TELEGRAM_CHANNELS?.split(',') || ["BBCBreaking", "CNN"]
  },
  
  // YouTube API Configuration
  youtube: {
    isEnabled: false, // Set to true when properly configured on the backend
  },
  
  // RSS Feed Configuration
  rssFeeds: {
    isEnabled: true, // We're using RSS feeds directly in the frontend
    feeds: [
      "https://feeds.bbci.co.uk/news/rss.xml",
      "https://rss.cnn.com/rss/edition.rss",
      "https://www.reutersagency.com/feed/?best-sectors=technology",
      "https://techcrunch.com/feed/",
      "https://www.theguardian.com/world/rss",
      "https://www.sciencedaily.com/rss/top.xml"
    ]
  }
};

// Feature flags for the application
export const featureFlags = {
  speechToText: true,
  textToSpeech: true,
  sentimentAnalysis: true,
  imagePreview: true,
  analytics: true,
  pdfExport: true,
  aiSummarization: false // Set to true when properly configured with Azure OpenAI
};
