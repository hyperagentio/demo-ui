<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import { dashboard } from './composables/useDashboard'

// Local state
const messages = ref([])
const userInput = ref('')
const isTyping = ref(false)
const error = ref(null)

// Computed properties
const agents = computed(() => dashboard.agents.value)
const jobs = computed(() => dashboard.jobs.value)

// Job creation states for simulation
const jobStates = [
  { state: 0, label: 'Open', emoji: '📋', color: '#3b82f6' },
  { state: 1, label: 'Accepted', emoji: '✅', color: '#f59e0b' },
  { state: 2, label: 'Completed', emoji: '🎯', color: '#10b981' }
]

// Add a message to the chat
const addMessage = (content, type = 'user', metadata = null) => {
  messages.value.push({
    id: Date.now() + Math.random(),
    content,
    type, // 'user', 'agent', 'system'
    timestamp: new Date(),
    metadata
  })
}

// Simulate typing indicator
const simulateTyping = async (duration = 2000) => {
  isTyping.value = true
  await new Promise(resolve => setTimeout(resolve, duration))
  isTyping.value = false
}

// Simulate job creation process
const simulateJobCreation = async (userPrompt) => {
  // Step 1: Acknowledge the request
  await simulateTyping(1500)
  addMessage(`I'll help you create a job for: "${userPrompt}". Let me analyze the requirements and find the best agent for this task.`, 'agent')

  // Step 2: Find suitable agent
  await simulateTyping(2000)
  const suitableAgents = agents.value.filter(agent =>
    agent.metadata?.description?.toLowerCase().includes('data') ||
    agent.metadata?.description?.toLowerCase().includes('analysis') ||
    agent.metadata?.description?.toLowerCase().includes('ai')
  )
  const selectedAgent = suitableAgents.length > 0 ? suitableAgents[0] : agents.value[0]

  addMessage(`I've found ${selectedAgent.metadata?.name || 'an agent'} that specializes in this type of work. Creating your job now...`, 'agent')

  // Step 3: Create the job
  await simulateTyping(1000)
  const newJobId = (jobs.value.length + 1).toString()
  const newJob = {
    id: newJobId,
    description: userPrompt,
    state: 0, // Open
    agentId: selectedAgent.id,
    budget: Math.floor(Math.random() * 500) + 100, // Random budget between 100-600 HYP
    creator: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    createdAt: Math.floor(Date.now() / 1000)
  }

  // Add to dashboard data (simulated)
  dashboard.jobs.value.push(newJob)

  addMessage(`✅ Job #${newJobId} has been created successfully!

**Job Details:**
- **Description:** ${userPrompt}
- **Assigned Agent:** ${selectedAgent.metadata?.name || `Agent ${selectedAgent.id}`}
- **Budget:** ${newJob.budget} HYP
- **Status:** Open for acceptance

The job is now live on the network and available for agents to accept.`, 'agent', { jobId: newJobId, job: newJob })

  // Step 4: Simulate acceptance
  await simulateTyping(3000)
  addMessage(`🎯 Great news! An agent has accepted your job #${newJobId}. The work is now in progress.`, 'agent')

  // Update job state
  const jobIndex = dashboard.jobs.value.findIndex(j => j.id === newJobId)
  if (jobIndex !== -1) {
    dashboard.jobs.value[jobIndex].state = 1 // Accepted
  }

  // Step 5: Simulate completion
  await simulateTyping(4000)
  addMessage(`🎉 Job #${newJobId} has been completed successfully! The agent has delivered the results.

**Completion Summary:**
- **Job:** ${userPrompt}
- **Agent:** ${selectedAgent.metadata?.name || `Agent ${selectedAgent.id}`}
- **Time:** ${Math.floor(Math.random() * 30) + 5} minutes
- **Status:** ✅ Completed

You can now review the results and provide feedback if needed.`, 'agent')

  // Update job state to completed
  if (jobIndex !== -1) {
    dashboard.jobs.value[jobIndex].state = 2 // Completed
  }

  // Step 6: Final message
  await simulateTyping(1000)
  addMessage(`Is there anything else you'd like me to help you with? You can create another job or explore the network dashboard.`, 'agent')
}

// Handle sending a message
const sendMessage = async () => {
  if (!userInput.value.trim()) return

  const prompt = userInput.value.trim()
  userInput.value = ''

  // Add user message
  addMessage(prompt, 'user')

  // Scroll to bottom
  await nextTick()
  scrollToBottom()

  // Simulate job creation process
  try {
    await simulateJobCreation(prompt)
  } catch (err) {
    error.value = err.message
    addMessage(`Sorry, I encountered an error: ${err.message}`, 'system')
  }

  // Scroll to bottom after responses
  await nextTick()
  scrollToBottom()
}

// Handle Enter key
const handleKeyPress = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

// Scroll to bottom of chat
const scrollToBottom = () => {
  const chatContainer = document.querySelector('.chat-messages')
  if (chatContainer) {
    chatContainer.scrollTop = chatContainer.scrollHeight
  }
}

// Format message content with basic markdown
const formatMessage = (content) => {
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
}

// Format timestamp
const formatTime = (timestamp) => {
  return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Initialize with welcome message
const initChat = () => {
  addMessage(`👋 Welcome to the HyperAgent Job Creator!

I'm here to help you create jobs for the AI agent network. Simply describe what you need, and I'll:

1. **Analyze** your requirements
2. **Find** the best agent for the job
3. **Create** the job on the network
4. **Monitor** its progress until completion

What would you like to work on today?`, 'agent')
}

// Initialize on mount
onMounted(() => {
  initChat()
})
</script>

<template>
  <div class="job-creator">
    <!-- Header -->
    <header class="chat-header">
      <div class="header-info">
        <h1>🤖 HyperAgent Job Creator</h1>
        <div class="network-info">
          <span class="network-label">Hedera Testnet</span>
          <span class="agent-count">• {{ agents.length }} Agents Available</span>
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

    <!-- Chat Interface -->
    <div class="chat-container">
      <!-- Messages -->
      <div class="chat-messages">
        <div
          v-for="message in messages"
          :key="message.id"
          :class="['message', `message-${message.type}`]"
        >
          <div class="message-avatar">
            <span v-if="message.type === 'user'">👤</span>
            <span v-else-if="message.type === 'agent'">🤖</span>
            <span v-else>⚙️</span>
          </div>
          <div class="message-content">
            <div class="message-text" v-html="formatMessage(message.content)"></div>
            <div class="message-time">
              {{ formatTime(message.timestamp) }}
            </div>
          </div>
        </div>

        <!-- Typing Indicator -->
        <div v-if="isTyping" class="message message-agent typing">
          <div class="message-avatar">🤖</div>
          <div class="message-content">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="chat-input-area">
        <div class="input-container">
          <textarea
            v-model="userInput"
            @keypress="handleKeyPress"
            placeholder="Describe the job you want to create... (e.g., 'Analyze customer data for insights')"
            class="chat-input"
            rows="1"
            :disabled="isTyping"
          ></textarea>
          <button
            @click="sendMessage"
            :disabled="!userInput.trim() || isTyping"
            class="send-btn"
          >
            {{ isTyping ? '⏳' : '📤' }}
          </button>
        </div>
        <div class="input-hint">
          Press Enter to send • Shift+Enter for new line
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.job-creator {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  display: flex;
  flex-direction: column;
}

.chat-header {
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

.chat-container {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-messages {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message {
  display: flex;
  gap: 12px;
  max-width: 80%;
}

.message-user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-agent {
  align-self: flex-start;
}

.message-system {
  align-self: center;
  justify-content: center;
  opacity: 0.8;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.message-user .message-avatar {
  background: rgba(16, 185, 129, 0.8);
}

.message-agent .message-avatar {
  background: rgba(59, 130, 246, 0.8);
}

.message-system .message-avatar {
  background: rgba(156, 163, 175, 0.8);
}

.message-content {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.message-user .message-content {
  background: rgba(16, 185, 129, 0.8);
  color: white;
}

.message-system .message-content {
  background: rgba(156, 163, 175, 0.8);
  text-align: center;
}

.message-text {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
  white-space: pre-wrap;
}

.message-user .message-text {
  color: white;
}

.message-system .message-text {
  color: white;
}

.message-time {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 8px;
  text-align: right;
}

.message-user .message-time {
  color: rgba(255, 255, 255, 0.8);
}

.typing-indicator {
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 8px 0;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

@keyframes typing {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.chat-input-area {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px 24px;
  background: rgba(255, 255, 255, 0.05);
}

.input-container {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.chat-input {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 12px 16px;
  color: white;
  font-family: inherit;
  font-size: 1rem;
  resize: none;
  min-height: 44px;
  max-height: 120px;
  outline: none;
  transition: all 0.2s;
}

.chat-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.chat-input:focus {
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.15);
}

.chat-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.send-btn {
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 12px;
  background: rgba(16, 185, 129, 0.8);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.2s;
  flex-shrink: 0;
}

.send-btn:hover:not(:disabled) {
  background: rgba(16, 185, 129, 0.9);
  transform: scale(1.05);
}

.send-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.input-hint {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 8px;
  text-align: center;
}

@media (max-width: 768px) {
  .job-creator {
    padding: 16px;
  }

  .chat-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
    padding: 16px;
  }

  .chat-messages {
    padding: 16px;
  }

  .message {
    max-width: 90%;
  }

  .chat-input-area {
    padding: 16px;
  }
}
</style>

<script>
export default {
  methods: {
    formatMessage(content) {
      // Simple markdown-like formatting for job details
      return content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>')
    },

    formatTime(timestamp) {
      return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  }
}
</script>