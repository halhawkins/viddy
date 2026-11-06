import { type ReactNode, createContext, useState, useContext, useCallback, useMemo } from 'react';

type Display =
  | 'trending' | 'new' | 'popular-tv' | 'popular-movies' | 'search' | 'lists' | 'tv-series-details'
  | 'series-credits' | 'movie-credits' | 'episode-credits' | 'person-credits'
  | 'to-watch' | 'watched' | 'movie-details' | 'series-details'
  | 'person-details' | 'season-details' | 'episode-details' | 'none';

export interface Selection {
  breadcrumb: string; // text displayed on the breadcrumb menu
  display: Display;
  query: string;
  mediaType: 'movie' | 'tv' | 'none';
  tmdbId: number | null;
  title?: string;
  seasonNumber?: number;
  episodeNumber?: number;
  page?: number | null;
}

const initialSelection: Selection = {
  breadcrumb: 'Trending',
  display: 'trending',
  query: '',
  mediaType: 'none',
  tmdbId: null,
  page: null
};

interface SelectionContextType extends Selection {
  history: Selection[];                 // breadcrumb trail (previous entries)
  setDisplay: (display: Display) => void;
  setPage: (page: number | null) => void;
  setQueryString: (q: string) => void;
  setMedia: (mediaType: Selection['mediaType'], tmdbId: number | null,
             title?: string, seasonNumber?: number, episodeNumber?: number) => void;
  push: (next: Partial<Selection>) => void;   // save current, then apply changes
  pop: () => void;                            // restore the last saved
  popTo: (index: number) => void;             // jump back to a breadcrumb
  reset: (next?: Partial<Selection>) => void; // clear the stack (e.g. top-level nav)
}

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

export const SelectionProvider = ({ children }: { children: ReactNode }) => {
  const [current, setCurrent] = useState<Selection>(initialSelection);
  const [history, setHistory] = useState<Selection[]>([]);

  const setDisplay = useCallback((display: Display) => {
    setCurrent(c => ({ ...c, display }));
  }, []);

  const setPage = useCallback((page: number | null) => {
    setCurrent(c => ({ ...c, page }));
  }, []);

  const setQueryString = useCallback((query: string) => {
    setCurrent(c => ({ ...c, query }));
  }, []);

  const setMedia = useCallback<SelectionContextType['setMedia']>(
    (mediaType, tmdbId, title, seasonNumber, episodeNumber) => {
      setCurrent(c => ({ ...c, mediaType, tmdbId, title, seasonNumber, episodeNumber }));
    }, []);

  const push = useCallback((next: Partial<Selection>) => {
    setHistory(h => [...h, current]);
    setCurrent(c => ({ ...c, ...next }));
  }, [current]);

  const pop = useCallback(() => {
    setHistory(h => {
      if (h.length === 0) return h;
      setCurrent(h[h.length - 1]);
      return h.slice(0, -1);
    });
  }, []);

  const popTo = useCallback((index: number) => {
    setHistory(h => {
      if (index < 0 || index >= h.length) return h;
      setCurrent(h[index]);
      return h.slice(0, index);
    });
  }, []);

  const reset = useCallback((next: Partial<Selection> = {}) => {
    setHistory([]);
    setCurrent({ ...initialSelection, ...next });
  }, []);

  const value = useMemo<SelectionContextType>(() => ({
    ...current, history,
    setDisplay, setPage, setQueryString, setMedia, push, pop, popTo, reset,
  }), [current, history, setDisplay, setPage, setQueryString, setMedia, push, pop, popTo, reset]);

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
};

export const useSelectionContext = () => {
  const context = useContext(SelectionContext);
  if (!context) throw new Error('useSelectionContext must be used within a SelectionProvider');
  return context;
};