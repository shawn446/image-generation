import fs from "fs";
import path from "path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-wasm";

export const runtime = "nodejs"; // Required for WASM

// Load WASM from /public/resvg.wasm
const wasmPath = path.join(process.cwd(), "public/resvg.wasm");
const wasmBinary = fs.readFileSync(wasmPath);

// Load font
const fontPath = path.join(process.cwd(), "app/fonts/Inter-Regular.ttf");
const fontData = fs.readFileSync(fontPath);

export async function GET(req, { params }) {
  // Strip ".png" from folder param
  const score = Number(params.score.replace(".png", "")) || 0;

  // SVG markup via Satori
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
