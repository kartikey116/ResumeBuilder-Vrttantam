import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { FiCheckCircle, FiAlertTriangle, FiActivity, FiEye, FiTarget, FiArrowLeft, FiFileText } from 'react-icons/fi';
import axiosInstance from '../../utils/axiosinstance.js';
import { toast } from 'react-hot-toast';

const AtsVisualizer = () => {
  const [searchParams] = useSearchParams();
  const resumeId = searchParams.get('resumeId');
  const navigate = useNavigate();
  
  const [jobDesc, setJobDesc] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiData, setAiData] = useState(null);

  const handleAnalyze = async () => {
    if (!resumeId && !file) {
      toast.error('No resume selected. Go to Dashboard or upload a PDF.');
      return;
    }
    if (!jobDesc.trim()) {
      toast.error('Please paste a Target Job Description.');
      return;
    }

    setLoading(true);
    try {
      let targetResumeData = null;

      if (file) {
        const formData = new FormData();
        formData.append('resumePdf', file);
        toast.loading("Analyzing PDF structure...", { id: "ats-toast" });
        const parseRes = await axiosInstance.post('/api/ai/parse-resume', formData, {
           headers: { "Content-Type": "multipart/form-data" }
        });
        targetResumeData = parseRes.data.parsed; 
      }

      toast.loading("Gemini ATS Scanning...", { id: "ats-toast" });
      const response = await axiosInstance.post('/api/ai/ats-score', {
        resumeId: !file ? resumeId : undefined,
        resumeDataJson: targetResumeData,
        jobDescription: jobDesc
      });
      setAiData(response.data.analysis);
      toast.success('Analysis Complete!', { id: "ats-toast" });
    } catch (error) {
       console.error("AI Analysis failed", error);
       toast.error("Failed to run ATS test. Please ensure Gemini API Key is configured.", { id: "ats-toast" });
    } finally {
       setLoading(false);
    }
  };

  const timelineData = aiData?.timeline || [];
  const hotspots = aiData?.hotspots || [];
  const coldspots = aiData?.coldspots || [];
  const score = aiData?.score || 0;
  
  // Calculate average attention for display
  const avgAttention = timelineData.length > 0 
    ? Math.round(timelineData.reduce((acc, curr) => acc + curr.attention, 0) / timelineData.length)
    : 0;

  return (
    <div className="min-h-screen bg-[#f8f9fc] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="text-center space-y-4 relative">
          <button onClick={() => navigate('/dashboard')} className="absolute left-0 top-0 mt-2 flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors bg-white px-3 py-1.5 rounded-lg border border-slate-200">
             <FiArrowLeft /> Dashboard
          </button>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Is your resume <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">ATS Friendly?</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            75% of resumes are rejected by Applicant Tracking Systems before a human ever sees them. Select a resume, paste the Job Description, and check your score via AI.
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex flex-col md:flex-row gap-6 mb-4">
             <div className={`flex-1 flex flex-col justify-center border-2 border-dashed rounded-xl p-6 items-center bg-slate-50 relative hover:bg-slate-100 transition-colors ${file ? 'border-blue-400 bg-blue-50/30' : 'border-slate-300'}`}>
                 <input 
                   type="file" 
                   accept="application/pdf" 
                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                   onChange={(e) => setFile(e.target.files[0])} 
                 />
                 <FiFileText className={`w-10 h-10 mb-3 ${file ? 'text-blue-500' : 'text-slate-400'}`}/>
                 <p className={`text-sm font-bold ${file ? 'text-blue-700' : 'text-slate-700'}`}>{file ? file.name : "Upload external PDF Resume"}</p>
                 <p className="text-xs text-slate-500 mt-1">{file ? "Click to change file" : "Drag and drop or click to browse"}</p>
             </div>
             <div className="flex-1 flex flex-col">
                 <label className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-3">
                    <FiTarget className="text-indigo-500"/> Target Job Description
                 </label>
                 <textarea 
                    className="w-full border border-slate-300 rounded-xl p-4 flex-1 focus:ring-2 focus:ring-blue-500 focus:outline-none font-sans text-sm text-slate-700 bg-slate-50/50"
                    placeholder="Paste the Job Description here to analyze your resume against it..."
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                 ></textarea>
             </div>
          </div>
          <div className="border-t border-slate-100 mt-4 pt-4 flex justify-between items-center">
            <span className="text-sm font-semibold text-slate-500">
                {file ? "External PDF Ready ✓" : resumeId ? "Resume Pulled from Dashboard ✓" : <span className="text-red-500">No Resume Provided ✗</span>}
            </span>
            <button 
              onClick={handleAnalyze} 
              disabled={loading || !jobDesc || (!resumeId && !file)}
              className="bg-slate-900 hover:bg-black text-white font-bold py-2.5 px-8 rounded-xl shadow-md disabled:bg-slate-300 disabled:shadow-none transition-all flex items-center justify-center min-w-[200px]"
            >
              {loading ? "Scanning via Gemini..." : "Calculate Score & Heatmap"}
            </button>
          </div>
        </div>

        {/* Dashboard Frame (Only show if aiData exists or loading) */}
        {(aiData || loading) && (
        <div className={`bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden transition-opacity duration-500 ${loading ? 'opacity-50' : 'opacity-100'}`}>
          {/* Dashboard Header */}
          <div className="border-b border-slate-100 bg-slate-50/50 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                 <h2 className="text-xl font-bold text-slate-800">How Recruiters See Your Resume</h2>
                 <span className={`px-3 py-1 rounded-full text-sm font-bold ${score >= 75 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {score}% Match Score
                 </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">Simulated recruiter scan via Gemini AI with heatmap attention zones.</p>
            </div>
            <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full text-slate-600 text-sm font-semibold">
              <FiEye className="text-blue-500" />
              <span>AI Simulation</span>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Graph Container */}
            <div className="bg-[#1e2330] rounded-xl p-6 relative shadow-inner overflow-hidden border border-[#2e3440]">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-[#a1b0cb] text-sm font-bold tracking-widest uppercase">Recruiter Attention Timeline</h3>
                  <p className="text-[#64748b] text-xs mt-1">High points get skimmed less and remembered more.</p>
                </div>
                <div className="bg-[#2a3040] text-[#a1b0cb] px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2">
                  <FiActivity className={avgAttention > 40 ? "text-green-400" : "text-blue-400"} />
                  Avg attention {avgAttention}%
                </div>
              </div>

              {/* Chart */}
              <div className="h-[250px] w-full relative z-10">
                {timelineData.length > 0 && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timelineData} margin={{ top: 10, left: -20, right: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAttention" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#f43f5e" />
                        <stop offset="50%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" hide />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e2330', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="attention"
                      stroke="url(#strokeGradient)"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorAttention)"
                      activeDot={{ r: 6, fill: '#fff', stroke: '#ec4899', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Analysis Detail Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Context and Feedback Panel */}
              <div className="lg:col-span-2 space-y-4">
                 
                 <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                    <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">Experience Match</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{aiData?.experienceMatch || "N/A"}</p>
                 </div>

                 <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                    <h4 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">Missing Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                        {aiData?.missingKeywords?.map((kw, i) => (
                           <span key={i} className="bg-white px-3 py-1 rounded-full text-indigo-700 text-xs font-bold border border-indigo-200">
                              {kw}
                           </span>
                        ))}
                        {(!aiData?.missingKeywords || aiData.missingKeywords.length === 0) && (
                            <span className="text-sm text-indigo-500">Perfect keyword match!</span>
                        )}
                    </div>
                 </div>

                 <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                    <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">Feedback & Suggestions</h4>
                    <ul className="text-sm text-green-800 space-y-2 list-disc pl-4">
                       {aiData?.feedback?.map((fb, i) => (
                           <li key={i}>{fb}</li>
                       ))}
                    </ul>
                 </div>
              </div>

              {/* Hotspots & Coldspots Panel */}
              <div className="space-y-4">
                <div className="bg-amber-50 rounded-xl p-5 border border-amber-100 shadow-sm">
                  <h4 className="flex items-center gap-2 text-amber-800 font-bold mb-4">
                    <FiAlertTriangle className="text-amber-500" />
                    Top Hotspots
                  </h4>
                  <div className="space-y-4">
                    {hotspots.map((spot, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs font-semibold text-amber-900 mb-1">
                        <span className="truncate pr-2" title={spot.text}>{i+1}. {spot.text}</span>
                        <span>{spot.score}%</span>
                      </div>
                      <div className="w-full bg-amber-200/50 rounded-full h-1.5">
                        <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${spot.score}%` }}></div>
                      </div>
                    </div>
                    ))}
                    {hotspots.length === 0 && <p className="text-xs text-amber-600">No notable hotspots found.</p>}
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-5 border border-blue-100 shadow-sm">
                  <h4 className="flex items-center gap-2 text-blue-800 font-bold mb-3">
                    <FiCheckCircle className="text-blue-500" />
                    Cold Spots to Rewrite
                  </h4>
                  <ul className="text-sm text-blue-900 space-y-2 opacity-80 list-disc pl-4">
                    {coldspots.map((spot, i) => (
                        <li key={i}>{spot}</li>
                    ))}
                    {coldspots.length === 0 && <li className="list-none">Your resume phrasing looks solid.</li>}
                  </ul>
                </div>

              </div>
            </div>

          </div>
        </div>
        )}

      </div>
    </div>
  );
};

export default AtsVisualizer;
