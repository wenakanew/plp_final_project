
import { toast } from "sonner";
import { apiConfig } from "../config/api-config";
import { RssItem } from "./rssService";

interface SummaryResult {
  summary: string;
  topics: string[];
  entities: { name: string; type: string }[];
}

// Simple mock AI summarization for now
// In production, this would connect to Azure OpenAI or another provider
export const generateSummary = async (items: RssItem[]): Promise<SummaryResult | null> => {
  // Check if Azure OpenAI is configured
  if (!apiConfig.azureOpenAI.isEnabled) {
    console.log("Azure OpenAI is not enabled, using mock summarization");
    return mockSummarization(items);
  }

  try {
    // This is where you would make the actual API call to Azure OpenAI
    // For now, we'll use the mock implementation
    return mockSummarization(items);
  } catch (error) {
    console.error("Error generating AI summary:", error);
    toast.error("There was an error generating the AI summary. Using simplified analysis instead.");
    return mockSummarization(items);
  }
};

// Mock implementation that extracts data from the RSS items
const mockSummarization = (items: RssItem[]): SummaryResult => {
  // Extract all titles and descriptions
  const allContent = items.map(item => `${item.title} ${item.description}`).join(' ');
  
  // Create a simple summary by taking first sentences from different articles
  const summaryParts: string[] = [];
  let totalLength = 0;
  const targetLength = 500;
  
  // Get first sentence from each article until we reach target length
  for (const item of items) {
    if (totalLength >= targetLength) break;
    
    const firstSentence = item.description.split(/[.!?](\s|$)/)[0] + '.';
    if (firstSentence.length > 10) {
      summaryParts.push(firstSentence);
      totalLength += firstSentence.length;
    }
  }
  
  // Simple topic extraction (in a real app, would use NLP/ML)
  const topicWords = new Set<string>();
  const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'of', 'to', 'in', 'on', 'at', 'for', 'with', 'by', 'about', 'as', 'into', 'like', 'through', 'after', 'over', 'between', 'out', 'from', 'up', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'shall', 'should', 'may', 'might', 'must', 'can', 'could', 'that', 'this', 'these', 'those', 'it', 'its', 'they', 'them', 'their', 'what', 'which', 'who', 'whom', 'whose', 'where', 'when', 'why', 'how']);
  
  items.forEach(item => {
    const titleWords = item.title.toLowerCase().match(/\b(\w+)\b/g) || [];
    titleWords.forEach(word => {
      if (word.length > 4 && !commonWords.has(word)) {
        topicWords.add(word);
      }
    });
  });
  
  // Extract potential entities (people, organizations)
  const entities: { name: string; type: string }[] = [];
  const potentialNames = allContent.match(/[A-Z][a-z]+ [A-Z][a-z]+/g) || [];
  
  potentialNames.forEach(name => {
    // Simple heuristic to avoid duplicates
    if (!entities.some(e => e.name === name)) {
      entities.push({
        name,
        // Simple type assignment based on context words
        type: allContent.includes(`President ${name}`) || allContent.includes(`Minister ${name}`) 
          ? "Person - Political Figure"
          : allContent.includes(`CEO ${name}`) || allContent.includes(`founder ${name}`)
          ? "Person - Business Leader"
          : "Person"
      });
    }
  });
  
  // Find organization names (simple heuristic)
  const orgKeywords = ["Inc.", "Corp.", "Company", "Organization", "Agency", "Group", "Ltd"];
  orgKeywords.forEach(keyword => {
    const regex = new RegExp(`[A-Z][A-Za-z]+ ${keyword}`, 'g');
    const matches = allContent.match(regex) || [];
    
    matches.forEach(match => {
      if (!entities.some(e => e.name === match)) {
        entities.push({
          name: match,
          type: "Organization"
        });
      }
    });
  });
  
  return {
    summary: summaryParts.join(' '),
    topics: Array.from(topicWords).slice(0, 10),
    entities: entities.slice(0, 10)
  };
};
