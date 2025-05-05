
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
    // Extract relevant data from RSS items
    const contentToSummarize = items.map(item => ({
      title: item.title,
      description: item.description,
      source: item.source,
      link: item.link,
      publishDate: item.publishDate
    }));

    console.log(`Preparing to summarize ${items.length} items with Azure OpenAI`);
    
    // Check if we have enough items to summarize, if not use mock data
    if (items.length < 2) {
      console.log("Not enough items to summarize, generating basic article");
      const mockResult = mockSummarization(items);
      
      // If we have at least one item, attempt to enhance the mock article with real data
      if (items.length === 1) {
        mockResult.article = `${mockResult.article}\n\nThis article includes information from: ${items[0].source}`;
        mockResult.summary = items[0].description;
      }
      
      return mockResult;
    }
    
    // Prepare system prompt for better article generation
    const systemPrompt = `You are a professional news editor that specializes in creating high-quality news articles based on multiple sources. 
Create a concise, well-structured news article that combines information from the provided sources.
Follow this structure:
1. Create a compelling headline (first line of the response)
2. Write a strong introduction summarizing the key points
3. Include 3-4 detailed body paragraphs with relevant facts
4. Add a brief conclusion
5. Mention the original sources where appropriate
Use a formal journalistic tone and ensure factual accuracy. If sources contradict each other, note this in your article.

If the sources mention William Ruto, Kenya's president, make sure to highlight his role and actions prominently in the article.`;

    // Prepare prompt for Azure OpenAI
    const prompt = {
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Please create a comprehensive news article based on these sources: ${JSON.stringify(contentToSummarize)}`
        }
      ],
      temperature: 0.7,
      top_p: 0.95,
      max_tokens: 1000
    };

    // Make request to Azure OpenAI API
    const apiUrl = `${apiConfig.azureOpenAI.endpoint}openai/deployments/${apiConfig.azureOpenAI.deploymentName}/chat/completions?api-version=${apiConfig.azureOpenAI.apiVersion}`;
    
    console.log(`Sending request to Azure OpenAI: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiConfig.azureOpenAI.apiKey
      },
      body: JSON.stringify(prompt),
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(30000) // 30 second timeout
    });
    
    // Parse response
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Azure OpenAI API error:", errorText);
      console.error(`Response status: ${response.status}`);
      throw new Error(`Azure OpenAI API returned ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log("Received response from Azure OpenAI");
    
    const generatedContent = data.choices[0].message.content;
    console.log("Generated content length:", generatedContent.length);

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
  
  // Check specifically for William Ruto
  if (allContent.toLowerCase().includes('ruto') || allContent.toLowerCase().includes('william ruto')) {
    entities.push({
      name: "William Ruto",
      type: "Person - President of Kenya"
    });
  }
  
  // Simple regex for person names (not comprehensive but works for demonstration)
  const potentialNames = allContent.match(/[A-Z][a-z]+ [A-Z][a-z]+/g) || [];
  
  potentialNames.forEach(name => {
    // Skip if already added (like William Ruto)
    if (name === "William Ruto" && entities.some(e => e.name === "William Ruto")) {
      return;
    }
    
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

  // Add Kenya as a location if not already present and relevant
  if (allContent.toLowerCase().includes('kenya') && !entities.some(e => e.name === "Kenya")) {
    entities.push({
      name: "Kenya",
      type: "Location - Country"
    });
  }
  
  return entities.slice(0, 10);
};

// Extract topics using simple keyword frequency
const extractTopics = (items: RssItem[]): string[] => {
  const allContent = items.map(item => `${item.title} ${item.description}`).join(' ').toLowerCase();
  const words = allContent.match(/\b\w{4,}\b/g) || [];
  const commonWords = new Set(['this', 'that', 'these', 'those', 'with', 'from', 'have', 'been', 'were', 'they', 'their', 'would', 'about', 'there', 'which']);
  
  // Add "Kenya" and "Ruto" to topics if they appear in the content
  const forcedTopics = [];
  if (allContent.includes('kenya')) forcedTopics.push('kenya');
  if (allContent.includes('ruto')) forcedTopics.push('ruto');
  
  // Count word frequency
  const wordCount: Record<string, number> = {};
  words.forEach(word => {
    if (!commonWords.has(word)) {
      wordCount[word] = (wordCount[word] || 0) + 1;
    }
  });
  
  // Sort by frequency
  const sortedTopics = Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word)
    .slice(0, 8); // Get top 8 instead of 10 to make room for forced topics
  
  // Combine forced topics and frequency-based topics (ensuring no duplicates)
  const combinedTopics = [...forcedTopics];
  sortedTopics.forEach(topic => {
    if (!combinedTopics.includes(topic)) {
      combinedTopics.push(topic);
    }
  });
  
  return combinedTopics.slice(0, 10);
};

// Mock implementation as fallback
const mockSummarization = (items: RssItem[]): SummaryResult => {
  // Create a more sophisticated mock article for better testing
  const today = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Get unique sources
  const sources = [...new Set(items.map(item => item.source))].filter(Boolean);
  const sourceText = sources.length > 0 
    ? sources.join(', ') 
    : "various news outlets";
  
  // Check if the search was about William Ruto or Kenya
  const isKenyaRelated = items.some(item => 
    item.title.toLowerCase().includes('kenya') || 
    item.description.toLowerCase().includes('kenya') ||
    item.title.toLowerCase().includes('ruto') || 
    item.description.toLowerCase().includes('ruto')
  );
  
  // Generate article title based on items or default
  let articleTitle = items.length > 0 
    ? `Latest Updates: ${items[0].title.split(' ').slice(0, 5).join(' ')}...` 
    : "Today's Top Stories: Global and Regional Updates";
  
  if (isKenyaRelated || items.length === 0) {
    articleTitle = "Kenya's President William Ruto Advances National Development Agenda";
  }
  
  // Create intro paragraph
  let article = `${articleTitle}\n\n`;
  
  if (isKenyaRelated || items.length === 0) {
    article += `As of ${today}, President William Ruto continues to implement his administration's development blueprint aimed at transforming Kenya's economy and improving citizens' livelihoods. Recent initiatives have focused on infrastructure development, agricultural reforms, and digital transformation across the country.\n\n`;
    
    article += `The Kenyan government has launched several key projects in various sectors, with President Ruto personally supervising their implementation. "We are committed to delivering on our promises to Kenyans through strategic investments and policy reforms," President Ruto stated during a recent public address.\n\n`;
    
    article += `Opposition leaders have expressed mixed reactions to the government's programs, with some acknowledging progress while others calling for more inclusive approaches to national development. Economic analysts note that these initiatives could significantly impact Kenya's growth trajectory if properly implemented.\n\n`;
    
    article += `As these programs continue to roll out across the country, Kenyans are watching closely to evaluate their impact on daily life and the broader economic landscape. President Ruto's administration has emphasized its commitment to transparency and accountability in all government projects.`;
  } else {
    // Add content from items if available
    if (items.length > 0) {
      // Add first paragraph from first item
      article += `${items[0].description} `;
      
      // Add second paragraph with more sources
      article += `\n\nExperts are closely monitoring these developments. `;
      
      if (items.length > 1) {
        article += `According to ${items[1].source}, "${items[1].description.substring(0, 100)}..." `;
      }
      
      // Add third paragraph with analysis
      article += `\n\nThe implications of these events are significant. `;
      if (items.length > 2) {
        article += `${items[2].description.substring(0, 150)}... `;
      }
      
      // Add conclusion
      article += `\n\nAs the situation continues to evolve, more updates are expected from ${sourceText}.`;
    } else {
      // Fallback content if no items are available
      article += `Current events around the globe continue to develop. Economic, political, and social trends are shifting as various factors influence regional stability and growth. Analysts are closely monitoring these developments and their potential impacts. More details will emerge as reporting continues.`;
    }
  }
  
  return {
    summary: article.split('\n\n')[0] + ' ' + (article.split('\n\n')[1] || ''),
    article: article,
    topics: isKenyaRelated ? ["kenya", "ruto", "government", "development", "politics", "economy", "infrastructure", "agriculture"] : extractTopics(items),
    entities: isKenyaRelated ? [
      { name: "William Ruto", type: "Person - President of Kenya" },
      { name: "Kenya", type: "Location - Country" },
      { name: "Kenyan Government", type: "Organization" }
    ] : extractEntities(items)
  };
};
