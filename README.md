# Tunei - Tune into Real-Time Truth

Tunei is a real-time news aggregation and analysis platform that helps you stay informed with accurate and timely information. Built with React, TypeScript, Vite, and Tailwind CSS, Tunei leverages AI to deliver insightful news, analytics, and a premium user experience.

---

## 🚀 Features

- **Real-time News Aggregation:** Stay updated with the latest news from multiple sources.
- **AI-powered Content Analysis:** Summarize, analyze, and get insights from news articles using advanced AI.
- **Customizable News Feeds:** Personalize your news experience based on your interests.
- **Premium Content Access:** Unlock exclusive features and content with premium access.
- **Social Interaction (Vibely):** Engage with other users and discuss trending topics.
- **Advanced Analytics & Insights:** Visualize trends and data with interactive charts.
- **PDF Export:** Export news summaries and analytics to PDF.
- **User Authentication:** Secure login and signup with Firebase.
- **Account Management:** Update your profile, reset your password, and manage your account settings.

---

## 🖥️ Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS, Shadcn UI
- **State Management:** React Context, TanStack React Query
- **Authentication:** Firebase Auth
- **Data Visualization:** Recharts
- **PDF Generation:** jsPDF

---

## 📦 Project Structure
tunei-ai-pulse/
├── public/ # Static assets
├── src/
│ ├── components/ # Reusable UI components
│ ├── contexts/ # React Contexts (e.g., Auth)
│ ├── hooks/ # Custom React hooks
│ ├── pages/ # Page components (Login, Signup, Dashboard, etc.)
│ ├── services/ # API and utility services (RSS, analytics, export, etc.)
│ ├── config/ # Configuration files (e.g., Firebase)
│ └── index.css # Tailwind CSS entry
├── package.json
├── tailwind.config.ts
├── vite.config.ts
└── README.md

---

## 🛠️ Getting Started

### 1. **Clone the Repository**

```bash
git clone https://github.com/wenakanew/plp_final_project.git
cd tunei-ai-pulse
```

### 2. **Install Dependencies**

```bash
npm install
```

### 3. **Set Up Environment Variables**

Create a `.env` file in the root directory and add your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. **Start the Development Server**

```bash
npm run dev
```

Visit [http://localhost:8080](http://localhost:8080) to view the app.

---

## 🏗️ Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

---

## 🚀 Deployment

You can deploy the contents of the `dist/` directory to any static hosting provider (e.g., Vercel, Netlify).

**Vercel Deployment:**
- Connect your GitHub repository to Vercel.
- Set the root directory to `tunei-ai-pulse` if deploying from a monorepo.
- Add your environment variables in the Vercel dashboard.
- Set the build command to `npm run build` and the output directory to `dist`.

---

## 👤 Authentication

Tunei uses Firebase Authentication for secure login and signup.  
- Users can create an account, log in, and manage their profile.
- Password reset functionality is available in the account settings.

---

## 📊 Analytics & Export

- View interactive analytics panels powered by Recharts.
- Export news summaries and analytics as PDF using jsPDF.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Create a new Pull Request

---

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase](https://firebase.google.com/)
- [Recharts](https://recharts.org/)
- [jsPDF](https://github.com/parallax/jsPDF)
- [Shadcn UI](https://ui.shadcn.com/)

---

**Tunei – Tune into Real-Time Truth.**
