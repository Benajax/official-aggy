'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, RotateCcw, Volume2, VolumeX, Camera, ArrowUpRight, Ghost, Plus,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import ContactModal from './ContactModal';

export default function BentoGrid({ socials, artist, tourDates }: any) {
  const posts = socials?.posts || socials || [];
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [hasEnded, setHasEnded] = useState(false);
  const [showControls, setShowControls] = useState(false);
  
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const pool = artist?.heroVideoPool || [];

  useEffect(() => {
    if (pool.length > 0) {
      setCurrentIndex(Math.floor(Math.random() * pool.length));
    }
  }, [artist]);

  const currentVideo = pool[currentIndex] || null;

  // --- NAVIGATION LOGIC ---
  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % pool.length);
    setHasEnded(false);
    setIsPlaying(true);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + pool.length) % pool.length);
    setHasEnded(false);
    setIsPlaying(true);
  };

  // --- REPLAY LOGIC (FIXED) ---
  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop parent togglePlay from firing
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setHasEnded(false);
      setIsPlaying(true);
    }
  };

  // --- VIDEO INTERACTION ---
  const togglePlay = () => {
    if (hasEnded) return; // Don't toggle if the video is at the replay screen
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // --- AUTO-PAUSE ON SCROLL ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (videoRef.current) {
          if (entry.isIntersecting && !hasEnded) {
            videoRef.current.play();
            setIsPlaying(true);
          } else {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        }
      },
      { threshold: 0.5 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [hasEnded, currentIndex]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-7xl mx-auto auto-rows-[200px] p-4 bg-black min-h-screen">
      
      {/* 1. LOGO BLOCK */}
      <div className="md:col-span-1 md:row-span-1 bg-zinc-950 rounded-[2.5rem] overflow-hidden relative border border-white/5 flex items-center justify-center p-4 group">
        {artist?.logoImg && (
          <img src={artist.logoImg} className="w-full h-full object-contain hover:scale-110 transition-transform duration-500 z-10" alt="Logo" />
        )}
        <div className="absolute inset-0 bg-cyan-500/5 blur-3xl" />
      </div>

      {/* 2. BANNER BLOCK */}
      <div className="md:col-span-3 md:row-span-1 bg-black rounded-[2.5rem] overflow-hidden border border-white/5 flex items-center justify-center relative">
        <h2 className="text-white font-[900] text-5xl md:text-7xl tracking-tighter uppercase italic z-10">
          MULTIFACETED<span className="text-emerald-500">.</span>
        </h2>
      </div>

      {/* 3. HERO VIDEO (2x2) - ADAPTIVE VIBE SWITCHER */}
      <div 
        ref={containerRef}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        onClick={togglePlay}
        className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-[2.5rem] bg-black border border-white/5 group shadow-2xl flex items-center justify-center cursor-pointer"
      >
        <AnimatePresence mode="wait">
          {currentVideo ? (
            <motion.div 
              key={currentVideo.url}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 w-full h-full flex items-center justify-center"
            >
              {/* AMBIENT GLOW LAYER */}
              <video 
                src={currentVideo.url}
                autoPlay muted loop playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-50 blur-[60px] scale-125"
              />

              {/* MAIN VIDEO LAYER */}
              <video 
                ref={videoRef}
                src={currentVideo.url}
                autoPlay muted playsInline 
                onTimeUpdate={() => setProgress((videoRef.current!.currentTime / videoRef.current!.duration) * 100)}
                onEnded={() => { setHasEnded(true); setIsPlaying(false); }}
                className={`relative z-10 transition-all duration-1000 ${
                  currentVideo.fillContainer 
                    ? 'w-full h-full object-cover'   
                    : 'h-full w-auto max-w-full object-contain' 
                } ${hasEnded ? 'opacity-40 blur-sm' : 'opacity-100'}`} 
              />
            </motion.div>
          ) : (
            <div className="text-white/30 animate-pulse">Initialising...</div>
          )}
        </AnimatePresence>

        {/* NAVIGATION ARROWS */}
        <div className={`absolute inset-0 z-40 flex items-center justify-between px-6 transition-opacity duration-500 ${showControls && pool.length > 1 ? 'opacity-100' : 'opacity-0'}`}>
          <button onClick={handlePrev} className="p-3 bg-black/40 hover:bg-white hover:text-black rounded-full backdrop-blur-md transition-all border border-white/10 text-white">
            <ChevronLeft size={20} />
          </button>
          <button onClick={handleNext} className="p-3 bg-black/40 hover:bg-white hover:text-black rounded-full backdrop-blur-md transition-all border border-white/10 text-white">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* CONTROLS */}
        <div className={`absolute inset-0 z-20 flex flex-col justify-end p-8 transition-opacity duration-500 ${showControls && !hasEnded ? 'opacity-100 bg-gradient-to-t from-black/90' : 'opacity-0'}`}>
          <div className="flex items-center gap-4 w-full">
            <div className="relative flex-grow h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 shadow-[0_0_15px_#06b6d4]" style={{ width: `${progress}%` }} />
            </div>
            
            <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">
              {currentIndex + 1} / {pool.length}
            </span>

            <button onClick={handleMute} className="text-white">
              {isMuted ? <VolumeX size={20} className="text-zinc-500" /> : <Volume2 size={20} className="text-cyan-400" />}
            </button>
          </div>
        </div>

        {/* REPLAY SCREEN */}
        <AnimatePresence>
          {hasEnded && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            >
              <button 
                onClick={handleReplay} 
                className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-black uppercase text-[10px] tracking-widest hover:scale-110 active:scale-95 transition-all shadow-2xl"
              >
                <RotateCcw size={14} strokeWidth={3} /> Replay
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. MAIN SOCIAL (1x2) */}
      <div className="md:col-span-1 md:row-span-2 bg-zinc-800 rounded-[2.5rem] overflow-hidden relative border border-white/5 group">
        {posts[0] && <img src={posts[0].mediaUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Social" />}
      </div>

      {/* 5. TOUR DATES (1x2) */}
      <div className="md:col-span-1 md:row-span-2 bg-zinc-950 border border-white/5 rounded-[2.5rem] p-8 flex flex-col h-full relative overflow-hidden">
        <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em] mb-8 font-bold text-center">Live Shows</p>
        <div className="space-y-6 overflow-y-auto flex-grow custom-scrollbar">
          {tourDates?.map((show: any) => (
            <div key={show._id} className="border-b border-white/5 pb-3 last:border-0 hover:translate-x-1 transition-transform">
              <p className="font-black text-sm uppercase text-white">{show.city}</p>
              <p className="text-zinc-500 text-[11px] uppercase font-mono">{show.venue}</p>
            </div>
          ))}
        </div>
        <button onClick={() => setIsContactModalOpen(true)} className="mt-6 w-full py-4 bg-white text-black rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-cyan-400 transition-all">Contact</button>
      </div>

      {/* 6. SPOTIFY (1x1) */}
      <div className="md:col-span-1 md:row-span-1 bg-emerald-500/10 border border-emerald-500/20 rounded-[2.5rem] p-8 flex flex-col justify-between group cursor-pointer hover:bg-emerald-500/20 transition-all">
        <Play fill="#10b981" className="text-emerald-500 transition-transform group-hover:scale-110" size={32} />
        <span className="text-emerald-500 font-black text-xs uppercase">Listen Now</span>
      </div>

      {/* 7. SNAPCHAT (1x1) */}
      <div className="bg-[#FFFC00] rounded-[2.5rem] p-8 flex flex-col justify-between text-black group cursor-pointer hover:scale-[1.02] transition-transform">
         <Ghost size={36} strokeWidth={2.5} />
         <span className="text-[12px] font-black uppercase">@{artist?.logoText || 'AGGY'}</span>
      </div>

      {/* 8. SMALL SOCIAL TILES (2x) */}
      {[1, 2].map((idx) => (
        <div key={idx} className="md:col-span-1 md:row-span-1 bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-white/5 group relative">
          {posts[idx] ? <img src={posts[idx].mediaUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500" alt="Social" /> : <div className="w-full h-full flex items-center justify-center opacity-40"><Plus size={24} className="text-white" /></div>}
        </div>
      ))}

      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </div>
  );
}