import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './Pages/LandingPages.jsx';
import Dashboard from './Pages/Home/Dashboard.jsx';
import EditResume from './Pages/ResumeUpdate/EditResume.jsx';
import UserProvider from './context/userContext.jsx';
import Footer from './Pages/Footer.jsx';

function App() {
  return (
    <Router>
      <UserProvider>
          <Toaster position="top-center"/>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/footer" element={<Footer />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/resume/:resumeId" element={<EditResume />} />
          </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
