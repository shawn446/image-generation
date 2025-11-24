import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const score = Number(searchParams.get("score") || 0);

  return new ImageResponse(
    (
      <div
        style={{
          width: "300px",
          height: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 64,
          fontWeight: 700,
          color: "#ffffff",

          // ADD A DARK BACKGROUND SO THE IMAGE IS VISIBLE
          backgroundColor: "#111",

          borderRadius: "50%",
          position: "relative",
        }}
      >
        {/* Ring Overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: `conic-gradient(
              #00ff88 ${score}%, 
              #333 ${score}%
            )`,
          }}
        />

        {/* Score Text */}
        <span style={{ position: "relative", zIndex: 2 }}>{score}</span>
      </div>
    ),
    {
      width: 300,
      height: 300,
    }
  );
}
