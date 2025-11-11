
import React, { useRef } from 'react';
import { TextPosition, ColorOption, DownloadFormat, DownloadSize, TextStyle, BoxColorType } from '../types';
import { COLOR_PALETTE, BRIGHTNESS_LEVELS, DOWNLOAD_FORMATS, DOWNLOAD_SIZES, BOX_COLOR_TYPES, OUTLINE_COLORS } from '../constants';
import { DownloadIcon, UploadIcon } from './icons';

interface ControlPanelProps {
  title: string;
  setTitle: (title: string) => void;
  subtitle: string;
  setSubtitle: (subtitle: string) => void;
  textPosition: TextPosition;
  setTextPosition: (position: TextPosition) => void;
  textColor: string;
  setTextColor: (color: string) => void;
  brightness: number;
  setBrightness: (level: number) => void;
  filename: string;
  setFilename: (name: string) => void;
  setBackgroundImage: (file: File | null) => void;
  downloadFormat: DownloadFormat;
  setDownloadFormat: (format: DownloadFormat) => void;
  downloadSize: DownloadSize;
  setDownloadSize: (size: DownloadSize) => void;
  handleDownload: () => void;
  textStyle: TextStyle;
  setTextStyle: (style: TextStyle) => void;
  outlineColor: string;
  setOutlineColor: (color: string) => void;
  boxColorType: BoxColorType;
  setBoxColorType: (type: BoxColorType) => void;
}

const ControlSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const TextInput: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; }> = ({ label, value, onChange, placeholder }) => (
    <div>
        <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">{label}</label>
        <input type="text" value={value} onChange={onChange} placeholder={placeholder} className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"/>
    </div>
);

export const ControlPanel: React.FC<ControlPanelProps> = ({
  title, setTitle, subtitle, setSubtitle, textPosition, setTextPosition,
  textColor, setTextColor, brightness, setBrightness, filename, setFilename,
  setBackgroundImage, downloadFormat, setDownloadFormat, downloadSize, setDownloadSize,
  handleDownload, textStyle, setTextStyle, outlineColor, setOutlineColor, boxColorType, setBoxColorType
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setBackgroundImage(event.target.files[0]);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const textStyleOptions: { name: string, value: TextStyle }[] = [
        { name: 'None', value: 'none' },
        { name: 'Outline', value: 'outline' },
        { name: 'Box', value: 'box' },
    ];

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg flex flex-col h-full">
            <div>
                <ControlSection title="Image">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                    <button
                        onClick={handleUploadClick}
                        className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-md transition"
                    >
                        <UploadIcon />
                        Upload Background
                    </button>
                     <button
                        onClick={() => setBackgroundImage(null)}
                        className="w-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-sm py-2 px-4 rounded-md transition"
                    >
                        Use Default Color
                    </button>
                </ControlSection>

                <ControlSection title="Text Content">
                    <TextInput label="Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="우리집 도서관"/>
                    <TextInput label="Subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="아이와 엄마가..."/>
                </ControlSection>

                <ControlSection title="Styling">
                    <div>
                        <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Text Position</label>
                        <div className="grid grid-cols-3 gap-2">
                            {(Object.values(TextPosition)).map(pos => (
                                <button key={pos} onClick={() => setTextPosition(pos)} className={`capitalize py-2 rounded-md text-sm transition ${textPosition === pos ? 'bg-orange-600 text-white font-semibold' : 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600'}`}>
                                    {pos}
                                </button>
                            ))}
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Palette</label>
                        <div className="flex flex-wrap gap-3 items-center">
                            {COLOR_PALETTE.map((color: ColorOption) => (
                                 <button key={color.name} onClick={() => setTextColor(color.hex)} className={`w-8 h-8 rounded-full border-2 transition ${textColor.toUpperCase() === color.hex.toUpperCase() ? 'border-orange-500 dark:border-slate-200 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-800 ring-orange-500 dark:ring-slate-200' : 'border-slate-400 dark:border-slate-500 hover:border-orange-500 dark:hover:border-slate-200'}`} style={{ backgroundColor: color.hex }} title={color.name} />
                            ))}
                            <div className="relative w-8 h-8" title="Custom Color">
                                <label htmlFor="custom-color" className="flex items-center justify-center w-full h-full rounded-md border-2 border-slate-400 dark:border-slate-500 cursor-pointer" style={{ backgroundColor: textColor }}>
                                     <span className="text-white font-bold text-lg" style={{ textShadow: '0 0 3px rgba(0,0,0,0.8)' }}>C</span>
                                </label>
                                <input
                                    id="custom-color"
                                    type="color"
                                    value={textColor}
                                    onChange={(e) => setTextColor(e.target.value)}
                                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Text Style</label>
                        <div className="grid grid-cols-3 gap-2">
                            {textStyleOptions.map(opt => (
                                <button key={opt.value} onClick={() => setTextStyle(opt.value)} className={`capitalize py-2 rounded-md text-sm transition ${textStyle === opt.value ? 'bg-orange-600 text-white font-semibold' : 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600'}`}>
                                    {opt.name}
                                </button>
                            ))}
                        </div>
                    </div>
                     {textStyle === 'outline' && (
                        <div className="mt-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Outline Color</label>
                                <div className="flex flex-wrap gap-3 items-center">
                                    {OUTLINE_COLORS.map((color) => (
                                        <button key={color.name} onClick={() => setOutlineColor(color.hex)} className={`w-8 h-8 rounded-full border-2 transition ${outlineColor.toUpperCase() === color.hex.toUpperCase() ? 'border-orange-500 dark:border-slate-200 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-800 ring-orange-500 dark:ring-slate-200' : 'border-slate-400 dark:border-slate-500 hover:border-orange-500 dark:hover:border-slate-200'}`} style={{ backgroundColor: color.hex }} title={color.name} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    {textStyle === 'box' && (
                        <div className="mt-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Box Color</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {BOX_COLOR_TYPES.map((opt) => (
                                        <button key={opt.value} onClick={() => setBoxColorType(opt.value)} className={`capitalize py-2 rounded-md text-sm transition ${boxColorType === opt.value ? 'bg-orange-600 text-white font-semibold' : 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600'}`}>
                                            {opt.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                     <div>
                        <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2 mt-4">Brightness Overlay</label>
                         <div className="grid grid-cols-3 gap-2">
                            {BRIGHTNESS_LEVELS.map(level => (
                                <button key={level.name} onClick={() => setBrightness(level.value)} className={`py-2 rounded-md text-sm transition ${brightness === level.value ? 'bg-orange-600 text-white font-semibold' : 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600'}`}>
                                    {level.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </ControlSection>

                <ControlSection title="Output">
                    <TextInput label="Filename" value={filename} onChange={(e) => setFilename(e.target.value)} />
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Format</label>
                        <div className="grid grid-cols-3 gap-2">
                            {DOWNLOAD_FORMATS.map(format => (
                                <button key={format.value} onClick={() => setDownloadFormat(format.value as DownloadFormat)} className={`uppercase py-2 rounded-md text-sm transition ${downloadFormat === format.value ? 'bg-orange-600 text-white font-semibold' : 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600'}`}>
                                    {format.name}
                                </button>
                            ))}
                        </div>
                    </div>

                     <div>
                        <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Size</label>
                         <div className="grid grid-cols-3 gap-2">
                            {DOWNLOAD_SIZES.map(size => (
                                <button key={size.value} onClick={() => setDownloadSize(size.value as DownloadSize)} className={`py-2 rounded-md text-sm transition ${downloadSize === size.value ? 'bg-orange-600 text-white font-semibold' : 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600'}`}>
                                    {size.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleDownload}
                        className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-md transition text-lg mt-4"
                    >
                        <DownloadIcon />
                        Download Image
                    </button>
                </ControlSection>
            </div>
            <div className="flex-grow" />
            <div className="text-right text-xs text-slate-400 dark:text-slate-500 pt-4">
                COPYRIGHT © 우리집도서관
            </div>
        </div>
    );
}