export type ThemeMode = "dark" | "light";

export type ThemeDefinition = {
  value: string;
  label: string;
  description: string;
  mode: ThemeMode;
  themeColor: string;
  swatch: readonly [string, string, string, string, string];
};

export const themeStorageKey = "miteee-theme";

export const resolvedThemes = [
  {
    value: "dark",
    label: "Dark",
    description: "Graphite night",
    mode: "dark",
    themeColor: "#090c11",
    swatch: ["#090c11", "#4e8cff", "#e6b86b", "#b7a4ff", "#ef8aad"]
  },
  {
    value: "light",
    label: "Light",
    description: "Clean daylight",
    mode: "light",
    themeColor: "#f7f8fa",
    swatch: ["#f7f8fa", "#3f63c8", "#9a631d", "#6d56b8", "#aa3f61"]
  },
  {
    value: "paper",
    label: "Paper",
    description: "Warm reading canvas",
    mode: "light",
    themeColor: "#f4efe5",
    swatch: ["#f4efe5", "#8b5b2b", "#416d85", "#3f7257", "#9a5361"]
  },
  {
    value: "parchment",
    label: "Parchment",
    description: "Dimmed tan paper",
    mode: "light",
    themeColor: "#c9b99f",
    swatch: ["#c9b99f", "#74491f", "#365f70", "#3f684f", "#81505a"]
  },
  {
    value: "night-paper",
    label: "Night Paper",
    description: "Warm paper after dark",
    mode: "dark",
    themeColor: "#211d18",
    swatch: ["#211d18", "#d5a460", "#78a9b4", "#82ad8b", "#c98994"]
  },
  {
    value: "monokai",
    label: "Monokai",
    description: "Ink, lime, and magenta",
    mode: "dark",
    themeColor: "#1f201b",
    swatch: ["#1f201b", "#a6e22e", "#66d9ef", "#fd971f", "#ff4f8a"]
  },
  {
    value: "dracula",
    label: "Dracula",
    description: "Purple midnight",
    mode: "dark",
    themeColor: "#191a24",
    swatch: ["#191a24", "#bd93f9", "#8be9fd", "#50fa7b", "#ff79c6"]
  },
  {
    value: "nord",
    label: "Nord",
    description: "Cool arctic blue",
    mode: "dark",
    themeColor: "#222831",
    swatch: ["#222831", "#88c0d0", "#a3be8c", "#ebcb8b", "#c4a7c5"]
  },
  {
    value: "gruvbox",
    label: "Gruvbox",
    description: "Retro earthy contrast",
    mode: "dark",
    themeColor: "#1d2021",
    swatch: ["#1d2021", "#b8bb26", "#83a598", "#fabd2f", "#d3869b"]
  },
  {
    value: "solarized-dark",
    label: "Solarized Dark",
    description: "Balanced blue-green",
    mode: "dark",
    themeColor: "#001f27",
    swatch: ["#001f27", "#2aa198", "#72baf0", "#e4c04a", "#ed7784"]
  },
  {
    value: "solarized-light",
    label: "Solarized Light",
    description: "Soft cream and teal",
    mode: "light",
    themeColor: "#fdf6e3",
    swatch: ["#fdf6e3", "#0f6f75", "#176ea2", "#806000", "#b8324b"]
  },
  {
    value: "tokyo-night",
    label: "Tokyo Night",
    description: "Indigo city glow",
    mode: "dark",
    themeColor: "#11121a",
    swatch: ["#11121a", "#7aa2f7", "#7dcfff", "#bb9af7", "#f7768e"]
  },
  {
    value: "one-dark",
    label: "One Dark",
    description: "Slate developer classic",
    mode: "dark",
    themeColor: "#1b1f24",
    swatch: ["#1b1f24", "#61afef", "#98c379", "#e5c07b", "#c678dd"]
  },
  {
    value: "catppuccin",
    label: "Catppuccin",
    description: "Mocha pastel night",
    mode: "dark",
    themeColor: "#11111b",
    swatch: ["#11111b", "#89b4fa", "#a6e3a1", "#f9e2af", "#f38ba8"]
  },
  {
    value: "high-contrast",
    label: "High Contrast",
    description: "Sharper text and focus",
    mode: "dark",
    themeColor: "#000000",
    swatch: ["#000000", "#7fceff", "#83f2aa", "#ffd84d", "#ffffff"]
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
    swatch: readonly [string, string, string, string, string];
};

export const themeOptions: readonly ThemePreferenceOption[] = [
  {
    value: "system",
    label: "System",
    description: "Follow this device",
    mode: "system",
    themeColor: "#090c11",
    swatch: ["#090c11", "#f7f8fa", "#4e8cff", "#b7a4ff", "#ef8aad"]
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
