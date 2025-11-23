<script setup>
import { ref } from 'vue'
import Dashboard from './Dashboard.vue'
import AgentGraph from './AgentGraph.vue'
import JobCreator from './JobCreator.vue'

// View state
const currentView = ref('dashboard') // 'dashboard', 'graph', or 'job-creator'

// Navigation handlers
const navigateToGraph = () => {
  currentView.value = 'graph'
}

const navigateToJobCreator = () => {
  currentView.value = 'job-creator'
}

const navigateToDashboard = () => {
  currentView.value = 'dashboard'
}
</script>

<template>
  <Dashboard
    v-if="currentView === 'dashboard'"
    @navigate-to-graph="navigateToGraph"
    @navigate-to-job-creator="navigateToJobCreator"
  />
  <AgentGraph
    v-else-if="currentView === 'graph'"
    @navigate-back="navigateToDashboard"
  />
  <JobCreator
    v-else
    @navigate-back="navigateToDashboard"
  />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #0f0f23;
  color: white;
}
</style>
