export interface UserConfig {
  fontSize: string;
  theme: ThemeConfig;
  updatedAt?: string;
}

export type ThemeConfig = 'light-theme' | 'dark-theme';
