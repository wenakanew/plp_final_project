
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share, BookOpen, Save } from "lucide-react";
import { toast } from "sonner";
import { RssItem } from "../services/rssService";

interface ArticleViewProps {
  article: string;
  searchTerm?: string;
  relatedSources: RssItem[];
  topics: string[];
}

const ArticleView = ({ article, searchTerm, relatedSources, topics }: ArticleViewProps) => {
  // Split article into title and content (assuming first line is title)
  const articleParts = article.split('\n\n');
  const title = articleParts[0];
  const content = articleParts.slice(1).join('\n\n');

  const handleShare = () => {
    try {
      navigator.clipboard.writeText(article);
      toast.success("Article copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy article");
      console.error("Share error:", error);
    }
  };

  const handleSave = () => {
    // In a real app, this would save to user's account
    toast.success("Article saved to your reading list");
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Article Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-3">{title}</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {topics.slice(0, 5).map((topic, index) => (
            <Badge key={index} variant="secondary">{topic}</Badge>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Generated from {relatedSources.length} sources
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleShare}>
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button size="sm" variant="outline" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="prose max-w-none">
            {content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sources */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {relatedSources.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-start gap-2">
                <BookOpen className="h-4 w-4 mt-1 flex-shrink-0" />
                <div>
                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm font-medium hover:underline"
                  >
                    {item.title}
                  </a>
                  <p className="text-xs text-muted-foreground">{item.source}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArticleView;
