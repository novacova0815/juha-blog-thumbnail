import { ColorOption, TextPosition, TextStyle, BoxColorType } from './types';

export const CANVAS_WIDTH = 1080;
export const CANVAS_HEIGHT = 1080;

export const DEFAULT_TITLE = '우리집 도서관';
export const DEFAULT_SUBTITLE = 'Reading Together, Growing Together';
export const DEFAULT_FILENAME = 'MyFamilyLibrary';
export const DEFAULT_TEXT_POSITION = TextPosition.Bottom;
export const DEFAULT_BRIGHTNESS = 0.1;

export const COLOR_PALETTE: ColorOption[] = [
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Red', hex: '#EF4444' },
  { name: 'Orange', hex: '#F97316' },
  { name: 'Yellow', hex: '#EAB308' },
  { name: 'Green', hex: '#22C55E' },
  { name: 'Teal', hex: '#14B8A6' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Purple', hex: '#8B5CF6' },
  { name: 'Beige', hex: '#F5E3C6' },
  { name: 'Brown', hex: '#4B3621' },
  { name: 'Navy', hex: '#1F3A5F' },
  { name: 'Gray', hex: '#6B7280' },
  { name: 'Black', hex: '#000000' },
];

export const DEFAULT_COLOR = '#F97316'; // Default is Orange

export const BRIGHTNESS_LEVELS = [
  { name: '0%', value: 0 },
  { name: '+10%', value: 0.1 },
  { name: '+20%', value: 0.2 },
];

export const DOWNLOAD_FORMATS = [
  { name: 'WebP', value: 'webp' },
  { name: 'PNG', value: 'png' },
  { name: 'JPEG', value: 'jpeg' },
];

export const DOWNLOAD_SIZES = [
  { name: '400px', value: 400 },
  { name: '800px', value: 800 },
  { name: '1200px', value: 1200 },
];

export const DEFAULT_DOWNLOAD_FORMAT = 'webp';
export const DEFAULT_DOWNLOAD_SIZE = 800;

export const DEFAULT_TEXT_STYLE: TextStyle = 'box';
export const DEFAULT_BOX_COLOR_TYPE: BoxColorType = 'light';

export const DEFAULT_OUTLINE_COLOR = '#333333';
export const OUTLINE_COLORS: ColorOption[] = [
  { name: 'Dark Gray', hex: '#333333' },
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
];

export const BOX_COLOR_TYPES = [
    { name: 'Auto', value: 'auto' as BoxColorType },
    { name: 'Light', value: 'light' as BoxColorType },
    { name: 'Dark', value: 'dark' as BoxColorType },
];
