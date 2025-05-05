
// API Configuration
// These values are loaded from environment variables or use provided defaults

export const apiConfig = {
  // Azure OpenAI Configuration
  azureOpenAI: {
    isEnabled: true,
    endpoint: "https://ai-kaniujeffray7064ai233651742665.openai.azure.com/",
    apiKey: "FiwgwdRSeBh3e45430pUCXDax50y8MqSkEjL3BvrGPmauvsvh6BzJQQJ99BDACHYHv6XJ3w3AAAAACOGBna5",
    deploymentName: "gpt-4o",
    apiVersion: "2024-12-01-preview"
  },
  
  // Social Media APIs
  twitter: {
    isEnabled: true,
    bearerToken: "AAAAAAAAAAAAAAAAAAAAANXR0gEAAAAAVUL%2BszDoveFykAyxtKIb7gXAISY%3DLHuwzojsOGRhdn2WbJLwZuwuO7urTbEltBpCbHV9Nbmp8a8AHF"
  },
  
  // Telegram Configuration
  telegram: {
    isEnabled: true,
    apiId: 24998427,
    apiHash: "2d1a638860d3dd1f5a919108f687d5bf",
    channels: ["BBCBreaking", "cnnbrk", "AJEnglish", "NTVKenyaOfficial", "citizentvkenya", "standardkenya", "NationMediaGroup"]
  },
  
  // YouTube API Configuration
  youtube: {
    isEnabled: false, // Not configured yet
  },
  
  // RSS Feed Configuration
  rssFeeds: {
    isEnabled: true,
    feeds: [
      "https://feeds.bbci.co.uk/news/world/africa/rss.xml",
      "https://rss.cnn.com/rss/edition.rss",
      "https://www.reutersagency.com/feed/?best-sectors=africa",
      "https://www.theguardian.com/world/rss",
      "https://nation.africa/kenya/rss",
      "https://www.standardmedia.co.ke/rss/headlines.php"
    ],
    // Add additional Kenya-specific feeds that might have William Ruto news
    kenyaFeeds: [
      "https://www.the-star.co.ke/rss/",
      "https://www.kbc.co.ke/rss/",
      "https://www.capitalfm.co.ke/news/feed/"
    ]
  },

  // Search API Configuration
  serpApi: {
    isEnabled: true,
    apiKey: "afec5d2454c0db8975cab38f0df3373f7fe63529a24b9b740f1ed622fa611372"
  },

  // Images API Configuration
  pexels: {
    isEnabled: true,
    apiKey: "GQxvgyyXd9lcNKaCw7Zv9DNiP61Wu2KACDLbouvbNSqTW1F8HalFRw2d"
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
  aiSummarization: true
};
