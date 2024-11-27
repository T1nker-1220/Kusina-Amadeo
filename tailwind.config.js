/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/contexts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ["class"],
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: {
          DEFAULT: "hsl(var(--background))",
          foreground: "hsl(var(--foreground))",
          light: '#FFF9F5',
          dark: '#1A1614',
        },
        brand: {
          50: '#FFF3E0',
          100: '#FFE0B2',
          200: '#FFCC80',
          300: '#FFB74D',
          400: '#FFA726',
          DEFAULT: '#FF8C42',
          500: '#FF8C42',
          600: '#E67A3B',
          700: '#D35F3C',
          800: '#4A3831',
          900: '#1A1614',
          hover: '#E67A3B',
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: '#F8F7F4',
          100: '#F1EFE9',
          200: '#E3DFD3',
          300: '#D5CFBD',
          400: '#C7BFA7',
          500: '#8B7355',
          600: '#6D5A43',
          700: '#4F4131',
          800: '#31281F',
          900: '#1F1A15',
          950: '#0F0D0A',
          hover: '#6D5A43',
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          50: '#FDFAF6',
          100: '#FAF5ED',
          200: '#F5EBDB',
          300: '#F0E1C9',
          400: '#EBD7B7',
          500: '#D4B996',
          600: '#A99178',
          700: '#7E6D5A',
          800: '#53483C',
          900: '#29241E',
          950: '#14120F',
          hover: '#A99178',
        },
        accent: {
          50: '#F6F8F9',
          100: '#EDF1F3',
          200: '#DBE3E7',
          300: '#C9D5DB',
          400: '#B7C7CF',
          DEFAULT: '#435B66',
          500: '#435B66',
          600: '#354952',
          700: '#27373D',
          800: '#1A2429',
          900: '#0D1214',
          950: '#06090A',
          hover: '#354952',
        },
        status: {
          success: '#2D936C',
          warning: '#FFB088',
          error: '#D35F3C',
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        foreground: "hsl(var(--foreground))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(to bottom right, #1A1614, #2C2320, #4A3831)',
        'gradient-accent': 'linear-gradient(45deg, #FF8C42, #D35F3C)',
        'gradient-warm': 'linear-gradient(to right, #FFF9F5, #F9EBE0)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.16' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        'gradient-x': 'gradient-x 5s ease infinite',
        'gradient-y': 'gradient-y 5s ease infinite',
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        'gradient-y': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'center top'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'center center'
          }
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      gradientColorStops: theme => ({
        ...theme('colors'),
        'dark-start': '#1A1614',
        'dark-mid': '#2C2320',
        'dark-end': '#4A3831',
        'accent-start': '#FF8C42',
        'accent-end': '#D35F3C',
      }),
    },
  },
  plugins: [require("tailwindcss-animate")],
}
