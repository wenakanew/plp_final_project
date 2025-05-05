
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

// Try multiple CORS proxies in case one fails
const CORS_PROXIES = [
  "https://corsproxy.io/?",
  "https://api.allorigins.win/raw?url=",
  "https://cors-anywhere.herokuapp.com/"
];

export const fetchRssFeeds = async (): Promise<RssItem[]> => {
  if (!apiConfig.rssFeeds.isEnabled || apiConfig.rssFeeds.feeds.length === 0) {
    console.error("RSS feeds are not enabled or no feeds are configured");
    return [];
  }

  try {
    // Try to use mockData if all else fails to ensure the app has something to display
    const mockData = generateMockData();
    
    const feedPromises = apiConfig.rssFeeds.feeds.map(async (feedUrl) => {
      // Try each CORS proxy in sequence
      for (const corsProxy of CORS_PROXIES) {
        try {
          const response = await fetch(`${corsProxy}${encodeURIComponent(feedUrl)}`, {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
          });
          
          if (response.ok) {
            const xmlText = await response.text();
            const parsedItems = parseRSS(xmlText);
            console.log(`Successfully fetched ${parsedItems.length} items from ${feedUrl}`);
            return parsedItems;
          }
        } catch (err) {
          console.error(`Error with proxy ${corsProxy} for feed ${feedUrl}:`, err);
          // Continue to next proxy
        }
      }
      
      console.error(`All proxies failed for feed: ${feedUrl}, using mock data instead`);
      // Return mock data for this feed to ensure something is displayed
      return mockData.filter((item, idx) => idx % 3 === 0); // Just take a subset of mock data
    });
    
    const results = await Promise.all(feedPromises);
    const flattenedResults = results.flat();
    
    if (flattenedResults.length === 0) {
      console.warn("No RSS items could be fetched, using all mock data");
      return mockData;
    }
    
    return flattenedResults;
  } catch (error) {
    console.error("Error fetching RSS feeds:", error);
    toast.error("Failed to fetch news sources. Using sample data instead.");
    return generateMockData();
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

// Generate mock data to ensure the app works even when RSS feeds are inaccessible
const generateMockData = (): RssItem[] => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const sources = ["BBC News", "CNN", "Reuters", "The Guardian", "Nation Africa", "Standard Media"];
  const sentiments: Array<"positive" | "neutral" | "negative"> = ["positive", "neutral", "negative"];
  
  const mockItems: RssItem[] = [
    {
      id: "mock-1",
      title: "Kenya's Tech Industry Sees Surge in Investment",
      description: "Kenya's technology sector has attracted over $100 million in new investments over the past quarter, signaling growing confidence in the country's digital economy.",
      content: "Kenya's technology sector has attracted over $100 million in new investments over the past quarter, signaling growing confidence in the country's digital economy. Startups focusing on fintech, agritech and healthtech have seen particular interest from international investors.",
      link: "https://example.com/kenya-tech",
      source: sources[0],
      sourceUrl: "https://example.com",
      imageUrl: "https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg",
      publishDate: today.toISOString(),
      sentiment: sentiments[0]
    },
    {
      id: "mock-2",
      title: "Climate Change Impacts East African Agriculture",
      description: "Farmers across East Africa are adapting to changing weather patterns with new techniques and crop varieties.",
      content: "Farmers across East Africa are adapting to changing weather patterns with new techniques and crop varieties. Government initiatives are supporting these transitions with training and subsidized equipment.",
      link: "https://example.com/climate-agriculture",
      source: sources[1],
      sourceUrl: "https://example.com",
      imageUrl: "https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg",
      publishDate: yesterday.toISOString(),
      sentiment: sentiments[1]
    },
    {
      id: "mock-3",
      title: "New Infrastructure Project to Connect East African Nations",
      description: "A major transportation corridor is being developed to facilitate trade between Kenya, Uganda, and Tanzania.",
      content: "A major transportation corridor is being developed to facilitate trade between Kenya, Uganda, and Tanzania. The project includes highways, railways, and digital infrastructure to boost regional commerce.",
      link: "https://example.com/infrastructure",
      source: sources[2],
      sourceUrl: "https://example.com",
      imageUrl: "https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg",
      publishDate: yesterday.toISOString(),
      sentiment: sentiments[0]
    },
    {
      id: "mock-4",
      title: "Healthcare Innovation Challenge Launched in Nairobi",
      description: "A new initiative aims to find technological solutions to healthcare access challenges in rural Kenya.",
      content: "A new initiative aims to find technological solutions to healthcare access challenges in rural Kenya. The program will provide funding and mentorship to selected projects with potential for national scale.",
      link: "https://example.com/healthcare",
      source: sources[3],
      sourceUrl: "https://example.com",
      imageUrl: "https://images.pexels.com/photos/5214949/pexels-photo-5214949.jpeg",
      publishDate: today.toISOString(),
      sentiment: sentiments[2]
    },
    {
      id: "mock-5",
      title: "Educational Reforms Target Digital Literacy",
      description: "Kenya's education ministry announces comprehensive plan to integrate technology skills across all levels of education.",
      content: "Kenya's education ministry announces comprehensive plan to integrate technology skills across all levels of education. The initiative aims to prepare students for an increasingly digital job market.",
      link: "https://example.com/education",
      source: sources[4],
      sourceUrl: "https://example.com",
      imageUrl: "https://images.pexels.com/photos/8471799/pexels-photo-8471799.jpeg",
      publishDate: yesterday.toISOString(),
      sentiment: sentiments[0]
    },
    {
      id: "mock-6",
      title: "Tourism Recovery Efforts Show Promising Results",
      description: "Kenya's tourism sector reports significant growth as international travel restrictions ease.",
      content: "Kenya's tourism sector reports significant growth as international travel restrictions ease. New marketing campaigns and sustainability initiatives are attracting visitors back to the country's parks and beaches.",
      link: "https://example.com/tourism",
      source: sources[5],
      sourceUrl: "https://example.com",
      imageUrl: "https://images.pexels.com/photos/19351937/pexels-photo-19351937/free-photo-of-elephants-and-their-tusks-on-a-savanna.jpeg",
      publishDate: today.toISOString(),
      sentiment: sentiments[0]
    }
  ];
  
  return mockItems;
};
