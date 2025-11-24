import fs from "fs";
import path from "path";
import satori from "satori";
import { initWasm, Resvg } from "@resvg/resvg-wasm";

export const runtime = "nodejs"; // must use node, NOT edge

// ----- LOAD FONT -----
const fontPath = path.join(process.cwd(), "app/fonts/Inter-Regular.ttf");
const fontData = fs.readFileSync(fontPath);

// ----- LOAD WASM -----
const wasmPath = path.join(
  process.cwd(),
  "node_modules/@resvg/resvg-wasm/index_bg.wasm"
);
const wasmBytes = fs.readFileSync(wasmPath);
await initWasm(wasmBytes);

// ----- API ROUTE -----
export async function GET(req, { params }) {
  const score = Number(params.score || 0);

  // Create SVG using Satori
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
                    strokeDasharray: `${score * 3.4} 999`,
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

  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return new Response(pngBuffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
