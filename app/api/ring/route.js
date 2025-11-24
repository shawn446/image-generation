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
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 64,
          fontWeight: 700,
          color: "#222",
          background: `conic-gradient(
            #ff3b30 ${score}%,
            #e5e5e5 ${score}%
          )`,
        }}
      >
        {score}
      </div>
    ),
    {
      width: 300,
      height: 300
    }
  );
}
