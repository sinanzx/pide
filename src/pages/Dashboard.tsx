import { useState, useEffect, useRef } from 'react';
import { useVerification } from '@/hooks/useVerification';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Database, Zap, CheckCircle2, Award, Terminal, Activity, Wallet, ChevronLeft, Loader2 } from 'lucide-react';
import BadgeCard from '@/components/BadgeCard';
import TypewriterLine from '@/components/TypewriterLine';
import { Link } from 'react-router-dom';

interface LogEntry {
  id: number;
  text: string;
  timestamp: string;
}

// --- THE WATCHTOWER FUNCTION ---
const sendToDiscord = async (proofHash: string) => {
  const WEBHOOK_URL = import.meta.env.VITE_DISCORD_WEBHOOK_URL;

  if (!WEBHOOK_URL) {
    console.warn('Discord webhook URL not configured');
    return;
  }

  const payload = {
    username: "PIDE Watchtower",
    avatar_url: "https://cdn-icons-png.flaticon.com/512/9382/9382189.png",
    embeds: [
      {
        title: "🟢 IDENTITY UPLINK ESTABLISHED",
        description: "A new user has successfully generated a zkTLS proof of reputation.",
        color: 65345,
        fields: [
          {
            name: "🛡️ Badge Type",
            value: "**Steam Veteran**",
            inline: true
          },
          {
            name: "🔐 Proof Hash",
            value: `\`${proofHash.slice(0, 15)}...\``,
            inline: true
          },
          {
            name: "📡 Status",
            value: "Verifying on Base Sepolia...",
            inline: false
          }
        ],
        footer: {
          text: "PIDE Protocol • zkTLS Verified"
        },
        timestamp: new Date().toISOString()
      }
    ]
  };

  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    console.log("Watchtower Notification Sent!");
  } catch (error) {
    console.error("Watchtower Error:", error);
  }
};

export default function Dashboard() {
  const STEAM_PROVIDER_ID = import.meta.env.VITE_STEAM_PROVIDER_ID;

  if (!STEAM_PROVIDER_ID) {
    console.error('Steam Provider ID not configured. Please check your .env file.');
  }

  const { generateProof, status, result } = useVerification();
  
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showWalletTooltip, setShowWalletTooltip] = useState(false);
  const [mintStatus, setMintStatus] = useState<'idle' | 'minting' | 'success'>('idle');
  const [mintedTokenId, setMintedTokenId] = useState<number | null>(null);
  
  const [totalProofs, setTotalProofs] = useState(1247);
  const [systemOnline, setSystemOnline] = useState(true);
  const [showBadgeCard, setShowBadgeCard] = useState(false);
  
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status.stage === 'connecting') {
      addLog('> Initializing TLS handshake...');
      setTimeout(() => addLog('> Establishing secure channel...'), 400);
    } else if (status.stage === 'generating') {
      addLog('> Intercepting packet...');
      setTimeout(() => addLog('> Extracting data payload...'), 500);
      setTimeout(() => addLog('> Computing zero-knowledge proof...'), 900);
    } else if (status.stage === 'validating') {
      addLog('> Validating proof integrity...');
      setTimeout(() => addLog('> Verifying cryptographic signatures...'), 400);
    } else if (status.stage === 'complete') {
      addLog('> Proof generated successfully.');
      setTimeout(() => addLog('> Ready for on-chain submission.'), 300);
    } else if (status.stage === 'error') {
      addLog('> ERROR: Verification failed.');
    }
  }, [status.stage]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalProofs(prev => prev + Math.floor(Math.random() * 5) + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemOnline(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (mintStatus === 'success' && mintedTokenId) {
      const timer = setTimeout(() => {
        setShowBadgeCard(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [mintStatus, mintedTokenId]);

  const addLog = (text: string) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
    setLogs(prev => [...prev, { id: Date.now() + Math.random(), text, timestamp }]);
  };

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    addLog('> Connecting to wallet...');
    
    setTimeout(() => {
      const simulatedAddress = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
      setWalletAddress(simulatedAddress);
      addLog(`> Wallet connected: ${truncateAddress(simulatedAddress)}`);
      setIsConnecting(false);
    }, 1000);
  };

  const simulateMinting = async (proofHash: string) => {
    setMintStatus('minting');
    addLog('> Initiating on-chain transaction...');
    addLog('> Waiting for blockchain confirmation...');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const tokenId = Math.floor(Math.random() * 1000) + 1;
    setMintedTokenId(tokenId);
    setMintStatus('success');
    
    const shortAddress = walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : '';
    addLog(`> Transaction Confirmed: SBT #${tokenId} Minted to ${shortAddress}`);
    addLog('> Token successfully bound to wallet (non-transferable)');
  };

  const handleVerify = async () => {
    if (!walletAddress) {
      addLog('> ERROR: Wallet not connected');
      return;
    }
    
    if (!STEAM_PROVIDER_ID) {
      console.error("Provider ID is missing");
      return;
    }
    
    setLogs([]);
    setMintStatus('idle');
    setMintedTokenId(null);
    addLog('> System initialized.');
    addLog('> Starting verification protocol...');
    
    const verificationResult = await generateProof(STEAM_PROVIDER_ID);
    
    if (verificationResult && verificationResult.success) {
      await sendToDiscord(verificationResult.proofHash);
      await simulateMinting(verificationResult.proofHash);
    }
  };

  const tickerItems = [
    '0x4a7f...3b2c verified Steam',
    '0xb2e1...9a4d verified Bank',
    '0x9c3a...7f1e minted SBT',
    '0x1d5b...4c8a verified GitHub',
    '0x8f2e...6d9b verified Twitter',
    '0x3a9c...2e7f minted SBT',
    '0x7b4d...1a5c verified LinkedIn',
    '0x6e8a...9b3d verified Steam',
    '0x2f1c...8e4a minted SBT',
    '0x5d9b...3f7e verified Bank'
  ];

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-8 py-5 bg-black border-b border-neutral-800" role="banner">
        {/* LEFT ZONE: Navigation */}
        <Link
          to="/"
          className="flex items-center gap-2 text-xs uppercase font-semibold text-white hover:text-neutral-400 transition-colors tracking-tight"
          aria-label="Back to homepage"
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          BACK
        </Link>

        {/* CENTER ZONE: Identity */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-5">
            <div>
              <h1 className="text-4xl font-black text-white uppercase tracking-tighter" style={{ letterSpacing: '-0.05em' }}>PIDE Protocol Dashboard</h1>
            </div>
            <div className="h-10 w-px bg-neutral-800" />
            <div className="flex items-center gap-3 border border-neutral-800 rounded-none px-5 py-3" role="status" aria-live="polite">
              <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                systemOnline ? 'bg-white' : 'bg-neutral-700'
              }`} role="presentation" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                ONLINE
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT ZONE: Wallet Action */}
        <div>
          {!walletAddress ? (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              aria-label="Connect wallet to PIDE Protocol"
              className="flex items-center gap-3 bg-transparent border border-white text-white 
                         hover:bg-white hover:text-black font-bold text-sm
                         py-3 px-6 rounded-none disabled:opacity-50 disabled:cursor-not-allowed 
                         transition-all duration-300 tracking-wider uppercase"
            >
              {isConnecting ? (
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
              ) : (
                <Wallet className="w-5 h-5" aria-hidden="true" />
              )}
              {isConnecting ? 'SECURING LINK...' : 'CONNECT WALLET'}
            </button>
          ) : (
            <div className="flex items-center gap-4 border border-white text-white 
                            font-bold text-sm py-3 px-6 rounded-none" role="status" aria-label="Wallet connected">
              <div className="w-2.5 h-2.5 bg-white rounded-full" role="presentation" />
              <span className="mono text-sm text-white">{truncateAddress(walletAddress)}</span>
              <Badge className="bg-white text-black font-bold text-[10px] tracking-wider uppercase rounded-none">ACTIVE</Badge>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8 space-y-8 pb-20">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Identity Stack */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="bg-transparent border border-neutral-800 rounded-none shadow-none">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center gap-3 font-bold text-xs tracking-wider uppercase">
                <Database className="w-5 h-5" aria-hidden="true" />
                TOTAL PROOFS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-6xl font-black text-white">
                {totalProofs.toLocaleString()}
              </div>
              <p className="text-[10px] text-neutral-500 mt-3 uppercase tracking-wide">Generated On-Chain</p>
            </CardContent>
          </Card>

          <Card className="bg-transparent border border-neutral-800 rounded-none shadow-none">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center gap-3 font-bold text-xs tracking-wider uppercase">
                <Activity className="w-5 h-5" aria-hidden="true" />
                ACTIVE SESSIONS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-6xl font-black text-white">
                {status.isVerifying ? '1' : '0'}
              </div>
              <p className="text-[10px] text-neutral-500 mt-3 uppercase tracking-wide">Currently Processing</p>
            </CardContent>
          </Card>

          <Card className="bg-transparent border border-neutral-800 rounded-none shadow-none">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center gap-3 font-bold text-xs tracking-wider uppercase">
                <Shield className="w-5 h-5" aria-hidden="true" />
                SECURITY LEVEL
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-6xl font-black text-white">MAX</div>
              <p className="text-[10px] text-neutral-500 mt-3 uppercase tracking-wide">zkTLS Protocol</p>
            </CardContent>
          </Card>

          <Card className="bg-transparent border border-neutral-800 rounded-none shadow-none">
            <CardHeader>
              <CardTitle className="text-white font-bold text-xs tracking-wider uppercase">SYSTEM STATUS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-500 uppercase">zkTLS Node</span>
                <Badge className="bg-white text-black font-bold text-[10px] tracking-wider uppercase rounded-none">ONLINE</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-500 uppercase">Smart Contract</span>
                <Badge className="bg-white text-black font-bold text-[10px] tracking-wider uppercase rounded-none">DEPLOYED</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-500 uppercase">Network</span>
                <Badge variant="outline" className="border-neutral-800 text-neutral-500 font-bold text-[10px] tracking-wider uppercase rounded-none">
                  Localhost
                </Badge>
              </div>
              <div className="h-px bg-neutral-800 my-3" />
              <div className="space-y-2">
                <div className="text-[10px] text-neutral-500 uppercase">Contract Address</div>
                <div className="text-xs text-white mono break-all">
                  0x0000...0000
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CENTER COLUMN: Live Log Terminal */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="bg-transparent border border-neutral-800 rounded-none shadow-none">
            <CardHeader>
              <CardTitle className="text-white font-bold flex items-center gap-3 tracking-wider uppercase">
                <Terminal className="w-6 h-6" aria-hidden="true" />
                LIVE TERMINAL LOG
              </CardTitle>
              <CardDescription className="text-neutral-500 mono text-xs">
                Real-time verification process output
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-black border border-neutral-800 rounded-none p-6 h-[450px] overflow-y-auto">
                {logs.length === 0 ? (
                  <div className="text-neutral-500 mono text-sm">
                    [SYSTEM READY] Awaiting verification request...
                  </div>
                ) : (
                  <div className="space-y-2">
                    {logs.map((log) => (
                      <div key={log.id} className="mono text-sm text-[#00ff41]">
                        <span className="text-neutral-600">[{log.timestamp}]</span> <TypewriterLine text={log.text} />
                      </div>
                    ))}
                    <div ref={logEndRef} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-transparent border border-neutral-800 rounded-none shadow-none">
            <CardHeader>
              <CardTitle className="text-white font-bold flex items-center gap-3 tracking-wider uppercase">
                <Shield className="w-6 h-6" aria-hidden="true" />
                IDENTITY UPLINK
              </CardTitle>
              <CardDescription className="text-neutral-500 mono text-xs">
                Verify Steam profile ownership via zkTLS
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* SUCCESS MESSAGE */}
              {result && result.success && (
                <div className="bg-transparent border border-neutral-800 rounded-none p-5 space-y-3">
                  <div className="flex items-center gap-3 text-white">
                    <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
                    <span className="font-bold tracking-wider uppercase">PROOF GENERATED</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="text-neutral-400 mono break-all">
                      <span className="font-semibold text-white">Proof Hash:</span> {result.proofHash}
                    </div>
                    <div className="text-neutral-400 mono break-all">
                      <span className="font-semibold text-white">Data Hash:</span> {result.dataHash}
                    </div>
                  </div>
                </div>
              )}

              {/* MINTING STATUS */}
              {mintStatus === 'minting' && (
                <div className="bg-transparent border border-neutral-800 rounded-none p-5 space-y-3">
                  <div className="flex items-center gap-3 text-white">
                    <Zap className="w-6 h-6 animate-pulse" aria-hidden="true" />
                    <span className="font-bold tracking-wider uppercase">MINTING SBT...</span>
                  </div>
                  <div className="text-xs text-neutral-400 mono">
                    Waiting for blockchain confirmation...
                  </div>
                </div>
              )}

              {/* MINT SUCCESS */}
              {mintStatus === 'success' && mintedTokenId && (
                <div className="bg-transparent border border-neutral-800 rounded-none p-5 space-y-3">
                  <div className="flex items-center gap-3 text-white">
                    <Award className="w-6 h-6" aria-hidden="true" />
                    <span className="font-bold tracking-wider uppercase">SBT MINTED SUCCESSFULLY!</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="text-neutral-400 mono">
                      <span className="font-semibold text-white">Token ID:</span> #{mintedTokenId}
                    </div>
                    <div className="text-neutral-400 mono break-all">
                      <span className="font-semibold text-white">Owner:</span> {walletAddress}
                    </div>
                    <div className="text-neutral-400 mono">
                      <span className="font-semibold text-white">Status:</span> Non-Transferable (Soulbound)
                    </div>
                  </div>
                </div>
              )}

              {/* ERROR MESSAGE */}
              {status.stage === 'error' && (
                <div className="bg-transparent border border-neutral-800 rounded-none p-5 space-y-3">
                  <div className="text-white mono text-sm">
                    ERROR: {result?.error || "Verification Failed"}
                  </div>
                </div>
              )}

              {/* DYNAMIC BUTTON AREA */}
              {!status.requestUrl ? (
                <div className="relative">
                  <button
                    onClick={handleVerify}
                    disabled={!walletAddress || status.isVerifying}
                    onMouseEnter={() => !walletAddress && setShowWalletTooltip(true)}
                    onMouseLeave={() => setShowWalletTooltip(false)}
                    aria-label="Generate zkTLS proof for Steam account verification"
                    className="w-full flex items-center justify-center bg-white text-black
                               font-black tracking-wider text-lg uppercase
                               py-6 px-8 rounded-none
                               disabled:opacity-50 disabled:cursor-not-allowed
                               hover:bg-black hover:text-white hover:border hover:border-white
                               transition-all duration-300"
                  >
                    {status.isVerifying ? (
                      <>
                        <Zap className="w-6 h-6 mr-3 animate-pulse" aria-hidden="true" />
                        INITIALIZING HANDSHAKE
                      </>
                    ) : (
                      <>
                        <Shield className="w-6 h-6 mr-3" aria-hidden="true" />
                        INITIALIZE STEAM LINK
                      </>
                    )}
                  </button>
                  {/* Tooltip */}
                  {showWalletTooltip && !walletAddress && (
                    <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 bg-black border border-white 
                                    text-white text-xs px-4 py-3 rounded-none mono whitespace-nowrap z-10">
                      Please Connect Wallet First
                      <div className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-0 h-0 
                                      border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent 
                                      border-t-[8px] border-t-white"></div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <a 
                    href={status.requestUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Login to Steam to complete verification (opens in new tab)"
                    className="w-full flex items-center justify-center bg-white text-black
                               font-black tracking-wider text-lg uppercase
                               py-6 px-8 rounded-none
                               hover:bg-black hover:text-white hover:border hover:border-white
                               transition-all duration-300"
                  >
                    <Zap className="w-6 h-6 mr-3" aria-hidden="true" />
                    👉 CLICK HERE TO LOGIN TO STEAM
                  </a>
                  <p className="text-xs text-center text-neutral-500 mono">
                    (Or check Console F12 for the raw link)
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Available Rewards */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="bg-transparent border border-neutral-800 rounded-none shadow-none">
            <CardHeader>
              <CardTitle className="text-white font-bold text-xs flex items-center gap-3 tracking-wider uppercase">
                <Award className="w-5 h-5" aria-hidden="true" />
                AVAILABLE REWARDS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-transparent border border-neutral-800 rounded-none p-4 hover:border-white transition-all duration-300 cursor-pointer group">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-[10px] text-white tracking-wider uppercase">STEAM ACCOUNT</span>
                  <Badge className="bg-transparent border border-neutral-800 text-white mono text-[10px] group-hover:bg-white group-hover:text-black transition-colors rounded-none">+500 PTS</Badge>
                </div>
                <p className="text-[10px] text-neutral-500 uppercase">Verify Steam profile ownership</p>
              </div>

              <div className="bg-transparent border border-neutral-800 rounded-none p-4 hover:border-white transition-all duration-300 cursor-pointer group">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-[10px] text-white tracking-wider uppercase">GITHUB COMMITS</span>
                  <Badge className="bg-transparent border border-neutral-800 text-white mono text-[10px] group-hover:bg-white group-hover:text-black transition-colors rounded-none">+300 PTS</Badge>
                </div>
                <p className="text-[10px] text-neutral-500 uppercase">Prove contribution history</p>
              </div>

              <div className="bg-transparent border border-neutral-800 rounded-none p-4 hover:border-white transition-all duration-300 cursor-pointer group">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-[10px] text-white tracking-wider uppercase">TWITTER FOLLOWERS</span>
                  <Badge className="bg-transparent border border-neutral-800 text-white mono text-[10px] group-hover:bg-white group-hover:text-black transition-colors rounded-none">+200 PTS</Badge>
                </div>
                <p className="text-[10px] text-neutral-500 uppercase">Verify follower count</p>
              </div>

              <div className="bg-transparent border border-neutral-800 rounded-none p-4 hover:border-white transition-all duration-300 cursor-pointer group">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-[10px] text-white tracking-wider uppercase">LINKEDIN PROFILE</span>
                  <Badge className="bg-transparent border border-neutral-800 text-white mono text-[10px] group-hover:bg-white group-hover:text-black transition-colors rounded-none">+400 PTS</Badge>
                </div>
                <p className="text-[10px] text-neutral-500 uppercase">Prove professional credentials</p>
              </div>

              <div className="bg-transparent border border-neutral-800 rounded-none p-4 hover:border-white transition-all duration-300 cursor-pointer group">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-[10px] text-white tracking-wider uppercase">BANK BALANCE</span>
                  <Badge className="bg-transparent border border-neutral-800 text-white mono text-[10px] group-hover:bg-white group-hover:text-black transition-colors rounded-none">+1000 PTS</Badge>
                </div>
                <p className="text-[10px] text-neutral-500 uppercase">Verify financial standing</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-transparent border border-neutral-800 rounded-none shadow-none">
            <CardHeader>
              <CardTitle className="text-white font-bold text-xs tracking-wider uppercase">YOUR POINTS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-6xl font-black text-white mb-3">0</div>
              <p className="text-[10px] text-neutral-500 uppercase">Complete verifications to earn points</p>
            </CardContent>
          </Card>
        </div>
        </div>
      </main>

      {/* Live Verification Ticker - Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-neutral-800 py-3 overflow-hidden z-50" role="marquee" aria-label="Live verification activity ticker">
        <div className="flex gap-12 animate-scroll whitespace-nowrap">
          {[...tickerItems, ...tickerItems, ...tickerItems].map((item, index) => (
            <div key={index} className="flex items-center gap-3 text-white mono text-sm">
              <span className="text-neutral-600">[</span>
              <span>{item}</span>
              <span className="text-neutral-600">]</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>

      {/* Badge Reveal Modal */}
      <BadgeCard
        isOpen={showBadgeCard}
        onClose={() => setShowBadgeCard(false)}
        walletAddress={walletAddress}
        tokenId={mintedTokenId}
      />
    </div>
  );
}
