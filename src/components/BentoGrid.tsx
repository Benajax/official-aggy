'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  Play, Pause, RotateCcw, Volume2, VolumeX, Camera, ArrowUpRight, Ghost, Plus,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import ContactModal from './ContactModal';

const tileHover: Variants = {
  initial: { scale: 1, y: 0, zIndex: 1 },
  hover: { 
    scale: 1.02, 
    y: -5, 
    zIndex: 10,
    transition: { duration: 0.2, ease: "easeOut" },
    boxShadow: "0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(6, 182, 212, 0.15)"
  },
  tap: { scale: 0.98 } // Added haptic-like feedback for mobile taps
};

export default function BentoGrid({ socials, artist, tourDates }: any) {
  const posts = socials?.posts || socials || [];
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [hasEnded, setHasEnded] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false); 
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const pool = artist?.heroVideoPool || [];

  useEffect(() => {
    if (pool.length > 0 && currentIndex === null) {
      setCurrentIndex(Math.floor(Math.random() * pool.length));
    }
  }, [artist, pool.length, currentIndex]);

  const currentVideo = currentIndex !== null ? pool[currentIndex] : null;

  // --- 🔊 MUTE SYNC ---
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted, currentIndex, isVideoReady]); 

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVideoReady(false);
    setCurrentIndex((prev) => (prev === null ? 0 : (prev + 1) % pool.length));
    setHasEnded(false);
    setIsPlaying(true);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVideoReady(false);
    setCurrentIndex((prev) => (prev === null ? 0 : (prev - 1 + pool.length) % pool.length));
    setHasEnded(false);
    setIsPlaying(true);
  };

  const handleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const togglePlay = () => {
    if (hasEnded) return;
    // On mobile, a tap on the video will toggle controls if they are hidden
    if (!showControls) {
        setShowControls(true);
        return;
    }
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

  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setHasEnded(false);
      setIsPlaying(true);
    }
  };

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
      <motion.div 
        variants={tileHover} initial="initial" whileHover="hover" whileTap="tap"
        className="md:col-span-1 md:row-span-1 bg-zinc-950 rounded-[2.5rem] overflow-hidden relative border border-white/5 flex items-center justify-center p-4"
      >
        {artist?.logoImg && <img src={artist.logoImg} className="w-full h-full object-contain z-10" alt="Logo" />}
        <div className="absolute inset-0 bg-cyan-500/5 blur-3xl" />
      </motion.div>

      {/* 2. BANNER BLOCK - Responsive Text Size */}
      <motion.div 
        variants={tileHover} initial="initial" whileHover="hover" whileTap="tap"
        className="md:col-span-3 md:row-span-1 bg-black rounded-[2.5rem] overflow-hidden border border-white/5 flex items-center justify-center relative"
      >
        <h2 className="text-white font-[900] text-4xl sm:text-5xl md:text-7xl tracking-tighter uppercase italic z-10 text-center px-4">
          MULTIFACETED<span className="text-emerald-500">.</span>
        </h2>
      </motion.div>

      {/* 3. HERO VIDEO PLAYER - Increased Mobile Row Span */}
      <motion.div 
        ref={containerRef}
        variants={tileHover} initial="initial" whileHover="hover" whileTap="tap"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        onClick={togglePlay}
        className="row-span-2 md:col-span-2 md:row-span-2 relative overflow-hidden rounded-[2.5rem] bg-black border border-white/5 shadow-2xl flex items-center justify-center cursor-pointer"
      >
        <AnimatePresence mode="wait">
          {currentVideo ? (
            <motion.div 
              key={currentVideo.url}
              initial={{ opacity: 0 }}
              animate={{ opacity: isVideoReady ? 1 : 0 }} 
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 w-full h-full flex items-center justify-center"
            >
              <video 
                src={currentVideo.url}
                autoPlay muted loop playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-50 blur-[60px] scale-125"
              />
              <video 
                ref={videoRef}
                src={currentVideo.url}
                autoPlay playsInline preload="auto"
                onCanPlay={() => setIsVideoReady(true)}
                onTimeUpdate={() => setProgress((videoRef.current!.currentTime / videoRef.current!.duration) * 100)}
                onEnded={() => { setHasEnded(true); setIsPlaying(false); }}
                className={`relative z-10 transition-all duration-1000 ${
                  currentVideo.fillContainer ? 'w-full h-full object-cover' : 'h-full w-auto max-w-full object-contain' 
                } ${hasEnded ? 'opacity-40 blur-sm' : 'opacity-100'}`} 
              />
            </motion.div>
          ) : null}
        </AnimatePresence>

        {!isVideoReady && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
          </div>
        )}

        {/* NAVIGATION - Larger targets for Mobile */}
        <div className={`absolute inset-0 z-[70] flex items-center justify-between px-4 sm:px-6 transition-opacity duration-500 pointer-events-none ${showControls && pool.length > 1 ? 'opacity-100' : 'opacity-0'}`}>
          <button onClick={handlePrev} className="p-4 bg-black/40 hover:bg-white hover:text-black rounded-full backdrop-blur-md transition-all border border-white/10 text-white pointer-events-auto active:scale-90">
            <ChevronLeft size={24} />
          </button>
          <button onClick={handleNext} className="p-4 bg-black/40 hover:bg-white hover:text-black rounded-full backdrop-blur-md transition-all border border-white/10 text-white pointer-events-auto active:scale-90">
            <ChevronRight size={24} />
          </button>
        </div>

        {/* CONTROLS */}
        <div className={`absolute inset-0 z-50 flex flex-col justify-end p-6 sm:p-8 transition-opacity duration-500 pointer-events-none ${showControls && !hasEnded ? 'opacity-100 bg-gradient-to-t from-black/90' : 'opacity-0'}`}>
          <div className="flex items-center gap-4 w-full pointer-events-auto">
            <div className="relative flex-grow h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 shadow-[0_0_15px_#06b6d4]" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">{(currentIndex || 0) + 1} / {pool.length}</span>
            <button onClick={handleMute} className="text-white p-2 active:scale-90">
              {isMuted ? <VolumeX size={24} className="text-zinc-500" /> : <Volume2 size={24} className="text-cyan-400" />}
            </button>
          </div>
        </div>

        {/* REPLAY */}
        <AnimatePresence>
          {hasEnded && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto px-4">
              <button onClick={handleReplay} className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-black uppercase text-[10px] tracking-widest hover:scale-110 active:scale-95 transition-all w-full sm:w-auto justify-center">
                <RotateCcw size={14} strokeWidth={3} /> Replay
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 4. MAIN SOCIAL */}
      <motion.div 
        variants={tileHover} initial="initial" whileHover="hover" whileTap="tap"
        className="row-span-2 md:col-span-1 md:row-span-2 bg-zinc-800 rounded-[2.5rem] overflow-hidden relative border border-white/5 group"
      >
        {posts[0] && <img src={posts[0].mediaUrl} className="w-full h-full object-cover" alt="Social" />}
      </motion.div>

      {/* 5. TOUR DATES */}
      <motion.div 
        variants={tileHover} initial="initial" whileHover="hover" whileTap="tap"
        className="row-span-2 md:col-span-1 md:row-span-2 bg-zinc-950 border border-white/5 rounded-[2.5rem] p-8 flex flex-col h-full relative overflow-hidden"
      >
        <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em] mb-8 font-bold text-center">Live Shows</p>
        <div className="space-y-6 overflow-y-auto flex-grow custom-scrollbar">
          {tourDates?.map((show: any) => (
            <div key={show._id} className="border-b border-white/5 pb-3 last:border-0">
              <p className="font-black text-sm uppercase text-white">{show.city}</p>
              <p className="text-zinc-500 text-[11px] uppercase font-mono">{show.venue}</p>
            </div>
          ))}
        </div>
        <button onClick={() => setIsContactModalOpen(true)} className="mt-6 w-full py-4 bg-white text-black rounded-2xl text-[11px] font-black uppercase tracking-widest active:bg-cyan-400 transition-all">Contact</button>
      </motion.div>

      {/* 6. SPOTIFY */}
      <motion.div 
        variants={tileHover} initial="initial" whileHover="hover" whileTap="tap"
        className="md:col-span-1 md:row-span-1 bg-emerald-500/10 border border-emerald-500/20 rounded-[2.5rem] p-8 flex flex-col justify-between group cursor-pointer"
      >
        <Play fill="#10b981" className="text-emerald-500" size={32} />
        <span className="text-emerald-500 font-black text-xs uppercase">Listen Now</span>
      </motion.div>

      {/* 7. SNAPCHAT */}
      <motion.div 
        variants={tileHover} initial="initial" whileHover="hover" whileTap="tap"
        className="bg-[#FFFC00] rounded-[2.5rem] p-8 flex flex-col justify-between text-black group cursor-pointer"
      >
         <Ghost size={36} strokeWidth={2.5} />
         <span className="text-[12px] font-black uppercase">@{artist?.logoText || 'AGGY'}</span>
      </motion.div>

      {/* 8. SMALL SOCIAL TILES */}
      {[1, 2].map((idx) => (
        <motion.div 
          key={idx} 
          variants={tileHover} initial="initial" whileHover="hover" whileTap="tap"
          className="md:col-span-1 md:row-span-1 bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-white/5 relative"
        >
          {posts[idx] ? <img src={posts[idx].mediaUrl} className="w-full h-full object-cover opacity-60" alt="Social" /> : <div className="w-full h-full flex items-center justify-center opacity-40"><Plus size={24} className="text-white" /></div>}
        </motion.div>
      ))}

      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </div>
  );
}