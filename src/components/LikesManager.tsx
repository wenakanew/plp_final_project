import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { toast } from "sonner";

interface LikesManagerProps {
  totalLikes: number;
  availableLikes: number;
  onWithdraw: (amount: number) => Promise<void>;
}

export function LikesManager({ totalLikes, availableLikes, onWithdraw }: LikesManagerProps) {
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleWithdraw = async () => {
    const amount = parseInt(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (amount > availableLikes) {
      toast.error("Insufficient likes available");
      return;
    }

    setIsProcessing(true);
    try {
      await onWithdraw(amount);
      setWithdrawAmount("");
    } catch (error) {
      toast.error("Failed to process withdrawal");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="p-6 bg-gray-800/50 border-gray-700">
      <h2 className="text-xl font-bold text-white mb-6">Likes Management</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="p-4 bg-gray-700/50 rounded-lg">
          <div className="flex items-center gap-2 text-gray-300 mb-2">
            <Heart className="w-5 h-5 text-red-400" />
            <span>Total Likes Earned</span>
          </div>
          <p className="text-2xl font-bold text-white">{totalLikes}</p>
        </div>
        
        <div className="p-4 bg-gray-700/50 rounded-lg">
          <div className="flex items-center gap-2 text-gray-300 mb-2">
            <Heart className="w-5 h-5 text-green-400" />
            <span>Available for Withdrawal</span>
          </div>
          <p className="text-2xl font-bold text-white">{availableLikes}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-4">
          <Input
            type="number"
            placeholder="Enter amount to withdraw"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            className="flex-1 bg-gray-700/50 border-gray-600 text-white"
          />
          <Button
            onClick={handleWithdraw}
            disabled={isProcessing || !withdrawAmount}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isProcessing ? "Processing..." : "Withdraw"}
          </Button>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">Earned 50 likes</span>
              </div>
              <span className="text-gray-400">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-2">
                <ArrowDownRight className="w-5 h-5 text-red-400" />
                <span className="text-gray-300">Withdrawn 30 likes</span>
              </div>
              <span className="text-gray-400">1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
} 