import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        dracula: {
          fundo: '#282A36',
          cinza: '#44475A',
          texto: '#F8F8F2',
          azul: '#6272A4',
          ciano: '#8BE9FD',
          verde: '#50FA7B',
          laranja: '#FFB86C',
          rosa: '#FF79C6',
          roxo: '#BD93F9',
          vermelho: '#FF5555',
          amarelo: '#F1FA8C',
        },
      },
    },
  },
  plugins: [],
};
export default config;
