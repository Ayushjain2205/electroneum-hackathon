export const modeColors = {
  bff: {
    main: "#FFB3BA", // Pastel Pink
    light: "#FFE5E8", // Light Pink
  },
  manager: {
    main: "#BAFFC9", // Pastel Green
    light: "#E5FFE9", // Light Green
  },
  coach: {
    main: "#BAE1FF", // Pastel Blue
    light: "#E5F4FF", // Light Blue
  },
  nutritionist: {
    main: "#FFFFBA", // Pastel Yellow
    light: "#FFFFE5", // Light Yellow
  },
  wellness: {
    main: "#FFD9BA", // Pastel Orange
    light: "#FFF0E5", // Light Orange
  },
};

export type ModeType = keyof typeof modeColors;
