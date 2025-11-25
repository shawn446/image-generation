import fs from "fs";
import path from "path";
import satori from "satori";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const runtime = "nodejs";

const fontPath = path.join(process.cwd(), "app/fonts/Inter-Regular.ttf");
const fontData = fs.readFileSync(fontPath);

const getGradientColors = (score) => {
  if (score >= 70) return { start: "#00D68F", end: "#7FFF4A" };
  if (score >= 51) return { start: "#FFAA55", end: "#C8E946" };
  return { start: "#FF5F7E", end: "#FF6B47" };
};

export async function GET(req, { params }) {
  const raw = String(params.score || "").replace(".svg", "").replace(".png", "");
  const score = Math.min(100, Math.max(0, Number(raw) || 0));

  const { start, end } = getGradientColors(score);
  const circumference = 2 * Math.PI * 54;
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

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
