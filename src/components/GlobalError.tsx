import React from 'react';

interface GlobalErrorProps {
  error: Error;
  errorInfo: React.ErrorInfo;
}

const GlobalError: React.FC<GlobalErrorProps> = ({ error, errorInfo }) => {
  const handleReboot = () => {
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center p-4 font-mono">
      <div className="max-w-4xl w-full space-y-6">
        {/* Terminal Header */}
        <div className="border border-red-500/30 bg-red-950/10 p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-red-500 text-sm">SYSTEM STATUS: CRITICAL</span>
          </div>
          
          <div className="space-y-2 text-red-400">
            <div className="flex items-start gap-2">
              <span className="text-red-500">&gt;</span>
              <span className="font-bold">CRITICAL SYSTEM FAILURE</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-500">&gt;</span>
              <span className="font-bold">RUNTIME EXCEPTION DETECTED</span>
            </div>
          </div>
        </div>

        {/* Error Details */}
        <div className="border border-red-500/20 bg-black/50 p-4 max-h-64 overflow-auto">
          <div className="text-red-400/80 text-sm space-y-2">
            <div>
              <span className="text-red-500">ERROR:</span> {error.message}
            </div>
            <div className="text-red-400/60 text-xs mt-4">
              <div className="mb-2 text-red-500">STACK TRACE:</div>
              <pre className="whitespace-pre-wrap break-all">
                {errorInfo.componentStack}
              </pre>
            </div>
          </div>
        </div>

        {/* Reboot Button */}
        <div className="flex justify-center">
          <button
            onClick={handleReboot}
            className="px-8 py-3 bg-red-500 hover:bg-red-600 text-black font-bold 
                     transition-all duration-200 hover:scale-105 active:scale-95
                     border-2 border-red-400 shadow-lg shadow-red-500/50"
          >
            REBOOT SYSTEM
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-red-500/40 text-xs">
          <p>PIDE PROTOCOL v1.0.0 | EMERGENCY RECOVERY MODE</p>
        </div>
      </div>
    </div>
  );
};

export default GlobalError;
