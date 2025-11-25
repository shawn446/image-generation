import fs from "fs";
import path from "path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const runtime = "nodejs";

// Load font once at startup
const fontPath = path.join(process.cwd(), "app/fonts/Inter-Regular.ttf");
const fontData = fs.readFileSync(fontPath);

// Color thresholds: red 0-50, yellow 51-69, green 70+
const getGradientColors = (score) => {
  if (score >= 70) return { start: "#00cc66", end: "#00ff88" }; // green
  if (score >= 51) return { start: "#ff9900", end: "#ffcc00" }; // yellow
  return { start: "#cc0000", end: "#ff4444" }; // red
};

export async function GET(req, { params }) {
  const raw = String(params.score || "").replace(".png", "");
  const score = Math.min(100, Math.max(0, Number(raw) || 0)); // clamp 0-100

  const { start, end } = getGradientColors(score);
  const circumference = 2 * Math.PI * 54; // ~339
  const strokeDasharray = `${(score / 100) * circumference} ${circumference}`;

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "600px",
          height: "600px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          background: "white",
        },
        children: [
          {
            type: "svg",
            props: {
              width: 600,
              height: 600,
              viewBox: "0 0 120 120",
              children: [
                // Gradient definition
                {
                  type: "defs",
                  props: {
                    children: [
                      {
                        type: "linearGradient",
                        props: {
                          id: "ringGradient",
                          x1: "0%",
                          y1: "0%",
                          x2: "100%",
                          y2: "100%",
                          children: [
                            {
                              type: "stop",
                              props: { offset: "0%", stopColor: start },
                            },
                            {
                              type: "stop",
                              props: { offset: "100%", stopColor: end },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                // Background track
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
                // Progress ring with gradient
                {
                  type: "circle",
                  props: {
                    cx: 60,
                    cy: 60,
                    r: 54,
                    stroke: "url(#ringGradient)",
                    strokeWidth: 12,
                    fill: "none",
                    strokeDasharray: strokeDasharray,
                    transform: "rotate(-90 60 60)",
                    strokeLinecap: "round",
                  },
                },
              ],
            },
          },
          // Score text
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                fontSize: 96,
                fontWeight: 400,
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
      width: 600,
      height: 600,
      fonts: [
        {
          name: "Inter",
          data: fontData,
          weight: 400,
        },
      ],
    }
  );

  const renderer = new Resvg(svg, {
    fitTo: { mode: "width", value: 600 },
  });
  const png = renderer.render().asPng();

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
