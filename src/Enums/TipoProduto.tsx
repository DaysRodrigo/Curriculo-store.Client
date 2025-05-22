export const TipoProduto = {
    Curso: 0,
    Experiência: 1,
    Acadêmico: 2,
    Outro: 3
} as const;

export type TipoProduto = typeof TipoProduto[keyof typeof TipoProduto];