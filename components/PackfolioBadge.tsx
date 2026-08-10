"use client";

import { useMemo, useState, useRef, useCallback, memo } from "react";
import { Button, Tooltip, message } from "antd";
import {
  DownloadOutlined,
  PictureOutlined,
  CodeOutlined,
  CheckOutlined,
  CopyOutlined,
  SafetyCertificateOutlined,
  LockOutlined,
} from "@ant-design/icons";
import type { PackageData, HealthScore } from "@/types";
import { formatCompactNumber } from "@/lib/utils";
import { config } from "@/lib/config";
import Image from "next/image";
import * as htmlToImage from "html-to-image";

// ------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------

const BADGE_WIDTH = 640;
const BADGE_HEIGHT = 280;
const COPY_FEEDBACK_DURATION = 2000;

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

interface PackfolioBadgeProps {
  pkg: PackageData;
  healthScore?: HealthScore;
  className?: string;
  showControls?: boolean;
}

// ------------------------------------------------------------------
// Subcomponent: Stat (high‑contrast)
// ------------------------------------------------------------------

const Stat = memo(function Stat({
  label,
  value,
  barPercentage,
}: {
  label: string;
  value: string;
  barPercentage?: number;
}) {
  const clamped =
    typeof barPercentage === "number" ? Math.min(barPercentage, 100) : 0;
  const isHealthy = clamped >= 70;
  const barColor = isHealthy
    ? "bg-green-500"
    : clamped >= 40
      ? "bg-amber-500"
      : "bg-red-500";

  return (
    <div className="space-y-1">
      <div className="text-xs font-mono uppercase tracking-widest text-gray-500">
        {label}
      </div>
      <div className="text-xl font-extrabold text-black">{value}</div>
      {typeof barPercentage === "number" && (
        <div className="mt-1.5 h-2 w-full rounded-full bg-gray-200 overflow-hidden shadow-inner">
          <div
            className={`h-full rounded-full ${barColor} transition-all duration-500 ease-out shadow-sm`}
            style={{ width: `${clamped}%` }}
            role="progressbar"
            aria-valuenow={clamped}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      )}
    </div>
  );
});

Stat.displayName = "Stat";

// ------------------------------------------------------------------
// SVG Generator – with pure white background & high contrast
// ------------------------------------------------------------------

function generateBadgeSvg(pkg: PackageData, healthScore?: HealthScore): string {
  const {
    name,
    version,
    description = "",
    stats: { allTime },
    githubStars = 0,
    lastPublish,
  } = pkg;

  const score = healthScore?.score ?? 0;
  const scoreLabel = healthScore ? `${score}/100` : "N/A";
  const publishDate = lastPublish
    ? new Date(lastPublish).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Unknown";
  const certId = `PKF-${Date.now().toString(36).toUpperCase()}-${name.slice(0, 4).toUpperCase()}`;

  // High‑contrast palette for SVG
  const colors = {
    bg: "#ffffff",
    border: "#d1d5db",
    primaryText: "#000000",
    secondaryText: "#1a1a1a",
    tertiaryText: "#4b5563",
    barBg: "#e5e7eb",
    barFill: "#22c55e",
  };

  const stats = [
    { label: "Health Score", value: scoreLabel, bar: Math.min(score, 100) },
    { label: "Total Downloads", value: formatCompactNumber(allTime) },
    { label: "GitHub Stars", value: formatCompactNumber(githubStars) },
    { label: "Last Published", value: publishDate },
  ];

  const esc = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${BADGE_WIDTH}" height="${BADGE_HEIGHT}" viewBox="0 0 ${BADGE_WIDTH} ${BADGE_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="shadow" x="-2%" y="-2%" width="104%" height="108%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000000" flood-opacity="0.12" />
    </filter>
    <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#22c55e" />
      <stop offset="100%" stop-color="#16a34a" />
    </linearGradient>
  </defs>

  <!-- Solid white background -->
  <rect width="100%" height="100%" rx="16" fill="${colors.bg}" stroke="${colors.border}" stroke-width="1.5" filter="url(#shadow)" />

  <!-- Top accent (thicker for visibility) -->
  <rect x="24" y="0" width="${BADGE_WIDTH - 48}" height="4" rx="2" fill="#000000" opacity="0.8" />

  <!-- Header -->
  <image href="/packfolio_logo.png" x="24" y="20" width="40" height="40" />
  <text x="74" y="32" font-family="Georgia, serif" font-size="18" font-weight="700" fill="${colors.primaryText}" letter-spacing="0.06em">CERTIFICATE OF AUTHENTICITY</text>
  <text x="74" y="52" font-family="Inter, system-ui, sans-serif" font-size="12" fill="${colors.tertiaryText}" font-weight="500">Verified by Packfolio · npm package validation</text>

  <!-- Security badge (high contrast) -->
  <g transform="translate(${BADGE_WIDTH - 148}, 16)">
    <rect x="0" y="0" width="124" height="34" rx="17" fill="#f3f4f6" stroke="#d1d5db" stroke-width="1.5" />
    <text x="16" y="23" font-family="Inter, system-ui, sans-serif" font-size="12" font-weight="700" fill="${colors.primaryText}">🔒 SECURE</text>
    <text x="66" y="23" font-family="Inter, system-ui, sans-serif" font-size="10" fill="${colors.tertiaryText}" font-weight="500">· ${esc(certId)}</text>
  </g>

  <!-- Package identity -->
  <text x="24" y="96" font-family="Inter, system-ui, sans-serif" font-size="26" font-weight="800" fill="${colors.primaryText}" letter-spacing="-0.02em">${esc(name)}</text>
  <text x="24" y="124" font-family="Inter, system-ui, sans-serif" font-size="15" fill="${colors.secondaryText}" font-weight="500">v${esc(version)}${description ? ` • ${esc(description.slice(0, 60))}${description.length > 60 ? "…" : ""}` : ""}</text>

  <line x1="24" y1="142" x2="${BADGE_WIDTH - 24}" y2="142" stroke="${colors.border}" stroke-width="1.5" />

  ${stats
    .map((stat, i) => {
      const x = 24 + (i % 2) * 290;
      const y = 162 + Math.floor(i / 2) * 54;
      const isScore = stat.label === "Health Score";
      const barWidth =
        isScore && typeof stat.bar === "number"
          ? Math.min(stat.bar * 1.6, 160)
          : 0;
      return `
        <text x="${x}" y="${y}" font-family="Inter, system-ui, sans-serif" font-size="10" fill="${colors.tertiaryText}" letter-spacing="0.1em" font-weight="600">${esc(stat.label)}</text>
        <text x="${x}" y="${y + 22}" font-family="Inter, system-ui, sans-serif" font-size="20" font-weight="800" fill="${colors.primaryText}">${esc(stat.value)}</text>
        ${
          isScore && typeof stat.bar === "number"
            ? `
          <rect x="${x}" y="${y + 34}" width="160" height="4" rx="2" fill="${colors.barBg}" />
          <rect x="${x}" y="${y + 34}" width="${barWidth}" height="4" rx="2" fill="url(#barGrad)" />
        `
            : ""
        }
      `;
    })
    .join("")}

  <text x="24" y="${BADGE_HEIGHT - 16}" font-family="Inter, system-ui, sans-serif" font-size="10" fill="${colors.tertiaryText}" font-weight="500">Data sourced from npm &amp; GitHub · Issued ${new Date().toLocaleDateString()} · Packfolio</text>
</svg>`;
}

// ------------------------------------------------------------------
// Download / Copy Helpers (unchanged)
// ------------------------------------------------------------------

const createSvgDownload = (filename: string, svg: string) => {
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};

const createPngDownload = async (
  filename: string,
  element: HTMLElement | null,
) => {
  if (!element) {
    message.error("Badge preview not available.");
    return;
  }
  try {
    const dataUrl = await htmlToImage.toPng(element, {
      quality: 1,
      backgroundColor: "#ffffff",
      pixelRatio: 2,
      skipAutoScale: true,
    });
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    link.click();
  } catch (err) {
    console.error("PNG export error:", err);
    message.error("Failed to generate PNG. Please try SVG.");
  }
};

const copyEmbedCode = async (svg: string, format: "markdown" | "html") => {
  const encoded = encodeURIComponent(svg);
  const dataUrl = `data:image/svg+xml;charset=utf-8,${encoded}`;
  let code = "";
  if (format === "markdown") {
    code = `![Packfolio Badge](${dataUrl})`;
  } else {
    code = `<img src="${dataUrl}" alt="Packfolio Badge" />`;
  }
  try {
    await navigator.clipboard.writeText(code);
    message.success(
      `${format === "markdown" ? "Markdown" : "HTML"} embed code copied!`,
    );
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = code;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    message.success(
      `${format === "markdown" ? "Markdown" : "HTML"} embed code copied!`,
    );
  }
};

// ------------------------------------------------------------------
// Main Component
// ------------------------------------------------------------------

export default function PackfolioBadge({
  pkg,
  healthScore,
  className = "",
  showControls = true,
}: PackfolioBadgeProps) {
  const badgeSvg = useMemo(
    () => generateBadgeSvg(pkg, healthScore),
    [pkg, healthScore],
  );

  const [copiedMd, setCopiedMd] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const badgeRef = useRef<HTMLDivElement>(null);

  const handleCopyMarkdown = useCallback(async () => {
    await copyEmbedCode(badgeSvg, "markdown");
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), COPY_FEEDBACK_DURATION);
  }, [badgeSvg]);

  const handleCopyHtml = useCallback(async () => {
    await copyEmbedCode(badgeSvg, "html");
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), COPY_FEEDBACK_DURATION);
  }, [badgeSvg]);

  const handleSvgDownload = useCallback(() => {
    createSvgDownload(`${pkg.name}-certificate.svg`, badgeSvg);
  }, [pkg.name, badgeSvg]);

  const badgeUrl = `${config.app.url}/badge/${pkg.name
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;

  const handlePngDownload = useCallback(() => {
    createPngDownload(`${pkg.name}-certificate.png`, badgeRef.current);
  }, [pkg.name]);

  const handleCopyBadgeUrl = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(badgeUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), COPY_FEEDBACK_DURATION);
      message.success("Badge URL copied to clipboard.");
    } catch {
      message.error("Unable to copy badge URL.");
    }
  }, [badgeUrl]);

  return (
    <div
      className={`bg-white rounded-2xl border border-gray-300 p-6 shadow-lg ${className}`}
      role="region"
      aria-label="Package certificate badge"
      style={{ background: "#ffffff" }} // enforce white
    >
      {showControls && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div>
            <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <SafetyCertificateOutlined className="text-gray-600" />
              Certificate Badge
            </h3>
            <p className="text-sm text-gray-600">
              Export a verified package certificate as SVG, PNG, or embed code.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Tooltip title="Download vector SVG">
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleSvgDownload}
                size="small"
                className="shadow-sm"
              >
                SVG
              </Button>
            </Tooltip>
            <Tooltip title="Download high-res PNG">
              <Button
                icon={<PictureOutlined />}
                onClick={handlePngDownload}
                size="small"
              >
                PNG
              </Button>
            </Tooltip>
            <Tooltip title="Copy Markdown embed">
              <Button
                icon={copiedMd ? <CheckOutlined /> : <CopyOutlined />}
                onClick={handleCopyMarkdown}
                size="small"
              >
                {copiedMd ? "Copied" : "MD"}
              </Button>
            </Tooltip>
            <Tooltip title="Copy HTML embed">
              <Button
                icon={copiedHtml ? <CheckOutlined /> : <CodeOutlined />}
                onClick={handleCopyHtml}
                size="small"
              >
                {copiedHtml ? "Copied" : "HTML"}
              </Button>
            </Tooltip>
          </div>
        </div>
      )}

      {/* Badge Preview – SOLID WHITE background */}
      <div className="flex justify-center">
        <div
          ref={badgeRef}
          className="relative w-full max-w-[640px] rounded-2xl bg-white p-5 shadow-xl border border-gray-300 transition-all duration-200 hover:shadow-2xl"
          style={{ background: "#ffffff" }}
        >
          {/* Top accent – black for contrast */}
          <div className="absolute top-0 left-6 right-6 h-1 bg-black rounded-full opacity-80" />

          <div className="relative">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Image
                  src="/packfolio_logo.png"
                  alt="Packfolio logo"
                  width={40}
                  height={40}
                  className="rounded"
                />
                <div>
                  <div className="text-base font-bold text-black font-serif tracking-wider">
                    Certificate of Authenticity
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    Verified by Packfolio · npm package validation
                  </div>
                </div>
              </div>
              <div className="bg-gray-100 border border-gray-300 rounded-full px-3 py-1 text-xs font-bold text-black flex items-center gap-1.5">
                <LockOutlined className="text-sm" />
                SECURE
              </div>
            </div>

            {/* Package identity */}
            <div className="mt-4">
              <div className="text-2xl font-extrabold text-black tracking-tight">
                {pkg.name}
              </div>
              <div className="text-sm text-gray-700 font-medium mt-0.5">
                v{pkg.version} {pkg.description && `• ${pkg.description}`}
              </div>
            </div>

            {/* Divider */}
            <div className="my-3 border-t border-gray-300" />

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              <Stat
                label="Health Score"
                value={healthScore ? `${healthScore.score}/100` : "N/A"}
                barPercentage={healthScore?.score}
              />
              <Stat
                label="Total Downloads"
                value={formatCompactNumber(pkg.stats.allTime)}
              />
              <Stat
                label="GitHub Stars"
                value={formatCompactNumber(pkg.githubStars ?? 0)}
              />
              <Stat
                label="Last Published"
                value={
                  pkg.lastPublish
                    ? new Date(pkg.lastPublish).toLocaleDateString()
                    : "Unknown"
                }
              />
            </div>

            {/* Footer */}
            <div className="mt-4 text-xs text-gray-400 flex justify-between font-medium">
              <span>Data sourced from npm &amp; GitHub</span>
              <span>Issued {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-gray-200 bg-slate-50 p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-slate-600 break-words">
          Badge URL:{" "}
          <span className="font-mono text-slate-800">{badgeUrl}</span>
        </div>
        <Button
          type="default"
          icon={copiedUrl ? <CheckOutlined /> : <CopyOutlined />}
          onClick={handleCopyBadgeUrl}
          size="small"
        >
          {copiedUrl ? "Copied" : "Copy badge URL"}
        </Button>
      </div>
    </div>
  );
}
