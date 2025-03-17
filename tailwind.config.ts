
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Wishlist custom colors
				wishlist: {
					primary: '#8B5CF6',    // Main purple
					secondary: '#D946EF',  // Magenta accent
					accent: '#F97316',     // Orange accent
					green: '#10B981',      // Success green
					blue: '#0EA5E9',       // Info blue
					gray: '#9CA3AF',       // Neutral gray
					light: '#F1F0FB',      // Light purple bg
					dark: '#1A1F2C',       // Dark blue-gray
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'pulse-subtle': {
					'0%, 100%': {
						opacity: '1',
						transform: 'scale(1)'
					},
					'50%': {
						opacity: '0.95',
						transform: 'scale(1.02)'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0)'
					},
					'50%': {
						transform: 'translateY(-5px)'
					}
				},
				'scale-in': {
					'0%': {
						transform: 'scale(0.95)',
						opacity: '0'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				},
				'slide-up': {
					'0%': {
						transform: 'translateY(10px)',
						opacity: '0'
					},
					'100%': {
						transform: 'translateY(0)',
						opacity: '1'
					}
				},
				'progress-fill': {
					'0%': { width: '0%' },
					'100%': { width: 'var(--progress-width)' }
				},
				'confetti-1': {
					'0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
					'100%': { transform: 'translateY(600px) rotate(360deg)', opacity: '0' }
				},
				'confetti-2': {
					'0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
					'100%': { transform: 'translateY(600px) rotate(-360deg)', opacity: '0' }
				},
				'confetti-3': {
					'0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
					'100%': { transform: 'translateY(600px) rotate(180deg)', opacity: '0' }
				},
				'pulse-celebration': {
					'0%, 100%': { opacity: '0.2' },
					'50%': { opacity: '0.5' }
				},
				'scale-celebration': {
					'0%': { transform: 'translate(-50%, -50%) scale(0.8)', opacity: '0' },
					'50%': { transform: 'translate(-50%, -50%) scale(1.2)', opacity: '1' },
					'100%': { transform: 'translate(-50%, -50%) scale(1)', opacity: '1' }
				},
				'wiggle': {
					'0%, 100%': { transform: 'rotate(-3deg)' },
					'50%': { transform: 'rotate(3deg)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-subtle': 'pulse-subtle 3s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite',
				'scale-in': 'scale-in 0.2s ease-out',
				'slide-up': 'slide-up 0.3s ease-out',
				'progress-fill': 'progress-fill 1.5s ease-out forwards',
				'confetti-1': 'confetti-1 3s ease-out forwards',
				'confetti-2': 'confetti-2 2.5s ease-out forwards',
				'confetti-3': 'confetti-3 3.5s ease-out forwards',
				'pulse-celebration': 'pulse-celebration 2s ease-in-out infinite',
				'scale-celebration': 'scale-celebration 0.8s ease-out forwards',
				'wiggle': 'wiggle 0.5s ease-in-out infinite'
			},
			backgroundImage: {
				'gradient-primary': 'linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)',
				'gradient-secondary': 'linear-gradient(135deg, #F97316 0%, #FBBF24 100%)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
