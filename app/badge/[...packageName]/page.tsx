import type { Metadata } from "next";
import PackfolioBadge from "@/components/PackfolioBadge";
import { fetchPackageByName, fetchPackageStats, fetchGitHubStarsForPackage } from "@/lib/api";
import { calculateHealthScore } from "@/lib/advancedApi";
import type { PackageData } from "@/types";

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
            Please check that the package exists and try again.
          </p>
        </div>
      </div>
    );
  }

  const stats = await fetchPackageStats(pkg.name);
  const githubStars = await fetchGitHubStarsForPackage(pkg.name, pkg.repositoryUrl);
  const packageData: PackageData = {
    ...pkg,
    stats,
    githubStars,
  };
  const healthScore = calculateHealthScore(packageData);

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="mx-auto max-w-3xl">
        <PackfolioBadge pkg={packageData} healthScore={healthScore} showControls={false} />
      </div>
    </div>
  );
}
