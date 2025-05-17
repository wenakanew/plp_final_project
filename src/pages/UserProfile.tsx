import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit2, 
  Save, 
  Loader2,
  ArrowLeft
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { LikesManager } from "@/components/LikesManager";
import { getUserLikes, withdrawLikes } from "@/services/likesService";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
}

interface UserLikes {
  totalLikes: number;
  availableLikes: number;
  transactions: {
    id: string;
    type: "earn" | "withdraw";
    amount: number;
    timestamp: string;
    description: string;
  }[];
}

const UserProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile>({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    location: "New York, USA",
    bio: "Tech enthusiast and content creator"
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userLikes, setUserLikes] = useState<UserLikes | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserLikes = async () => {
      try {
        const likes = await getUserLikes();
        setUserLikes(likes);
      } catch (error) {
        toast.error("Failed to load likes data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserLikes();
  }, []);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleWithdraw = async (amount: number) => {
    try {
      const updatedLikes = await withdrawLikes(amount);
      setUserLikes(updatedLikes);
      toast.success(`Successfully withdrew ${amount} likes`);
    } catch (error) {
      toast.error("Failed to process withdrawal");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6 text-gray-400 hover:text-white"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="space-y-6">
          <Card className="p-6 bg-gray-800/50 border-gray-700">
            <h1 className="text-2xl font-bold text-white mb-4">User Profile</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-300 mb-2">Profile Information</h2>
                <div className="space-y-2">
                  <p className="text-gray-400">Username: JohnDoe</p>
                  <p className="text-gray-400">Email: john@example.com</p>
                  <p className="text-gray-400">Member since: January 2024</p>
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-300 mb-2">Account Status</h2>
                <div className="space-y-2">
                  <p className="text-gray-400">Subscription: Premium</p>
                  <p className="text-gray-400">Posts: 15</p>
                  <p className="text-gray-400">Comments: 45</p>
                </div>
              </div>
            </div>
          </Card>

          {loading ? (
            <Card className="p-6 bg-gray-800/50 border-gray-700">
              <p className="text-gray-400">Loading likes data...</p>
            </Card>
          ) : userLikes ? (
            <LikesManager
              totalLikes={userLikes.totalLikes}
              availableLikes={userLikes.availableLikes}
              onWithdraw={handleWithdraw}
            />
          ) : (
            <Card className="p-6 bg-gray-800/50 border-gray-700">
              <p className="text-gray-400">Failed to load likes data</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 