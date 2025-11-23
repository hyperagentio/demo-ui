<script setup>
import { ref, computed, onMounted } from 'vue'
import { dashboard } from './composables/useDashboard'

// Local state
const error = ref(null)

// Computed properties for safe access with .value
const stats = computed(() => dashboard.stats.value)
const agents = computed(() => dashboard.agents.value)
const jobs = computed(() => dashboard.jobs.value)
const multihopJobs = computed(() => dashboard.multihopJobs.value)
const isLoading = computed(() => dashboard.isLoading.value)

// Computed properties for safe access
const lastUpdateTime = computed(() => {
  if (dashboard && dashboard.lastUpdate && dashboard.lastUpdate.value instanceof Date && dashboard.lastUpdate.value.getTime() > 1000) {
    return dashboard.lastUpdate.value.toLocaleTimeString()
  }
  return null
})

// Initialize the dashboard with dummy data
const initDashboard = async () => {
  try {
    error.value = null
    // Load dummy data
    await dashboard.fetchAllData()
  } catch (err) {
    error.value = err.message
    console.error('Failed to initialize dashboard:', err)
  }
}

// Manual refresh (dummy - just updates timestamp)
const refreshData = async () => {
  try {
    dashboard.lastUpdate.value = new Date()
  } catch (err) {
    error.value = err.message
  }
}

// Initialize on mount
onMounted(() => {
  console.log("Dashboard object:", dashboard);
  console.log("Agents:", dashboard.agents.value);
  console.log("Stats:", dashboard.stats.value);
  initDashboard()
})
</script>

<template>
  <div class="dashboard">
    <!-- Main Dashboard -->
    <div>
      <header class="dashboard-header">
        <div class="header-info">
          <h1>🤖 HyperAgent Dashboard</h1>
          <div class="account-info">
            <span class="network-info">Hedera Testnet </span>
            <span v-if="lastUpdateTime" class="last-update">
              Last updated: {{ lastUpdateTime }}
            </span>
          </div>
        </div>
        <div class="header-actions">
           <button
             @click="$emit('navigate-to-job-creator')"
             class="job-creator-btn"
           >
             💬 Create Job
           </button>
           <button
             @click="$emit('navigate-to-graph')"
             class="graph-btn"
           >
             📊 Network Graph
           </button>
           <button
             @click="refreshData"
             :disabled="isLoading"
             class="refresh-btn"
           >
             {{ isLoading ? 'Refreshing...' : '🔄 Refresh' }}
           </button>
           <div class="connection-status">
             <span class="status-indicator connected"></span>
             Data Loaded
           </div>
         </div>
      </header>

      <div v-if="error" class="error-banner">
        ⚠️ Error: {{ error }}
      </div>

      <!-- Statistics Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <h3>{{ stats.totalAgents }}</h3>
            <p>Total Agents</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">💼</div>
          <div class="stat-content">
            <h3>{{ stats.totalJobs }}</h3>
            <p>Total Jobs</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📋</div>
          <div class="stat-content">
            <h3>{{ stats.openJobs }}</h3>
            <p>Open Jobs</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <h3>{{ stats.acceptedJobs }}</h3>
            <p>Accepted Jobs</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🎯</div>
          <div class="stat-content">
            <h3>{{ stats.completedJobs }}</h3>
            <p>Completed Jobs</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🛡️</div>
          <div class="stat-content">
            <h3>{{ stats.verifierAgents }}</h3>
            <p>Verifier Agents</p>
          </div>
        </div>
      </div>

      <div class="dashboard-content">
        <!-- Agents Section -->
        <section class="dashboard-section">
          <h2>Registered Agents</h2>
           <div v-if="agents.length === 0 && !isLoading" class="empty-state">
             <p>No agents available. This should not happen with dummy data.</p>
           </div>
           <div v-else class="agents-grid">
             <div v-for="agent in agents" :key="agent.id" class="agent-card">
               <div class="agent-header">
                 <h3>{{ agent.metadata?.name || `Agent ${agent.id}` }}</h3>
                 <div class="agent-badges">
                   <span v-if="agent.isVerifier" class="badge verifier">🛡️ Verifier</span>
                 </div>
               </div>
               <div class="agent-details">
                 <p><strong>ID:</strong> {{ agent.formattedId }}</p>
                 <p><strong>Owner:</strong> {{ agent.formattedOwner }}</p>
                 <p><strong>Clients:</strong> {{ agent.clients?.length || 0 }}</p>
                 <p v-if="agent.metadata?.description" class="agent-description">
                   {{ agent.metadata.description }}
                 </p>
               </div>
             </div>
           </div>
        </section>

        <!-- Jobs Section -->
        <section class="dashboard-section">
          <h2>Recent Jobs</h2>
           <div v-if="jobs.length === 0 && !isLoading" class="empty-state">
             <p>No jobs available. This should not happen with dummy data.</p>
           </div>
           <div v-else class="jobs-list">
             <div v-for="job in jobs" :key="job.id" class="job-card">
               <div class="job-header">
                 <h3>{{ job.description || 'Job description' }}</h3>
                 <span :class="['job-status', `status-${job.state}`]">
                   {{ dashboard.getJobStateLabel(job.state) }}
                 </span>
               </div>
               <div class="job-details">
                 <p><strong>Agent ID:</strong> {{ job.agentId || 'N/A' }}</p>
                 <p><strong>Budget:</strong> {{ job.budget ? (Number(job.budget) / 1e18).toFixed(2) : '0.00' }} HYP</p>
                 <p><strong>Creator:</strong> {{ job.creator ? job.creator.slice(0, 6) + '...' + job.creator.slice(-4) : 'N/A' }}</p>
                 <p><strong>Created:</strong> {{ dashboard.formatTimestamp(job.createdAt) }}</p>
               </div>
             </div>
           </div>
        </section>

        <!-- Multihop Jobs Section -->
        <section v-if="multihopJobs.length > 0" class="dashboard-section">
          <h2>Multihop Jobs</h2>
          <div class="multihop-list">
            <div v-for="multihop in multihopJobs" :key="multihop.id" class="multihop-card">
              <div class="multihop-header">
                <h3>Multihop Job {{ multihop.id }}</h3>
                <span :class="['job-status', `status-${multihop.state}`]">
                  {{ multihop.state === 0 ? 'Active' : 'Completed' }}
                </span>
              </div>
               <div class="multihop-details">
                 <p><strong>Creator:</strong> {{ multihop.creator ? multihop.creator.slice(0, 6) + '...' + multihop.creator.slice(-4) : 'N/A' }}</p>
                 <p><strong>Steps:</strong> {{ multihop.stepsCount }}</p>
               </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.connection-prompt {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
}

.connection-content {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 48px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 500px;
  width: 100%;
}

.connection-content h1 {
  color: white;
  margin-bottom: 16px;
  font-size: 2.5rem;
}

.connection-content p {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 32px;
  font-size: 1.1rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.header-info h1 {
  color: white;
  margin: 0 0 8px 0;
  font-size: 2rem;
  font-weight: 600;
}

.account-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.network-info {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  font-size: 0.9rem;
}

.last-update {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.job-creator-btn {
  background: rgba(139, 92, 246, 0.8);
  border: 1px solid rgba(139, 92, 246, 0.5);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.job-creator-btn:hover {
  background: rgba(139, 92, 246, 0.9);
  transform: translateY(-1px);
}

.graph-btn {
  background: rgba(16, 185, 129, 0.8);
  border: 1px solid rgba(16, 185, 129, 0.5);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.graph-btn:hover {
  background: rgba(16, 185, 129, 0.9);
  transform: translateY(-1px);
}

.refresh-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.refresh-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-weight: 500;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.status-indicator.connected {
  background: #4ade80;
  box-shadow: 0 0 8px rgba(74, 222, 128, 0.5);
}

.status-indicator.disconnected {
  background: #ef4444;
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
}

.error-banner {
  background: rgba(239, 68, 68, 0.9);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  margin-bottom: 24px;
  border: 1px solid rgba(239, 68, 68, 0.5);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

.stat-content h3 {
  color: white;
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
}

.stat-content p {
  color: rgba(255, 255, 255, 0.8);
  margin: 4px 0 0 0;
  font-size: 0.9rem;
  font-weight: 500;
}

.dashboard-content {
  display: grid;
  gap: 32px;
}

.dashboard-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.dashboard-section h2 {
  color: white;
  margin: 0 0 24px 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.agents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.agent-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s;
}

.agent-card:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-1px);
}

.agent-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.agent-header h3 {
  color: white;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.agent-badges {
  display: flex;
  gap: 8px;
}

.badge {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge.verifier {
  background: rgba(59, 130, 246, 0.8);
  color: white;
}

.agent-details p {
  color: rgba(255, 255, 255, 0.8);
  margin: 8px 0;
  font-size: 0.9rem;
}

.agent-description {
  font-style: italic;
  color: rgba(255, 255, 255, 0.7) !important;
}

.jobs-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.job-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s;
}

.job-card:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-1px);
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.job-header h3 {
  color: white;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  flex: 1;
  margin-right: 16px;
}

.job-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.job-status.status-0 { /* Open */
  background: rgba(59, 130, 246, 0.8);
  color: white;
}

.job-status.status-1 { /* Accepted */
  background: rgba(245, 158, 11, 0.8);
  color: white;
}

.job-status.status-2 { /* Completed */
  background: rgba(34, 197, 94, 0.8);
  color: white;
}

.job-status.status-3 { /* Cancelled */
  background: rgba(239, 68, 68, 0.8);
  color: white;
}

.job-details p {
  color: rgba(255, 255, 255, 0.8);
  margin: 6px 0;
  font-size: 0.9rem;
}

.empty-state {
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  padding: 40px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  border: 1px dashed rgba(255, 255, 255, 0.2);
}

.empty-state p {
  margin: 0;
  font-size: 1rem;
}

.multihop-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.multihop-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s;
}

.multihop-card:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-1px);
}

.multihop-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.multihop-header h3 {
  color: white;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.multihop-details p {
  color: rgba(255, 255, 255, 0.8);
  margin: 6px 0;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .dashboard {
    padding: 16px;
  }

  .dashboard-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }

  .agents-grid {
    grid-template-columns: 1fr;
  }
}
</style>