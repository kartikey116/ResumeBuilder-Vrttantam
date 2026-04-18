import React from 'react';

function Footer() {
  return (
    <footer className="py-20 border-t bg-black text-white">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
               वृत्तान्तम् (Vṛttāntam) – Account / report / summary
            </h3>
            <p className="text-gray-600">
              "Vṛttāntam: Redefining career growth through powerful professional summaries."
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4 underline text-white">Product</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-purple-600 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-purple-600 transition-colors">Templates</a></li>
              <li><a href="#" className="hover:text-purple-600 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-purple-600 transition-colors">API</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4 underline text-white">Support</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-purple-600 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-purple-600 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-purple-600 transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-purple-600 transition-colors">Terms</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4 underline text-white">Connect</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-purple-600 transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-purple-600 transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-purple-600 transition-colors">GitHub</a></li>
              <li><a href="#" className="hover:text-purple-600 transition-colors">Discord</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 text-center border-gray-300">
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} ResumeBuilder. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
