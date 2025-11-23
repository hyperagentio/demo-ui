import { ref, computed } from 'vue'
import { ethers } from 'ethers'
import { CONTRACT_ADDRESSES, NETWORK_CONFIG } from '../config.js'
import IdentityRegistryABI from '../abis/IdentityRegistry.json'
import JobsModuleABI from '../abis/JobsModule.json'
import HyptTokenABI from '../abis/HyptToken.json'

// Hedera testnet configuration
const HEDERA_TESTNET_RPC = 'https://testnet.hashio.io/api'

export function useBlockchain() {
  const provider = ref(null)
  const signer = ref(null)
  const contracts = ref({})
  const isConnected = ref(false)
  const isConnecting = ref(false)
  const error = ref(null)
  const account = ref('')

  // Initialize blockchain connection (read-only)
  const connect = async () => {
    try {
      isConnecting.value = true
      error.value = null

      // Connect to Hedera testnet via RPC
      provider.value = new ethers.JsonRpcProvider(HEDERA_TESTNET_RPC)

      // Test the connection
      await provider.value.getNetwork()

      // Initialize contracts (read-only)
      contracts.value = {
        identityRegistry: new ethers.Contract(CONTRACT_ADDRESSES.IDENTITY_REGISTRY, IdentityRegistryABI, provider.value),
        jobsModule: new ethers.Contract(CONTRACT_ADDRESSES.JOBS_MODULE, JobsModuleABI, provider.value),
        hyptToken: new ethers.Contract(CONTRACT_ADDRESSES.HYPT_TOKEN, HyptTokenABI, provider.value)
      }

      // Set a dummy account since we're read-only
      account.value = '0x0000000000000000000000000000000000000000'

      isConnected.value = true
      return true
    } catch (err) {
      error.value = err.message || 'Failed to connect to Hedera testnet'
      console.error('Connection error:', err)
      return false
    } finally {
      isConnecting.value = false
    }
  }

  // Disconnect from blockchain
  const disconnect = () => {
    provider.value = null
    contracts.value = {}
    isConnected.value = false
    account.value = ''
    error.value = null
  }

  // Switch network (not applicable for read-only connection)
  const switchNetwork = async () => {
    // Not needed for read-only RPC connection
    return true
  }

  // Setup event listeners (not needed for read-only connection)
  const setupEventListeners = () => {
    // No event listeners needed for read-only RPC connection
  }

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return ''
    const addressStr = String(address)
    if (addressStr.length < 10) return addressStr // Return as-is if too short
    return `${addressStr.slice(0, 6)}...${addressStr.slice(-4)}`
  }

  // Format balance
  const formatBalance = (balance, decimals = 18) => {
    if (!balance) return '0'
    try {
      return ethers.formatUnits(balance, decimals)
    } catch (error) {
      console.warn('Failed to format balance:', balance, error)
      return String(balance)
    }
  }

  return {
    // State
    provider,
    contracts,
    isConnected,
    isConnecting,
    error,
    account,

    // Methods
    connect,
    disconnect,
    switchNetwork,
    setupEventListeners,
    formatAddress,
    formatBalance
  }
}