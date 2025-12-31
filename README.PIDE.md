# PIDE - Proof-of-Insight Data Exchange

A high-security Data Integrity Protocol that uses zkTLS to verify Web2 data on-chain.

## Architecture

### Smart Contract Layer
- **SBT.sol**: Custom Soulbound Token implementation (non-transferable)
  - Mint tokens with verified data proofs
  - Store zkTLS proof hashes on-chain
  - Prevent token transfers (soulbound)
  - Track verification status

### Frontend Layer
- **Dashboard.tsx**: Cyber-industrial UI for data verification
- **useVerification.ts**: Modular verification hook with **Live zkTLS Integration**
  - Features Live zkTLS Verification using the Reclaim Protocol SDK
  - Generates authentic cryptographic proofs from Steam servers
  - Provides real-time progress tracking and status updates
  - Supports handshake URL generation for mobile verification

## Getting Started

### 1. Environment Setup

**IMPORTANT**: Before running the project, you must configure your environment variables.

```bash
# Copy the example environment file
cp .env.example .env
```

Then edit `.env` and add your credentials:

```bash
# Reclaim Protocol Configuration (Required)
VITE_RECLAIM_APP_ID=your_reclaim_app_id_here
VITE_RECLAIM_APP_SECRET=your_reclaim_app_secret_here

# Steam Provider Configuration (Required)
VITE_STEAM_PROVIDER_ID=your_steam_provider_id_here

# Discord Webhook Configuration (Optional)
VITE_DISCORD_WEBHOOK_URL=your_discord_webhook_url_here

# Smart Contract Configuration
VITE_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
VITE_CHAIN_ID=1337
VITE_RPC_URL=http://127.0.0.1:8545
```

**Security Note**: Never commit your `.env` file to version control. It's already listed in `.gitignore`.

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Compile Smart Contracts
```bash
npx hardhat compile
```

### 4. Start Local Blockchain (Terminal 1)
```bash
npx hardhat node
```

### 5. Deploy Contract (Terminal 2)
```bash
npx hardhat run scripts/deploy.ts --network localhost
```

Copy the deployed contract address and update `VITE_CONTRACT_ADDRESS` in your `.env` file.

### 6. Start Frontend (Terminal 2)
```bash
pnpm dev
```

## Project Structure

```
/workspace/
├── contracts/
│   └── SBT.sol                 # Soulbound Token contract
├── scripts/
│   └── deploy.ts               # Deployment script
├── src/
│   ├── hooks/
│   │   └── useVerification.ts  # Live zkTLS verification hook (Reclaim SDK)
│   ├── pages/
│   │   └── Dashboard.tsx       # Main UI
│   └── index.css               # Cyber-industrial theme
├── hardhat.config.ts           # Hardhat configuration
└── .env.example                # Environment template
```

## Design System

### Color Palette
- **Background**: `#0d1117` (GitHub dark)
- **Accent**: `#00ff41` (Neon green)
- **Cards**: `#161b22` (Elevated dark)

### Typography
- **Font**: Courier New (terminal-style monospace)
- **Effects**: Neon glow on primary elements

### Components
- Grid background pattern
- Neon borders with glow effects
- Terminal-style text rendering

## Smart Contract Features

### Minting
```solidity
function mint(string memory dataHash, string memory proofHash) 
    external returns (uint256)
```

### Verification
```solidity
function verify(uint256 tokenId) external
```

### Querying
```solidity
function getToken(uint256 tokenId) external view returns (TokenData memory)
function getTokensByOwner(address owner) external view returns (uint256[] memory)
```

## Current Features

### ✅ Live zkTLS Integration
- **Reclaim Protocol SDK** integrated and operational
- Real cryptographic proof generation from Steam servers
- Handshake URL generation for mobile verification
- Discord webhook notifications on successful proof generation

## Next Steps

### Contract Integration
1. Connect wallet (MetaMask/WalletConnect)
2. Call `mint()` with generated proofs
3. Display minted tokens in dashboard
4. Show verification status

### Enhanced Features
- Token revocation UI
- Proof history timeline
- Multi-chain support
- IPFS integration for data storage

## Development Commands

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Start local node
npx hardhat node

# Deploy to localhost
npx hardhat run scripts/deploy.ts --network localhost

# Start frontend
pnpm dev

# Build for production
pnpm build
```

## Security Notes

- Tokens are **non-transferable** (soulbound)
- Each data hash can only be used once
- Only token owners can revoke their tokens
- Verification is currently open (add access control for production)

## License

MIT
