import { NewsArticle } from "@/types/news";

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export const searchNews = async (query: string) => {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(
        query
      )}&language=en&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch news");
    }

    const data = await response.json();
    return data.articles;
  } catch (error) {
    console.error("Error searching news:", error);
    throw error;
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        prompt: prompt,
        n: 1,
        size: "1024x1024"
      })
    });

    if (!response.ok) {
      throw new Error("Failed to generate image");
    }

    const data = await response.json();
    return data.data[0].url;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

export const generateNewsArticle = async (topic: string, style: string = "professional"): Promise<NewsArticle> => {
  try {
    // Get news data from NewsAPI
    const newsData = await searchNews(topic);
    
    if (!newsData || newsData.length === 0) {
      throw new Error("No news found for the given topic");
    }

    // Select a random article from the results
    const randomArticle = newsData[Math.floor(Math.random() * newsData.length)];

    // Generate an image based on the topic
    const imagePrompt = `A professional news image about ${topic}, high quality, photorealistic`;
    const imageUrl = await generateImage(imagePrompt);

    // Style-specific prompts
    const stylePrompts = {
      professional: "Rewrite this news article in a professional, business-like tone suitable for corporate settings. Focus on facts and maintain a formal writing style.",
      casual: "Rewrite this news article in a casual, conversational tone perfect for social media. Make it engaging and easy to read.",
      simple: "Rewrite this news article in simple, straightforward language that's easy to understand. Avoid complex terms and keep sentences short.",
      creative: "Rewrite this news article in a creative and engaging style. Add some flair while maintaining accuracy.",
      journalistic: "Rewrite this news article in a traditional journalistic style. Focus on the 5 W's and maintain objectivity.",
      conversational: "Rewrite this news article in a friendly, chat-like tone. Make it feel like a conversation with the reader."
    };

    // Generate the article with the selected style
    const prompt = `${stylePrompts[style as keyof typeof stylePrompts]}\n\nOriginal article:\n${randomArticle.content}`;
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a professional news writer who can adapt content to different writing styles."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error("Failed to generate article");
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    return {
      id: randomArticle.id,
      title: randomArticle.title,
      content: generatedContent,
      author: randomArticle.author,
      source: randomArticle.source,
      url: randomArticle.url,
      imageUrl: imageUrl,
      publishedAt: randomArticle.publishedAt,
      style: style
    };
  } catch (error) {
    console.error("Error generating news article:", error);
    throw error;
  }
}; 