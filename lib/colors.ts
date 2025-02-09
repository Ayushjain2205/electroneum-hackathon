export const modeColors = {
  bff: {
    main: "#E0B3FF", // Pastel Purple
    light: "#F0E5FF", // Light Purple
    lighter: "#F8F5FF", // Ultra Light Purple
  },
  manager: {
    main: "#BAFFC9", // Pastel Green
    light: "#E5FFE9", // Light Green
    lighter: "#F5FFF7", // Ultra Light Green
  },
  coach: {
    main: "#BAE1FF", // Pastel Blue
    light: "#E5F4FF", // Light Blue
    lighter: "#F5FAFF", // Ultra Light Blue
  },
  shopper: {
    main: "#FFFFBA", // Pastel Yellow
    light: "#FFFFE5", // Light Yellow
    lighter: "#FFFFF5", // Ultra Light Yellow
  },
  girlfriend: {
    main: "#FFB3BA", // Pastel Pink
    light: "#FFE5E8", // Light Pink
    lighter: "#FFF5F7", // Ultra Light Pink
  },
};

export type ModeType = keyof typeof modeColors;
