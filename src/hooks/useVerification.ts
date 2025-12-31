import { useState, useCallback } from 'react';
import { ReclaimProofRequest } from '@reclaimprotocol/js-sdk';

export interface VerificationResult {
  success: boolean;
  proofHash: string; // The unique identifier of the proof
  dataHash: string;  // The context or parameters extracted
  timestamp: number;
  error?: string;
  fullProof?: any;   // The raw ZK proof object to send to chain
}

export interface VerificationStatus {
  isVerifying: boolean;
  progress: number;
  stage: 'idle' | 'connecting' | 'generating' | 'validating' | 'complete' | 'error';
  requestUrl?: string; // URL for QR Code (Mobile fallback)
}

/**
 * PIDE zkTLS Verification Hook (God Tier Implementation)
 * Replaces the CodeNut mock with real Reclaim Protocol logic.
 */
export function useVerification() {
  const [status, setStatus] = useState<VerificationStatus>({
    isVerifying: false,
    progress: 0,
    stage: 'idle',
  });

  const [result, setResult] = useState<VerificationResult | null>(null);

  /**
   * Generates a zkTLS proof using Reclaim Protocol
   * @param providerId - The Reclaim Provider ID (e.g., Steam Provider ID)
   */
  const generateProof = useCallback(async (providerId: string): Promise<VerificationResult> => {
    setStatus({ isVerifying: true, progress: 10, stage: 'connecting' });
    setResult(null);

    try {
      // 1. Initialize the Reclaim SDK from environment variables
      const APP_ID = import.meta.env.VITE_RECLAIM_APP_ID;
      const APP_SECRET = import.meta.env.VITE_RECLAIM_APP_SECRET;

      if (!APP_ID || !APP_SECRET) {
        throw new Error('Reclaim Protocol credentials not configured. Please check your .env file.');
      }

      console.log('Initializing zkTLS Handshake...');
      const request = await ReclaimProofRequest.init(APP_ID, APP_SECRET, providerId);
      
      // 2. Generate Request URL (This handles the "Vibe" of the handshake)
      const requestUrl = await request.getRequestUrl();
      console.log('Proof Request URL:', requestUrl);
      
      setStatus({ 
        isVerifying: true, 
        progress: 30, 
        stage: 'generating', 
        requestUrl 
      });

      // 3. Start Session & Wait for Proof (The "Magic" Step)
      // We wrap the callback-based SDK in a Promise to keep our clean async/await flow
      const proof = await new Promise<any>((resolve, reject) => {
        request.startSession({
          onSuccess: (proofs) => {
            console.log('zkTLS Proof Received:', proofs);
            resolve(proofs); // Proof generated successfully
          },
          onError: (error) => {
            console.error('zkTLS Failed:', error);
            reject(error);
          }
        });
      });

      // 4. Validate & Format Result
      setStatus({ isVerifying: true, progress: 90, stage: 'validating' });

      // In Reclaim, 'proofs' is often an array. We take the first valid one.
      const proofData = Array.isArray(proof) ? proof[0] : proof;

      const verificationResult: VerificationResult = {
        success: true,
        proofHash: typeof proofData === 'string' ? proofData : JSON.stringify(proofData.claimData.identifier),
        dataHash: JSON.stringify(proofData.claimData.context),
        timestamp: Date.now(),
        fullProof: proofData 
      };

      setResult(verificationResult);
      setStatus({ isVerifying: false, progress: 100, stage: 'complete' });

      return verificationResult;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'zkTLS Handshake Failed';
      
      const errorResult: VerificationResult = {
        success: false,
        proofHash: '',
        dataHash: '',
        timestamp: Date.now(),
        error: errorMessage,
      };

      setResult(errorResult);
      setStatus({ isVerifying: false, progress: 0, stage: 'error' });

      return errorResult;
    }
  }, []);

  const reset = useCallback(() => {
    setStatus({ isVerifying: false, progress: 0, stage: 'idle' });
    setResult(null);
  }, []);

  return {
    generateProof,
    reset,
    status,
    result,
  };
}