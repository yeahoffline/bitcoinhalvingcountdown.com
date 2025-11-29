import './style.css'
import Alpine from 'alpinejs'

// Bitcoin halving constants - these are protocol-defined and immutable
const BLOCKS_PER_HALVING = 210000
const AVERAGE_BLOCK_TIME_MS = 10 * 60 * 1000 // 10 minutes in milliseconds
const INITIAL_BLOCK_REWARD = 50 // Initial reward was 50 BTC

Alpine.data('bitcoinHalving', () => ({
  currentBlock: 0,
  blocksRemaining: 0,
  targetDate: null,
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  progressPercent: 0,
  currentReward: 0,
  nextReward: 0,
  halvingNumber: 0,
  nextHalvingBlock: 0,
  loading: true,
  
  init() {
    this.estimateCurrentBlock()
    this.startCountdown()
    
    // Update countdown every second
    setInterval(() => {
      this.updateCountdown()
    }, 1000)
    
    // Refresh block data every 2 minutes
    setInterval(() => {
      this.fetchCurrentBlock()
    }, 2 * 60 * 1000)
    
    // Try to fetch real block data
    this.fetchCurrentBlock()
  },
  
  // Calculate halving info based on any block height
  calculateHalvingInfo(blockHeight) {
    // Which epoch are we in? (0 = blocks 0-209999, 1 = blocks 210000-419999, etc.)
    const currentEpoch = Math.floor(blockHeight / BLOCKS_PER_HALVING)
    
    // Next halving occurs at the start of the next epoch
    this.nextHalvingBlock = (currentEpoch + 1) * BLOCKS_PER_HALVING
    
    // Halving number (1st halving was at block 210000, end of epoch 0)
    this.halvingNumber = currentEpoch + 1
    
    // Block rewards: 50 -> 25 -> 12.5 -> 6.25 -> 3.125 -> 1.5625 -> ...
    this.currentReward = INITIAL_BLOCK_REWARD / Math.pow(2, currentEpoch)
    this.nextReward = INITIAL_BLOCK_REWARD / Math.pow(2, currentEpoch + 1)
    
    // Blocks remaining until next halving
    this.blocksRemaining = this.nextHalvingBlock - blockHeight
    
    // Progress through current epoch (0-100%)
    const blocksIntoEpoch = blockHeight % BLOCKS_PER_HALVING
    this.progressPercent = (blocksIntoEpoch / BLOCKS_PER_HALVING) * 100
    
    // Calculate target date
    this.calculateTargetDate()
  },
  
  async fetchCurrentBlock() {
    try {
      const response = await fetch('https://mempool.space/api/blocks/tip/height')
      if (response.ok) {
        const height = await response.json()
        this.currentBlock = height
        this.calculateHalvingInfo(height)
      }
    } catch (error) {
      console.log('Using estimated block height:', error.message)
    }
    this.loading = false
  },
  
  estimateCurrentBlock() {
    // Genesis block was January 3, 2009
    const genesisDate = new Date('2009-01-03T18:15:05Z')
    const now = new Date()
    const msElapsed = now - genesisDate
    
    // Estimate block height based on average 10 minute blocks
    const estimatedBlock = Math.floor(msElapsed / AVERAGE_BLOCK_TIME_MS)
    
    this.currentBlock = estimatedBlock
    this.calculateHalvingInfo(estimatedBlock)
  },
  
  calculateTargetDate() {
    const msRemaining = this.blocksRemaining * AVERAGE_BLOCK_TIME_MS
    this.targetDate = new Date(Date.now() + msRemaining)
  },
  
  startCountdown() {
    this.updateCountdown()
  },
  
  updateCountdown() {
    if (!this.targetDate) return
    
    const now = new Date()
    const diff = this.targetDate - now
    
    if (diff <= 0) {
      // Halving happened! Recalculate
      this.days = 0
      this.hours = 0
      this.minutes = 0
      this.seconds = 0
      this.fetchCurrentBlock()
      return
    }
    
    this.days = Math.floor(diff / (1000 * 60 * 60 * 24))
    this.hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    this.minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    this.seconds = Math.floor((diff % (1000 * 60)) / 1000)
  },
  
  formatNumber(num) {
    return num.toLocaleString()
  },
  
  formatReward(reward) {
    // Format reward nicely (avoid floating point ugliness)
    if (reward >= 1) {
      return reward % 1 === 0 ? reward.toString() : reward.toFixed(3).replace(/\.?0+$/, '')
    }
    return reward.toFixed(8).replace(/\.?0+$/, '')
  },
  
  formatDate(date) {
    if (!date) return ''
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  },
  
  padZero(num, minDigits = 2) {
    return String(num).padStart(minDigits, '0')
  },
  
  getOrdinalSuffix(n) {
    const s = ['th', 'st', 'nd', 'rd']
    const v = n % 100
    return s[(v - 20) % 10] || s[v] || s[0]
  }
}))

Alpine.start()

window.Alpine = Alpine
