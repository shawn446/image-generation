import fs from "fs";
import path from "path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

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
  const raw = String(params.score || "").replace(".png", "");
  const score = Math.min(100, Math.max(0, Number(raw) || 0));

  const { start, end } = getGradientColors(score);
  
  // Generate at 2x for crisp rendering
  const width = 600;
  const height = 16;
  const barWidth = (score / 100) * width;

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: `${width}px`,
          height: `${height}px`,
          display: "flex",
          position: "relative",
          background: "#e5e7eb",
          borderRadius: "8px",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                width: `${barWidth}px`,
                height: `${height}px`,
                background: `linear-gradient(90deg, ${start}, ${end})`,
                borderRadius: "8px",
              },
            },
          },
        ],
      },
    },
    {
      width,
      height,
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
    fitTo: { mode: "width", value: width },
  });
  const png = renderer.render().asPng();

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
