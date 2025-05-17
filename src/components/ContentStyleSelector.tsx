import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Briefcase, 
  Coffee, 
  Sparkles, 
  Newspaper, 
  MessageSquare 
} from "lucide-react";

interface ContentStyle {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface ContentStyleSelectorProps {
  selectedStyle: string;
  onStyleSelect: (style: string) => void;
}

const contentStyles: ContentStyle[] = [
  {
    id: "professional",
    name: "Professional",
    description: "Formal and business-like tone, suitable for corporate settings",
    icon: <Briefcase className="h-5 w-5" />
  },
  {
    id: "casual",
    name: "Casual",
    description: "Relaxed and conversational tone, perfect for social media",
    icon: <Coffee className="h-5 w-5" />
  },
  {
    id: "simple",
    name: "Simple",
    description: "Clear and straightforward language, easy to understand",
    icon: <BookOpen className="h-5 w-5" />
  },
  {
    id: "creative",
    name: "Creative",
    description: "Engaging and imaginative writing style",
    icon: <Sparkles className="h-5 w-5" />
  },
  {
    id: "journalistic",
    name: "Journalistic",
    description: "News-style writing with focus on facts and clarity",
    icon: <Newspaper className="h-5 w-5" />
  },
  {
    id: "conversational",
    name: "Conversational",
    description: "Friendly and interactive tone, like a chat",
    icon: <MessageSquare className="h-5 w-5" />
  }
];

const ContentStyleSelector = ({ selectedStyle, onStyleSelect }: ContentStyleSelectorProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">Select Content Style</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contentStyles.map((style) => (
          <Card
            key={style.id}
            className={`cursor-pointer transition-all duration-200 ${
              selectedStyle === style.id
                ? "bg-blue-500/10 border-blue-500"
                : "bg-gray-800/50 border-gray-700 hover:border-gray-600"
            }`}
            onClick={() => onStyleSelect(style.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  selectedStyle === style.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 text-gray-400"
                }`}>
                  {style.icon}
                </div>
                <div>
                  <h4 className={`font-medium ${
                    selectedStyle === style.id
                      ? "text-blue-400"
                      : "text-white"
                  }`}>
                    {style.name}
                  </h4>
                  <p className="text-sm text-gray-400 mt-1">
                    {style.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ContentStyleSelector; 