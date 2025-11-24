import fs from "fs";
import path from "path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ----- Load font -----
const fontPath = path.join(process.cwd(), "app/fonts/Inter-Regular.ttf");
const fontData = fs.readFileSync(fontPath);

// ----- API Route -----
export async function GET(req, { params }) {
  const scoreRaw = params.score || "0";
  const score = Number(scoreRaw.replace(".png", ""));

  // Create SVG via Satori
  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          fontFamily: "Inter",
          background: "#fff",
        },
        children: [
          {
            type: "svg",
            props: {
              width: 300,
              height: 300,
              viewBox: "0 0 120 120",
              children: [
                {
                  type: "circle",
                  props: {
                    cx: 60,
                    cy: 60,
                    r: 54,
                    stroke: "#e5e5e5",
                    strokeWidth: 12,
                    fill: "none",
                  },
                },
                {
                  type: "circle",
                  props: {
                    cx: 60,
                    cy: 60,
                    r: 54,
                    stroke: "#00ff88",
                    strokeWidth: 12,
                    fill: "none",
                    strokeDasharray: `${(score / 100) * 339} 339`,
                    transform: "rotate(-90 60 60)",
                    strokeLinecap: "round",
                  },
                },
              ],
            },
          },
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                color: "#000",
                fontSize: 48,
                fontWeight: "bold",
              },
              children: String(score),
            },
          },
        ],
      },
    },
    {
      width: 300,
      height: 300,
      fonts: [
        {
          name: "Inter",
          data: fontData,
          weight: 400,
          style: "normal",
        },
      ],
    }
  );

  // Convert SVG → PNG
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 300 },
  });

  const png = resvg.render().asPng();

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
