import { ref, computed } from 'vue'

// Job states for dummy data
const JobState = {
  0: 'Open',
  1: 'Accepted',
  2: 'Completed',
  3: 'Cancelled'
}

// Initialize with dummy data directly
const agents = ref([
  {
    id: '1',
    owner: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    isVerifier: false,
    tokenURI: '',
    metadata: {
      name: 'Data Analyst Agent',
      description: 'Specialized in data processing and analysis tasks'
    },
    clients: ['0x1234567890123456789012345678901234567890', '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd'],
    formattedId: '1',
    formattedOwner: '0x742d...f44e'
  },
  {
    id: '2',
    owner: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    isVerifier: true,
    tokenURI: '',
    metadata: {
      name: 'Security Audit Agent',
      description: 'Expert in smart contract security and auditing'
    },
    clients: ['0x1234567890123456789012345678901234567890'],
    formattedId: '2',
    formattedOwner: '0x742d...f44e'
  },
  {
    id: '3',
    owner: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    isVerifier: false,
    tokenURI: '',
    metadata: {
      name: 'AI Training Agent',
      description: 'Handles machine learning model training and optimization'
    },
    clients: ['0xabcdefabcdefabcdefabcdefabcdefabcdefabcd', '0x1111111111111111111111111111111111111111'],
    formattedId: '3',
    formattedOwner: '0x742d...f44e'
  },
  {
    id: '4',
    owner: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    isVerifier: true,
    tokenURI: '',
    metadata: {
      name: 'DeFi Strategy Agent',
      description: 'Optimizes yield farming and DeFi investment strategies'
    },
    clients: ['0x2222222222222222222222222222222222222222'],
    formattedId: '4',
    formattedOwner: '0x742d...f44e'
  },
  {
    id: '5',
    owner: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    isVerifier: false,
    tokenURI: '',
    metadata: {
      name: 'Blockchain Monitor Agent',
      description: 'Monitors blockchain transactions and network activity'
    },
    clients: ['0x3333333333333333333333333333333333333333', '0x4444444444444444444444444444444444444444', '0x5555555555555555555555555555555555555555'],
    formattedId: '5',
    formattedOwner: '0x742d...f44e'
  }
])

const jobs = ref([
  {
    id: '1',
    description: 'Data analysis task for customer insights',
    state: 0, // Open
    agentId: '1',
    budget: 100000000000000000000, // 100 HYP in wei
    creator: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    createdAt: Math.floor(Date.now() / 1000) - 3600 // 1 hour ago
  },
  {
    id: '2',
    description: 'Smart contract audit and security review',
    state: 1, // Accepted
    agentId: '2',
    budget: 500000000000000000000, // 500 HYP in wei
    creator: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    createdAt: Math.floor(Date.now() / 1000) - 7200 // 2 hours ago
  },
  {
    id: '3',
    description: 'AI model training for image recognition',
    state: 2, // Completed
    agentId: '3',
    budget: 200000000000000000000, // 200 HYP in wei
    creator: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    createdAt: Math.floor(Date.now() / 1000) - 86400 // 1 day ago
  },
  {
    id: '4',
    description: 'Blockchain transaction monitoring service',
    state: 0, // Open
    agentId: '1',
    budget: 75000000000000000000, // 75 HYP in wei
    creator: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    createdAt: Math.floor(Date.now() / 1000) - 1800 // 30 minutes ago
  },
  {
    id: '5',
    description: 'DeFi yield optimization strategy',
    state: 1, // Accepted
    agentId: '4',
    budget: 300000000000000000000, // 300 HYP in wei
    creator: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    createdAt: Math.floor(Date.now() / 1000) - 10800 // 3 hours ago
  }
])

const multihopJobs = ref([
  {
    id: '1',
    state: 0, // Active
    creator: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    stepsCount: 3
  },
  {
    id: '2',
    state: 1, // Completed
    creator: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    stepsCount: 5
  }
])

const recentActivity = ref([])
const isLoading = ref(false)
const lastUpdate = ref(new Date())

// Statistics computed from data
const stats = computed(() => {
  return {
    totalAgents: agents.value.length,
    totalJobs: jobs.value.length + multihopJobs.value.reduce((acc, mh) => acc + mh.stepsCount, 0),
    openJobs: jobs.value.filter(job => job.state === 0).length,
    acceptedJobs: jobs.value.filter(job => job.state === 1).length,
    completedJobs: jobs.value.filter(job => job.state === 2).length,
    cancelledJobs: jobs.value.filter(job => job.state === 3).length,
    verifierAgents: agents.value.filter(agent => agent.isVerifier).length,
    totalMultihopJobs: multihopJobs.value.length
  }
})

// Fetch all agents
const fetchAgents = async () => {
  // Using dummy data instead of blockchain fetching
  // Data is already initialized
}

// Fetch jobs (simplified - in real implementation, you'd track job IDs)
const fetchJobs = async () => {
  // Using dummy data instead of blockchain fetching
  // Data is already initialized
}

// Fetch multihop jobs
const fetchMultihopJobs = async () => {
  // Using dummy data instead of blockchain fetching
  // Data is already initialized
}

// Fetch all dashboard data (dummy implementation)
const fetchAllData = async () => {
  try {
    isLoading.value = true
    // Data is already loaded, just update timestamp
    lastUpdate.value = new Date()
  } catch (err) {
    console.error('Failed to fetch dashboard data:', err)
    throw err
  } finally {
    isLoading.value = false
  }
}

// Periodic updates (disabled for dummy data)
const startPeriodicUpdates = () => {
  // No periodic updates needed for dummy data
}

const stopPeriodicUpdates = () => {
  // No periodic updates to stop
}

// Manual refresh
const refresh = async () => {
  await fetchAllData()
}

// Get job state label
const getJobStateLabel = (state) => {
  return JobState[state] || 'Unknown'
}

// Format timestamp
const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'N/A'
  return new Date(Number(timestamp) * 1000).toLocaleString()
}

// Export as a singleton object
export const dashboard = {
  // Data
  agents,
  jobs,
  multihopJobs,
  recentActivity,
  stats,
  isLoading,
  lastUpdate,

  // Methods
  fetchAgents,
  fetchJobs,
  fetchMultihopJobs,
  fetchAllData,
  startPeriodicUpdates,
  stopPeriodicUpdates,
  refresh,
  getJobStateLabel,
  formatTimestamp
}