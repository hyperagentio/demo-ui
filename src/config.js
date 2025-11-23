// Contract addresses - Update these with your deployed contract addresses
export const CONTRACT_ADDRESSES = {
  IDENTITY_REGISTRY: '0x5e3946F4f1c94D7a7d8Ac70Ea8860deD277a8248', // Replace with actual IdentityRegistry address
  JOBS_MODULE: '0xe54Ec561179e1E210c64A67f021F3Ba7ef9C18D0', // Replace with actual JobsModule address
  HYPT_TOKEN: '0x7744D92137fDA24C3164Bdc9a467a4a25aCf1954' // Replace with actual HyptToken address
}

// Network configuration
export const NETWORK_CONFIG = {
  chainId: 296,
  name: 'Hedera Testnet',
  rpcUrl: 'https://testnet.hashio.io/api' // Replace with your RPC endpoint
}

// Job states enum (matching JobsModule contract)
export const JobState = {
  0: 'Open',
  1: 'Accepted',
  2: 'Completed',
  3: 'Cancelled'
}

// Update intervals (in milliseconds)
export const UPDATE_INTERVALS = {
  DASHBOARD: 30000, // 30 seconds
  AGENTS: 60000, // 1 minute
  JOBS: 15000 // 15 seconds
}