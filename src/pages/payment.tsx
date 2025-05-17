// PaymentOptions.tsx
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, Wallet, Smartphone, Lock } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  // Get subscription details from location state
  const subscriptionDetails = location.state?.subscriptionDetails || {
    plan: "Basic",
    price: "$9.99",
    period: "month"
  };

  const paymentMethods = [
    {
      id: "credit-card",
      name: "Credit Card",
      icon: <CreditCard className="h-6 w-6" />,
      description: "Pay securely with your credit card"
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: <Wallet className="h-6 w-6" />,
      description: "Pay with your PayPal account"
    },
    {
      id: "mpesa",
      name: "M-PESA",
      icon: <Smartphone className="h-6 w-6" />,
      description: "Pay using M-PESA mobile money"
    }
  ];

  const handleBack = () => {
    navigate("/premium");
  };

  const handlePayment = () => {
    if (!selectedMethod) {
      toast.error("Please select a payment method");
      return;
    }
    // Placeholder for payment processing
    toast.success("Processing payment...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <Button
          onClick={handleBack}
          className="mb-8 flex items-center gap-2 bg-gray-800 text-white hover:bg-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Plans
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Subscription Summary */}
          <Card className="bg-gradient-to-r from-gray-900 to-gray-800 border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-white">
                  <span>Plan</span>
                  <span className="font-semibold">{subscriptionDetails.plan}</span>
                </div>
                <div className="flex justify-between items-center text-white">
                  <span>Billing Period</span>
                  <span className="font-semibold">Per {subscriptionDetails.period}</span>
                </div>
                <div className="flex justify-between items-center text-white">
                  <span>Amount</span>
                  <span className="font-semibold text-xl">{subscriptionDetails.price}</span>
                </div>
                <div className="pt-4 border-t border-gray-700">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Lock className="h-4 w-4" />
                    <span className="text-sm">Secure payment processing</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card className="bg-gradient-to-r from-gray-900 to-gray-800 border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">Select Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
                      selectedMethod === method.id
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        selectedMethod === method.id
                          ? "bg-blue-500 text-white"
                          : "bg-gray-800 text-gray-400"
                      }`}>
                        {method.icon}
                      </div>
                      <div className="text-left">
                        <h3 className="text-white font-semibold">{method.name}</h3>
                        <p className="text-sm text-gray-400">{method.description}</p>
                      </div>
                    </div>
                  </button>
                ))}

                <Button
                  onClick={handlePayment}
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-6"
                >
                  Pay {subscriptionDetails.price}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Payment;
