/**
 * SITE SEARCH HOOK
 * Shared search logic for navbar search components
 */

import { useMemo } from "react";
import { searchSiteIndex } from "../utils/siteSearchIndex";

export const useSiteSearch = (searchQuery) => {
  const suggestions = useMemo(() => {
    if (!searchQuery || searchQuery.trim() === "") {
      return [];
    }

    const results = searchSiteIndex(searchQuery);
    // Limit to 8 results for UI
    return results.slice(0, 8);
  }, [searchQuery]);

  const hasResults = suggestions.length > 0;
  const isEmptyQuery = !searchQuery || searchQuery.trim() === "";

  return {
    suggestions,
    hasResults,
    isEmptyQuery,
    query: searchQuery,
  };
};
