import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const score = Number(searchParams.get("score") || 0);

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "300px",
          height: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
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
        </svg>

        {/* OVERLAY TEXT (HTML, NOT SVG!) */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "64px",
            fontWeight: "700",
            color: "#111",
          }}
        >
          {score}
        </div>
      </div>
    ),
    {
      width: 300,
      height: 300,
    }
  );
}
