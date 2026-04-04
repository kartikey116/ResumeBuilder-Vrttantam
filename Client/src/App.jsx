import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './Pages/LandingPages.jsx';
import Dashboard from './Pages/Home/Dashboard.jsx';
import EditResume from './Pages/ResumeUpdate/EditResume.jsx';
import UserProvider from './context/userContext.jsx';
import Footer from './Pages/Footer.jsx';
import OAuthSuccess from './Pages/OAuthSuccess.jsx';
import ResumeProvider from './context/ResumeContext.jsx';
import AtsVisualizer from './Pages/ATSCheck/AtsVisualizer.jsx';
import Login from './Pages/Auth/Login.jsx';
import SignUp from './Pages/Auth/SignUp.jsx';


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

          </Routes>
        </ResumeProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
