/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"], // Enables dark mode with a class strategy
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      container: {
        padding: '5%'
      },
      colors: {
        // Booking.com color scheme
        primary: {
          DEFAULT: '#003580', // Booking.com blue
          '50': '#E6F0FF',
          '100': '#CCE1FF',
          '200': '#99C3FF',
          '300': '#66A5FF',
          '400': '#3387FF',
          '500': '#003580',
          '600': '#002A66',
          '700': '#001F4D',
          '800': '#001533',
          '900': '#000A1A',
        },
        secondary: {
          DEFAULT: '#000000',
          '50': 'rgba(0, 0, 0, 0.05)',
          '100': 'rgba(0, 0, 0, 0.1)',
          '200': 'rgba(0, 0, 0, 0.2)',
          '300': 'rgba(0, 0, 0, 0.3)',
          '400': 'rgba(0, 0, 0, 0.4)',
          '500': 'rgba(0, 0, 0, 0.5)',
          '600': 'rgba(0, 0, 0, 0.6)',
          '700': 'rgba(0, 0, 0, 0.7)',
          '800': 'rgba(0, 0, 0, 0.8)',
          '900': 'rgba(0, 0, 0, 0.9)',
        },
        booking: {
          blue: '#003580',
          'blue-light': '#006CE4',
          'blue-dark': '#002A66',
          white: '#FFFFFF',
          black: '#000000',
          'gray-light': '#F5F5F5',
          'gray-medium': '#E5E5E5',
          'gray-dark': '#666666',
        },
        gradient: {
          start: '#003580',
          end: '#006CE4',
        },
        gray: {
          DEFAULT: '#555555',
          '50': 'rgba(85, 85, 85, 0.05)',
          '100': 'rgba(85, 85, 85, 0.1)',
          '200': 'rgba(85, 85, 85, 0.2)',
          '300': 'rgba(85, 85, 85, 0.3)',
          '400': 'rgba(85, 85, 85, 0.4)',
          '500': 'rgba(85, 85, 85, 0.5)',
          '600': 'rgba(85, 85, 85, 0.6)',
          '700': 'rgba(85, 85, 85, 0.7)',
          '800': 'rgba(85, 85, 85, 0.8)',
          '900': 'rgba(85, 85, 85, 0.9)',
        },
        red: {
          DEFAULT: '#FF0F0F',
          '50': 'rgba(255, 15, 15, 0.05)',
          '100': 'rgba(255, 15, 15, 0.1)',
          '200': 'rgba(255, 15, 15, 0.2)',
          '300': 'rgba(255, 15, 15, 0.3)',
          '400': 'rgba(255, 15, 15, 0.4)',
          '500': '#FF0F0F',
          '600': 'rgba(255, 15, 15, 0.6)',
          '700': 'rgba(255, 15, 15, 0.7)',
          '800': 'rgba(255, 15, 15, 0.8)',
          '900': 'rgba(255, 15, 15, 0.9)',
        },
        green: {
          DEFAULT: '#29A91D',
          '50': 'rgba(41, 169, 29, 0.05)',
          '100': 'rgba(41, 169, 29, 0.1)',
          '200': 'rgba(41, 169, 29, 0.2)',
          '300': 'rgba(41, 169, 29, 0.3)',
          '400': 'rgba(41, 169, 29, 0.4)',
          '500': 'rgba(41, 169, 29, 0.5)',
          '600': 'rgba(41, 169, 29, 0.6)',
          '700': 'rgba(41, 169, 29, 0.7)',
          '800': 'rgba(41, 169, 29, 0.8)',
          '900': 'rgba(41, 169, 29, 0.9)',
        },
        primarydashboard: {
          '50': '#f8f9fb',
          '100': '#f1f3f6',
          '200': '#dfe3ea',
          '300': '#c2cad7',
          '400': '#9fabb9',
          '500': '#82919f',
          '600': '#6b7a87',
          '700': '#596771',
          '800': '#4c565f',
          '900': '#414950',
          'DEFAULT': '#121B36',
        },
        icons: '#414651'
      },
      spacing: {
        64: "16rem",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        outfit: ["Outfit", "sans-serif"],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(90deg, #003580 0%, #006CE4 100%)',
      },
    },
  },

  plugins: [require("tailwindcss-animate"), require("@tailwindcss/forms")],

};
