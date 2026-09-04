export type ThemeMeta = {
  name: string;
  value: string;
  /** Cores de amostra para o seletor visual */
  swatch: {
    background: string;
    primary: string;
    accent: string;
  };
};

export const themes: ThemeMeta[] = [
  {
    name: "Atelier",
    value: "light",
    swatch: {
      background: "#f4f8f6",
      primary: "#0d6b5c",
      accent: "#e6f0ed",
    },
  },
  {
    name: "Noite",
    value: "dark",
    swatch: {
      background: "#0d1514",
      primary: "#2dd4bf",
      accent: "#1a2826",
    },
  },
  {
    name: "Menta",
    value: "mint",
    swatch: {
      background: "#f0faf5",
      primary: "#0d9f6e",
      accent: "#d8f3e7",
    },
  },
  {
    name: "Crepúsculo",
    value: "twilight",
    swatch: {
      background: "#fef3eb",
      primary: "#f9734a",
      accent: "#fbbf24",
    },
  },
  {
    name: "Âmbar",
    value: "golden-elegancy",
    swatch: {
      background: "#f5f5f5",
      primary: "#c45c0a",
      accent: "#fbbf24",
    },
  },
  {
    name: "Mono",
    value: "mono",
    swatch: {
      background: "#e6e6e6",
      primary: "#666666",
      accent: "#333333",
    },
  },
];

export const themeValues = themes.map((t) => t.value);
