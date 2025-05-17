interface LikesTransaction {
  id: string;
  type: 'earn' | 'withdraw';
  amount: number;
  timestamp: string;
  description: string;
}

interface UserLikes {
  totalLikes: number;
  availableLikes: number;
  transactions: LikesTransaction[];
}

// Mock data for demonstration
let mockUserLikes: UserLikes = {
  totalLikes: 1500,
  availableLikes: 1000,
  transactions: [
    {
      id: '1',
      type: 'earn',
      amount: 50,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      description: 'Likes earned from article'
    },
    {
      id: '2',
      type: 'withdraw',
      amount: 100,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      description: 'Likes withdrawn'
    }
  ]
};

export const getUserLikes = async (): Promise<UserLikes> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUserLikes);
    }, 500);
  });
};

export const withdrawLikes = async (amount: number): Promise<UserLikes> => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (amount > mockUserLikes.availableLikes) {
        reject(new Error('Insufficient likes available'));
        return;
      }

      mockUserLikes = {
        ...mockUserLikes,
        availableLikes: mockUserLikes.availableLikes - amount,
        transactions: [
          {
            id: Date.now().toString(),
            type: 'withdraw',
            amount,
            timestamp: new Date().toISOString(),
            description: 'Likes withdrawn'
          },
          ...mockUserLikes.transactions
        ]
      };

      resolve(mockUserLikes);
    }, 1000);
  });
};

export const addLikes = async (amount: number, description: string): Promise<UserLikes> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      mockUserLikes = {
        ...mockUserLikes,
        totalLikes: mockUserLikes.totalLikes + amount,
        availableLikes: mockUserLikes.availableLikes + amount,
        transactions: [
          {
            id: Date.now().toString(),
            type: 'earn',
            amount,
            timestamp: new Date().toISOString(),
            description
          },
          ...mockUserLikes.transactions
        ]
      };

      resolve(mockUserLikes);
    }, 500);
  });
}; 