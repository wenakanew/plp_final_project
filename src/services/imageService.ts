import { apiConfig } from "../config/api-config";
import { toast } from "sonner";

interface ImageResult {
  url: string;
  title: string;
  source: string;
  width: number;
  height: number;
}

export const searchImages = async (query: string): Promise<ImageResult[]> => {
  try {
    // First try Pexels API
    if (apiConfig.pexels.isEnabled) {
      const pexelsResponse = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=10`,
        {
          headers: {
            Authorization: apiConfig.pexels.apiKey
          }
        }
      );

      if (pexelsResponse.ok) {
        const data = await pexelsResponse.json();
        return data.photos.map((photo: any) => ({
          url: photo.src.large,
          title: photo.alt || query,
          source: "Pexels",
          width: photo.width,
          height: photo.height
        }));
      }
    }

    // Fallback to SerpAPI for image search
    if (apiConfig.serpApi.isEnabled) {
      const serpResponse = await fetch(
        `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&tbm=isch&api_key=${apiConfig.serpApi.apiKey}`
      );

      if (serpResponse.ok) {
        const data = await serpResponse.json();
        return data.images_results.map((image: any) => ({
          url: image.original,
          title: image.title,
          source: "SerpAPI",
          width: image.original_width,
          height: image.original_height
        }));
      }
    }

    // If both APIs fail, return empty array
    return [];
  } catch (error) {
    console.error("Error searching images:", error);
    toast.error("Failed to search images. Please try again.");
    return [];
  }
};

export const generateImagePrompt = async (content: string): Promise<string> => {
  try {
    // Use Azure OpenAI to generate an image prompt based on the content
    const apiUrl = `${apiConfig.azureOpenAI.endpoint}openai/deployments/${apiConfig.azureOpenAI.deploymentName}/chat/completions?api-version=${apiConfig.azureOpenAI.apiVersion}`;
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiConfig.azureOpenAI.apiKey
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "You are an expert at creating image prompts. Create a detailed, descriptive prompt that would generate a relevant image for the given content. Focus on visual elements, style, and mood."
          },
          {
            role: "user",
            content: `Create an image prompt for this content: ${content}`
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      })
    });

    if (!response.ok) {
      throw new Error("Failed to generate image prompt");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating image prompt:", error);
    return content; // Fallback to using the content as the prompt
  }
}; 