import './fonts.css';
import asset0 from "./assets/lp-28-hero.png";

import React from 'react';

export default function Northwind() {
  return (
    <div className="flex w-full h-full bg-[#1a1a1a] text-zinc-50 font-['Inter'] overflow-hidden">
      {/* Left Column: Content */}
      <div className="flex flex-col w-[55%] h-full p-16 justify-between relative z-10">
        {/* Navigation */}
        <nav className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            {/* Logo Mark */}
            <div className="w-8 h-8 rounded-sm bg-amber-400 flex items-center justify-center">
              <div className="w-3 h-3 bg-[#1a1a1a] rounded-full" />
            </div>
            <span className="font-semibold tracking-wide text-lg tracking-tight">NORTHWIND</span>
          </div>
          <div className="flex gap-8 text-sm font-medium text-zinc-400">
            <a href="#" className="hover:text-zinc-50 transition-colors">Programs</a>
            <a href="#" className="hover:text-zinc-50 transition-colors">Admissions</a>
            <a href="#" className="hover:text-zinc-50 transition-colors">Tuition & Aid</a>
            <a href="#" className="hover:text-zinc-50 transition-colors">About Us</a>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="flex flex-col max-w-xl mt-12">
          {/* Eyebrow */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-[2px] bg-amber-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              Northwind Learning
            </span>
          </div>

          <h1 className="text-6xl font-bold leading-[1.1] tracking-tight mb-8 text-white">
            Welcoming the <br />
            class of 2031.
          </h1>

          <p className="text-xl leading-relaxed text-zinc-400 mb-12">
            Our new catalog of professional certificates and degree programs is designed for working adults. Flexible schedules, world-class faculty, and a community of peers.
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-6">
            <button className="px-8 py-4 bg-amber-400 text-[#1a1a1a] text-sm font-semibold rounded-sm hover:bg-amber-300 transition-colors">
              Apply now
            </button>
            <button className="px-8 py-4 bg-transparent border border-zinc-700 text-zinc-50 text-sm font-semibold rounded-sm hover:border-zinc-500 transition-colors">
              Explore programs
            </button>
          </div>
        </div>

        {/* Footer / Extra info */}
        <div className="flex items-center gap-12 pt-8 border-t border-zinc-800/50 mt-12">
          <div>
            <div className="text-3xl font-light text-zinc-300 mb-1">50+</div>
            <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Programs</div>
          </div>
          <div>
            <div className="text-3xl font-light text-zinc-300 mb-1">100%</div>
            <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Online or Hybrid</div>
          </div>
        </div>
      </div>

      {/* Right Column: Image */}
      <div className="w-[45%] h-full relative">
        <div className="absolute inset-0 bg-amber-400/10 mix-blend-overlay z-10" />
        <img 
          src={asset0} 
          alt="Adult learners in a bright classroom" 
          className="w-full h-full object-cover grayscale-[20%]"
        />
        
        {/* Yellow Accent Block overlay on image bottom right */}
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-400 p-10 flex flex-col justify-end z-20">
          <div className="w-12 h-12 mb-6 text-[#1a1a1a]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <div className="text-[#1a1a1a] font-semibold text-lg leading-snug">
            Spring enrollment <br/>is now open.
          </div>
        </div>
      </div>
    </div>
  );
}
