// Immutable v2 defaults. New website defaults must not change the meaning of existing IDs.
import type { UiLabInitConfig } from "./init-config.js";
export const V2_DEFAULTS: Record<"light" | "dark", UiLabInitConfig> = {
  "light": {
    "version": 2,
    "framework": "next",
    "themeMode": "light",
    "longFormTypography": true,
    "customFont": false,
    "font": "inter",
    "themeToggle": false,
    "typography": {
      "headerScale": 0.75,
      "bodyScale": 0.75,
      "headerMinFontSizePx": 12,
      "bodyMinFontSizePx": 13.5,
      "monoMinFontSizePx": 13,
      "monoFontSizeScale": 1,
      "monoFontWeightScale": 1,
      "monoLetterSpacingScale": 1,
      "monoLineHeight": 1.55
    },
    "layout": {
      "radius": 1.4,
      "borderWidth": 1,
      "spacingScale": 0.9
    },
    "colors": {
      "background": {
        "l": 1,
        "c": 0,
        "h": 0
      },
      "foreground": {
        "l": 0.6,
        "c": 0,
        "h": 0
      },
      "accent": {
        "l": 0.5,
        "c": 0.2,
        "h": 30
      },
      "codeTheme": "adaptive",
      "backgroundShade": 950,
      "foregroundShade": 300,
      "accentShade": 500,
      "globalAdjustments": {
        "lightnessShift": 0,
        "chromaBoost": 1
      },
      "semantic": {
        "success": {
          "light": {
            "color": {
              "l": 0.9,
              "c": 0.2,
              "h": 142
            },
            "chromaLimit": 0.25
          },
          "dark": {
            "color": {
              "l": 0.9,
              "c": 0.2,
              "h": 142
            },
            "chromaLimit": 0.25
          }
        },
        "danger": {
          "light": {
            "color": {
              "l": 0.9,
              "c": 0.3,
              "h": 25
            },
            "chromaLimit": 0.25
          },
          "dark": {
            "color": {
              "l": 0.9,
              "c": 0.3,
              "h": 25
            },
            "chromaLimit": 0.25
          }
        },
        "warning": {
          "light": {
            "color": {
              "l": 0.9,
              "c": 0.2,
              "h": 65
            },
            "chromaLimit": 0.25
          },
          "dark": {
            "color": {
              "l": 0.9,
              "c": 0.2,
              "h": 65
            },
            "chromaLimit": 0.25
          }
        },
        "info": {
          "light": {
            "color": {
              "l": 0.9,
              "c": 0.2,
              "h": 255
            },
            "chromaLimit": 0.25
          },
          "dark": {
            "color": {
              "l": 0.9,
              "c": 0.2,
              "h": 255
            },
            "chromaLimit": 0.25
          }
        }
      },
      "accentChromaLimit": 0.35
    }
  },
  "dark": {
    "version": 2,
    "framework": "next",
    "themeMode": "dark",
    "longFormTypography": true,
    "customFont": false,
    "font": "inter",
    "themeToggle": false,
    "typography": {
      "headerScale": 0.75,
      "bodyScale": 0.75,
      "headerMinFontSizePx": 12,
      "bodyMinFontSizePx": 13.5,
      "monoMinFontSizePx": 13,
      "monoFontSizeScale": 1,
      "monoFontWeightScale": 1,
      "monoLetterSpacingScale": 1,
      "monoLineHeight": 1.55
    },
    "layout": {
      "radius": 1.4,
      "borderWidth": 1,
      "spacingScale": 0.9
    },
    "colors": {
      "background": {
        "l": 0.071,
        "c": 0,
        "h": 0
      },
      "foreground": {
        "l": 0.4,
        "c": 0,
        "h": 0
      },
      "accent": {
        "l": 0.5,
        "c": 0.2,
        "h": 30
      },
      "codeTheme": "adaptive",
      "backgroundShade": 900,
      "foregroundShade": 100,
      "accentShade": 500,
      "globalAdjustments": {
        "lightnessShift": 0,
        "chromaBoost": 1
      },
      "semantic": {
        "success": {
          "light": {
            "color": {
              "l": 0.9,
              "c": 0.2,
              "h": 142
            },
            "chromaLimit": 0.25
          },
          "dark": {
            "color": {
              "l": 0.9,
              "c": 0.2,
              "h": 142
            },
            "chromaLimit": 0.25
          }
        },
        "danger": {
          "light": {
            "color": {
              "l": 0.9,
              "c": 0.3,
              "h": 25
            },
            "chromaLimit": 0.25
          },
          "dark": {
            "color": {
              "l": 0.9,
              "c": 0.3,
              "h": 25
            },
            "chromaLimit": 0.25
          }
        },
        "warning": {
          "light": {
            "color": {
              "l": 0.9,
              "c": 0.2,
              "h": 65
            },
            "chromaLimit": 0.25
          },
          "dark": {
            "color": {
              "l": 0.9,
              "c": 0.3,
              "h": 65
            },
            "chromaLimit": 0.25
          }
        },
        "info": {
          "light": {
            "color": {
              "l": 0.9,
              "c": 0.2,
              "h": 255
            },
            "chromaLimit": 0.25
          },
          "dark": {
            "color": {
              "l": 0.9,
              "c": 0.2,
              "h": 255
            },
            "chromaLimit": 0.25
          }
        }
      },
      "accentChromaLimit": 0.35
    }
  }
};
