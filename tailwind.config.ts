import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'mc-bg-base': 'var(--mc-bg-base)',
        'mc-bg-surface': 'var(--mc-bg-surface)',
        'mc-bg-subtle': 'var(--mc-bg-subtle)',
        'mc-accent': 'var(--mc-accent)',
        'mc-accent-light': 'var(--mc-accent-light)',
        'mc-income': 'var(--mc-income)',
        'mc-expense': 'var(--mc-expense)',
        'mc-warning': 'var(--mc-warning)',
        'mc-text-1': 'var(--mc-text-1)',
        'mc-text-2': 'var(--mc-text-2)',
        'mc-text-3': 'var(--mc-text-3)',
        'mc-border': 'var(--mc-border)',
        'mc-success': 'var(--mc-success)',
        'mc-error': 'var(--mc-error)',
        'mc-info': 'var(--mc-info)',
      },
      borderRadius: {
        'mc-sm': 'var(--mc-radius-sm)',
        'mc-md': 'var(--mc-radius-md)',
        'mc-lg': 'var(--mc-radius-lg)',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
