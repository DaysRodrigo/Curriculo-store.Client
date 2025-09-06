import { Award, Briefcase, BookOpen, Code } from "lucide-react"

export const TipoProduto = [
    { id: 0, name: 'Courses', icon: Award, color: 'bg-purple-500' },
    { id: 1, name: 'Experience', icon: Briefcase, color: 'bg-green-500'},
    { id: 2, name: 'Academic', icon: BookOpen, color: 'bg-blue-500'},
    { id: 3, name: 'Others', icon: Code, color: 'bg-orange-500'}
 ] as const;

export type TipoProduto = typeof TipoProduto[number];