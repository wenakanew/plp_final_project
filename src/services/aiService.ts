
import { toast } from "sonner";
import { apiConfig } from "../config/api-config";
import { RssItem } from "./rssService";

interface SummaryResult {
  summary: string;
  topics: string[];
  entities: { name: string; type: string }[];
  article: string; // New field for the generated news article
}

// Use Azure OpenAI to generate a summary and news article
export const generateSummary = async (items: RssItem[]): Promise<SummaryResult | null> => {
  // Check if Azure OpenAI is configured
  if (!apiConfig.azureOpenAI.isEnabled) {
    console.log("Azure OpenAI is not enabled, using mock summarization");
    return mockSummarization(items);
  }

  try {
    // Extract titles and descriptions from RSS items
    const contentToSummarize = items.map(item => ({
      title: item.title,
      description: item.description,
      source: item.source,
      link: item.link,
      publishDate: item.publishDate
    }));

    // Prepare prompt for Azure OpenAI
    const prompt = {
      messages: [
        {
          role: "system",
          content: "You are a professional news editor that specializes in creating high-quality news articles based on multiple sources. Create a concise, well-structured news article that combines information from the provided sources. Organize the article with a compelling headline, a strong introduction, detailed body paragraphs, and a conclusion. Include relevant facts, quotes, and mention the sources."
        },
        {
          role: "user",
          content: `Please create a comprehensive news article based on these sources: ${JSON.stringify(contentToSummarize)}`
        }
      ],
      temperature: 0.5,
      top_p: 0.95,
      max_tokens: 800
    };

    // Make request to Azure OpenAI API
    const apiUrl = `${apiConfig.azureOpenAI.endpoint}openai/deployments/${apiConfig.azureOpenAI.deploymentName}/chat/completions?api-version=${apiConfig.azureOpenAI.apiVersion}`;
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiConfig.azureOpenAI.apiKey
      },
      body: JSON.stringify(prompt)
    });
    
    // Parse response
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Azure OpenAI API error:", errorText);
      throw new Error(`Azure OpenAI API returned ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    // Extract entities and topics using a simple keyword extraction
    const entities = extractEntities(items);
    const topics = extractTopics(items);
    
    // Create a summary extract from the first paragraph of the article
    const summary = generatedContent.split('\n\n')[0];
    
    return {
      summary: summary,
      article: generatedContent,
      topics: topics,
      entities: entities
    };
    
  } catch (error) {
    console.error("Error generating AI summary:", error);
    toast.error("There was an error generating the AI summary. Using simplified analysis instead.");
    return mockSummarization(items);
  }
};

// Extract potential entities (people, organizations)
const extractEntities = (items: RssItem[]): { name: string; type: string }[] => {
  const allContent = items.map(item => `${item.title} ${item.description}`).join(' ');
  const entities: { name: string; type: string }[] = [];
  
  // Simple regex for person names (not comprehensive but works for demonstration)
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
  
  return entities.slice(0, 10);
};

// Extract topics using simple keyword frequency
const extractTopics = (items: RssItem[]): string[] => {
  const allContent = items.map(item => `${item.title} ${item.description}`).join(' ').toLowerCase();
  const words = allContent.match(/\b\w{4,}\b/g) || [];
  const commonWords = new Set(['this', 'that', 'these', 'those', 'with', 'from', 'have', 'been', 'were', 'they', 'their', 'would', 'about', 'there', 'which']);
  
  // Count word frequency
  const wordCount: Record<string, number> = {};
  words.forEach(word => {
    if (!commonWords.has(word)) {
      wordCount[word] = (wordCount[word] || 0) + 1;
    }
  });
  
  // Sort by frequency
  return Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word)
    .slice(0, 10);
};

// Mock implementation as fallback
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
  
  // Generate a mock news article
  const articleTitle = items.length > 0 ? `Latest Updates on ${items[0].title.split(' ').slice(0, 3).join(' ')}...` : "Latest News Updates";
  const mockArticle = `${articleTitle}\n\n${summaryParts.join(' ')}\n\nThis news compilation is based on sources from ${items.map(item => item.source).filter((v, i, a) => a.indexOf(v) === i).join(', ')}.`;
  
  return {
    summary: summaryParts.join(' '),
    article: mockArticle,
    topics: extractTopics(items),
    entities: extractEntities(items)
  };
};
