import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { generateNewsArticle } from "@/services/newsService";
import NewsArticleView from "@/components/NewsArticleView";
import ContentStyleSelector from "@/components/ContentStyleSelector";

const NewsGenerator = () => {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState<any>(null);
  const [selectedStyle, setSelectedStyle] = useState("professional");
  const [regenerating, setRegenerating] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log("Article state:", article);
    console.log("Selected style:", selectedStyle);
  }, [article, selectedStyle]);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    setLoading(true);
    try {
      const generatedArticle = await generateNewsArticle(topic, selectedStyle);
      console.log("Generated article:", generatedArticle);
      setArticle(generatedArticle);
      toast.success("Article generated successfully!");
    } catch (error) {
      console.error("Error generating article:", error);
      toast.error("An error occurred while generating the article");
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!topic.trim()) return;

    setRegenerating(true);
    try {
      const regeneratedArticle = await generateNewsArticle(topic, selectedStyle);
      console.log("Regenerated article:", regeneratedArticle);
      setArticle(regeneratedArticle);
      toast.success("Article regenerated successfully!");
    } catch (error) {
      console.error("Error regenerating article:", error);
      toast.error("An error occurred while regenerating the article");
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Search Card */}
      <Card className="bg-gradient-to-r from-gray-900 to-gray-800 border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Generate News Article</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Enter a topic (e.g., Audi, Technology, Sports)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="flex-1 bg-gray-800 text-white border-gray-700"
            />
            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Generate
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Style Selector Card - Always visible */}
      <Card className="bg-gradient-to-r from-gray-900 to-gray-800 border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Customize Content Style</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-gray-300">Select a writing style for your article</p>
              {article && (
                <Button
                  onClick={handleRegenerate}
                  disabled={regenerating}
                  variant="outline"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white border-none"
                >
                  {regenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Regenerating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      Regenerate with Selected Style
                    </>
                  )}
                </Button>
              )}
            </div>
            <ContentStyleSelector
              selectedStyle={selectedStyle}
              onStyleSelect={setSelectedStyle}
            />
          </div>
        </CardContent>
      </Card>

      {/* Article View */}
      {article && <NewsArticleView article={article} />}
    </div>
  );
};

export default NewsGenerator; 