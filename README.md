# StaySafe NG | AI Security Intelligence Platform

StaySafe NG is a cutting-edge, open-source security intelligence platform designed to provide real-time situational awareness for residents and travelers in Nigeria. By leveraging **Google's Gemini AI**, the platform aggregates, validates, and visualizes security data to help users make informed decisions about their safety.

##  Overview

In an era where accurate and timely information is critical, StaySafe NG bridges the gap between scattered news reports and actionable intelligence. The application monitors kidnapping, banditry, and road accident trends across Nigeria, offering features like route risk analysis, live incident mapping, and an AI-powered security assistant.

##  Key Features

### 1. **Live Security Dashboard**
*   **Real-Time Data**: Automatically aggregated security incidents (last 7 days) categorized by type (Kidnappings, Banditry, Accidents, etc.).
*   **Trend Analysis**: Visual graphs showing incident frequency over time.
*   **Severity Indicators**: Color-coded risk levels for different regions.

### 2. **Interactive Threat Map**
*   **Heatmaps & Markers**: Visual representation of high-risk zones using *Leaflet.js*.
*   **Route Safety Checks**: Analyze highways (e.g., Abuja-Kaduna, Lagos-Ibadan) for recent activity before you travel.
*   **Geolocation Support**: See incidents near your current location.

### 3. **AI Security Chief (Gemini Powered)**
*   **Instant Advisories**: Chat with an AI security expert trained on Nigerian security contexts.
*   **Context-Aware**: Ask specific questions like "Is it safe to drive from Abuja to Jos right now?" and receive data-backed advice.
*   **Emergency Protocols**: Quick access to emergency numbers (112, 767) and safety tips.

### 4. **Community Reporting System**
*   **Crowdsourced Intel**: Users can submit reports of suspicious activity.
*   **Verification**: Community upvoting/downvoting system to validate report accuracy.
*   **AI Pre-Screening**: Incoming reports are analyzed by AI to flag high-priority threats immediately.

### 5. **Premium UI/UX**
*   **Modern Design**: Built with a sleek, glassmorphic aesthetic using Tailwind CSS.
*   **Dark Mode**: Fully supported dark/light themes for comfortable viewing in any environment.
*   **Responsive**: Optimized for mobile devices for on-the-go access.

##  Technology Stack

*   **Frontend**: React 18 (TypeScript), Vite
*   **AI Engine**: Google Gemini 2.5 Flash (via Google GenAI SDK)
*   **Styling**: Tailwind CSS, PostCSS
*   **Maps**: Leaflet, React-Leaflet
*   **Charts**: Recharts
*   **Icons**: Lucide React
*   **State Management**: React Hooks & Context

##  Installation & Setup

Follow these steps to get the project running on your local machine.

### Prerequisites
*   **Node.js** (v18 or higher recommended)
*   **npm** or **yarn**
*   **Google Gemini API Key**: Get one from [Google AI Studio](https://aistudio.google.com/).

### Steps

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/your-username/staysafe-ng.git
    cd staysafe-ng
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    # or
    npm install --legacy-peer-deps
    ```

3.  **Environment Configuration**
    Create a `.env.local` file in the root directory and add your API Key:
    ```env
    VITE_GEMINI_API_KEY=your_actual_api_key_here
    GEMINI_API_KEY=your_actual_api_key_here
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    The app will normally run on `http://localhost:3000` or `http://localhost:5173`.

## 📂 Project Structure

```text
staysafe-ng/
├── public/              # Static assets
├── src/
│   ├── components/      # React components (Dashboard, Map, Feed, etc.)
│   ├── data/            # Static data specific to Nigeria (states, LGAs)
│   ├── services/        # API integrations (Gemini, Google Search)
│   ├── App.tsx          # Main application layout
│   ├── index.css        # Global styles & Tailwind directives
│   └── types.ts         # TypeScript interfaces 
├── .env.local           # Environment variables (GitIgnored)
└── package.json         # Dependencies and scripts
```

## 🤝 Contributing

Contributions are welcome! If you'd like to improve StaySafe NG, please follow these steps:

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.
All Pull Requests are looked into
## 📄 License

This project is open-source and available under the **MIT License**.

---

<p align="center">
  <small>Built with ❤️ for a Safer Nigeria.</small>
</p>

