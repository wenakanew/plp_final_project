
import { toast } from "sonner";
import { apiConfig } from "../config/api-config";

export interface RssItem {
  id: string;
  title: string;
  description: string;
  content: string;
  link: string;
  source: string;
  sourceUrl: string;
  imageUrl?: string;
  publishDate: string;
  sentiment?: "positive" | "neutral" | "negative";
}

// Helper function to parse RSS XML to JSON
const parseRSS = (xml: string): RssItem[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "application/xml");
  const items = doc.querySelectorAll("item");
  
  return Array.from(items).map((item, index) => {
    // Extract image URL from content if available
    const contentNode = item.querySelector("content\\:encoded, encoded")?.textContent || 
                        item.querySelector("description")?.textContent || "";
    
    // Simple regex to find the first image in the content
    const imgMatch = contentNode.match(/<img[^>]+src="([^">]+)"/);
    const imageUrl = imgMatch ? imgMatch[1] : undefined;
    
    // Get the source from the feed
    const sourceElement = doc.querySelector("channel > title");
    const source = sourceElement ? sourceElement.textContent || "" : "";
    const sourceUrlElement = doc.querySelector("channel > link");
    const sourceUrl = sourceUrlElement ? sourceUrlElement.textContent || "" : "";

    // Generate a random sentiment (in a real app, this would use NLP)
    const sentiments: Array<"positive" | "neutral" | "negative"> = ["positive", "neutral", "negative"];
    const randomSentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
    
    return {
      id: `${source.toLowerCase().replace(/\s/g, '-')}-${index}`,
      title: item.querySelector("title")?.textContent || "",
      description: item.querySelector("description")?.textContent?.replace(/<[^>]*>/g, "") || "",
      content: contentNode,
      link: item.querySelector("link")?.textContent || "",
      source: source,
      sourceUrl: sourceUrl,
      imageUrl: imageUrl,
      publishDate: item.querySelector("pubDate")?.textContent || new Date().toISOString(),
      sentiment: randomSentiment,
    };
  });
};

export const fetchRssFeeds = async (): Promise<RssItem[]> => {
  if (!apiConfig.rssFeeds.isEnabled || apiConfig.rssFeeds.feeds.length === 0) {
    console.error("RSS feeds are not enabled or no feeds are configured");
    return [];
  }

  try {
    const feedPromises = apiConfig.rssFeeds.feeds.map(async (feedUrl) => {
      try {
        // Use a CORS proxy for development
        const corsProxy = "https://corsproxy.io/?";
        const response = await fetch(`${corsProxy}${encodeURIComponent(feedUrl)}`);
        
        if (!response.ok) {
          console.error(`Failed to fetch RSS feed: ${feedUrl}`);
          return [];
        }
        
        const xmlText = await response.text();
        return parseRSS(xmlText);
      } catch (error) {
        console.error(`Error fetching RSS feed ${feedUrl}:`, error);
        return [];
      }
    });
    
    const results = await Promise.all(feedPromises);
    return results.flat();
  } catch (error) {
    console.error("Error fetching RSS feeds:", error);
    toast.error("Failed to fetch news sources. Please try again later.");
    return [];
  }
};

// Process RSS items and prepare them for display
export const processRssItems = (items: RssItem[], searchTerm?: string): RssItem[] => {
  // Filter by search term if provided
  let filteredItems = items;
  
  if (searchTerm && searchTerm.trim() !== "") {
    const term = searchTerm.toLowerCase();
    filteredItems = items.filter(item => 
      item.title.toLowerCase().includes(term) || 
      item.description.toLowerCase().includes(term) ||
      item.content.toLowerCase().includes(term)
    );
  }
  
  // Sort by date (most recent first)
  filteredItems.sort((a, b) => {
    return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
  });
  
  return filteredItems;
};
