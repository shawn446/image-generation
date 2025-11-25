import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request, { params }) {
  const score = parseInt(params.score) || 0;
  const clampedScore = Math.min(100, Math.max(0, score));
  
  // Color based on score (same logic as ring)
  let color;
  if (clampedScore >= 70) {
    color = '#22c55e'; // Green
  } else if (clampedScore >= 50) {
    color = '#eab308'; // Yellow
  } else {
    color = '#ef4444'; // Red
  }

  const width = 200;
  const height = 24;
  const barWidth = (clampedScore / 100) * width;

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <!-- Background bar -->
      <rect x="0" y="0" width="${width}" height="${height}" rx="4" ry="4" fill="#e5e7eb"/>
      
      <!-- Progress bar -->
      <rect x="0" y="0" width="${barWidth}" height="${height}" rx="4" ry="4" fill="${color}"/>
    </svg>
  `;

  return new ImageResponse(
    (
      <div style={{ display: 'flex' }}>
        <img src={`data:image/svg+xml,${encodeURIComponent(svg)}`} />
      </div>
    ),
    {
      width,
      height,
    }
  );
}
```

**Push to GitHub**, wait for Render deploy, then test:
```
https://image-generation-zdng.onrender.com/api/bar/75.png
https://image-generation-zdng.onrender.com/api/bar/50.png
https://image-generation-zdng.onrender.com/api/bar/25.png
