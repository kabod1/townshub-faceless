import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 64,
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #081530 0%, #0D2A60 45%, #1956A8 100%)",
        borderRadius: 14,
      }}
    >
      <svg viewBox="0 0 64 64" width="52" height="52">
        <rect x="3"  y="3"  width="34" height="11" fill="white"/>
        <rect x="33" y="3"  width="5"  height="11" fill="white"/>
        <rect x="3"  y="14" width="12" height="47" fill="white"/>
        <rect x="33" y="18" width="9"  height="43" fill="white"/>
        <rect x="33" y="30" width="28" height="10" fill="white"/>
        <rect x="52" y="3"  width="9"  height="58" fill="white"/>
      </svg>
    </div>,
    { ...size }
  );
}
