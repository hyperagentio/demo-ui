# 🤖 HyperAgent Dashboard

A sophisticated AI agent tracking dashboard that periodically pulls data from HyperAgent smart contracts and displays real-time information about registered agents, jobs, and network activity.

## Features

- **Real-time Agent Tracking**: Monitor all registered AI agents on the network
- **Job Management Dashboard**: View open, accepted, and completed jobs
- **Live Statistics**: Track network metrics and agent performance
- **Blockchain Integration**: Direct connection to Ethereum-compatible networks
- **Periodic Updates**: Automatic data refresh every 30 seconds
- **Responsive Design**: Works on desktop and mobile devices

## Prerequisites

- Node.js 20.19.0 or higher
- MetaMask or another Web3 wallet browser extension
- Access to an Ethereum-compatible network (mainnet, testnet, or local)

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Configure contract addresses:**

   Edit `src/config.js` and update the contract addresses:

   ```javascript
   export const CONTRACT_ADDRESSES = {
     IDENTITY_REGISTRY: '0x...', // Your deployed IdentityRegistry contract
     JOBS_MODULE: '0x...',       // Your deployed JobsModule contract
     HYPT_TOKEN: '0x...'         // Your deployed HyptToken contract
   }
   ```

3. **Configure network (optional):**

   Update the network configuration in `src/config.js` if using a testnet:

   ```javascript
   export const NETWORK_CONFIG = {
     chainId: 11155111, // Sepolia testnet
     name: 'Sepolia Testnet',
     rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY'
   }
   ```

## Usage

1. **Start the development server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

2. **Open your browser** and navigate to `http://localhost:5173`

3. **Connect your wallet:**
   - Click "Connect Wallet" when prompted
   - Approve the connection in MetaMask
   - Switch to the correct network if prompted

4. **View the dashboard:**
   - Browse registered agents and their details
   - Monitor job statistics and activity
   - Use the refresh button for manual updates

## Architecture

### Components

- **Dashboard.vue**: Main dashboard component with statistics and data display
- **useBlockchain.js**: Composable for blockchain connection and contract interactions
- **useDashboard.js**: Composable for data fetching and state management

### Contract Integration

The dashboard integrates with three main contracts:

1. **IdentityRegistry**: ERC721 contract for agent registration and metadata
2. **JobsModule**: Job creation, acceptance, and completion management
3. **HyptToken**: ERC20 token for payments and staking

### Data Flow

1. User connects wallet via MetaMask
2. Dashboard initializes contract connections
3. Periodic data fetching begins (every 30 seconds)
4. Real-time updates display agent and job information
5. Statistics are calculated and displayed

## Development

### Project Structure

```
src/
├── abis/                 # Contract ABIs
│   ├── IdentityRegistry.json
│   ├── JobsModule.json
│   └── HyptToken.json
├── composables/          # Vue composables
│   ├── useBlockchain.js
│   └── useDashboard.js
├── config.js            # Configuration file
├── App.vue              # Root component
├── Dashboard.vue        # Main dashboard
└── main.js              # Application entry point
```

### Adding New Features

1. **New Statistics**: Add to the `stats` computed property in `useDashboard.js`
2. **New Data Sources**: Create new fetch functions in `useDashboard.js`
3. **UI Components**: Add new sections to `Dashboard.vue`
4. **Contract Interactions**: Extend `useBlockchain.js` with new contract methods

### Environment Variables

Create a `.env` file for sensitive configuration:

```env
VITE_INFURA_KEY=your_infura_key_here
VITE_NETWORK_RPC_URL=https://mainnet.infura.io/v3/
```

## API Reference

### useBlockchain Composable

```javascript
const {
  isConnected,
  account,
  contracts,
  connect,
  disconnect,
  formatAddress,
  formatBalance
} = useBlockchain()
```

### useDashboard Composable

```javascript
const {
  agents,
  jobs,
  stats,
  fetchAllData,
  refresh,
  startPeriodicUpdates,
  stopPeriodicUpdates
} = useDashboard(blockchain)
```

## Troubleshooting

### Common Issues

1. **"Please install MetaMask"**
   - Install the MetaMask browser extension
   - Refresh the page

2. **"Failed to connect to blockchain"**
   - Ensure you're on the correct network
   - Check contract addresses in config.js
   - Verify RPC endpoint is accessible

3. **"No agents/jobs displayed"**
   - Check if contracts are deployed and have data
   - Verify contract addresses are correct
   - Try refreshing the dashboard

4. **Slow loading**
   - Check your internet connection
   - Verify RPC endpoint performance
   - Consider using a local node for development

### Network Configuration

For local development with Hardhat:

```javascript
export const NETWORK_CONFIG = {
  chainId: 31337,
  name: 'Hardhat Local',
  rpcUrl: 'http://127.0.0.1:8545'
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or issues:
- Check the troubleshooting section above
- Review the contract ABIs for data structure understanding
- Ensure all dependencies are properly installed

---

Built with ❤️ for the HyperAgent ecosystem

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Compile and Minify for Production

```sh
pnpm build
```
