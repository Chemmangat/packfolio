"use client";

import Globe from "react-globe.gl";
import { useRef, useEffect } from "react";
import { formatNumber } from "@/lib/utils";

interface Point {
  country: string;
  lat: number;
  lng: number;
  weight: number;
  downloads: number;
}

interface Props {
  pointsData: Point[];
  maxDownloads: number;
  hovered: Point | null;
  onHover: (point: Point | null) => void;
  theme: "dark" | "light";
}

export default function GlobeWrapper({
  pointsData,
  maxDownloads,
  hovered,
  onHover,
  theme,
}: Props) {
  const ref = useRef<any>(null);

  useEffect(() => {
    const controls = ref.current?.controls?.();
    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.4;
      controls.enableZoom = false;
    }
  }, []);

  const isDark = theme === "dark";

  // Dark: NASA night-lights. Light: Natural Earth day texture.
  const globeImageUrl = isDark
    ? "//unpkg.com/three-globe/example/img/earth-night.jpg"
    : "//unpkg.com/three-globe/example/img/earth-day.jpg";

  const atmosphereColor = isDark ? "#3b82f6" : "#60a5fa";

  return (
    <Globe
      ref={ref}
      width={560}
      height={380}
      backgroundColor="rgba(0,0,0,0)"
      globeImageUrl={globeImageUrl}
      bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
      pointsData={pointsData}
      pointLat="lat"
      pointLng="lng"
      pointAltitude={(d: any) => 0.01 + (d.downloads / maxDownloads) * 0.07}
      pointRadius={(d: any) => 0.5 + (d.downloads / maxDownloads) * 1.4}
      pointColor={(d: any) => {
        if (d === hovered) return "#ffffff";
        const intensity = 0.45 + (d.downloads / maxDownloads) * 0.55;
        return isDark
          ? `rgba(239,68,68,${intensity})`
          : `rgba(220,38,38,${intensity})`;
      }}
      pointLabel={(d: any) => {
        const bg = isDark ? "#1a1a1a" : "#ffffff";
        const border = isDark ? "#333" : "#e0e0e0";
        const text = isDark ? "#fff" : "#111";
        return `<div style="font-family:monospace;font-size:11px;background:${bg};border:1px solid ${border};padding:6px 10px;border-radius:6px;color:${text};box-shadow:0 4px 12px rgba(0,0,0,0.15)">
          <strong>${d.country}</strong><br/>
          <span style="color:#ef4444">~${formatNumber(d.downloads)} downloads</span>
        </div>`;
      }}
      onPointHover={(p: any) => onHover(p)}
      atmosphereColor={atmosphereColor}
      atmosphereAltitude={0.18}
    />
  );
}
