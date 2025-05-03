
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Play, Smile, Meh, Frown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultItem {
  id: number;
  title: string;
  snippet: string;
  source: string;
  sourceUrl: string;
  imageUrl?: string;
  timestamp: string;
  sentiment: "positive" | "neutral" | "negative";
}

interface ResultsDisplayProps {
  results: ResultItem[];
}

const getSentimentIcon = (sentiment: string) => {
  switch (sentiment) {
    case "positive":
      return <Smile className="h-4 w-4 text-green-500" />;
    case "negative":
      return <Frown className="h-4 w-4 text-red-500" />;
    default:
      return <Meh className="h-4 w-4 text-gray-500" />;
  }
};

const ResultsDisplay = ({ results }: ResultsDisplayProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-xl font-medium mb-6">Summary Results</h2>
      <div className="space-y-6">
        {results.map((item) => (
          <div
            key={item.id}
            className={cn(
              "tunei-card",
              item.imageUrl ? "flex flex-col md:flex-row gap-4" : ""
            )}
          >
            {item.imageUrl && (
              <div className="w-full md:w-1/3 h-48 md:h-auto overflow-hidden rounded-lg">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className={item.imageUrl ? "w-full md:w-2/3" : "w-full"}>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs font-normal">
                  {item.source}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {item.timestamp}
                </span>
                {getSentimentIcon(item.sentiment)}
              </div>
              <h3 className="text-lg font-medium mb-2">{item.title}</h3>
              <p className="text-sm text-foreground/80 mb-4">{item.snippet}</p>
              <div className="flex items-center justify-between">
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-primary underline hover:text-primary/80"
                >
                  View Original Source
                </a>
                <Button size="sm" variant="ghost" className="gap-1 text-xs">
                  <Play className="h-3 w-3" />
                  Listen
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsDisplay;
