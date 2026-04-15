'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
// 1. Import the PortableText component
import { PortableText } from '@portabletext/react'; 
import {
  Play, Pause, RotateCcw, Volume2, VolumeX, Camera, ArrowUpRight, Ghost, Plus,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import ContactModal from './ContactModal';

const tileHover: Variants = {
  initial: { scale: 1, y: 0, zIndex: 1 },
  hover: { 
    scale: 1.02, y: -5, zIndex: 10,
    transition: { duration: 0.2, ease: "easeOut" },
    boxShadow: "0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(6, 182, 212, 0.15)"
  },
  tap: { scale: 0.98 }
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

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = isMuted;
  }, [isMuted, currentIndex, isVideoReady]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVideoReady(false);
    setCurrentIndex((prev) => (prev! + 1) % pool.length);
    setHasEnded(false);
    setIsPlaying(true);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVideoReady(false);
    setCurrentIndex((prev) => (prev! - 1 + pool.length) % pool.length);
    setHasEnded(false);
    setIsPlaying(true);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-7xl mx-auto auto-rows-[200px] p-4 bg-black min-h-screen">
      
      {/* 1. LOGO & 2. BANNER */}
      <motion.div variants={tileHover} initial="initial" whileHover="hover" whileTap="tap" className="md:col-span-1 md:row-span-1 bg-zinc-950 rounded-[2.5rem] overflow-hidden relative border border-white/5 flex items-center justify-center p-4">
        {artist?.logoImg && <img src={artist.logoImg} className="w-full h-full object-contain z-10" alt="Logo" />}
        <div className="absolute inset-0 bg-cyan-500/5 blur-3xl" />
      </motion.div>

      <motion.div variants={tileHover} initial="initial" whileHover="hover" whileTap="tap" className="md:col-span-3 md:row-span-1 bg-black rounded-[2.5rem] overflow-hidden border border-white/5 flex items-center justify-center relative text-center px-4">
        <h2 className="text-white font-[900] text-4xl sm:text-7xl tracking-tighter uppercase italic z-10">MULTIFACETED.</h2>
      </motion.div>

      {/* 3. HERO VIDEO PLAYER */}
      <motion.div 
        ref={containerRef}
        variants={tileHover} initial="initial" whileHover="hover"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        onClick={() => !hasEnded && videoRef.current && (videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause(), setIsPlaying(!videoRef.current.paused))}
        className="row-span-2 md:col-span-2 md:row-span-2 relative overflow-hidden rounded-[2.5rem] bg-black border border-white/5 shadow-2xl flex items-center justify-center cursor-pointer"
      >
        <AnimatePresence mode="wait">
          {currentVideo && (
            <motion.div key={currentVideo.url} initial={{ opacity: 0 }} animate={{ opacity: isVideoReady ? 1 : 0 }} transition={{ duration: 0.6 }} className="absolute inset-0 w-full h-full flex items-center justify-center">
              <video src={currentVideo.url} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-50 blur-[60px] scale-125" />
              <video 
                ref={videoRef} src={currentVideo.url} autoPlay playsInline preload="auto"
                onCanPlay={() => setIsVideoReady(true)}
                onTimeUpdate={() => setProgress((videoRef.current!.currentTime / videoRef.current!.duration) * 100)}
                onEnded={() => { setHasEnded(true); setIsPlaying(false); }}
                className={`relative z-10 transition-all duration-1000 ${currentVideo.fillContainer ? 'w-full h-full object-cover' : 'h-full w-auto max-w-full object-contain'} ${hasEnded ? 'opacity-40 blur-sm' : 'opacity-100'}`} 
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* NAVIGATION LAYER */}
        <div className={`absolute inset-0 z-[70] flex items-center justify-between px-6 transition-opacity pointer-events-none ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          <button onClick={handlePrev} className="p-3 bg-black/40 hover:bg-white hover:text-black rounded-full backdrop-blur-md border border-white/10 text-white pointer-events-auto"><ChevronLeft size={20} /></button>
          <button onClick={handleNext} className="p-3 bg-black/40 hover:bg-white hover:text-black rounded-full backdrop-blur-md border border-white/10 text-white pointer-events-auto"><ChevronRight size={20} /></button>
        </div>

        {/* MUTE & PROGRESS */}
        <div className={`absolute inset-0 z-50 flex flex-col justify-end p-8 transition-opacity pointer-events-none ${showControls && !hasEnded ? 'opacity-100 bg-gradient-to-t from-black/90' : 'opacity-0'}`}>
          <div className="flex items-center gap-4 w-full pointer-events-auto">
            <div className="relative flex-grow h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 shadow-[0_0_15px_#06b6d4]" style={{ width: `${progress}%` }} />
            </div>
            <button onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }} className="text-white">{isMuted ? <VolumeX size={24} className="text-zinc-500" /> : <Volume2 size={24} className="text-cyan-400" />}</button>
          </div>
        </div>
      </motion.div>

      {/* 4. MAIN SOCIAL */}
      <motion.div variants={tileHover} initial="initial" whileHover="hover" className="row-span-2 md:col-span-1 md:row-span-2 bg-zinc-800 rounded-[2.5rem] overflow-hidden relative border border-white/5 group">
        {posts[0] && <img src={posts[0].mediaUrl} className="w-full h-full object-cover" alt="Social" />}
      </motion.div>

      {/* 5. TOUR DATES */}
      <motion.div variants={tileHover} initial="initial" whileHover="hover" className="row-span-2 md:col-span-1 md:row-span-2 bg-zinc-950 border border-white/5 rounded-[2.5rem] p-8 flex flex-col h-full relative">
        <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mb-8 text-center">Live Shows</p>
        <div className="space-y-6 overflow-y-auto flex-grow custom-scrollbar">
          {tourDates?.map((show: any) => (
            <div key={show._id} className="border-b border-white/5 pb-3 last:border-0 hover:translate-x-1 transition-transform">
              <p className="font-black text-sm uppercase text-white">{show.city}</p>
              <p className="text-zinc-500 text-[11px] uppercase font-mono">{show.venue}</p>
            </div>
          ))}
        </div>
        <button onClick={() => setIsContactModalOpen(true)} className="mt-6 w-full py-4 bg-white text-black rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-cyan-400">Contact</button>
      </motion.div>

      {/* 6. SPOTIFY */}
      <motion.div variants={tileHover} initial="initial" whileHover="hover" className="md:col-span-1 md:row-span-1 bg-emerald-500/10 border border-emerald-500/20 rounded-[2.5rem] p-8 flex flex-col justify-between group">
        <Play fill="#10b981" className="text-emerald-500" size={32} />
        <span className="text-emerald-500 font-black text-xs uppercase">Listen Now</span>
      </motion.div>

      {/* UPDATED: ABOUT TILE USING THE BIO FIELD */}
      <motion.div variants={tileHover} initial="initial" whileHover="hover" className="md:col-span-1 md:row-span-1 bg-zinc-900 rounded-[2.5rem] p-8 border border-white/5 flex flex-col justify-center relative overflow-hidden">
        <p className="text-zinc-500 font-mono text-[9px] uppercase tracking-[0.3em] mb-3">About</p>
        <div className="text-white text-[11px] leading-relaxed opacity-80 font-medium line-clamp-5">
          {artist?.bio ? (
            <PortableText value={artist.bio} />
          ) : (
            <p>{artist?.description || "Visual artist and multi-faceted creator."}</p>
          )}
        </div>
      </motion.div>

      {/* 7. SNAPCHAT */}
      <motion.div variants={tileHover} initial="initial" whileHover="hover" className="bg-[#FFFC00] rounded-[2.5rem] p-8 flex flex-col justify-between text-black group cursor-pointer">
         <Ghost size={36} strokeWidth={2.5} />
         <span className="text-[12px] font-black uppercase">@{artist?.logoText || 'AGGY'}</span>
      </motion.div>

      {/* 8. SMALL SOCIAL TILE */}
      <motion.div variants={tileHover} initial="initial" whileHover="hover" className="md:col-span-1 md:row-span-1 bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-white/5 relative">
        {posts[1] ? <img src={posts[1].mediaUrl} className="w-full h-full object-cover opacity-60" alt="Social" /> : <div className="w-full h-full flex items-center justify-center opacity-40"><Plus size={24} className="text-white" /></div>}
      </motion.div>

      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </div>
  );
}