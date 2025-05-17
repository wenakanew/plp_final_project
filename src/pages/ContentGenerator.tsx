import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { generateAnyContent } from "@/services/aiService";
import { searchImages, generateImagePrompt } from "@/services/imageService";
import { ArrowLeft, Loader2, Save, Share, Image as ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ImageResult {
  url: string;
  title: string;
  source: string;
  width: number;
  height: number;
}

const ContentGenerator = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [contentType, setContentType] = useState("article");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSearchingImages, setIsSearchingImages] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{
    content: string;
    title?: string;
    topics?: string[];
  } | null>(null);
  const [images, setImages] = useState<ImageResult[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageResult | null>(null);

  const contentTypes = [
    { value: "article", label: "Article" },
    { value: "story", label: "Story" },
    { value: "poem", label: "Poem" },
    { value: "blog", label: "Blog Post" },
    { value: "essay", label: "Essay" },
    { value: "review", label: "Review" },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateAnyContent(prompt, contentType);
      if (result) {
        setGeneratedContent(result);
        toast.success("Content generated successfully!");
        
        // Generate image prompt and search for images
        setIsSearchingImages(true);
        try {
          const imagePrompt = await generateImagePrompt(result.content);
          const imageResults = await searchImages(imagePrompt);
          setImages(imageResults);
          if (imageResults.length > 0) {
            setSelectedImage(imageResults[0]);
          }
        } catch (error) {
          console.error("Error searching images:", error);
          toast.error("Failed to find relevant images");
        } finally {
          setIsSearchingImages(false);
        }
      }
    } catch (error) {
      console.error("Error generating content:", error);
      toast.error("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent.content);
      toast.success("Content copied to clipboard!");
    }
  };

  const handleSave = () => {
    // In a real app, this would save to user's account
    toast.success("Content saved to your library!");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <h1 className="text-3xl font-bold mb-8">AI Content Generator</h1>

        {/* Input Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Generate Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="contentType">Content Type</Label>
                <Select
                  value={contentType}
                  onValueChange={setContentType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    {contentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="prompt">What would you like to create?</Label>
                <Textarea
                  id="prompt"
                  placeholder="Enter your prompt here..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Content"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Generated Content */}
        {generatedContent && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{generatedContent.title}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                  >
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSave}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Selected Image */}
              {selectedImage && (
                <div className="mb-6">
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Image from {selectedImage.source}
                  </p>
                </div>
              )}

              {/* Content */}
              <div className="prose max-w-none">
                {generatedContent.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>

              {/* Image Gallery */}
              {images.length > 0 && (
                <div className="mt-8 pt-6 border-t">
                  <h3 className="text-lg font-medium mb-4">Related Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className={`relative cursor-pointer rounded-lg overflow-hidden ${
                          selectedImage?.url === image.url ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setSelectedImage(image)}
                      >
                        <img
                          src={image.url}
                          alt={image.title}
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                          {image.title}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Topics */}
              {generatedContent.topics && generatedContent.topics.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-sm font-medium mb-2">Topics:</h3>
                  <div className="flex flex-wrap gap-2">
                    {generatedContent.topics.map((topic, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ContentGenerator; 