import type { Metadata } from "next";
import Link from "next/link";
import PackfolioBadge from "@/components/PackfolioBadge";
import { fetchPackageByName, fetchPackageStats, fetchGitHubStarsForPackage } from "@/lib/api";
import { calculateHealthScore } from "@/lib/advancedApi";
import type { PackageData, PackageStats } from "@/types";

interface BadgePageProps {
  params: {
    packageName: string[];
  };
}

export async function generateMetadata({ params }: BadgePageProps): Promise<Metadata> {
  const packageName = params.packageName.join("/");
  return {
    title: `${packageName} Badge | PackFolio`,
    description: `Standalone PackFolio badge for ${packageName}. Verify package authenticity and export badge assets.`,
  };
}

export default async function BadgePage({ params }: BadgePageProps) {
  const packageName = params.packageName.join("/");
  const pkg = await fetchPackageByName(packageName);

  if (!pkg) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4">
        <div className="mx-auto max-w-3xl rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Badge not found</h1>
          <p className="mt-4 text-sm text-slate-600">
            We could not resolve the package <span className="font-mono text-slate-800">{packageName}</span>.
          </p>
          <div className="mt-6 inline-flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Back to Packfolio
            </Link>
            <a
              href={`https://www.npmjs.com/package/${encodeURIComponent(packageName)}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              View on npm
            </a>
          </div>
        </div>
      </div>
    );
  }

  let stats: PackageStats = {
    daily: 0,
    weekly: 0,
    monthly: 0,
    allTime: 0,
    downloads: [],
  };
  let githubStars: number | undefined = undefined;

  try {
    stats = await fetchPackageStats(pkg.name);
  } catch (error) {
    console.warn(`Badge route: failed to fetch stats for ${pkg.name}`, error);
  }

  try {
    githubStars = await fetchGitHubStarsForPackage(pkg.name, pkg.repositoryUrl);
  } catch (error) {
    console.warn(`Badge route: failed to fetch GitHub stars for ${pkg.name}`, error);
  }

  const packageData: PackageData = {
    ...pkg,
    stats,
    githubStars,
  };

  let healthScore = undefined;
  try {
    healthScore = calculateHealthScore(packageData);
  } catch (error) {
    console.warn(`Badge route: failed to calculate health score for ${pkg.name}`, error);
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="mx-auto max-w-3xl">
        <PackfolioBadge pkg={packageData} healthScore={healthScore} showControls={false} />
      </div>
    </div>
  );
}
