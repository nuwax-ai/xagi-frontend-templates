/** @type {import('tailwindcss').Config} */

// Tailwind default palette names
const defaultColors = [
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
];

// Custom palette extension
const customColors = ['primary'];

// Shade steps
const colorShades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

// Utility prefixes that take color tokens
const colorPrefixes = [
  'text',
  'bg',
  'border',
  'ring',
  'divide',
  'placeholder',
  'from',
  'via',
  'to',
  'stroke',
  'fill',
  'accent',
  'caret',
  'outline',
];

// Build safelist entries for color utilities
function generateColorSafelist() {
  const safelist = [];
  const allColors = [...defaultColors, ...customColors];

  // For each color-related prefix × palette name
  colorPrefixes.forEach(prefix => {
    allColors.forEach(color => {
      // Shade-specific classes (e.g. text-blue-500)
      colorShades.forEach(shade => {
        safelist.push(`${prefix}-${color}-${shade}`);
      });
      // Base color token without shade
      safelist.push(`${prefix}-${color}`);
    });
  });

  // Special keywords: white, black, transparent, current
  const specialColors = ['white', 'black', 'transparent', 'current'];
  colorPrefixes.forEach(prefix => {
    specialColors.forEach(color => {
      safelist.push(`${prefix}-${color}`);
    });
  });

  return safelist;
}

// Default Tailwind spacing scale
const spacingValues = [
  0,
  0.5,
  1,
  1.5,
  2,
  2.5,
  3,
  3.5,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  14,
  16,
  20,
  24,
  28,
  32,
  36,
  40,
  44,
  48,
  52,
  56,
  60,
  64,
  72,
  80,
  96,
  // Extra spacing keys used in this project
  18,
  88,
  // Keyword spacing tokens
  'px',
  'auto',
  'full',
  'screen',
];

// Padding / margin utility prefixes
const spacingPrefixes = {
  padding: ['p', 'px', 'py', 'pt', 'pr', 'pb', 'pl'],
  margin: ['m', 'mx', 'my', 'mt', 'mr', 'mb', 'ml'],
};

// Safelist spacing utilities
function generateSpacingSafelist() {
  const safelist = [];
  const allPrefixes = [...spacingPrefixes.padding, ...spacingPrefixes.margin];

  // For each prefix × spacing value
  allPrefixes.forEach(prefix => {
    spacingValues.forEach(value => {
      // Numeric spacing (p-3, m-4, fractional keys, …)
      if (typeof value === 'number') {
        // Numeric keys; Tailwind normalizes fractional classes
        safelist.push(`${prefix}-${value}`);
      } else {
        // Keyword spacing (px, auto, full, screen)
        safelist.push(`${prefix}-${value}`);
      }
    });
  });

  return safelist;
}

// Default border-width scale
const borderWidthValues = [0, 1, 2, 4, 8];

// Border-width utility prefixes
const borderWidthPrefixes = [
  'border',
  'border-t',
  'border-r',
  'border-b',
  'border-l',
  'border-x',
  'border-y',
];

// Safelist border-width utilities
function generateBorderWidthSafelist() {
  const safelist = [];

  // For each prefix × width value
  borderWidthPrefixes.forEach(prefix => {
    borderWidthValues.forEach(value => {
      // e.g. border-0, border-2, border-4, border-8
      safelist.push(`${prefix}-${value}`);
    });
  });

  // Plain `border` (default 1px)
  safelist.push('border');

  return safelist;
}

// Default border-style keywords
const borderStyleValues = [
  'solid',
  'dashed',
  'dotted',
  'double',
  'hidden',
  'none',
];

// Safelist border-style utilities
function generateBorderStyleSafelist() {
  const safelist = [];

  // border-solid, border-dashed, …
  borderStyleValues.forEach(style => {
    safelist.push(`border-${style}`);
  });

  return safelist;
}

// Default font-weight tokens
const fontWeightValues = [
  'thin', // 100
  'extralight', // 200
  'light', // 300
  'normal', // 400
  'medium', // 500
  'semibold', // 600
  'bold', // 700
  'extrabold', // 800
  'black', // 900
];

// Safelist font-weight utilities
function generateFontWeightSafelist() {
  const safelist = [];

  // font-thin, font-light, font-bold, …
  fontWeightValues.forEach(weight => {
    safelist.push(`font-${weight}`);
  });

  return safelist;
}

// Default text-size keys
// Matches Tailwind docs: xs … 9xl
const fontSizeValues = [
  'xs',
  'sm',
  'base',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
  '6xl',
  '7xl',
  '8xl',
  '9xl',
];

// Safelist text-* size utilities
function generateFontSizeSafelist() {
  const safelist = [];

  // text-sm, text-base, text-lg, …
  fontSizeValues.forEach(size => {
    safelist.push(`text-${size}`);
  });

  return safelist;
}

// Default line-height keys
// Matches Tailwind: none … loose, numeric 3–10
const lineHeightValues = [
  'none',
  'tight',
  'snug',
  'normal',
  'relaxed',
  'loose',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
];

// Safelist leading-* utilities
function generateLineHeightSafelist() {
  const safelist = [];

  // leading-none, leading-tight, leading-5, …
  lineHeightValues.forEach(value => {
    safelist.push(`leading-${value}`);
  });

  return safelist;
}

// Default letter-spacing tokens
// Matches Tailwind tracking scale
const letterSpacingValues = [
  'tighter',
  'tight',
  'normal',
  'wide',
  'wider',
  'widest',
];

// Safelist tracking-* utilities
function generateLetterSpacingSafelist() {
  const safelist = [];

  // tracking-tighter, tracking-wide, …
  letterSpacingValues.forEach(value => {
    safelist.push(`tracking-${value}`);
  });

  return safelist;
}

// Default text-align keywords
// Matches Tailwind text-* alignment
const textAlignValues = ['left', 'center', 'right', 'justify', 'start', 'end'];

// Safelist text-align utilities (text-left, …)
function generateTextAlignSafelist() {
  const safelist = [];

  // Note: shares `text-` prefix with font sizes in safelist
  textAlignValues.forEach(value => {
    safelist.push(`text-${value}`);
  });

  return safelist;
}

// Default opacity percentage steps
// Matches Tailwind opacity scale
const opacityValues = [
  0, 5, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 95, 100,
];

// Safelist opacity-* utilities
function generateOpacitySafelist() {
  const safelist = [];

  // opacity-0, opacity-50, opacity-100, …
  opacityValues.forEach(value => {
    safelist.push(`opacity-${value}`);
  });

  return safelist;
}

// Default border-radius keys
// Matches Tailwind rounded-* scale
const borderRadiusValues = [
  'none',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
  'full',
];

// rounded-* utility prefixes
const borderRadiusPrefixes = [
  'rounded',
  'rounded-t',
  'rounded-r',
  'rounded-b',
  'rounded-l',
  'rounded-tl',
  'rounded-tr',
  'rounded-bl',
  'rounded-br',
];

// Safelist rounded utilities
function generateBorderRadiusSafelist() {
  const safelist = [];

  // For each rounded prefix × radius token
  borderRadiusPrefixes.forEach(prefix => {
    borderRadiusValues.forEach(value => {
      // rounded-md, rounded-lg, rounded-tl-sm, …
      safelist.push(`${prefix}-${value}`);
    });
  });

  return safelist;
}

// Default box-shadow tokens
// Matches Tailwind shadow-* scale
const shadowValues = ['sm', 'md', 'lg', 'xl', '2xl', 'inner', 'none'];

// Safelist shadow-* utilities
function generateShadowSafelist() {
  const safelist = [];

  // shadow-sm, shadow-md, shadow-lg, …
  shadowValues.forEach(value => {
    safelist.push(`shadow-${value}`);
  });

  return safelist;
}

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // Merge every generated utility into safelist so dynamic class names are not purged
  safelist: [
    ...generateColorSafelist(),
    ...generateSpacingSafelist(),
    ...generateBorderWidthSafelist(),
    ...generateBorderStyleSafelist(),
    ...generateFontWeightSafelist(),
    ...generateFontSizeSafelist(),
    ...generateLineHeightSafelist(),
    ...generateLetterSpacingSafelist(),
    ...generateTextAlignSafelist(),
    ...generateOpacitySafelist(),
    ...generateBorderRadiusSafelist(),
    ...generateShadowSafelist(),
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-balance': {
          'text-wrap': 'balance',
        },
      };
      addUtilities(newUtilities);
    },
  ],
  darkMode: 'class',
};
