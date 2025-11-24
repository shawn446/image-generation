import satori from "satori";
import { Resvg } from "@resvg/resvg-wasm";

export const runtime = "nodejs"; 
export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  const score = Number(params.score || 0);

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
          fontFamily: "sans-serif",
          background: "#f4f4f4",
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
                    stroke: "#333",
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
                fontSize: "48px",
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
      fonts: [],
    }
  );

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: 300,
    },
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
