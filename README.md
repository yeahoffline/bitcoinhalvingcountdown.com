# Bitcoin Halving Countdown

A beautiful, real-time Bitcoin halving countdown website built with Vite, Tailwind CSS, and Alpine.js.

![Bitcoin Halving Countdown](https://img.shields.io/badge/Bitcoin-Halving-F7931A?style=for-the-badge&logo=bitcoin&logoColor=white)

## Features

- 🕐 **Real-time Countdown** - Live countdown to the next Bitcoin halving
- 📊 **Live Block Data** - Fetches current block height from mempool.space API
- 🔄 **Fully Automatic** - Automatically calculates each halving based on Bitcoin's immutable protocol rules
- 🎨 **Beautiful UI** - Stunning dark theme with Bitcoin orange accents
- 📱 **Responsive** - Works perfectly on mobile, tablet, and desktop
- ⚡ **Fast** - Built with Vite for lightning-fast builds
- 🌐 **Static** - Builds to static files for easy deployment anywhere

## How It Works

The countdown automatically calculates the next halving based on Bitcoin's protocol:

- **Halving interval**: Every 210,000 blocks
- **Block reward**: Started at 50 BTC, halves each epoch
- **Estimated date**: Based on ~10 minute average block time

No configuration needed - the code will correctly countdown to every future halving automatically.

## Tech Stack

- **Vite** - Next generation frontend tooling
- **Tailwind CSS v4** - Utility-first CSS framework
- **Alpine.js** - Lightweight JavaScript framework

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

After running `npm run build`, the `dist/` folder contains all static files ready for deployment:

```
dist/
├── index.html
└── assets/
    ├── index-[hash].css
    └── index-[hash].js
```

Simply copy the contents of `dist/` to your web hosting.

## License

MIT License - See [LICENSE.md](LICENSE.md)
