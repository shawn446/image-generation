import fs from "fs";
import path from "path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

export const runtime = "nodejs";

// Load WASM
const wasmPath = path.join(process.cwd(), "public/resvg.wasm");
const wasmData = fs.readFileSync(wasmPath);

// Load font
const fontPath = path.join(process.cwd(), "app/fonts/Inter-Regular.ttf");
const fontData = fs.readFileSync(fontPath);

export async function GET(req, { params }) {
  // 🔥 IMPORTANT: remove ".png" from dynamic segment
  const rawScore = params.score.replace(".png", "");
  const score = Number(rawScore) || 0;

  // Create SVG ring using Satori
  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "300px",
          height: "300px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          borderRadius: "50%",
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
                    stroke: "#00cc66",
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
                fontSize: 48,
                fontWeight: 700,
                color: "#000",
                fontFamily: "Inter",
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

  // Convert to PNG
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
