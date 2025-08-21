# Care & Service Design Tokens

## Color System

### Primary Colors
```css
--primary-50: #f0fdfa;     /* Lightest teal */
--primary-100: #ccfbf1;    /* Very light teal */
--primary-200: #99f6e4;    /* Light teal */
--primary-300: #5eead4;    /* Medium light teal */
--primary-400: #2dd4bf;    /* Medium teal */
--primary-500: #2d8484;    /* Primary brand teal */
--primary-600: #0d9488;    /* Dark teal */
--primary-700: #0f766e;    /* Darker teal */
--primary-800: #115e59;    /* Very dark teal */
--primary-900: #134e4a;    /* Darkest teal */
```

### Semantic Colors
```css
/* Success */
--success-light: #dcfce7;
--success: #16a34a;
--success-dark: #15803d;

/* Warning */
--warning-light: #fef3c7;
--warning: #d97706;
--warning-dark: #92400e;

/* Error */
--error-light: #fee2e2;
--error: #dc2626;
--error-dark: #991b1b;

/* Info */
--info-light: #dbeafe;
--info: #2563eb;
--info-dark: #1d4ed8;
```

### Neutral Colors
```css
--white: #ffffff;
--gray-50: #f8fafc;
--gray-100: #f1f5f9;
--gray-200: #e2e8f0;
--gray-300: #cbd5e1;
--gray-400: #94a3b8;
--gray-500: #64748b;
--gray-600: #475569;
--gray-700: #334155;
--gray-800: #1e293b;
--gray-900: #0f172a;
--black: #000000;
```

## Typography

### Font Families
```css
--font-primary: 'Geist', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'Geist Mono', 'Fira Code', 'Monaco', monospace;
```

### Font Sizes
```css
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */
--text-5xl: 3rem;        /* 48px */
--text-6xl: 3.75rem;     /* 60px */
```

### Font Weights
```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
```

### Line Heights
```css
--leading-tight: 1.25;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose: 2;
```

## Spacing

### Scale
```css
--space-px: 1px;
--space-0: 0;
--space-1: 0.25rem;      /* 4px */
--space-2: 0.5rem;       /* 8px */
--space-3: 0.75rem;      /* 12px */
--space-4: 1rem;         /* 16px */
--space-5: 1.25rem;      /* 20px */
--space-6: 1.5rem;       /* 24px */
--space-8: 2rem;         /* 32px */
--space-10: 2.5rem;      /* 40px */
--space-12: 3rem;        /* 48px */
--space-16: 4rem;        /* 64px */
--space-20: 5rem;        /* 80px */
--space-24: 6rem;        /* 96px */
--space-32: 8rem;        /* 128px */
```

## Borders

### Border Radius
```css
--radius-none: 0;
--radius-sm: 0.125rem;    /* 2px */
--radius-md: 0.375rem;    /* 6px */
--radius-lg: 0.5rem;      /* 8px */
--radius-xl: 0.75rem;     /* 12px */
--radius-2xl: 1rem;       /* 16px */
--radius-full: 9999px;    /* Full round */
```

### Border Widths
```css
--border-0: 0;
--border-1: 1px;
--border-2: 2px;
--border-4: 4px;
--border-8: 8px;
```

## Shadows

### Box Shadows
```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
--shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
```

## Motion

### Transitions
```css
--transition-fast: 150ms ease-in-out;
--transition-base: 250ms ease-in-out;
--transition-slow: 350ms ease-in-out;
```

### Animations
```css
--animate-bounce: bounce 1s infinite;
--animate-pulse: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
--animate-spin: spin 1s linear infinite;
--animate-fade-in: fade-in 0.5s ease-in-out;
```

## Breakpoints

### Screen Sizes
```css
--screen-sm: 640px;       /* Small devices */
--screen-md: 768px;       /* Medium devices */
--screen-lg: 1024px;      /* Large devices */
--screen-xl: 1280px;      /* Extra large devices */
--screen-2xl: 1536px;     /* 2x Extra large devices */
```

## Component-Specific Tokens

### Buttons
```css
--button-height-sm: 2rem;      /* 32px */
--button-height-md: 2.5rem;    /* 40px */
--button-height-lg: 3rem;      /* 48px */
--button-padding-x: 1rem;      /* 16px */
--button-padding-y: 0.5rem;    /* 8px */
```

### Form Elements
```css
--input-height: 2.5rem;        /* 40px */
--input-padding-x: 0.75rem;    /* 12px */
--input-border-radius: var(--radius-md);
--input-border-color: var(--gray-300);
--input-focus-border: var(--primary-500);
```

### Cards
```css
--card-padding: 1.5rem;        /* 24px */
--card-radius: var(--radius-lg);
--card-shadow: var(--shadow-md);
--card-border: 1px solid var(--gray-200);
```

### Navigation
```css
--nav-height: 4rem;            /* 64px */
--nav-padding: 1rem;           /* 16px */
--nav-shadow: var(--shadow-sm);
```

## Usage Guidelines

### Color Usage
- Use primary colors for main actions and branding
- Use semantic colors consistently (success for positive actions, error for problems)
- Maintain 4.5:1 contrast ratio for accessibility
- Use neutral grays for text and backgrounds

### Typography Usage
- Primary font for all UI text
- Mono font only for code or technical content
- Scale font sizes proportionally
- Use consistent line heights for readability

### Spacing Usage
- Use consistent spacing scale throughout the design
- Maintain vertical rhythm with consistent spacing
- Use larger spacing for section breaks
- Smaller spacing for related elements
