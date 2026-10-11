import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

// The preview image shown when a link to the site is shared on WhatsApp, Facebook, etc.
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 80,
        background: "#FFF0F5",
        color: "#17164F",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 26,
            background: "#FF2D68",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              marginLeft: 10,
              borderTop: "22px solid transparent",
              borderBottom: "22px solid transparent",
              borderLeft: "36px solid white",
            }}
          />
        </div>
        <div style={{ fontSize: 64, fontWeight: 800 }}>{siteConfig.name}</div>
      </div>
      <div
        style={{
          marginTop: 48,
          fontSize: 60,
          fontWeight: 800,
          lineHeight: 1.15,
          maxWidth: 950,
        }}
      >
        Maths and Science video lessons for Classes 6–10
      </div>
      <div style={{ marginTop: 28, fontSize: 32, color: "#414567" }}>
        Chapter by chapter · CBSE / NCERT
      </div>
    </div>,
    size,
  );
}
