import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share, Save, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface NewsArticleViewProps {
  article: {
    id: string;
    title: string;
    content: string;
    author: string;
    source: string;
    url: string;
    imageUrl: string;
    publishedAt: string;
    style?: string;
  };
}

const NewsArticleView = ({ article }: NewsArticleViewProps) => {
  const handleShare = () => {
    navigator.clipboard.writeText(article.content);
    toast.success("Article copied to clipboard!");
  };

  const handleSave = () => {
    toast.success("Article saved to your library!");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="bg-gradient-to-r from-gray-900 to-gray-800 border-none shadow-lg">
      <CardContent className="p-8">
        {/* Article Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4 text-white">{article.title}</h1>
          <div className="flex items-center justify-center gap-4 text-gray-400">
            <p>By {article.author}</p>
            <p>•</p>
            <p>{article.source}</p>
            <p>•</p>
            <p>{formatDate(article.publishedAt)}</p>
            {article.style && (
              <>
                <p>•</p>
                <p className="capitalize">{article.style} Style</p>
              </>
            )}
          </div>
        </div>

        {/* Main Image */}
        {article.imageUrl && (
          <div className="mb-8">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-[400px] object-cover rounded-lg"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-invert max-w-none mb-8">
          {article.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-4 text-lg leading-relaxed text-gray-300">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={handleShare}
            className="flex items-center gap-2 bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
          >
            <Share className="h-4 w-4" />
            Share Article
          </Button>
          <Button
            variant="outline"
            onClick={handleSave}
            className="flex items-center gap-2 bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
          >
            <Save className="h-4 w-4" />
            Save Article
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open(article.url, '_blank')}
            className="flex items-center gap-2 bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
          >
            <ExternalLink className="h-4 w-4" />
            Read Original
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsArticleView; 