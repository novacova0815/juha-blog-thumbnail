
import React, { useRef, useEffect, forwardRef } from 'react';
import { TextPosition, TextStyle, BoxColorType } from '../types';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants';

interface PreviewProps {
  backgroundImage: File | null;
  title: string;
  subtitle: string;
  textPosition: TextPosition;
  textColor: string;
  brightness: number;
  textStyle: TextStyle;
  outlineColor: string;
  boxColorType: BoxColorType;
}

const adjustColorBrightness = (hex: string, percent: number): string => {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) return '#000000';

  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);
  
  const factor = 1 + percent / 100;

  r = Math.round(Math.min(255, Math.max(0, r * factor)));
  g = Math.round(Math.min(255, Math.max(0, g * factor)));
  b = Math.round(Math.min(255, Math.max(0, b * factor)));

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

const getAutoBoxColor = (textColorHex: string): 'light' | 'dark' => {
    if (!/^#[0-9a-f]{6}$/i.test(textColorHex)) return 'dark';
    const r = parseInt(textColorHex.substring(1, 3), 16);
    const g = parseInt(textColorHex.substring(3, 5), 16);
    const b = parseInt(textColorHex.substring(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? 'dark' : 'light';
};

const wrapText = (context: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
    if (!text.trim()) return [];
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach(word => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const { width } = context.measureText(testLine);
        if (width > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    });

    if (currentLine) {
        lines.push(currentLine);
    }
    return lines;
};


export const Preview = forwardRef<HTMLCanvasElement, PreviewProps>(({
  backgroundImage, title, subtitle, textPosition, textColor, brightness, textStyle, outlineColor, boxColorType
}, ref) => {
    const internalCanvasRef = useRef<HTMLCanvasElement>(null);
    const canvasRef = (ref || internalCanvasRef) as React.RefObject<HTMLCanvasElement>;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const draw = (img: HTMLImageElement | null) => {
            // Draw background color or image
            ctx.fillStyle = '#7c2d12'; // orange-900
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            if (img) {
                const canvasAspect = CANVAS_WIDTH / CANVAS_HEIGHT;
                const imgAspect = img.width / img.height;
                let sx, sy, sWidth, sHeight;

                if (imgAspect > canvasAspect) { // image wider than canvas
                    sHeight = img.height;
                    sWidth = sHeight * canvasAspect;
                    sx = (img.width - sWidth) / 2;
                    sy = 0;
                } else { // image taller than canvas
                    sWidth = img.width;
                    sHeight = sWidth / canvasAspect;
                    sx = 0;
                    sy = (img.height - sHeight) / 2;
                }
                ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            }

            // Apply brightness overlay
            if (brightness > 0) {
                ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
                ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            }

            // --- Text Prep ---
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            const lineSpacing = 40; // Increased spacing
            const titleHeight = 90;
            const subtitleHeight = 68; // Increased font size by ~50%
            const maxWidth = CANVAS_WIDTH - 160;

            ctx.font = `bold ${titleHeight}px "Pretendard", "Noto Sans KR", sans-serif`;
            const titleLines = wrapText(ctx, title, maxWidth);
            
            ctx.font = `500 ${subtitleHeight}px "Caveat", "Pretendard", "Noto Sans KR", sans-serif`;
            const subtitleLines = wrapText(ctx, subtitle, maxWidth);

            const titleBlockHeight = titleLines.length * titleHeight;
            const subtitleBlockHeight = subtitleLines.length > 0 ? subtitleLines.length * subtitleHeight : 0;

            let totalTextHeight = titleBlockHeight;
            if (subtitleBlockHeight > 0) {
                totalTextHeight += lineSpacing + subtitleBlockHeight;
            }
            
            let firstLineTitleY: number;
            
            // --- Box and Text Positioning ---
            if (textStyle === 'box') {
                const boxPaddingVertical = 30;
                const boxHeight = totalTextHeight + (boxPaddingVertical * 2);
                const boxWidth = CANVAS_WIDTH;
                const boxX = 0;
                let boxY: number;

                switch (textPosition) {
                    case TextPosition.Top:
                        boxY = 0;
                        break;
                    case TextPosition.Center:
                        boxY = (CANVAS_HEIGHT - boxHeight) / 2;
                        break;
                    case TextPosition.Bottom:
                    default:
                        boxY = CANVAS_HEIGHT - boxHeight;
                        break;
                }
                
                // Draw Box
                const effectiveColorType = boxColorType === 'auto' ? getAutoBoxColor(textColor) : boxColorType;
                const baseRgb = effectiveColorType === 'light' ? '255, 255, 255' : '0, 0, 0';
                const alpha = 0.7; // Fixed 70% transparency
                
                ctx.fillStyle = `rgba(${baseRgb}, ${alpha})`;
                ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
                
                // Position text inside the box
                firstLineTitleY = boxY + boxPaddingVertical + (titleHeight / 2);

            } else {
                // Original text positioning for 'none' or 'outline'
                switch (textPosition) {
                    case TextPosition.Top:
                        firstLineTitleY = 150 + titleHeight / 2;
                        break;
                    case TextPosition.Center:
                        firstLineTitleY = (CANVAS_HEIGHT / 2) - (totalTextHeight / 2) + (titleHeight / 2);
                        break;
                    case TextPosition.Bottom:
                    default:
                        firstLineTitleY = CANVAS_HEIGHT - 150 - totalTextHeight + titleHeight / 2;
                        break;
                }
            }
            
            const firstLineSubtitleY = (firstLineTitleY - titleHeight / 2 + titleBlockHeight) + lineSpacing + subtitleHeight / 2;
            
            // --- Text Drawing ---
            // Reset shadow and set stroke styles
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            
            if (textStyle === 'outline') {
                ctx.strokeStyle = outlineColor;
                ctx.lineWidth = 8;
                ctx.lineJoin = 'round';
            } else {
                ctx.strokeStyle = 'transparent';
                ctx.lineWidth = 0;
            }

            // Draw Title
            ctx.font = `bold ${titleHeight}px "Pretendard", "Noto Sans KR", sans-serif`;
            ctx.fillStyle = textColor;
            titleLines.forEach((line, index) => {
                const y = firstLineTitleY + (index * titleHeight);
                if (textStyle === 'outline') {
                    ctx.strokeText(line, CANVAS_WIDTH / 2, y);
                }
                ctx.fillText(line, CANVAS_WIDTH / 2, y);
            });

            // Draw Subtitle
            const subtitleColor = adjustColorBrightness(textColor, -10); // 10% darker
            ctx.font = `500 ${subtitleHeight}px "Caveat", "Pretendard", "Noto Sans KR", sans-serif`; // Medium weight
            ctx.fillStyle = subtitleColor;
            subtitleLines.forEach((line, index) => {
                const y = firstLineSubtitleY + (index * subtitleHeight);
                if (textStyle === 'outline') {
                    ctx.strokeText(line, CANVAS_WIDTH / 2, y);
                }
                ctx.fillText(line, CANVAS_WIDTH / 2, y);
            });
        };

        const performDraw = () => {
            if (backgroundImage) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = new Image();
                    img.onload = () => draw(img);
                    img.src = e.target?.result as string;
                };
                reader.readAsDataURL(backgroundImage);
            } else {
                draw(null);
            }
        };

        const loadFontsAndDraw = async () => {
            try {
                // Use document.fonts.load for more explicit control over font loading.
                // This ensures that the specific fonts we need for the canvas are
                // available before we attempt to draw.
                await Promise.all([
                    document.fonts.load('bold 90px "Pretendard"'),
                    document.fonts.load('500 68px "Caveat"')
                ]);
            } catch (e) {
                console.warn("Failed to load custom fonts, default fonts will be used.", e);
            }
            
            performDraw();
        };

        loadFontsAndDraw();

    }, [backgroundImage, title, subtitle, textPosition, textColor, brightness, textStyle, outlineColor, boxColorType, canvasRef]);
    
    return <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="rounded-lg shadow-2xl w-full aspect-square" />;
});
