'use client';

import { useEffect, useState } from 'react';

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

export default useAlbumAverageColor;