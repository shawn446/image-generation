import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const score = Number(searchParams.get("score") || 0);

  return new ImageResponse(
    (
      <svg width="300" height="300" viewBox="0 0 120 120">
        <circle 
          cx="60" 
          cy="60" 
          r="54" 
          stroke="#e5e5e5" 
          strokeWidth="12" 
          fill="none" 
        />
        <circle
          cx="60"
          cy="60"
          r="54"
          stroke="#00ff88"
          strokeWidth="12"
          fill="none"
          strokeDasharray={`${(score / 100) * 339} 339`}
          transform="rotate(-90 60 60)"
          strokeLinecap="round"
        />
        <text
          x="50%"
          y="50%"
          fontSize="32"
          fontWeight="700"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="#111"
        >
          {score}
        </text>
      </svg>
    ),
    {
      width: 300,
      height: 300,
    }
  );
}
