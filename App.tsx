

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { Preview } from './components/Preview';
import {
  DEFAULT_TITLE,
  DEFAULT_SUBTITLE,
  DEFAULT_FILENAME,
  DEFAULT_TEXT_POSITION,
  DEFAULT_COLOR,
  DEFAULT_BRIGHTNESS,
  DEFAULT_DOWNLOAD_FORMAT,
  DEFAULT_DOWNLOAD_SIZE,
  DEFAULT_TEXT_STYLE,
  DEFAULT_BOX_COLOR_TYPE,
  DEFAULT_OUTLINE_COLOR,
} from './constants';
import { TextPosition, DownloadFormat, DownloadSize, Theme, TextStyle, BoxColorType } from './types';
import { ThemeToggle } from './components/ThemeToggle';

const App: React.FC = () => {
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [title, setTitle] = useState<string>(DEFAULT_TITLE);
  const [subtitle, setSubtitle] = useState<string>(DEFAULT_SUBTITLE);
  const [textPosition, setTextPosition] = useState<TextPosition>(DEFAULT_TEXT_POSITION);
  const [textColor, setTextColor] = useState<string>(DEFAULT_COLOR);
  const [brightness, setBrightness] = useState<number>(DEFAULT_BRIGHTNESS);
  const [filename, setFilename] = useState<string>(DEFAULT_FILENAME);
  const [downloadFormat, setDownloadFormat] = useState<DownloadFormat>(DEFAULT_DOWNLOAD_FORMAT);
  const [downloadSize, setDownloadSize] = useState<DownloadSize>(DEFAULT_DOWNLOAD_SIZE);
  const [theme, setTheme] = useState<Theme>('dark');
  const [textStyle, setTextStyle] = useState<TextStyle>(DEFAULT_TEXT_STYLE);
  const [outlineColor, setOutlineColor] = useState<string>(DEFAULT_OUTLINE_COLOR);
  const [boxColorType, setBoxColorType] = useState<BoxColorType>(DEFAULT_BOX_COLOR_TYPE);

  // Fix: Initialize canvasRef to hold a reference to the canvas element.
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const handleDownload = useCallback(() => {
    if (!canvasRef.current) return;

    const mainCanvas = canvasRef.current;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = downloadSize;
    tempCanvas.height = downloadSize;
    const tempCtx = tempCanvas.getContext('2d');

    if (!tempCtx) return;

    // To preserve the background color on PNGs with resizing
    tempCtx.fillStyle = '#1e293b'; // slate-800
    tempCtx.fillRect(0, 0, downloadSize, downloadSize);
    tempCtx.drawImage(mainCanvas, 0, 0, mainCanvas.width, mainCanvas.height, 0, 0, downloadSize, downloadSize);

    const mimeType = `image/${downloadFormat}`;
    const quality = downloadFormat === 'jpeg' ? 0.95 : 0.9;
    const dataUrl = tempCanvas.toDataURL(mimeType, quality);

    const link = document.createElement('a');
    link.href = dataUrl;
    
    const baseFilename = filename.replace(/\.(webp|png|jpeg|jpg)$/i, '');
    const extension = downloadFormat === 'jpeg' ? 'jpg' : downloadFormat;
    link.download = `${baseFilename || 'download'}.${extension}`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [filename, downloadFormat, downloadSize]);

  return (
    <div className="relative min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-200 font-sans p-4 lg:p-8 selection:bg-orange-500 selection:text-white transition-colors duration-300">
      <ThemeToggle theme={theme} setTheme={setTheme} />
      <main className="max-w-screen-xl mx-auto">
        <header className="text-center mb-8">
            <div className="flex justify-center items-center">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-orange-400 dark:from-orange-500 dark:to-orange-300">JUHA Blog Thumbnail</h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-base md:text-lg">Blogger용 이미지 최적화 프로그램</p>
        </header>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/5 flex justify-center">
            <div className="w-full max-w-md aspect-square sticky top-8">
               <Preview
                ref={canvasRef}
                backgroundImage={backgroundImage}
                title={title}
                subtitle={subtitle}
                textPosition={textPosition}
                textColor={textColor}
                brightness={brightness}
                textStyle={textStyle}
                outlineColor={outlineColor}
                boxColorType={boxColorType}
              />
            </div>
          </div>

          <div className="lg:w-3/5">
            <ControlPanel
              title={title}
              setTitle={setTitle}
              subtitle={subtitle}
              setSubtitle={setSubtitle}
              textPosition={textPosition}
              setTextPosition={setTextPosition}
              textColor={textColor}
              setTextColor={setTextColor}
              brightness={brightness}
              setBrightness={setBrightness}
              filename={filename}
              setFilename={setFilename}
              setBackgroundImage={setBackgroundImage}
              downloadFormat={downloadFormat}
              setDownloadFormat={setDownloadFormat}
              downloadSize={downloadSize}
              setDownloadSize={setDownloadSize}
              handleDownload={handleDownload}
              textStyle={textStyle}
              setTextStyle={setTextStyle}
              outlineColor={outlineColor}
              setOutlineColor={setOutlineColor}
              boxColorType={boxColorType}
              setBoxColorType={setBoxColorType}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;