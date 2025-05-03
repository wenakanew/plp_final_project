
// API Configuration
// NOTE: These are placeholder values and API keys are not directly exposed in frontend code
// In production, these would be handled securely through a backend service like Supabase

export const apiConfig = {
  // Azure OpenAI Configuration
  azureOpenAI: {
    isEnabled: false,
    endpoint: process.env.AZURE_OPENAI_ENDPOINT || "",
    deploymentName: process.env.DEPLOYMENT_NAME || "gpt-4o",
    apiVersion: process.env.API_VERSION || "2024-12-01-preview"
  },
  
  // Social Media APIs
  twitter: {
    isEnabled: false,
  },
  
  // Telegram Configuration
  telegram: {
    isEnabled: false,
    channels: process.env.TELEGRAM_CHANNELS?.split(',') || ["BBCBreaking", "CNN"]
  },
  
  // YouTube API Configuration
  youtube: {
    isEnabled: false,
  },
  
  // RSS Feed Configuration
  rssFeeds: {
    isEnabled: true,
    feeds: [
      "https://feeds.bbci.co.uk/news/rss.xml",
      "https://rss.cnn.com/rss/edition.rss",
      "https://www.reutersagency.com/feed/?best-sectors=technology"
    ]
  }
};

// Feature flags for the application
export const featureFlags = {
  speechToText: true,
  textToSpeech: false,
  sentimentAnalysis: true,
  imagePreview: true,
  analytics: true,
  pdfExport: false
};
