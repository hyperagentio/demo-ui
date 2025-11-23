<script setup>
import { ref, computed, onMounted } from 'vue'
import { dashboard } from './composables/useDashboard'

// Local state
const error = ref(null)
const selectedAgent = ref(null)
const hoveredAgent = ref(null)

// Computed properties for safe access
const agents = computed(() => dashboard.agents.value)
const jobs = computed(() => dashboard.jobs.value)
const isLoading = computed(() => dashboard.isLoading.value)

// Generate graph data from agents and jobs
const graphData = computed(() => {
  const nodes = []
  const links = []

  // Create nodes for agents
  agents.value.forEach((agent, index) => {
    const angle = (index / agents.value.length) * 2 * Math.PI
    const radius = 200
    const x = Math.cos(angle) * radius + 400
    const y = Math.sin(angle) * radius + 300

    nodes.push({
      id: agent.id,
      name: agent.metadata?.name || `Agent ${agent.id}`,
      x,
      y,
      type: agent.isVerifier ? 'verifier' : 'agent',
      clients: agent.clients?.length || 0,
      agent: agent
    })
  })

  // Create links based on job relationships
  jobs.value.forEach(job => {
    if (job.agentId) {
      const agentNode = nodes.find(n => n.id === job.agentId)
      if (agentNode) {
        // Create a "job" node in the center
        const jobNodeId = `job-${job.id}`
        if (!nodes.find(n => n.id === jobNodeId)) {
          nodes.push({
            id: jobNodeId,
            name: `Job ${job.id}`,
            x: 400 + (Math.random() - 0.5) * 100,
            y: 300 + (Math.random() - 0.5) * 100,
            type: 'job',
            state: job.state,
            job: job
          })
        }

        // Link agent to job
        links.push({
          source: agentNode.id,
          target: jobNodeId,
          type: 'agent-job'
        })
      }
    }
  })

  // Create links between agents that share clients (collaboration network)
  agents.value.forEach((agent1, i) => {
    agents.value.slice(i + 1).forEach(agent2 => {
      const sharedClients = agent1.clients?.filter(client =>
        agent2.clients?.includes(client)
      ).length || 0

      if (sharedClients > 0) {
        links.push({
          source: agent1.id,
          target: agent2.id,
          type: 'collaboration',
          strength: sharedClients
        })
      }
    })
  })

  return { nodes, links }
})

// Handle node click
const handleNodeClick = (node) => {
  selectedAgent.value = node.agent || null
}

// Handle node hover
const handleNodeHover = (node) => {
  hoveredAgent.value = node
}

// Handle node leave
const handleNodeLeave = () => {
  hoveredAgent.value = null
}

// Get node color based on type
const getNodeColor = (node) => {
  switch (node.type) {
    case 'verifier':
      return '#3b82f6' // Blue for verifiers
    case 'agent':
      return '#10b981' // Green for regular agents
    case 'job':
      return '#f59e0b' // Orange for jobs
    default:
      return '#6b7280'
  }
}

// Get link color based on type
const getLinkColor = (link) => {
  switch (link.type) {
    case 'agent-job':
      return '#94a3b8'
    case 'collaboration':
      return '#fbbf24'
    default:
      return '#6b7280'
  }
}

// Get link stroke width
const getLinkWidth = (link) => {
  return link.type === 'collaboration' ? link.strength * 2 : 1
}

// Initialize the graph
const initGraph = async () => {
  try {
    error.value = null
    // Graph data is computed from dashboard data
  } catch (err) {
    error.value = err.message
    console.error('Failed to initialize graph:', err)
  }
}

// Initialize on mount
onMounted(() => {
  initGraph()
})
</script>

<template>
  <div class="agent-graph">
    <!-- Header -->
    <header class="graph-header">
      <div class="header-info">
        <h1>🤖 Agent Network Graph</h1>
        <div class="network-info">
          <span class="network-label">Hedera Testnet</span>
          <span class="agent-count">• {{ agents.length }} Agents Connected</span>
        </div>
      </div>
      <div class="header-actions">
        <button
          @click="$emit('navigate-back')"
          class="back-btn"
        >
          ← Back to Dashboard
        </button>
      </div>
    </header>

    <div v-if="error" class="error-banner">
      ⚠️ Error: {{ error }}
    </div>

    <!-- Graph Container -->
    <div class="graph-container">
      <svg
        class="graph-svg"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid meet"
      >
        <!-- Links -->
        <g class="links">
          <line
            v-for="link in graphData.links"
            :key="`${link.source}-${link.target}`"
            :x1="graphData.nodes.find(n => n.id === link.source)?.x || 0"
            :y1="graphData.nodes.find(n => n.id === link.source)?.y || 0"
            :x2="graphData.nodes.find(n => n.id === link.target)?.x || 0"
            :y2="graphData.nodes.find(n => n.id === link.target)?.y || 0"
            :stroke="getLinkColor(link)"
            :stroke-width="getLinkWidth(link)"
            stroke-opacity="0.6"
            class="graph-link"
          />
        </g>

        <!-- Nodes -->
        <g class="nodes">
          <circle
            v-for="node in graphData.nodes"
            :key="node.id"
            :cx="node.x"
            :cy="node.y"
            :r="node.type === 'job' ? 8 : 12"
            :fill="getNodeColor(node)"
            :stroke="selectedAgent?.id === node.id ? '#ffffff' : 'rgba(255,255,255,0.3)'"
            :stroke-width="selectedAgent?.id === node.id ? 3 : 1"
            class="graph-node"
            @click="handleNodeClick(node)"
            @mouseenter="handleNodeHover(node)"
            @mouseleave="handleNodeLeave"
          />

          <!-- Node Labels -->
          <text
            v-for="node in graphData.nodes"
            :key="`label-${node.id}`"
            :x="node.x"
            :y="node.y + (node.type === 'job' ? 25 : 30)"
            text-anchor="middle"
            class="node-label"
            :class="{ 'selected': selectedAgent?.id === node.id }"
          >
            {{ node.name.length > 15 ? node.name.substring(0, 15) + '...' : node.name }}
          </text>
        </g>
      </svg>

      <!-- Legend -->
      <div class="graph-legend">
        <div class="legend-item">
          <div class="legend-color" style="background: #10b981;"></div>
          <span>Agent</span>
        </div>
        <div class="legend-item">
          <div class="legend-color" style="background: #3b82f6;"></div>
          <span>Verifier Agent</span>
        </div>
        <div class="legend-item">
          <div class="legend-color" style="background: #f59e0b;"></div>
          <span>Job</span>
        </div>
        <div class="legend-item">
          <div class="legend-line" style="background: #94a3b8;"></div>
          <span>Agent-Job Link</span>
        </div>
        <div class="legend-item">
          <div class="legend-line" style="background: #fbbf24;"></div>
          <span>Collaboration</span>
        </div>
      </div>
    </div>

    <!-- Agent Details Panel -->
    <div v-if="selectedAgent" class="agent-details-panel">
      <div class="panel-header">
        <h3>{{ selectedAgent.metadata?.name || `Agent ${selectedAgent.id}` }}</h3>
        <button @click="selectedAgent = null" class="close-btn">×</button>
      </div>
      <div class="panel-content">
        <div class="detail-row">
          <strong>ID:</strong> {{ selectedAgent.formattedId }}
        </div>
        <div class="detail-row">
          <strong>Owner:</strong> {{ selectedAgent.formattedOwner }}
        </div>
        <div class="detail-row">
          <strong>Type:</strong>
          <span :class="['agent-type', selectedAgent.isVerifier ? 'verifier' : 'agent']">
            {{ selectedAgent.isVerifier ? '🛡️ Verifier' : '🤖 Agent' }}
          </span>
        </div>
        <div class="detail-row">
          <strong>Clients:</strong> {{ selectedAgent.clients?.length || 0 }}
        </div>
        <div v-if="selectedAgent.metadata?.description" class="detail-row">
          <strong>Description:</strong> {{ selectedAgent.metadata.description }}
        </div>
        <div class="detail-row">
          <strong>Related Jobs:</strong>
          {{ jobs.filter(job => job.agentId === selectedAgent.id).length }}
        </div>
      </div>
    </div>

    <!-- Hover Tooltip -->
    <div
      v-if="hoveredAgent && !selectedAgent"
      class="hover-tooltip"
      :style="{ left: hoveredAgent.x + 'px', top: hoveredAgent.y + 'px' }"
    >
      <div class="tooltip-content">
        <strong>{{ hoveredAgent.name }}</strong>
        <div v-if="hoveredAgent.type !== 'job'">
          Clients: {{ hoveredAgent.clients }}
        </div>
        <div v-if="hoveredAgent.type === 'job'">
          State: {{ dashboard.getJobStateLabel(hoveredAgent.state) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.agent-graph {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.graph-header {
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

.network-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  font-size: 0.9rem;
}

.agent-count {
  color: rgba(255, 255, 255, 0.7);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.error-banner {
  background: rgba(239, 68, 68, 0.9);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  margin-bottom: 24px;
  border: 1px solid rgba(239, 68, 68, 0.5);
}

.graph-container {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.graph-svg {
  width: 100%;
  max-width: 800px;
  height: 600px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  margin-bottom: 20px;
}

.graph-node {
  cursor: pointer;
  transition: all 0.2s;
}

.graph-node:hover {
  stroke: #ffffff !important;
  stroke-width: 2 !important;
}

.graph-link {
  transition: all 0.2s;
}

.node-label {
  fill: rgba(255, 255, 255, 0.9);
  font-size: 12px;
  font-weight: 500;
  pointer-events: none;
}

.node-label.selected {
  fill: #ffffff;
  font-weight: 700;
}

.graph-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.legend-line {
  width: 24px;
  height: 2px;
  border-radius: 1px;
}

.agent-details-panel {
  position: fixed;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  max-width: 300px;
  z-index: 1000;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.panel-header h3 {
  color: #1f2937;
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #374151;
}

.panel-content {
  color: #374151;
}

.detail-row {
  margin-bottom: 12px;
  font-size: 0.9rem;
}

.detail-row strong {
  color: #1f2937;
  margin-right: 8px;
}

.agent-type {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.agent-type.verifier {
  background: rgba(59, 130, 246, 0.8);
  color: white;
}

.agent-type.agent {
  background: rgba(16, 185, 129, 0.8);
  color: white;
}

.hover-tooltip {
  position: absolute;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  pointer-events: none;
  z-index: 1000;
  transform: translate(-50%, -100%);
  margin-top: -10px;
  white-space: nowrap;
}

.tooltip-content {
  color: white;
}

.tooltip-content strong {
  display: block;
  margin-bottom: 4px;
  color: #ffffff;
}

@media (max-width: 768px) {
  .agent-graph {
    padding: 16px;
  }

  .graph-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .graph-container {
    padding: 16px;
  }

  .graph-svg {
    height: 400px;
  }

  .agent-details-panel {
    position: static;
    transform: none;
    margin-top: 20px;
    max-width: none;
  }

  .hover-tooltip {
    display: none;
  }
}
</style>