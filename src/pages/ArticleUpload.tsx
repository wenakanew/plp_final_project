import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const ArticleUpload = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Please enter the article title and content");
      return;
    }
    // Placeholder for future functionality
    toast.success("Article saved successfully!");
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="container mx-auto py-8">
      <Button
        onClick={handleBack}
        className="mb-4 flex items-center gap-2 bg-gray-800 text-white hover:bg-gray-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      <Card className="mb-8 bg-gradient-to-r from-gray-900 to-gray-800 border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Write and Upload Article</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="Article Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-800 text-white border-gray-700"
            />
            <Textarea
              placeholder="Article Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-40 bg-gray-800 text-white border-gray-700"
            />
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="flex-1 bg-gray-800 text-white border-gray-700"
              />
              <Button
                onClick={handleSubmit}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArticleUpload; 