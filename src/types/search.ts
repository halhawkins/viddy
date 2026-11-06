import type { MovieWithMediaType, PersonWithMediaType, TVWithMediaType } from '.';

/**
 * A paginated search result.
 *
 * @see https://developer.themoviedb.org/reference/search-movie
 */
export interface Search<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

/**
 * A paginated multi-search response containing movie, TV show, and person results.
 *
 * @see https://developer.themoviedb.org/reference/search-multi
 */
export type MultiSearchResult =
  Search<MovieWithMediaType | TVWithMediaType | PersonWithMediaType>;
