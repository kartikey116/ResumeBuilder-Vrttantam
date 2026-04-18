import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/home/LandingPage.jsx';
import Dashboard from './pages/home/Dashboard.jsx';
import EditResume from './pages/ResumeUpdate/EditResume.jsx';
import UserProvider from './context/userContext.jsx';
import Footer from './components/common/Footer.jsx';
import OAuthSuccess from './pages/auth/OAuthSuccess.jsx';
import ResumeProvider from './context/ResumeContext.jsx';
import AtsVisualizer from './pages/ATSCheck/AtsVisualizer.jsx';
import Login from './pages/auth/Login.jsx';
import SignUp from './pages/auth/SignUp.jsx';
import TemplateGallery from './pages/Community/TemplateGallery.jsx';


function App() {
  return (
    <Router>
      <UserProvider>
        <ResumeProvider>
          <Toaster position="top-center"/>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/footer" element={<Footer />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/resume/:resumeId" element={<EditResume />} />
            <Route path="/oauth-success" element={<OAuthSuccess />} />
            <Route path="/ats-check" element={<AtsVisualizer />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/community" element={<TemplateGallery />} />

          </Routes>
        </ResumeProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
