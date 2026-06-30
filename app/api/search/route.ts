import { NextResponse, type NextRequest } from "next/server";
import { getSearchCandidates } from "@/lib/content";
import { selectQuickSearchResults } from "@/lib/quick-search";

function clampLimit(value: string | null) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 6;
  return Math.min(Math.max(Math.trunc(parsed), 1), 12);
}

export function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") || "";
  const limit = clampLimit(request.nextUrl.searchParams.get("limit"));
  const results = selectQuickSearchResults(getSearchCandidates(), query, limit).map((result) => ({
    groupLabel: result.groupLabel,
    signalLabel: result.signalLabel,
    preview: {
      slug: result.preview.slug,
      label: result.preview.label,
      courseCode: result.preview.courseCode,
      week: result.preview.week,
      excerpt: result.preview.excerpt,
      stats: result.preview.stats
    }
  }));

  return NextResponse.json({ results });
}
