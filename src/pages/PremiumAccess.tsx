import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Check, Zap, Star, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Plan {
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  icon: React.ReactNode;
  popular?: boolean;
}

const plans: Plan[] = [
  {
    name: 'Basic',
    price: 9.99,
    interval: 'month',
    features: [
      'Basic AI article generation',
      'Standard news sources',
      'Basic analytics',
      'Email support',
      '1 user account'
    ],
    icon: <Zap className="w-6 h-6 text-yellow-400" />
  },
  {
    name: 'Pro',
    price: 19.99,
    interval: 'month',
    features: [
      'Advanced AI article generation',
      'Premium news sources',
      'Advanced analytics',
      'Priority support',
      '3 user accounts',
      'Custom news categories',
      'Export to multiple formats'
    ],
    icon: <Star className="w-6 h-6 text-blue-400" />,
    popular: true
  },
  {
    name: 'Enterprise',
    price: 49.99,
    interval: 'month',
    features: [
      'Unlimited AI article generation',
      'All news sources',
      'Enterprise analytics',
      '24/7 dedicated support',
      'Unlimited user accounts',
      'API access',
      'Custom integrations',
      'White-label options'
    ],
    icon: <Crown className="w-6 h-6 text-purple-400" />
  }
];

export const PremiumAccess = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = (plan: string, price: string, period: string) => {
    navigate("/payment", {
      state: {
        subscriptionDetails: {
          plan,
          price,
          period
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Back Button */}
      <div className="absolute top-6 left-6">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-gray-800/50 backdrop-blur-sm hover:bg-gray-700/50 transition-all duration-300"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-5 w-5 text-gray-300" />
        </Button>
      </div>

      <div className="max-w-7xl mx-auto pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">
            Choose Your Premium Plan
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Unlock the full potential of Tunei with our premium features. Select the plan that best fits your needs.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border ${
                plan.popular
                  ? 'border-indigo-500/50 shadow-lg shadow-indigo-500/20'
                  : 'border-gray-700/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-indigo-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-6">
                {plan.icon}
                <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-white">${plan.price}</span>
                <span className="text-gray-400">/{plan.interval}</span>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSubscribe(plan.name, "$" + plan.price, plan.interval)}
                disabled={loading}
                className={`w-full ${
                  plan.popular
                    ? 'bg-indigo-600 hover:bg-indigo-700'
                    : 'bg-gray-700 hover:bg-gray-600'
                } text-white py-3 rounded-lg transition-colors duration-300`}
              >
                {loading ? 'Processing...' : 'Subscribe Now'}
              </Button>
            </div>
          ))}
        </div>

        {/* Features Showcase */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Premium Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm">
              <Zap className="w-8 h-8 text-yellow-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Advanced AI Generation
              </h3>
              <p className="text-gray-400">
                Get more accurate and detailed AI-generated articles with our premium models.
              </p>
            </div>
            <div className="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm">
              <Star className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Premium Sources
              </h3>
              <p className="text-gray-400">
                Access exclusive news sources and real-time updates from premium publishers.
              </p>
            </div>
            <div className="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm">
              <Crown className="w-8 h-8 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Enterprise Analytics
              </h3>
              <p className="text-gray-400">
                Get detailed insights and analytics to make data-driven decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 