
import { RssItem } from "./rssService";

export interface AnalyticsData {
  wordCount: number;
  sourcesCount: number;
  articleCount: number;
  sentimentData: { name: string; value: number; color: string }[];
  sourceData: { name: string; articles: number; color: string }[];
  topKeywords: { text: string; value: number }[];
}

// Color mapping for sources
const sourceColors: Record<string, string> = {
  "BBC News": "#bb1919",
  "BBC": "#bb1919",
  "CNN": "#cc0000",
  "Reuters": "#ff8000",
  "TechCrunch": "#0a9e01",
  "ScienceDaily": "#006699",
  "The Guardian": "#052962",
  "Financial Times": "#fff1e5",
  "New York Times": "#000000",
};

// Default colors for sources without specific mapping
const defaultColors = [
  "#38bdf8", "#fb923c", "#a78bfa", "#4ade80", 
  "#f87171", "#facc15", "#c084fc", "#34d399"
];

export const processAnalytics = (items: RssItem[]): AnalyticsData => {
  // Count total words in all articles
  const wordCount = items.reduce((acc, item) => {
    const words = item.description.split(/\s+/).length;
    return acc + words;
  }, 0);

  // Count unique sources
  const sources = new Set(items.map(item => item.source));
  const sourcesCount = sources.size;

  // Count articles
  const articleCount = items.length;

  // Process sentiment data
  const sentimentCounts: Record<string, number> = {
    "Positive": 0,
    "Neutral": 0,
    "Negative": 0
  };

  items.forEach(item => {
    if (item.sentiment === "positive") sentimentCounts["Positive"]++;
    else if (item.sentiment === "negative") sentimentCounts["Negative"]++;
    else sentimentCounts["Neutral"]++;
  });

  const sentimentData = [
    { name: "Positive", value: sentimentCounts["Positive"], color: "#4ade80" },
    { name: "Neutral", value: sentimentCounts["Neutral"], color: "#94a3b8" },
    { name: "Negative", value: sentimentCounts["Negative"], color: "#f87171" }
  ];

  // Process source distribution data
  const sourceDistribution: Record<string, number> = {};
  items.forEach(item => {
    if (sourceDistribution[item.source]) {
      sourceDistribution[item.source]++;
    } else {
      sourceDistribution[item.source] = 1;
    }
  });

  // Convert to array and sort by count
  const sourceEntries = Object.entries(sourceDistribution);
  sourceEntries.sort((a, b) => b[1] - a[1]);
  
  // Take top 5 sources
  const topSources = sourceEntries.slice(0, 5);
  
  // Map to the format needed for charts
  const sourceData = topSources.map(([name, count], index) => {
    // Use predefined color if available, otherwise take from default colors
    const color = sourceColors[name] || defaultColors[index % defaultColors.length];
    
    return {
      name,
      articles: count,
      color
    };
  });

  // Extract keywords (simple implementation - in a real app, use NLP)
  const allText = items.map(item => `${item.title} ${item.description}`).join(' ');
  const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'of', 'to', 'in', 'on', 'at', 'for', 'with', 'by', 'about', 'as', 'into', 'like', 'through', 'after', 'over', 'between', 'out', 'from', 'up', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'shall', 'should', 'may', 'might', 'must', 'can', 'could', 'that', 'this', 'these', 'those', 'it', 'its', 'they', 'them', 'their', 'what', 'which', 'who', 'whom', 'whose', 'where', 'when', 'why', 'how']);
  
  const words = allText.toLowerCase().match(/\b(\w+)\b/g) || [];
  const wordFrequency: Record<string, number> = {};
  
  words.forEach(word => {
    if (word.length > 3 && !commonWords.has(word)) {
      if (wordFrequency[word]) {
        wordFrequency[word]++;
      } else {
        wordFrequency[word] = 1;
      }
    }
  });
  
  const wordEntries = Object.entries(wordFrequency);
  wordEntries.sort((a, b) => b[1] - a[1]);
  
  const topKeywords = wordEntries.slice(0, 10).map(([text, value]) => ({ text, value }));

  return {
    wordCount,
    sourcesCount,
    articleCount,
    sentimentData,
    sourceData,
    topKeywords
  };
};
