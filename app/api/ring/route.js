import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const score = Number(searchParams.get("score") || 0);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",          // REQUIRED
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          width: "300px",
          height: "300px",
          fontFamily: "sans-serif",
        }}
      >
        {/* WRAP SVG INSIDE A FLEX CONTAINER TOO */}
        <div style={{ display: "flex" }}>
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
        </div>

        {/* TEXT OVERLAY */}
        <div
          style={{
            display: "flex",        // REQUIRED
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "64px",
            fontWeight: "700",
            color: "#111",
            alignItems: "center",
            justifyContent: "center",
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
