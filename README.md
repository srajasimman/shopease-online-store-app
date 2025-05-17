# ShopEase - Online Store Application

A modern, full-featured e-commerce application built with React, TypeScript, and Tailwind CSS.

![ShopEase Screenshot](https://github.com/user-attachments/assets/81bdfc24-405f-49a9-99e0-9547deedb741)

## Features

- 🛍️ Product catalog with search, filter, and sort functionality
- 🛒 Shopping cart with real-time updates
- 💳 Checkout process with form validation
- 📊 Admin dashboard with sales analytics
- 📦 Product management system
- 📋 Order management and tracking
- 📱 Responsive design for all devices

## Tech Stack

- **Frontend Framework:** React 18 with TypeScript
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **Icons:** Lucide React
- **Charts:** Chart.js with React-Chartjs-2
- **Date Handling:** date-fns
- **Build Tool:** Vite

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/shopease.git
   cd shopease
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── admin/         # Admin-specific components
│   └── ui/            # Base UI components
├── context/           # React context providers
├── data/             # Mock data and constants
├── pages/            # Page components
│   └── admin/        # Admin pages
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Features in Detail

### Customer Features

- Browse products by category
- Search products
- Filter by price range
- Sort by various criteria
- Add products to cart
- Manage cart items
- Checkout process
- Order tracking

### Admin Features

- Sales dashboard with analytics
- Product management (CRUD operations)
- Order management
- Inventory tracking
- Sales metrics and charts

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Live Demo

Visit the live demo: [ShopEase Demo]([https://bright-valkyrie-52e686.netlify.app](https://srajasimman-shopease-online-store.netlify.app/))

## Acknowledgments

- Product images from [Pexels](https://www.pexels.com/)
- Icons from [Lucide](https://lucide.dev/)
