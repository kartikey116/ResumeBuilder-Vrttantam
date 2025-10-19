import React from "react";
import { useState, useEffect, useContext, useMemo, useRef } from "react"; 

import { useNavigate } from "react-router-dom";
import Modal from "../COmponent/Modal.jsx";
import Login from "../Pages/Auth/Login.jsx";
import Signup from "../Pages/Auth/SignUp.jsx";
import { UserContext } from "../context/userContext.jsx";
import ProfileInfoCard from "../COmponent/Cards/ProfileInfoCard.jsx";
import { features, testimonials, faqs } from "../assets/Constant.jsx";
import "../App.css";

function LandingPages() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");

  const [typedText, setTypedText] = useState("");
  const fullText =
    'Inspired by the Sanskrit term "वृttāntam" (narrative), our platform empowers you to create resumes that tell your unique professional story with ease and elegance.';

  const handleCTA = () => {
    if (!user) {
      setOpenAuthModal(true);
    } else {
      navigate("/dashboard");
    }
  };

  useEffect(() => {
    const startTypingTimeout = setTimeout(() => {
      let i = 0;
      setTypedText("");
      const interval = setInterval(() => {
        if (i < fullText.length) {
          setTypedText((prev) => prev + fullText.charAt(i));
          i++;
        } else {
          clearInterval(interval);
          const cursor = document.querySelector(".typing-cursor");
          if (cursor) {
            cursor.style.display = "none";
          }
        }
      }, 40);

      return () => clearInterval(interval);
    }, 1000);

    return () => clearTimeout(startTypingTimeout);
  }, []);

  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const mouse = useRef({ x: undefined, y: undefined });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Set canvas dimensions
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();

    window.addEventListener("resize", setCanvasSize);

    // Mouse event listener
    const handleMouseMove = (event) => {
      mouse.current.x = event.x;
      mouse.current.y = event.y;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Dot properties
    const dotCount = 100;
    const dotRadius = 1;
    const connectDistance = 120; // Max distance to connect dots
    const mouseConnectDistance = 150; // Max distance to connect to mouse
    const colors = ["#a855f7", "#ec4899", "#d8b4fe", "#fbcfe8"]; // Purple and Pink shades

    class Dot {
      constructor(x, y, dx, dy, radius, color) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = radius;
        this.color = color;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
          this.dx = -this.dx;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
          this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;

        this.draw();
      }
    }

    let dots = [];
    function init() {
      dots = [];
      for (let i = 0; i < dotCount; i++) {
        let radius = dotRadius;
        let x = Math.random() * (canvas.width - radius * 2) + radius;
        let y = Math.random() * (canvas.height - radius * 2) + radius;
        let dx = (Math.random() - 0.5) * 0.5; 
        let dy = (Math.random() - 0.5) * 0.5;
        let color = colors[Math.floor(Math.random() * colors.length)];
        dots.push(new Dot(x, y, dx, dy, radius, color));
      }
    }

    function animate() {
      animationFrameId.current = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < dots.length; i++) {
        dots[i].update();

        // Connect dots to other dots
        for (let j = i + 1; j < dots.length; j++) {
          const dist = Math.sqrt(
            Math.pow(dots[i].x - dots[j].x, 2) +
              Math.pow(dots[i].y - dots[j].y, 2)
          );
          if (dist < connectDistance) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(128,0,128, ${1 - dist / connectDistance})`; // Purple tint
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        // Connect dots to mouse
        if (mouse.current.x && mouse.current.y) {
          const distToMouse = Math.sqrt(
            Math.pow(dots[i].x - mouse.current.x, 2) +
              Math.pow(dots[i].y - mouse.current.y, 2)
          );
          if (distToMouse < mouseConnectDistance) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(mouse.current.x, mouse.current.y);
            ctx.strokeStyle = `rgba(236, 72, 153, ${
              1 - distToMouse / mouseConnectDistance
            })`; 
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    }

    init();
    animate();

    // Cleanup function
    return () => {
      window.removeEventListener("resize", setCanvasSize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, []); 

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap');
          
          @keyframes fade-in-down {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-down { animation: fade-in-down 0.7s ease-out forwards; }

          @keyframes pop-in {
            0% { opacity: 0; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          .animate-pop-in { animation: pop-in 0.6s ease-out forwards; }

          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          .animate-shimmer {
            background-size: 200% auto;
            animation: shimmer 3s infinite linear;
          }
          
          @keyframes blink {
            from, to { border-color: transparent }
            50% { border-color: #7c3aed; }
          }
          .typing-cursor {
            display: inline-block;
            width: 2px;
            height: 1.2em;
            background-color: #7c3aed;
            animation: blink 1s step-end infinite;
            vertical-align: bottom;
            margin-left: 4px;
          }
          
          .interactive-canvas {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
          }
        `}
      </style>
      <div className="w-full min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 font-sans overflow-x-hidden">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <header className="flex items-center justify-between py-4 animate-fade-in-down">
            <div className="flex items-baseline text-3xl font-extrabold text-gray-900 tracking-tight">
              <span
                className="font-dancing-script text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-700 animate-shimmer"
                style={{
                  fontSize: "5.5rem",
                  fontFamily: "'Dancing Script', cursive",
                  backgroundSize: "200% auto",
                  animationDelay: "0.2s",
                  lineHeight: "1",
                }}
              >
                V
              </span>
              <span
                className="font-dancing-script text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-700 animate-shimmer"
                style={{
                  fontSize: "3.5rem",
                  fontFamily: "'Dancing Script', cursive",
                  backgroundSize: "200% auto",
                  animationDelay: "0.2s",
                  marginLeft: "-0.2em",
                }}
              >
                ṛttāntam
              </span>
              <span
                className="font-dancing-script text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-700 animate-shimmer ml-4"
                style={{
                  fontSize: "1.25rem",
                  fontFamily: "'Dancing Script', cursive",
                  backgroundSize: "200% auto",
                  animationDelay: "0.4s",
                }}
              >
                (वृत्तान्तम्)
              </span>
            </div>
            {user ? (
              <ProfileInfoCard />
            ) : (
              <button
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                onClick={() => setOpenAuthModal(true)}
              >
                Login / Sign Up
              </button>
            )}
          </header>

          {/* Hero Section */}
          <div className="flex flex-col items-center justify-center text-center mt-5 md:mt-5 py-20 relative z-10">
            {/* Canvas for interactive dot animation */}
            <canvas ref={canvasRef} className="interactive-canvas"></canvas>

            <div
              className="max-w-3xl animate-fade-in-down"
              style={{ animationDelay: "0.6s" }}
            >
              <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight">
                Craft Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse">
                  Perfect Resume
                </span>
              </h1>
              <p className="text-lg text-gray-700 mt-6 mb-10 leading-relaxed min-h-[5.25rem]">
                {typedText}
                <span className="typing-cursor"></span>
              </p>
              <button
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-4 rounded-full font-semibold text-lg hover:scale-105 transition-all duration-300 shadow-xl transform hover:rotate-1"
                onClick={handleCTA}
              >
                Get Started Now
              </button>
            </div>
          </div>

          <section className="mt-24 relative z-10">
            <h2
              className="text-4xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12 animate-fade-in-down"
              style={{ animationDelay: "1s" }}
            >
              Why Choose{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                Vṛttāntam?
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl backdrop-blur-md bg-white/40 dark:bg-gray-800/50 shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 transform hover:-translate-y-2"
                  style={{ animationDelay: `${1.2 + index * 0.1}s` }}
                >
                  <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl mb-4 text-white text-2xl shadow-md">
                    {feature.icon ?? "✨"}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="mt-24 py-16 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl relative z-10 overflow-hidden">
  <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12 animate-fade-in-down">
    What Our Users Say
  </h2>

  <div className="relative w-full overflow-hidden">
    <div
      className="flex space-x-6 animate-scroll hover:[animation-play-state:paused] px-6"
    >
      {[...testimonials, ...testimonials].map((t, i) => (
        <div
          key={i}
          className="shrink-0 w-80 sm:w-96 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg transition-transform transform hover:scale-105 cursor-pointer"
        >
          <p className="text-gray-700 dark:text-gray-300 italic mb-6">
            “{t.quote}”
          </p>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-full flex items-center justify-center font-bold">
              {t.name.charAt(0)}
            </div>
            <div>
              <p className="text-gray-900 dark:text-gray-100 font-semibold">
                {t.name}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{t.role}</p>
              <div className="flex mt-1">
                {Array.from({ length: 5 }).map((_, star) => (
                  <span key={star} className="text-yellow-400">★</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>

  <style>{`
    @keyframes scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .animate-scroll {
      display: flex;
      width: max-content;
      animation: scroll 25s linear infinite;
    }
    .hover\\:\\[animation-play-state\\:paused\\]:hover {
      animation-play-state: paused !important;
    }
  `}</style>
</section>


          {/* FAQs Section */}
          <section className="mt-24 relative z-10">
            <h2
              className="text-4xl font-bold text-center text-gray-900 mb-12 animate-fade-in-down"
              style={{ animationDelay: "2s" }}
            >
              Frequently Asked Questions
            </h2>
            <div className="max-w-4xl mx-auto space-y-6">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 animate-pop-in"
                  style={{ animationDelay: `${2.2 + index * 0.08}s` }}
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="mt-24 py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl text-center shadow-2xl relative z-10">
            <h2
              className="text-4xl font-bold mb-6 animate-fade-in-down"
              style={{ animationDelay: "2.6s" }}
            >
              Ready to Build Your Future?
            </h2>
            <p
              className="text-xl mb-10 leading-relaxed animate-fade-in-down"
              style={{ animationDelay: "2.8s" }}
            >
              Join thousands of professionals creating stunning resumes with
              Vṛttāntam.
            </p>
            <button
              className="bg-white text-purple-700 px-12 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl animate-pop-in"
              style={{ animationDelay: "3s" }}
              onClick={handleCTA}
            >
              Start Building Now
            </button>
          </section>

          {/* Auth Modal */}
          <Modal
            isOpen={openAuthModal}
            onClose={() => {
              setOpenAuthModal(false);
              setCurrentPage("login");
            }}
            hideHeader
          >
            {currentPage === "login" && (
              <Login setCurrentPage={setCurrentPage} />
            )}
            {currentPage === "signup" && (
              <Signup setCurrentPage={setCurrentPage} />
            )}
          </Modal>
        </div>

        {/* Footer */}
        <footer className="mt-24 py-12 bg-gray-900 text-white relative z-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-dancing-script">
                  Vṛttāntam
                </h3>
                <p className="text-gray-400 mt-2 leading-relaxed">
                  Crafting professional narratives that empower your career.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Product</h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-purple-400 transition-colors"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-purple-400 transition-colors"
                    >
                      Templates
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-purple-400 transition-colors"
                    >
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-purple-400 transition-colors"
                    >
                      API
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Support</h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-purple-400 transition-colors"
                    >
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-purple-400 transition-colors"
                    >
                      Contact
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-purple-400 transition-colors"
                    >
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-purple-400 transition-colors"
                    >
                      Terms
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Connect</h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-purple-400 transition-colors"
                    >
                      Twitter
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-purple-400 transition-colors"
                    >
                      LinkedIn
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-purple-400 transition-colors"
                    >
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-purple-400 transition-colors"
                    >
                      Discord
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-8 mt-8 text-center">
              <p className="text-gray-400">
                © {new Date().getFullYear()} Vṛttāntam. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default LandingPages;
