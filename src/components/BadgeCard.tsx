import { motion } from 'framer-motion';
import { Gamepad2, Shield, CheckCircle2, X } from 'lucide-react';

interface BadgeCardProps {
  isOpen: boolean;
  onClose: () => void;
  walletAddress: string | null;
  tokenId: number | null;
}

export default function BadgeCard({ isOpen, onClose, walletAddress, tokenId }: BadgeCardProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Badge Card */}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, rotate: 10 }}
        transition={{ 
          type: "spring", 
          stiffness: 200, 
          damping: 20,
          duration: 0.6 
        }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-[400px] h-[550px] bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#0d1117] 
                   border-4 border-[#00ff41] rounded-2xl overflow-hidden shadow-2xl"
        style={{
          boxShadow: '0 0 60px rgba(0, 255, 65, 0.6), 0 0 100px rgba(0, 255, 65, 0.3), inset 0 0 40px rgba(0, 255, 65, 0.1)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center 
                     bg-[#161b22] border border-[#00ff41]/30 rounded-lg hover:border-[#00ff41] 
                     transition-all group"
        >
          <X className="w-4 h-4 text-[#00ff41] group-hover:rotate-90 transition-transform" />
        </button>

        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: `
                linear-gradient(rgba(0, 255, 65, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 255, 65, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '30px 30px',
              animation: 'gridPulse 3s ease-in-out infinite'
            }} 
          />
        </div>

        {/* Glow Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-10 left-10 w-40 h-40 bg-[#00ff41] rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-10 right-10 w-40 h-40 bg-[#7000ff] rounded-full blur-3xl"
        />

        {/* Card Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 space-y-6">
          {/* Badge Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="relative"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-[#00ff41] to-[#00cc33] rounded-3xl 
                          flex items-center justify-center shadow-2xl"
              style={{
                boxShadow: '0 0 40px rgba(0, 255, 65, 0.8), 0 0 80px rgba(0, 255, 65, 0.4)'
              }}
            >
              <Gamepad2 className="w-16 h-16 text-[#0d1117]" strokeWidth={2.5} />
            </div>
            {/* Verified Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="absolute -top-2 -right-2 w-10 h-10 bg-[#00ff41] rounded-full 
                       flex items-center justify-center border-4 border-[#0d1117]"
            >
              <CheckCircle2 className="w-5 h-5 text-[#0d1117]" strokeWidth={3} />
            </motion.div>
          </motion.div>

          {/* Badge Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center space-y-2"
          >
            <h2 className="text-4xl font-bold text-[#00ff41] terminal-font tracking-wider"
              style={{
                textShadow: '0 0 20px rgba(0, 255, 65, 0.8), 0 0 40px rgba(0, 255, 65, 0.4)'
              }}
            >
              STEAM VETERAN
            </h2>
            <div className="flex items-center justify-center gap-3 text-sm text-[#00ff41]/70 terminal-font">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Class: Elite
              </span>
              <span className="text-[#00ff41]/30">|</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Verified: True
              </span>
            </div>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full h-px bg-gradient-to-r from-transparent via-[#00ff41] to-transparent"
          />

          {/* Token Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full space-y-3 bg-[#161b22]/50 border border-[#00ff41]/20 rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#00ff41]/60 terminal-font">Token ID</span>
              <span className="text-sm text-[#00ff41] terminal-font font-bold">#{tokenId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#00ff41]/60 terminal-font">Type</span>
              <span className="text-sm text-[#00ff41] terminal-font font-bold">Soulbound Token</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#00ff41]/60 terminal-font">Status</span>
              <span className="text-sm text-[#00ff41] terminal-font font-bold flex items-center gap-1">
                <span className="w-2 h-2 bg-[#00ff41] rounded-full animate-pulse" />
                Non-Transferable
              </span>
            </div>
          </motion.div>

          {/* Minted to Wallet */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="w-full bg-gradient-to-r from-[#00ff41]/10 via-[#00ff41]/20 to-[#00ff41]/10 
                     border border-[#00ff41] rounded-xl p-4 text-center"
          >
            <div className="text-xs text-[#00ff41]/70 terminal-font mb-1">SBT MINTED TO</div>
            <div className="text-sm text-[#00ff41] terminal-font font-bold break-all">
              {walletAddress}
            </div>
          </motion.div>

          {/* Pulsing Glow Effect */}
          <motion.div
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-xs text-[#00ff41] terminal-font text-center"
          >
            ✨ ACHIEVEMENT UNLOCKED ✨
          </motion.div>
        </div>

        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-[#00ff41] rounded-tl-2xl" />
        <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-[#00ff41] rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-[#00ff41] rounded-bl-2xl" />
        <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-[#00ff41] rounded-br-2xl" />
      </motion.div>
    </motion.div>
  );
}
