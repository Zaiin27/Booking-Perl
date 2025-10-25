# Meal Cheap - Affordable Meal Delivery Service

A modern, responsive web application for affordable meal delivery services built with React, Vite, and Tailwind CSS.

## 🎨 Design System

### Colors

- **Primary**: #ffffff (White)
- **Secondary**: #000000 (Black)
- **Gradient**: Linear gradient from #9945FF to #14F195

### Typography

- **Headings**: Inter font family
- **Body Text**: Poppins font family
- **Buttons**: Outfit font family

## 🚀 Features

- **Modern Landing Page**: Beautiful, responsive landing page with gradient accents
- **Authentication System**: Complete login/signup system with role-based access control
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Component Library**: Reusable UI components for consistent design
- **Dashboard Layouts**: Role-specific dashboard layouts for different user types

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Redux Toolkit with Redux Persist
- **Routing**: React Router DOM
- **UI Components**: Custom component library with Radix UI primitives
- **Forms**: Formik + Yup validation
- **Charts**: Chart.js + React Chart.js 2
- **Icons**: Lucide React + React Icons

## 📱 User Roles

- **Admin**: System administrators with full access
- **Staff**: Staff members managing their operations
- **User**: Customers with limited access

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd meal-cheap
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── global/             # Layout components and global structure
├── pages/              # Page components
├── services/           # API services and endpoints
├── store/              # Redux store configuration
├── styles/             # Global styles and CSS
├── utils/              # Utility functions and helpers
└── router.jsx          # Application routing
```

## 🎯 Key Components

- **Landing Page**: Modern marketing page with gradient design
- **Authentication**: Login, signup, and password management
- **Dashboard Layouts**: Role-specific dashboard structures
- **Reusable Components**: Button, Input, Modal, Table, and more
- **Responsive Navigation**: Mobile-friendly sidebar and header

## 🔧 Customization

### Adding New Colors

Update `tailwind.config.js` to add new color variants:

```javascript
colors: {
  custom: {
    DEFAULT: '#your-color',
    '50': 'rgba(your-color, 0.05)',
    // ... more variants
  }
}
```

### Adding New Fonts

Import fonts in `src/index.css` and add to Tailwind config:

```javascript
fontFamily: {
  custom: ["Custom Font", "sans-serif"],
}
```

## 📱 Responsive Design

The application is built with a mobile-first approach using Tailwind CSS breakpoints:

- `sm`: 640px and up
- `md`: 768px and up
- `lg`: 1024px and up
- `xl`: 1280px and up
- `2xl`: 1536px and up

## 🚀 Deployment

### Production Deployment (Recommended)

The application is configured for production deployment using Docker with nginx to serve static files.

#### Using Docker Compose (Production)

```bash
# Build and run the production version
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

#### Using Docker directly

```bash
# Build the production image
docker build -t meal-cheap .

# Run the container
docker run -p 80:80 meal-cheap
```

### Development Deployment

For local development with hot reloading:

```bash
# Using Docker Compose for development
docker-compose -f docker-compose.dev.yml up --build

# Or using Docker directly
docker build -f Dockerfile.dev -t meal-cheap-dev .
docker run -p 5181:5181 meal-cheap-dev
```

### Manual Deployment

1. Build the application:

```bash
npm run build
```

2. Serve the built files using a static server:

```bash
npm run preview
```

### Vercel/Netlify

The project is configured for easy deployment on Vercel or Netlify with the build command `npm run build`.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository or contact the development team.

---

**Meal Cheap** - Making healthy eating affordable and accessible for everyone. 🍽️✨
# Booking-Perl
