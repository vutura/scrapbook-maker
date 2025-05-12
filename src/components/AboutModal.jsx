// AboutModal.jsx
import React from 'react';

const AboutModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-white w-[720px] rounded-2xl shadow-xl relative overflow-hidden">
        
        {/* Pink gradient line at the top */}
          <div className="h-1 w-full bg-gradient-to-r from-pink-200 via-pink-400 to-pink-200" />
          
          <div className="p-8">
            <h2 className="font-serialb text-2xl mb-6 text-pink-500 text-center font-bold">
              About Scrapbook Maker
            </h2>

            <div className="space-y-6">

              {/* Description */}
              <div className="space-y-4">
                <p className="font-serialt text-gray-600 font-bold">
                hi! I'm Vutura, a junior software engineer with a passion for art, cute things, and technology. 
                this project was born from my desire to create something that perfectly blends all these elements 
                together !!
                </p>
                <p className="font-serialt text-gray-600 font-bold">
                this the first project in my portfolio and i'm so excited for you to try it  💖
                </p>
                <p className="font-serialt text-gray-600 font-bold">
                built with react, tailwind css and lots of love, this project showcases a journey into learning and creating 
                interactive web applications with a focus on user experience and design.
                </p>
                <p className="font-serialt text-gray-600 font-bold">
                THIS IS STILL A WORK IN PROGRESS!!! YOU MAY ENCOUNTER SOME ERRORS OR UNFINISHED STUFF :-( SUPPORT IN SPANISH IS COMING SOON (๑•᎑•๑)
                </p>
                <p className="font-serialt text-gray-600 font-bold">
                once you've finished your creation, don't forget to save and share it! feel free to reach out to me on my profiles for feedback, suggestions, or any questions.
                </p>
                <div className="pt-4">
                <p className="font-serialt text-gray-700 mb-3 font-bold">
                  if you enjoyed using Scrapbook Maker, consider supporting my work buying me a coffee ! you can donate as little as $1
                </p>
                <a
                  href="https://buymeacoffee.com/vutura"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-[#FFDD00] text-[#000000] font-serialb px-6 py-3 rounded-full 
                 hover:bg-[#FFED4F] transition-all duration-300 shadow-md hover:shadow-lg 
                 transform hover:-translate-y-0.5 font-bold"
                >
                  Buy me a coffee ☕
                </a>
                </div>
              </div>

              {/* Features section 
              <div>
                <h3 className="font-serialb text-lg mb-3 text-gray-700 font-bold">Features</h3>
                <ul className="list-none space-y-2">
                <li className="font-serialt text-gray-600 flex items-center gap-2 font-bold">
                  ✨ Large collection of cute stickers
                </li>
                <li className="font-serialt text-gray-600 flex items-center gap-2 font-bold">
                  ✨ Intuitive drag-and-drop interface
                </li>
                <li class="font-serialt text-gray-600 flex items-center gap-2 font-bold">
                  ✨ Advanced sticker controls (rotate, resize, layer)
                </li>
                <li class="font-serialt text-gray-600 flex items-center gap-2 font-bold">
                  ✨ Save and share your creations
                </li>
                </ul>
              </div>*/}

            {/* Connect section */}
            <div>
              <h3 className="font-serialb text-lg mb-3 text-gray-700">Let's Connect!</h3>
              <div className="flex gap-4">
                <a
                  href="https://github.com/vutura"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-pink-200 rounded-full text-sm hover:bg-gray-100 transition-colors font-serialb"
                >
                  GitHub
                </a>
              </div>
            </div>

            {/* Close button */}
            <div className="mt-8 text-center">
              <button
                onClick={onClose}
                className="font-serialb px-6 py-2 rounded-full border border-gray-300
                         hover:bg-gray-50 transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;