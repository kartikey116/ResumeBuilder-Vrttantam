# Vṛttāntam (वृत्तान्तम्) — The Art of Professional Narrative

![Vṛttāntam Banner](https://img.shields.io/badge/AI-Powered-7c3aed?style=for-the-badge&logo=google-gemini&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

**Vṛttāntam** (Sanskrit for "narrative" or "account") is a high-fidelity, AI-driven resume ecosystem designed to help professionals escape the "ATS Black Hole." It transforms the job hunt from a formatting headache into a strategic storytelling process.

---

## ✨ Core Functionalities

### 1. 🎯 Smart ATS Global Scanner
Most resume builders give you a generic "score." Vṛttāntam provides a **Recruiter Simulation**:
- **Radar-based Dimension Analysis**: Breaks down your fit across 5 key pillars: Keyword Match, Skills Alignment, Experience Level, Impact & Metrics, and Formatting Quality.
- **Heatmap Attention Zones**: Visualizes exactly which sections of your resume will capture a recruiter's eye (Section-by-section attention map).
- **Brutally Honest Scoring**: Calibrated to real enterprise ATS systems (75%+ is a true strong match).
- **Keyword & Phrase Audit**: Identifies exactly which hard skills are missing and which "Cold Spot" phrases need rewriting for impact.

### 2. ⚡ AI-Powered Resume Import
Stop copy-pasting. Drop any existing PDF or DOCX resume, and our **Gemini-backed Parser** will:
- Deconstruct the document into structured data (Work, Education, Skills, Projects).
- Map the data instantly to any of our 12+ professional templates.
- Preserve your history while modernizing your presentation in under 10 seconds.

### 3. 🛡️ Privacy-First Community Gallery
Share your success without sacrificing your identity. Our **AI Anonymization Engine**:
- Scrubs all PII (Personally Identifiable Information) on the fly.
- Replaces your contact info, location, and company names with realistic, fictional "persona" data.
- Allows you to publish templates to the global gallery for others to "clone" and adapt.

### 4. 🎨 Premium Design Engine
- **12+ Professional Templates**: Optimized for both human readability and machine parsability.
- **One-Click Switch**: Change your entire resume design without losing content.
- **Dynamic Customization**: Full control over color palettes (HSL tailored), typography (Inter, Roboto, DM Serif), and spacing.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js, Vite, Framer Motion (Animations), Recharts (Data Viz) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB + Mongoose |
| **AI Engine** | Google Gemini API (`gemini-2.0-flash`) |
| **Storage** | AWS S3 (Signed URLs for secure PDF/Image hosting) |
| **Auth** | Passport.js (Local, Google OAuth, GitHub OAuth) |

---

## 🚀 Why Vṛttāntam?

### The "Black Hole" Problem
75% of resumes are rejected by bots before they ever reach a human. Generic builders prioritize "looking pretty" over "performing well." Vṛttāntam is built **backwards from the ATS**, ensuring your narrative is machine-readable first and human-inspiring second.

### Narrative over List
A resume shouldn't just be a list of responsibilities. Inspired by its namesake, our platform encourages **impact-quantified narratives**. Our AI Bullet Enhancer helps you pivot from *"Responsible for X"* to *"Led X, resulting in a 40% efficiency gain."*

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account
- Google Gemini API Key
- AWS S3 Bucket (Optional for profile pics/PDF storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kartikey116/ResumeBuilder.git
   cd Vṛttāntam
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   # Create a .env file with:
   # PORT=5000
   # MONGO_URI=your_mongodb_uri
   # JWT_SECRET=your_secret
   # GEMINI_API_KEY=your_key
   # GOOGLE_CLIENT_ID/SECRET (for OAuth)
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd Client
   npm install
   npm run dev
   ```

---

## 📜 License
Personal use and learning. Developed as a showcase of modern AI integration and Full-stack engineering.

**वृत्तान्तम् — Your professional story, perfectly told.**
