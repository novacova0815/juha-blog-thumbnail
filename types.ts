export enum TextPosition {
  Top = 'top',
  Center = 'center',
  Bottom = 'bottom',
}

export interface ColorOption {
  name: string;
  hex: string;
}

export type DownloadFormat = 'webp' | 'png' | 'jpeg';
export type DownloadSize = 400 | 800 | 1200;

// Fix: Add the missing 'Theme' type definition.
export type Theme = 'light' | 'dark';

export type TextStyle = 'none' | 'outline' | 'box';
export type BoxColorType = 'auto' | 'light' | 'dark';
