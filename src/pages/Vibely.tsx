import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, ThumbsUp, MessageCircle, Share, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Mock data for demonstration
const mockArticles = [
  {
    id: 1,
    title: "The Future of AI in Healthcare",
    content: "Artificial Intelligence is revolutionizing healthcare delivery...",
    author: "John Doe",
    likes: 42,
    comments: 15,
    timestamp: "2 hours ago",
    image: "https://picsum.photos/800/400"
  },
  {
    id: 2,
    title: "Sustainable Technology Trends",
    content: "Green technology is becoming increasingly important...",
    author: "Jane Smith",
    likes: 28,
    comments: 8,
    timestamp: "4 hours ago",
    image: "https://picsum.photos/800/401"
  }
];

const Vibely = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
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
    toast.success("Article posted successfully!");
    setShowUploadModal(false);
    setTitle("");
    setContent("");
    setImage(null);
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="container mx-auto py-8 relative">
      <Button
        onClick={handleBack}
        className="mb-4 flex items-center gap-2 bg-gray-800 text-white hover:bg-gray-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      {/* Floating Action Button */}
      <Button
        onClick={() => setShowUploadModal(true)}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center"
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Article Feed */}
      <div className="space-y-6">
        {mockArticles.map((article) => (
          <Card key={article.id} className="bg-gradient-to-r from-gray-900 to-gray-800 border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white mb-2">{article.title}</h2>
                  <p className="text-gray-300 mb-4">{article.content}</p>
                  {article.image && (
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>Posted by {article.author}</span>
                    <span>•</span>
                    <span>{article.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <Button variant="ghost" className="text-gray-400 hover:text-white">
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      {article.likes}
                    </Button>
                    <Button variant="ghost" className="text-gray-400 hover:text-white">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {article.comments}
                    </Button>
                    <Button variant="ghost" className="text-gray-400 hover:text-white">
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl bg-gradient-to-r from-gray-900 to-gray-800 border-none shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl font-bold text-white">Create New Post</CardTitle>
              <Button
                variant="ghost"
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  placeholder="Post Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-gray-800 text-white border-gray-700"
                />
                <Textarea
                  placeholder="Write your post content here..."
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
                    Post
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Vibely; 