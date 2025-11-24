import fs from "fs";
import path from "path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-wasm";

export const runtime = "nodejs"; // must be node, NOT edge

// Load font once at startup
const fontPath = path.join(process.cwd(), "app/fonts/Inter-Regular.ttf");
const fontData = fs.readFileSync(fontPath);

export async function GET(req, { params }) {
  const score = Number(params.score || 0);

  // Build SVG with Satori
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
          background: "#f5f5f5",
          fontFamily: "Inter",
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
                color: "#111",
                fontSize: "64px",
                fontWeight: "700",
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

  const pngData = resvg.render().asPng();

  return new Response(pngData, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
