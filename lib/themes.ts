export type ThemeMode = "dark" | "light";

export type ThemeDefinition = {
  value: string;
  label: string;
  description: string;
  mode: ThemeMode;
  themeColor: string;
  swatch: readonly [string, string, string];
};

export const themeStorageKey = "miteee-theme";

export const resolvedThemes = [
  {
    value: "dark",
    label: "Dark",
    description: "Graphite night",
    mode: "dark",
    themeColor: "#090c11",
    swatch: ["#090c11", "#4e8cff", "#f3f5f7"]
  },
  {
    value: "light",
    label: "Light",
    description: "Clean daylight",
    mode: "light",
    themeColor: "#f7f8fa",
    swatch: ["#f7f8fa", "#2567df", "#171a20"]
  },
  {
    value: "paper",
    label: "Paper",
    description: "Warm reading canvas",
    mode: "light",
    themeColor: "#f4efe5",
    swatch: ["#f4efe5", "#8b5b2b", "#302a22"]
  },
  {
    value: "monokai",
    label: "Monokai",
    description: "Ink, lime, and magenta",
    mode: "dark",
    themeColor: "#272822",
    swatch: ["#272822", "#a6e22e", "#ff4f8a"]
  },
  {
    value: "dracula",
    label: "Dracula",
    description: "Purple midnight",
    mode: "dark",
    themeColor: "#282a36",
    swatch: ["#282a36", "#bd93f9", "#50fa7b"]
  },
  {
    value: "nord",
    label: "Nord",
    description: "Cool arctic blue",
    mode: "dark",
    themeColor: "#2e3440",
    swatch: ["#2e3440", "#88c0d0", "#eceff4"]
  },
  {
    value: "gruvbox",
    label: "Gruvbox",
    description: "Retro earthy contrast",
    mode: "dark",
    themeColor: "#282828",
    swatch: ["#282828", "#d8dc5a", "#fabd2f"]
  },
  {
    value: "solarized-dark",
    label: "Solarized Dark",
    description: "Balanced blue-green",
    mode: "dark",
    themeColor: "#002b36",
    swatch: ["#002b36", "#7bd5cc", "#e4c04a"]
  },
  {
    value: "solarized-light",
    label: "Solarized Light",
    description: "Soft cream and teal",
    mode: "light",
    themeColor: "#fdf6e3",
    swatch: ["#fdf6e3", "#0f6f75", "#073642"]
  },
  {
    value: "tokyo-night",
    label: "Tokyo Night",
    description: "Indigo city glow",
    mode: "dark",
    themeColor: "#1a1b26",
    swatch: ["#1a1b26", "#7aa2f7", "#bb9af7"]
  },
  {
    value: "one-dark",
    label: "One Dark",
    description: "Slate developer classic",
    mode: "dark",
    themeColor: "#282c34",
    swatch: ["#282c34", "#61afef", "#98c379"]
  },
  {
    value: "catppuccin",
    label: "Catppuccin",
    description: "Mocha pastel night",
    mode: "dark",
    themeColor: "#1e1e2e",
    swatch: ["#1e1e2e", "#89b4fa", "#f38ba8"]
  },
  {
    value: "high-contrast",
    label: "High Contrast",
    description: "Sharper text and focus",
    mode: "dark",
    themeColor: "#000000",
    swatch: ["#000000", "#ffd84d", "#ffffff"]
  }
] as const satisfies readonly ThemeDefinition[];

export type ResolvedTheme = (typeof resolvedThemes)[number]["value"];
export type ThemePreference = "system" | ResolvedTheme;

export type ThemePreferenceOption = {
  value: ThemePreference;
  label: string;
  description: string;
  mode: ThemeMode | "system";
  themeColor: string;
  swatch: readonly [string, string, string];
};

export const themeOptions: readonly ThemePreferenceOption[] = [
  {
    value: "system",
    label: "System",
    description: "Follow this device",
    mode: "system",
    themeColor: "#090c11",
    swatch: ["#090c11", "#f7f8fa", "#4e8cff"]
  },
  ...resolvedThemes
];

export const resolvedThemeIds = resolvedThemes.map((theme) => theme.value) as ResolvedTheme[];

export const themeModeById = Object.fromEntries(
  resolvedThemes.map((theme) => [theme.value, theme.mode])
) as Record<ResolvedTheme, ThemeMode>;

export const themeDefinitionById = Object.fromEntries(
  resolvedThemes.map((theme) => [theme.value, theme])
) as Record<ResolvedTheme, (typeof resolvedThemes)[number]>;

export function isResolvedTheme(value: unknown): value is ResolvedTheme {
  return typeof value === "string" && resolvedThemeIds.includes(value as ResolvedTheme);
}

export function isThemePreference(value: unknown): value is ThemePreference {
  return value === "system" || isResolvedTheme(value);
}

export function normalizeThemePreference(value: unknown): ThemePreference {
  return isThemePreference(value) ? value : "system";
}

export function resolveThemePreference(preference: ThemePreference, prefersDark: boolean): ResolvedTheme {
  return preference === "system" ? (prefersDark ? "dark" : "light") : preference;
}
