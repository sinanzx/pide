import { motion, Variants, useReducedMotion } from 'framer-motion';
import { 
  Shield, Lock, DollarSign, Github, Twitter, FileText, Zap, 
  TrendingUp, Users, Database, CheckCircle, X, 
  Gamepad2, CreditCard, Sparkles, Bot,
  ArrowRight, ExternalLink, Server, Key, Award
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/contexts/ToastContext';
import { analytics } from '@/utils/analytics';
import { useEffect } from 'react';

export default function MarketingSite() {
  const { toast } = useToast();
  const shouldReduceMotion = useReducedMotion();

  // Announce page load to screen readers
  useEffect(() => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = 'PIDE Protocol homepage loaded. Navigate through sections using headings.';
    document.body.appendChild(announcement);
    
    return () => {
      document.body.removeChild(announcement);
    };
  }, []);

  const handleComingSoon = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    const featureName = target.textContent || 'Unknown Feature';
    analytics.trackFeatureInteraction(featureName, 'coming_soon_click');
    toast.error("ACCESS DENIED", "This feature is locked until Phase 2.");
  };

  // Respect reduced motion preference
  const animationDuration = shouldReduceMotion ? 0.01 : 0.6;
  
  const fadeIn = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: animationDuration }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1
      }
    }
  };

  const slideInLeft = {
    initial: { opacity: 0, x: shouldReduceMotion ? 0 : -50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: animationDuration }
  };

  const slideInRight = {
    initial: { opacity: 0, x: shouldReduceMotion ? 0 : 50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: animationDuration }
  };

  // Scroll-triggered reveal component
  const Reveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: animationDuration, delay: shouldReduceMotion ? 0 : delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );

  return (
    <main className="relative min-h-screen w-full bg-black overflow-hidden">
      {/* Radial Spotlight Gradient - Fluid Light */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      
      {/* Visual Noise Texture */}
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-50" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }} 
      />

      <div className="relative z-10">
        {/* 1. THE HERO */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20" aria-label="Hero section">
          <motion.div 
            className="max-w-6xl mx-auto text-center space-y-8"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="space-y-4">
              <div className="inline-block px-6 py-2 border border-white/20 backdrop-blur-3xl bg-white/5 rounded-full mb-6">
                <span className="text-xs font-medium tracking-[0.2em] text-white/60">PIDE PROTOCOL</span>
              </div>
              <h1 className="font-sans tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 text-5xl md:text-7xl font-bold text-center leading-tight">
                THE BRIDGE BETWEEN
                <br />
                DIGITAL TRUTH
                <br />
                AND ON-CHAIN REALITY
              </h1>
            </motion.div>

            <motion.p 
              variants={fadeIn}
              className="text-xl md:text-2xl text-neutral-500 max-w-4xl mx-auto font-light leading-relaxed"
            >
              Monetize your reputation, not your privacy. The first <span className="font-sans text-white">zkTLS</span>-powered Data Exchange for Web3 Gaming & Ethical Finance.
            </motion.p>

            <motion.div variants={fadeIn} className="flex flex-wrap items-center justify-center gap-4 pt-8">
              <Link
                to="/dashboard"
                className="group inline-flex items-center gap-3 px-10 py-5 min-h-[44px] rounded-full bg-white text-black font-medium text-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                onClick={() => analytics.trackButtonClick('Launch Terminal', 'Hero')}
                aria-label="Launch PIDE Terminal Dashboard"
              >
                <Zap className="w-5 h-5" aria-hidden="true" />
                Launch Terminal
              </Link>

              <a
                href="https://docs.reclaimprotocol.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-10 py-5 min-h-[44px] rounded-full border border-white/20 text-white font-medium text-lg hover:bg-white/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                onClick={() => analytics.trackLinkClick('Read Docs', 'https://docs.reclaimprotocol.org/')}
                aria-label="Read PIDE Protocol documentation (opens in new tab)"
              >
                <FileText className="w-5 h-5" aria-hidden="true" />
                Read Docs
                <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
              </a>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              variants={fadeIn}
              className="pt-20"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              aria-hidden="true"
            >
              <div className="w-6 h-10 border border-neutral-800 flex justify-center pt-2 mx-auto">
                <div className="w-1 h-2 bg-white" />
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* 2. THE LIVE METRICS */}
        <section className="py-12 px-6" aria-label="Live protocol metrics">
          <Reveal>
            <div className="max-w-7xl mx-auto">
              <div className="relative p-8 border border-neutral-800 bg-transparent">
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-white" role="presentation" />
                      <span className="text-sm font-sans text-neutral-500 uppercase tracking-wider">Live</span>
                    </div>
                    <div className="text-4xl md:text-5xl font-bold text-white font-sans" aria-label="14,203 proofs generated">14,203</div>
                    <div className="text-sm text-neutral-500 font-sans">PROOFS GENERATED</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-white" role="presentation" />
                      <span className="text-sm font-sans text-neutral-500 uppercase tracking-wider">Active</span>
                    </div>
                    <div className="text-4xl md:text-5xl font-bold text-white font-sans" aria-label="890 active nodes">890</div>
                    <div className="text-sm text-neutral-500 font-sans">ACTIVE NODES</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-white" role="presentation" />
                      <span className="text-sm font-sans text-neutral-500 uppercase tracking-wider">Secured</span>
                    </div>
                    <div className="text-4xl md:text-5xl font-bold text-white font-sans" aria-label="45 million dollars plus data secured">$45M+</div>
                    <div className="text-sm text-neutral-500 font-sans">DATA SECURED</div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* 3. THE ARCHITECTURE */}
        <section className="py-32 px-6" aria-label="Zero-knowledge data pipeline architecture">
          <motion.div
            className="max-w-7xl mx-auto space-y-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="text-center space-y-4">
              <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight uppercase">
                Zero-Knowledge Data Pipeline
              </h2>
              <p className="text-xl text-neutral-500 max-w-3xl mx-auto">
                Three steps to verifiable truth. No centralized oracle. No data leakage.
              </p>
            </motion.div>

            {/* Visual Flow Diagram */}
            <motion.div variants={fadeIn} className="relative max-w-5xl mx-auto mb-20" role="img" aria-label="Data pipeline flow diagram showing TLS Session, ZK Witness, Verify, and On-Chain SBT steps">
              <div className="flex items-center justify-between">
                {/* Node 1: Lock */}
                <div className="flex flex-col items-center space-y-3 z-10">
                  <div className="w-20 h-20 bg-white flex items-center justify-center">
                    <Lock className="w-10 h-10 text-black" />
                  </div>
                  <span className="text-sm font-sans text-white">TLS Session</span>
                </div>

                {/* Connection Line 1 */}
                <div className="flex-1 h-0.5 bg-neutral-800 mx-4 relative">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white" />
                </div>

                {/* Node 2: Server */}
                <div className="flex flex-col items-center space-y-3 z-10">
                  <div className="w-20 h-20 bg-neutral-800 flex items-center justify-center">
                    <Server className="w-10 h-10 text-white" />
                  </div>
                  <span className="text-sm font-sans text-white">ZK Witness</span>
                </div>

                {/* Connection Line 2 */}
                <div className="flex-1 h-0.5 bg-neutral-800 mx-4 relative">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white" />
                </div>

                {/* Node 3: Shield */}
                <div className="flex flex-col items-center space-y-3 z-10">
                  <div className="w-20 h-20 bg-white flex items-center justify-center">
                    <Shield className="w-10 h-10 text-black" />
                  </div>
                  <span className="text-sm font-sans text-white">Verify</span>
                </div>

                {/* Connection Line 3 */}
                <div className="flex-1 h-0.5 bg-neutral-800 mx-4 relative">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white" />
                </div>

                {/* Node 4: Database */}
                <div className="flex flex-col items-center space-y-3 z-10">
                  <div className="w-20 h-20 bg-neutral-800 flex items-center justify-center">
                    <Database className="w-10 h-10 text-white" />
                  </div>
                  <span className="text-sm font-sans text-white">On-Chain SBT</span>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <Reveal delay={0}>
                <div className="relative">
                  <div className="relative p-8 bg-transparent border border-neutral-800 space-y-6 h-full">
                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-white flex items-center justify-center font-bold text-black text-xl">
                      01
                    </div>
                    <div className="w-16 h-16 bg-neutral-900 flex items-center justify-center mx-auto">
                      <Key className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white text-center">TLS Handshake</h3>
                    <p className="text-neutral-500 text-center leading-relaxed">
                      User logs into Steam, Bank, or any Web2 service securely. The session is encrypted end-to-end.
                    </p>
                  </div>
                  {/* Arrow */}
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                    <ArrowRight className="w-8 h-8 text-neutral-800" />
                  </div>
                </div>
              </Reveal>

              {/* Step 2 */}
              <Reveal delay={0.1}>
                <div className="relative">
                  <div className="relative p-8 bg-transparent border border-neutral-800 space-y-6 h-full">
                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-neutral-800 flex items-center justify-center font-bold text-white text-xl">
                      02
                    </div>
                    <div className="w-16 h-16 bg-neutral-900 flex items-center justify-center mx-auto">
                      <Server className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white text-center">Witness Generation</h3>
                    <p className="text-neutral-500 text-center leading-relaxed">
                      Client-side SDK intercepts the TLS response and generates a Zero-Knowledge Proof locally. Raw data never leaves your device.
                    </p>
                  </div>
                  {/* Arrow */}
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                    <ArrowRight className="w-8 h-8 text-neutral-800" />
                  </div>
                </div>
              </Reveal>

              {/* Step 3 */}
              <Reveal delay={0.2}>
                <div className="relative">
                  <div className="relative p-8 bg-transparent border border-neutral-800 space-y-6 h-full">
                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-white flex items-center justify-center font-bold text-black text-xl">
                      03
                    </div>
                    <div className="w-16 h-16 bg-neutral-900 flex items-center justify-center mx-auto">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white text-center">On-Chain Mint</h3>
                    <p className="text-neutral-500 text-center leading-relaxed">
                      Smart contract verifies the ZK proof and mints a Soulbound Token (SBT) representing your verified credential.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </motion.div>
        </section>

        {/* 4. USE CASES */}
        <section id="features" className="py-32 px-6" aria-label="Use cases and applications">
          <motion.div
            className="max-w-7xl mx-auto space-y-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="text-center space-y-4">
              <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight uppercase">
                Powering the Next Generation of DApps
              </h2>
              <p className="text-xl text-neutral-500 max-w-3xl mx-auto">
                From gaming airdrops to ethical finance, PIDE unlocks use cases impossible with traditional oracles.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Gaming */}
              <Reveal delay={0}>
                <article className="group relative p-8 bg-transparent border border-neutral-800 hover:border-white transition-all duration-300 overflow-hidden focus-within:ring-2 focus-within:ring-white" tabIndex={0}>
                  <div className="relative z-10 space-y-4">
                    <div className="w-14 h-14 bg-neutral-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
                      <Gamepad2 className="w-7 h-7 text-white" aria-hidden="true" />
                    </div>
                    <h3 className="text-3xl font-bold text-white">Gaming Reputation</h3>
                    <p className="text-neutral-500 leading-relaxed">
                      Prove your Steam achievements, Valorant rank, or League MMR without sharing your account. Unlock exclusive NFT airdrops based on verified skill.
                    </p>
                    <div className="pt-4">
                      <span className="inline-block px-3 py-1 bg-neutral-900 border border-neutral-800 text-white text-sm font-sans">
                        Steam Integration Live
                      </span>
                    </div>
                  </div>
                </article>
              </Reveal>

              {/* Finance */}
              <Reveal delay={0.1}>
                <article className="group relative p-8 bg-transparent border border-neutral-800 hover:border-white transition-all duration-300 overflow-hidden focus-within:ring-2 focus-within:ring-white" tabIndex={0}>
                  <div className="relative z-10 space-y-4">
                    <div className="w-14 h-14 bg-neutral-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
                      <CreditCard className="w-7 h-7 text-white" aria-hidden="true" />
                    </div>
                    <h3 className="text-3xl font-bold text-white">Ethical Finance</h3>
                    <p className="text-neutral-500 leading-relaxed">
                      Prove your credit score or bank balance to DeFi protocols without exposing sensitive data. Access undercollateralized loans based on verified reputation.
                    </p>
                    <div className="pt-4">
                      <span className="inline-block px-3 py-1 bg-neutral-900 border border-neutral-800 text-white text-sm font-sans">
                        Phase 2 Roadmap
                      </span>
                    </div>
                  </div>
                </article>
              </Reveal>

              {/* Social */}
              <Reveal delay={0.2}>
                <article className="group relative p-8 bg-transparent border border-neutral-800 hover:border-white transition-all duration-300 overflow-hidden focus-within:ring-2 focus-within:ring-white" tabIndex={0}>
                  <div className="relative z-10 space-y-4">
                    <div className="w-14 h-14 bg-neutral-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
                      <Sparkles className="w-7 h-7 text-white" aria-hidden="true" />
                    </div>
                    <h3 className="text-3xl font-bold text-white">Social Verification</h3>
                    <p className="text-neutral-500 leading-relaxed">
                      Prove your Twitter followers, GitHub contributions, or LinkedIn connections. Build verifiable on-chain reputation from your Web2 social graph.
                    </p>
                    <div className="pt-4">
                      <span className="inline-block px-3 py-1 bg-neutral-900 border border-neutral-800 text-white text-sm font-sans">
                        Phase 2 Roadmap
                      </span>
                    </div>
                  </div>
                </article>
              </Reveal>

              {/* AI Agents */}
              <Reveal delay={0.3}>
                <article className="group relative p-8 bg-transparent border border-neutral-800 hover:border-white transition-all duration-300 overflow-hidden focus-within:ring-2 focus-within:ring-white" tabIndex={0}>
                  <div className="relative z-10 space-y-4">
                    <div className="w-14 h-14 bg-neutral-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
                      <Bot className="w-7 h-7 text-white" aria-hidden="true" />
                    </div>
                    <h3 className="text-3xl font-bold text-white">AI Agent Reputation</h3>
                    <p className="text-neutral-500 leading-relaxed">
                      Enable AI agents to prove their performance metrics, API usage, or task completion rates. Build trust in autonomous systems through verifiable credentials.
                    </p>
                    <div className="pt-4">
                      <span className="inline-block px-3 py-1 bg-neutral-900 border border-neutral-800 text-white text-sm font-sans">
                        Phase 3 Roadmap
                      </span>
                    </div>
                  </div>
                </article>
              </Reveal>
            </div>
          </motion.div>
        </section>

        {/* 5. COMPARISON TABLE */}
        <section className="py-32 px-6" aria-label="Comparison with traditional oracles">
          <motion.div
            className="max-w-7xl mx-auto space-y-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="text-center space-y-4">
              <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
                Why <span className="text-white">PIDE</span>?
              </h2>
              <p className="text-xl text-neutral-500 max-w-3xl mx-auto">
                The only protocol that preserves privacy while proving truth.
              </p>
            </motion.div>

            <motion.div variants={fadeIn} className="overflow-hidden border border-neutral-800">
              <div className="overflow-x-auto">
                <table className="w-full" role="table" aria-label="Feature comparison between Traditional Oracles and PIDE Protocol">
                  <thead>
                    <tr className="border-b border-neutral-800">
                      <th className="px-6 py-4 text-left text-neutral-500 font-sans text-sm uppercase tracking-wider bg-black">
                        Feature
                      </th>
                      <th className="px-6 py-4 text-center text-neutral-500 font-sans text-sm uppercase tracking-wider bg-black">
                        Traditional Oracles
                      </th>
                      <th className="px-6 py-4 text-center text-white font-sans text-sm uppercase tracking-wider bg-black">
                        PIDE Protocol
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-black">
                    <tr className="border-b border-neutral-800">
                      <td className="px-6 py-4 text-white font-medium">Data Privacy</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <X className="w-5 h-5 text-neutral-500" />
                          <span className="text-neutral-500">Exposed to Oracle</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <CheckCircle className="w-5 h-5 text-white" />
                          <span className="text-neutral-300">Privacy Preserved</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b border-neutral-800">
                      <td className="px-6 py-4 text-white font-medium">Verification Method</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <X className="w-5 h-5 text-neutral-500" />
                          <span className="text-neutral-500">Centralized Server</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <CheckCircle className="w-5 h-5 text-white" />
                          <span className="text-neutral-300">zkTLS Client-Side</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b border-neutral-800">
                      <td className="px-6 py-4 text-white font-medium">User Control</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <X className="w-5 h-5 text-neutral-500" />
                          <span className="text-neutral-500">Oracle Controlled</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <CheckCircle className="w-5 h-5 text-white" />
                          <span className="text-neutral-300">Full User Control</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b border-neutral-800">
                      <td className="px-6 py-4 text-white font-medium">Monetization</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <X className="w-5 h-5 text-neutral-500" />
                          <span className="text-neutral-500">Platform Profits</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <CheckCircle className="w-5 h-5 text-white" />
                          <span className="text-neutral-300">User Earns Rewards</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-white font-medium">Transparency</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <X className="w-5 h-5 text-neutral-500" />
                          <span className="text-neutral-500">Closed Source</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <CheckCircle className="w-5 h-5 text-white" />
                          <span className="text-neutral-300">Open Source</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* 6. ROADMAP */}
        <section className="py-32 px-6" aria-label="Product roadmap">
          <motion.div
            className="max-w-5xl mx-auto space-y-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="text-center space-y-4">
              <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight uppercase">
                Roadmap
              </h2>
              <p className="text-xl text-neutral-500 max-w-3xl mx-auto">
                Building the future of verifiable data, one phase at a time.
              </p>
            </motion.div>

            <div className="space-y-12 relative">
              {/* Vertical Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-neutral-800" role="presentation" />

              {/* Phase 1 */}
              <Reveal delay={0}>
                <article className="relative pl-20">
                  <div className="absolute left-5 top-6 w-6 h-6 bg-white border-4 border-black z-10" />
                  <div className="p-6 bg-transparent border border-neutral-800">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-white text-black font-bold text-sm">CURRENT</span>
                      <h3 className="text-2xl font-bold text-white">Phase 1: Gaming Integration</h3>
                    </div>
                    <p className="text-neutral-500">Steam achievements, Valorant ranks, and League MMR verification. Soulbound Tokens for verified gamers.</p>
                  </div>
                </article>
              </Reveal>

              {/* Phase 2 */}
              <Reveal delay={0.1}>
                <article className="relative pl-20">
                  <div className="absolute left-5 top-6 w-6 h-6 bg-neutral-800 border-4 border-black z-10" />
                  <div className="p-6 bg-transparent border border-neutral-800">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-neutral-800 text-white font-bold text-sm">Q2 2025</span>
                      <h3 className="text-2xl font-bold text-white">Phase 2: Banking & Ethical Finance</h3>
                    </div>
                    <p className="text-neutral-500">Credit score verification, bank balance proofs, and undercollateralized DeFi lending based on reputation.</p>
                  </div>
                </article>
              </Reveal>

              {/* Phase 3 */}
              <Reveal delay={0.2}>
                <article className="relative pl-20">
                  <div className="absolute left-5 top-6 w-6 h-6 bg-white border-4 border-black z-10" />
                  <div className="p-6 bg-transparent border border-neutral-800">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-neutral-900 text-white font-bold text-sm border border-neutral-800">Q3 2025</span>
                      <h3 className="text-2xl font-bold text-white">Phase 3: AI Agent Reputation</h3>
                    </div>
                    <p className="text-neutral-500">Enable AI agents to build verifiable on-chain reputation through performance metrics and task completion proofs.</p>
                  </div>
                </article>
              </Reveal>

              {/* Phase 4 */}
              <Reveal delay={0.3}>
                <article className="relative pl-20">
                  <div className="absolute left-5 top-6 w-6 h-6 bg-neutral-800 border-4 border-black z-10" />
                  <div className="p-6 bg-transparent border border-neutral-800">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-neutral-900 text-white font-bold text-sm border border-neutral-800">Q4 2025</span>
                      <h3 className="text-2xl font-bold text-white">Phase 4: Decentralized Data DAO</h3>
                    </div>
                    <p className="text-neutral-500">Launch governance token and data marketplace. Users earn rewards for sharing verified credentials with approved buyers.</p>
                  </div>
                </article>
              </Reveal>
            </div>
          </motion.div>
        </section>

        {/* 7. FOOTER */}
        <footer className="py-20 px-6 border-t border-neutral-800" role="contentinfo" aria-label="Site footer">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              <nav aria-label="Product links">
                <h3 className="text-white font-bold mb-4 uppercase tracking-wider">Product</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/dashboard" className="text-neutral-500 hover:text-white transition-colors focus:outline-none focus:text-white focus:underline">
                      Launch Terminal
                    </Link>
                  </li>
                  <li>
                    <a href="https://docs.reclaimprotocol.org" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-white transition-colors focus:outline-none focus:text-white focus:underline">
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={handleComingSoon} className="text-neutral-500 hover:text-white transition-colors cursor-pointer focus:outline-none focus:text-white focus:underline">
                      API Reference
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={handleComingSoon} className="text-neutral-500 hover:text-white transition-colors cursor-pointer focus:outline-none focus:text-white focus:underline">
                      SDK
                    </a>
                  </li>
                </ul>
              </nav>

              <nav aria-label="Resource links">
                <h3 className="text-white font-bold mb-4 uppercase tracking-wider">Resources</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" onClick={handleComingSoon} className="text-neutral-500 hover:text-white transition-colors cursor-pointer focus:outline-none focus:text-white focus:underline">
                      Whitepaper
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={handleComingSoon} className="text-neutral-500 hover:text-white transition-colors cursor-pointer focus:outline-none focus:text-white focus:underline">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="/#features" className="text-neutral-500 hover:text-white transition-colors focus:outline-none focus:text-white focus:underline">
                      Case Studies
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={handleComingSoon} className="text-neutral-500 hover:text-white transition-colors cursor-pointer focus:outline-none focus:text-white focus:underline">
                      Brand Kit
                    </a>
                  </li>
                </ul>
              </nav>

              <nav aria-label="Community links">
                <h3 className="text-white font-bold mb-4 uppercase tracking-wider">Community</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-white transition-colors flex items-center gap-2 focus:outline-none focus:text-white focus:underline">
                      <Github className="w-4 h-4" />
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-white transition-colors flex items-center gap-2 focus:outline-none focus:text-white focus:underline">
                      <Twitter className="w-4 h-4" />
                      Twitter
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={handleComingSoon} className="text-neutral-500 hover:text-white transition-colors cursor-pointer focus:outline-none focus:text-white focus:underline">
                      Discord
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={handleComingSoon} className="text-neutral-500 hover:text-white transition-colors cursor-pointer focus:outline-none focus:text-white focus:underline">
                      Telegram
                    </a>
                  </li>
                </ul>
              </nav>

              <nav aria-label="Legal links">
                <h3 className="text-white font-bold mb-4 uppercase tracking-wider">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" onClick={handleComingSoon} className="text-neutral-500 hover:text-white transition-colors cursor-pointer focus:outline-none focus:text-white focus:underline">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={handleComingSoon} className="text-neutral-500 hover:text-white transition-colors cursor-pointer focus:outline-none focus:text-white focus:underline">
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={handleComingSoon} className="text-neutral-500 hover:text-white transition-colors cursor-pointer focus:outline-none focus:text-white focus:underline">
                      Cookie Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={handleComingSoon} className="text-neutral-500 hover:text-white transition-colors cursor-pointer focus:outline-none focus:text-white focus:underline">
                      Security
                    </a>
                  </li>
                </ul>
              </nav>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white flex items-center justify-center">
                  <Shield className="w-5 h-5 text-black" aria-hidden="true" />
                </div>
                <span className="text-white font-bold text-xl">PIDE</span>
              </div>
              <p className="text-neutral-500 text-sm">
                © 2025 PIDE Protocol. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
