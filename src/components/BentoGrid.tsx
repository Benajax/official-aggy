'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, RotateCcw, Volume2, VolumeX, Camera, ArrowUpRight, Ghost, Plus
} from 'lucide-react';
import ContactModal from './ContactModal';

export default function BentoGrid({ socials, artist, tourDates }: any) {
  const posts = socials?.posts || [];
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [hasEnded, setHasEnded] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    if (!artist) return;
    if (selectedVideo !== null) return;

    const pool = artist.heroVideoPool || [];
    if (pool.length > 0) {
      const randomIndex = Math.floor(Math.random() * pool.length);
      setSelectedVideo(pool[randomIndex]);
    } else {
      setSelectedVideo(artist.heroVideo);
    }
  }, [artist, selectedVideo]);

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
  }, [hasEnded]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const newTime = (Number(e.target.value) / 100) * videoRef.current.duration;
      videoRef.current.currentTime = newTime;
      setProgress(Number(e.target.value));
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      isPlaying ? videoRef.current.pause() : videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setHasEnded(false);
      setIsPlaying(true);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-7xl mx-auto auto-rows-[200px] p-4 bg-black min-h-screen">
      
      {/* 1. LOGO BLOCK */}
      <div className="md:col-span-1 md:row-span-1 bg-zinc-950 rounded-[2.5rem] overflow-hidden relative border border-white/5 flex items-center justify-center p-4 group">
        {artist?.logoImg && (
          <img src={artist.logoImg} className="w-full h-full object-contain hover:scale-110 transition-transform duration-500 z-10" alt="Logo" />
        )}
        <div className="absolute inset-0 bg-cyan-500/5 blur-3xl group-hover:bg-cyan-500/10 transition-colors" />
      </div>

      {/* 2. BANNER BLOCK */}
      <div className="md:col-span-3 md:row-span-1 bg-black rounded-[2.5rem] overflow-hidden border border-white/5 flex items-center justify-center relative group">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <h2 className="text-white font-[900] text-5xl md:text-7xl tracking-tighter uppercase italic z-10">
          MULTIFACETED<span className="text-emerald-500">.</span>
        </h2>
      </div>

      {/* 3. HERO VIDEO (2x2) - AMBIENT GLOW EDITION */}
      <div 
        ref={containerRef}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-[2.5rem] bg-zinc-950 border border-white/5 group shadow-2xl flex items-center justify-center"
      >
        {selectedVideo ? (
          <>
            {/* BACKGROUND GLOW LAYER: Blurred, fills the whole container */}
            <video 
              src={selectedVideo}
              autoPlay muted loop playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-20 blur-3xl scale-150"
            />

            {/* MAIN VIDEO LAYER: Contained to ensure NO cropping (no heads cut off) */}
            <video 
              ref={videoRef}
              src={selectedVideo}
              autoPlay muted playsInline 
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => { 
                if (videoRef.current) {
                  videoRef.current.currentTime = 0;
                  videoRef.current.pause();
                }
                setHasEnded(true); 
                setIsPlaying(false); 
              }}
              className={`relative z-10 h-full w-auto object-contain transition-all duration-1000 ${
                hasEnded ? 'opacity-40 blur-sm' : 'opacity-100'
              }`} 
            />
          </>
        ) : (
          <div className="absolute inset-0 w-full h-full bg-zinc-900 flex items-center justify-center">
            <div className="text-white/50">Loading...</div>
          </div>
        )}

        {/* CONTROLS OVERLAY */}
        <div className={`absolute inset-0 z-20 flex flex-col justify-end p-8 transition-opacity duration-500 ${showControls && !hasEnded ? 'opacity-100 bg-gradient-to-t from-black/90 via-transparent' : 'opacity-0'}`}>
          <div className="flex items-center gap-4 w-full mb-2">
            <button onClick={togglePlay} className="text-white hover:text-cyan-400">
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
            </button>
            <div className="relative flex-grow h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500" style={{ width: `${progress}%` }} />
            </div>
            <button onClick={() => { if(videoRef.current) { videoRef.current.muted = !isMuted; setIsMuted(!isMuted); } }}>
              {isMuted ? <VolumeX size={20} className="text-zinc-400" /> : <Volume2 size={20} className="text-cyan-400" />}
            </button>
          </div>
        </div>

        {/* REPLAY OVERLAY */}
        <AnimatePresence>
          {hasEnded && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <button onClick={handleReplay} className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-black uppercase text-[10px] tracking-widest hover:scale-110 transition-all">
                <RotateCcw size={14} /> Replay
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. MAIN SOCIAL (1x2) */}
      <div className="md:col-span-1 md:row-span-2 bg-zinc-800 rounded-[2.5rem] overflow-hidden relative border border-white/5 group">
        {posts[0] && (
          <img 
            src={posts[0].sizes.medium.mediaUrl} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            alt="Social" 
          />
        )}
        <div className="absolute top-6 right-6 p-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 z-10"><Camera size={16} className="text-white" /></div>
      </div>

      {/* 5. TOUR DATES (1x2) */}
      <div className="md:col-span-1 md:row-span-2 bg-zinc-950 border border-white/5 rounded-[2.5rem] p-8 flex flex-col h-full relative overflow-hidden">
        <p className="relative z-10 text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em] mb-8 font-bold text-center">Live Shows</p>
        <div className="relative z-10 space-y-6 overflow-y-auto flex-grow">
          {tourDates?.map((show: any) => (
            <div key={show._id} className="border-b border-white/5 pb-3 last:border-0 hover:translate-x-1 transition-transform group/item">
              <p className="font-black text-sm uppercase text-white group-hover/item:text-cyan-400">{show.city}</p>
              <p className="text-zinc-500 text-[11px] uppercase font-mono">{show.venue}</p>
            </div>
          ))}
        </div>
        <button onClick={() => setIsContactModalOpen(true)} className="relative z-10 mt-6 w-full py-4 bg-white text-black rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-cyan-400 transition-all">
          Contact
        </button>
      </div>

      {/* 6. SPOTIFY (1x1) */}
      <div className="md:col-span-1 md:row-span-1 bg-emerald-500/10 border border-emerald-500/20 rounded-[2.5rem] p-8 flex flex-col justify-between group cursor-pointer hover:bg-emerald-500/20 transition-all">
        <Play fill="#10b981" className="text-emerald-500 transition-transform group-hover:scale-110" size={32} />
        <div className="flex justify-between items-end">
          <span className="text-emerald-500 font-black text-xs uppercase">Listen Now</span>
          <ArrowUpRight size={18} className="text-emerald-500" />
        </div>
      </div>

      {/* 7. SNAPCHAT (1x1) */}
      <div className="bg-[#FFFC00] rounded-[2.5rem] p-8 flex flex-col justify-between text-black group cursor-pointer hover:scale-[1.02] transition-transform">
         <Ghost size={36} strokeWidth={2.5} />
         <span className="text-[12px] font-black uppercase">@{artist?.logoText || 'AGGY'}</span>
      </div>

      {/* 8. SMALL SOCIAL TILES (2x) */}
      {[1, 2].map((idx) => (
        <div key={idx} className="md:col-span-1 md:row-span-1 bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-white/5 group relative">
          {posts[idx] ? (
            <img src={posts[idx].sizes.small.mediaUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500" alt="Social" />
          ) : (
            <div className="w-full h-full flex items-center justify-center opacity-40"><Plus size={24} className="text-white" /></div>
          )}
        </div>
      ))}

      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </div>
  );
}