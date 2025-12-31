import { motion } from 'framer-motion';

const Index = () => {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-black">
      {/* Radial Spotlight Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      
      {/* Visual Noise Texture */}
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-50" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }} 
      />

      {/* Floating Badge */}
      <div className="absolute top-12 animate-[float_6s_ease-in-out_infinite] z-10">
        <div className="px-6 py-2 border border-white/20 backdrop-blur-3xl bg-white/5 rounded-full">
          <span className="text-xs font-medium tracking-[0.2em] text-white/60">PIDE PROTOCOL</span>
        </div>
      </div>

      {/* Hero Section - Fluid Light Design */}
      <div className="flex flex-col items-center justify-center min-h-[80vh] z-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="text-center space-y-8"
        >
          {/* Metallic Gradient Headline */}
          <h1 className="text-7xl md:text-9xl font-sans font-bold tracking-tighter bg-gradient-to-b from-white to-white/30 bg-clip-text text-transparent leading-[0.9]">
            Welcome to Your
            <br />
            App Starter
          </h1>
          
          {/* Subheadline */}
          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto font-light tracking-wide">
            Let&apos;s build something amazing together.
          </p>
        </motion.div>

        {/* Pill-Shaped Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row gap-4 mt-12"
        >
          {/* Launch Terminal - Solid White */}
          <button 
            aria-label="Launch PIDE Protocol Terminal"
            className="px-8 py-4 rounded-full bg-white text-black font-medium transition-transform hover:scale-105"
          >
            Launch Terminal
          </button>
          
          {/* Read Docs - Transparent with Blur */}
          <button 
            aria-label="Read PIDE Protocol documentation"
            className="px-8 py-4 rounded-full border border-white/30 text-white font-medium backdrop-blur-sm bg-white/5 transition-transform hover:scale-105"
          >
            Read Docs
          </button>
        </motion.div>
      </div>
    </main>
  );
};

export default Index;
