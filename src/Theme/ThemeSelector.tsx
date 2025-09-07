import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { Sparkles, Flame, Snowflake } from "lucide-react";


type SelectorTheme = 'vibrant' | 'warm' | 'minimal';

const themes = {
    vibrant: {
        name: "Vibrante Azul/Roxo",
        description: "Desing moderno com gradientes vibrantes",
        preview: "Roxo vibrante + Azul elétrico",
        colors: ["hsl(262 83% 58%)", "hsl(213 93% 67%)", "hsl(220 14.3% 95.9%)"],
        icon: Sparkles
    },
    warm: {
        name: "Tons Quentes",
        description: "Cores quentes e aconchegantes",
        preview: "Laranja + Verde natural",
        colors: ["hsl(24 100% 58%)", "hsl(142 76% 36%)", "hsl(45 93% 95%)"],
        icon: Flame
    },
    minimal: {
        name: "Minimalista Frio",
        description: "Design limpo com tons azul-acinzentados",
        preview: "Azul profissional + Cinza suave",
        colors: ["hsl(210 100% 56%)", "hsl(200 18% 46%)", "hsl(210 40% 96%)"],
        icon: Snowflake
    }
} as const;

export function ThemeSelector () {
    const { theme, setTheme } = useTheme();

    return (
        <div className="hidden md:flex items-center gap-6">
            {Object.entries(themes).map(([key, themeConfig]) => (
                <Button
                    key={key}
                    size="icon"
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2
                        ${theme === key ? 'border-primary shadow-lg' : 'border-border hover:border-primary/50'}`}
                        onClick={() => setTheme(key as SelectorTheme)}
                              style={{
                                borderColor: themeConfig.colors[2], backgroundColor: themeConfig.colors[0]
                            }}
                    >
                    <themeConfig.icon className="h-4 w-4" />
                </Button>
            ))}
        </div>
    );
}