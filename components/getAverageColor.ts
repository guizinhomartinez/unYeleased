'use client';

import { useEffect, useState } from 'react';
import ColorThief from "colorthief";

const useAlbumAverageColor = (src: string) => {
  const [averageColor, setAverageColor] = useState(['']);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.crossOrigin = 'Anonymous'; // Allow cross-origin images

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {
        console.error('Canvas context is not supported.');
        return;
      }

      // Set canvas dimensions to match the image
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      // Draw the image onto the canvas
      context.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Get the pixel data
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;

      let r = 0,
        g = 0,
        b = 0;

      // Sum up the RGB values
      for (let i = 0; i < imageData.length; i += 4) {
        r += imageData[i];
        g += imageData[i + 1];
        b += imageData[i + 2];
      }

      // Calculate the average color
      const totalPixels = imageData.length / 4;
      const avgR = Math.round(r / totalPixels);
      const avgG = Math.round(g / totalPixels);
      const avgB = Math.round(b / totalPixels);

      const color1 = `${avgR}`;
      const color2 = `${avgG}`;
      const color3 = `${avgB}`;
      setAverageColor([color1, color2, color3]);
    };

    img.onerror = () => {
      console.error('Failed to load image:', src);
    };
  }, [src]);

  return [averageColor[0], averageColor[1], averageColor[2]]; // Return the calculated average color
};

const rgbToHsl = (red: number, green: number, blue: number) => {
  red /= 255;
  green /= 255;
  blue /= 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  let h = 0,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case red:
        h = (green - blue) / d + (green < blue ? 6 : 0);
        break;
      case green:
        h = (blue - red) / d + 2;
        break;
      case blue:
        h = (red - green) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    hue: Math.round(h * 360),
    saturation: Math.round(s * 100),
    lightness: Math.round(l * 100),
  };
};

export const extractColorsFromImage = async (img: HTMLImageElement): Promise<string[]> => {
  try {
    const response = await fetch(img.src);
    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);
    const proxyImg = new Image();

    return new Promise(resolve => {
      proxyImg.onload = () => {
        try {
          const colorThief = new ColorThief();
          const colors = colorThief.getPalette(proxyImg, 5);
          const primaryColor = colorThief.getColor(proxyImg);

          const colorsWithPrimary = [primaryColor, ...colors];
          const colorsHsl = colorsWithPrimary.map(color => {
            const [r, g, b] = color;
            const { hue, saturation, lightness } = rgbToHsl(r, g, b);
            return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
          });

          URL.revokeObjectURL(imageUrl);
          resolve(colorsHsl);
        } catch (error) {
          console.error("ColorThief error:", error);
          URL.revokeObjectURL(imageUrl);
          resolve([]);
        }
      };

      proxyImg.onerror = () => {
        console.error("Error loading proxy image");
        URL.revokeObjectURL(imageUrl);
        resolve([]);
      };

      proxyImg.src = imageUrl;
    });
  } catch (error) {
    console.error("Error extracting colors:", error);
    return [];
  }
};

export default useAlbumAverageColor;