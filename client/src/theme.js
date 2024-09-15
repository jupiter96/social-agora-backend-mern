// color design tokens export
export const tokensDark = {
  grey: {
    0: "#ffffff", // White
    10: "#e6f9e6", // Light greenish grey
    50: "#c2f0c2", // Soft green
    100: "#99e699", // Light green
    200: "#66cc66", // Medium light green
    300: "#33b33f", // Medium green
    400: "#28a745", // Slightly darker green
    500: "#22c274", // Base color
    600: "#1dae6b", // Darker green
    700: "#1a9f5e", // Even darker green
    800: "#168f52", // Dark green
    900: "#137b45", // Very dark green
    1000: "#0f5e36", // Almost black green
  },
  primary: {
    // dark gray shades
    100: "#d3d3d3", // light gray
    200: "#a6a6a6", // medium light gray
    300: "#7a7a7a", // medium gray
    400: "#4d4d4d", // medium dark gray
    500: "#212121", // dark gray
    600: "#191919", // the base color
    700: "#141414", // darker gray
    800: "#0d0d0d", // very dark gray
    900: "#070707", // almost black
},
  secondary: {
    50: "#e0f6e0", // Very light green
    100: "#b3ebb3", // Light green
    200: "#99e6a6", // Soft green
    300: "#66d97a", // Medium light green
    400: "#4dc66b", // Medium green
    500: "#22c274", // Base color
    600: "#1abf6a", // Darker green
    700: "#17a95e", // Even darker green
    800: "#139c54", // Dark green
    900: "#0f7f43", // Very dark green
  },
  actionColor: {
    50: "#f44336", // Very light green
  },
};

// function that reverses the color palette
function reverseTokens(tokensDark) {
  const reversedTokens = {};
  Object.entries(tokensDark).forEach(([key, val]) => {
    const keys = Object.keys(val);
    const values = Object.values(val);
    const length = keys.length;
    const reversedObj = {};
    for (let i = 0; i < length; i++) {
      reversedObj[keys[i]] = values[length - i - 1];
    }
    reversedTokens[key] = reversedObj;
  });
  return reversedTokens;
}
export const tokensLight = reverseTokens(tokensDark);

// mui theme settings
export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode
            primary: {
              ...tokensDark.primary,
              main: tokensDark.primary[400],
              light: tokensDark.primary[400],
            },
            secondary: {
              ...tokensDark.secondary,
              main: tokensDark.secondary[300],
            },
            neutral: {
              ...tokensDark.grey,
              main: tokensDark.grey[500],
            },
            background: {
              default: tokensDark.primary[600],
              alt: tokensDark.primary[500],
            },
            action: {
              delete: tokensDark.actionColor[50],
            }
          }
        : {
            // palette values for light mode
            primary: {
              ...tokensLight.primary,
              main: tokensDark.grey[50],
              light: tokensDark.grey[100],
            },
            secondary: {
              ...tokensLight.secondary,
              main: tokensDark.secondary[600],
              light: tokensDark.secondary[700],
            },
            neutral: {
              ...tokensLight.grey,
              main: tokensDark.grey[500],
            },
            background: {
              default: tokensDark.grey[0],
              alt: tokensDark.grey[50],
            },
            action: {
              delete: tokensDark.actionColor[50],
            }
          }),
    },
    typography: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};
