import { createContext, useContext, useEffect, useState } from 'react';

type ThemeVariant = 'vibrant' | 'warm' | 'minimal' | 'light' | 'dark';

interface ThemeContextType {
    theme: ThemeVariant;
    setTheme: (theme: ThemeVariant) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeVariables = {
    vibrant: {
        '--primary': '262 83% 58%',
        '--primary-foreground': '210 20% 98%',
        '--secondary': '220 14.3% 95.9%',
        '--secondary-foreground': '220.9 39.3% 11%',
        '--accent': '213 93% 67%',
        '--accent-foreground': '210 20% 98%',
        '--hero-gradient': 'linear-gradient(135deg, hsl(262 83% 58%) 0%, hsl(213 93% 67%) 100%)',
        '--card-hover': '262 83% 95%',
        '--success': '142 76% 36%',
        '--warning': '38 92% 50%',
        '--info': '213 93% 67%'
    },
    warm: {
        '--primary':'24 100% 58%' ,
        '--primary-foreground': '210 20% 98%',
        '--secondary': '45 93% 95%',
        '--secondary-foreground': '24 45% 11%',
        '--accent': '142 76% 36%',
        '--accent-foreground': '210 20% 98%',
        '--hero-gradient': 'linear-gradient(135deg, hsl(24 100% 58%) 0%, hsl(142 76% 36%) 100%)',
        '--card-hover': '24 100% 95%',
        '--success': '142 76% 36%',
        '--warning': '38 92% 50%',
        '--info': '200 100% 56%'
    },
    minimal: {
        '--primary': '210 100% 56%',
        '--primary-foreground': '210 20% 98%',
        '--secondary': '210 40% 96%',
        '--secondary-foreground': '210 10 23%',
        '--accent': '200 18% 46%',
        '--accent-foreground': '210 20% 98%',
        '--hero-gradient': 'linear-gradient(135deg, hsl(210 100% 56%) 0%, hsl(200 18% 46%) 100%)',
        '--card-hover': '210 100% 95%',
        '--success': '142 76% 36%',
        '--warning': '38 92% 50%',
        '--info': '210 100% 56%' 
    },
    light: {}, dark: {}
};

export function CustomThemeProvider({ children }: { children: React.ReactNode}) {
    const [ theme, setTheme ] = useState<ThemeVariant>('vibrant');

    useEffect(() => {
        const root = document.documentElement;
        const variables = themeVariables[theme];

        Object.entries(variables).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });
        // const root = document.documentElement;
    
        // if (theme === 'light' || theme === 'dark') {
        //     root.classList.remove('light', 'dark');
        //     root.classList.add(theme);
        // } else {
        //     const variables = themeVariables[theme];
        //     Object.entries(variables).forEach(([property, value]) => {
        //         root.style.setProperty(property, value);
        //     });
        // }
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useThemne must be used within a ThemeProvider');
    return context;
}