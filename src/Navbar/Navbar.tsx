import { type FC, type MouseEvent, useEffect, useState, useRef } from 'react';
import { useSelectionContext } from '../SelectionContext';
import scrollLeft from '../assets/arrow-left-cricle.svg';
import scrollRight from '../assets/arrow-right-cricle.svg';

export const Navbar:FC = () => {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const trendingRef = useRef<HTMLDivElement>(null);
  const newShowsRef = useRef<HTMLDivElement>(null);
  const popularTVRef = useRef<HTMLDivElement>(null);
  const popularMoviesRef = useRef<HTMLDivElement>(null);
  const listsRef = useRef<HTMLDivElement>(null);
  const toWatch = useRef<HTMLDivElement>(null);
  const watched = useRef<HTMLDivElement>(null);
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const scrollDirectionRef = useRef<-1 | 1 | null>(null);

  const selectionState = useSelectionContext();

  useEffect(() => {
    const container = scrollContainerRef.current;
    const content = menuContainerRef.current;
    if (!container || !content) return;

    const updateScrollControls = () => {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(container.scrollLeft + container.clientWidth < container.scrollWidth - 1);
    };
    const resizeObserver = new ResizeObserver(updateScrollControls);

    updateScrollControls();
    container.addEventListener('scroll', updateScrollControls);
    resizeObserver.observe(container);
    resizeObserver.observe(content);
    window.addEventListener('resize', updateScrollControls);

    return () => {
      container.removeEventListener('scroll', updateScrollControls);
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateScrollControls);
    };
  }, []);

  const stopScrolling = () => {
    scrollDirectionRef.current = null;
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  const startScrolling = (direction: -1 | 1) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    scrollDirectionRef.current = direction;
    if (animationFrameRef.current !== null) return;

    let previousTime: number | null = null;
    const scroll = (time: number) => {
      const currentContainer = scrollContainerRef.current;
      const currentDirection = scrollDirectionRef.current;
      if (!currentContainer || currentDirection === null) {
        animationFrameRef.current = null;
        return;
      }

      if (previousTime === null) {
        previousTime = time;
        animationFrameRef.current = requestAnimationFrame(scroll);
        return;
      }

      const elapsed = time - previousTime;
      previousTime = time;
      currentContainer.scrollLeft += currentDirection * Math.min(elapsed, 32) * 0.3;

      const reachedEdge = currentDirection < 0
        ? currentContainer.scrollLeft <= 0
        : currentContainer.scrollLeft + currentContainer.clientWidth >= currentContainer.scrollWidth - 1;
      if (reachedEdge) {
        stopScrolling();
        return;
      }
      animationFrameRef.current = requestAnimationFrame(scroll);
    };

    animationFrameRef.current = requestAnimationFrame(scroll);
  };

  useEffect(() => {
    const sel = selectionState.display;
    if (menuContainerRef.current) {
      const menuElements = Array.from(menuContainerRef.current.children);
      menuElements.forEach(item => item.classList.add("text=gray-400"));
      menuElements.forEach(item => item.classList.remove("text-yellow-300"));
    }
    switch(sel) {
      case 'trending':
        if (trendingRef) {
          trendingRef.current?.classList.remove('text-gray-400'); 
          trendingRef.current?.classList.add("text-yellow-300");
        }
        break;
      case 'new':
        if (newShowsRef) {
          newShowsRef.current?.classList.remove("text-gray-400");
          newShowsRef.current?.classList.add("text-yellow-300");
        }
        break;
      case 'popular-tv':
        if (popularTVRef) {
          popularTVRef.current?.classList.remove("text-gray-400");
          popularTVRef.current?.classList.add("text-yellow-300");
        }
        break;
      case 'popular-movies':
        if (popularMoviesRef) {
          popularMoviesRef.current?.classList.remove("text-gray-400");
          popularMoviesRef.current?.classList.add("text-yellow-300");
        }
        break;
      case 'lists':
        if (listsRef) {
          listsRef.current?.classList.remove("text-gray-400");
          listsRef.current?.classList.add("text-yellow-300");
        }
        break;
      case 'to-watch':
        if (toWatch) {
          toWatch.current?.classList.remove("text-gray-400");
          toWatch.current?.classList.add("text-yellow-300");
        }
        break;
      case 'watched':
        if (watched) {
          watched.current?.classList.remove("text-gray-400");
          watched.current?.classList.add("text-yellow-300");
        }
        break;
    }
  },[selectionState])

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const keyVal = target.getAttribute("data-key");
    if (keyVal === null) return;

    switch (keyVal) {
      case 'trending':
      case 'new':
      case 'popular-tv':
      case 'popular-movies':
      case 'lists':
      case 'to-watch':
      case 'watched':
        selectionState.reset({ display: keyVal });
        break;
    }
    
  }

    return (
        <nav className="max-w-xl">
          <div className="relative">
            <div ref={scrollContainerRef} className="w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div ref={menuContainerRef} className="w-max min-w-full flex flex-nowrap my-4 text-base justify-between">
                <div data-key={"trending"} ref={trendingRef} className="shrink-0 text-gray-400 cursor-pointer hover:text-gray-300" onClick={handleClick}>Trending</div>
                <div className="shrink-0"> • </div>
                <div data-key={"new"} ref={newShowsRef} className="shrink-0 text-gray-400 cursor-pointer hover:text-gray-300" onClick={handleClick}>TV Today</div>
                <div className="shrink-0"> • </div>
                <div data-key={"popular-tv"} ref={popularTVRef} className="shrink-0 text-gray-400 cursor-pointer hover:text-gray-300" onClick={handleClick}>Popular TV</div>
                <div className="shrink-0"> • </div>
                <div data-key={"popular-movies"} ref={popularMoviesRef} className="shrink-0 text-gray-400 cursor-pointer hover:text-gray-300" onClick={handleClick}>Popular Movies</div>
                <div className="shrink-0"> • </div>
                <div data-key={"lists"} ref={listsRef} className="shrink-0 text-gray-400 cursor-pointer hover:text-gray-300" onClick={handleClick}>Lists</div>
                <div className="shrink-0"> • </div>
                <div data-key={"to-watch"} ref={toWatch} className="shrink-0 text-gray-400 cursor-pointer hover:text-gray-300" onClick={handleClick}>To Watch</div>
                <div className="shrink-0"> • </div>
                <div data-key={"watched"} ref={watched} className="shrink-0 text-gray-400 cursor-pointer hover:text-gray-300" onClick={handleClick}>Watched</div>
              </div>
            </div>
            {canScrollLeft && (
              <button
                type="button"
                aria-label="Scroll menu left"
                className="absolute left-0 top-1/2 z-10 -translate-y-1/2 cursor-pointer z-10"
                onPointerEnter={event => { if (event.pointerType !== 'touch') startScrolling(-1); }}
                onPointerLeave={stopScrolling}
                onPointerDown={() => startScrolling(-1)}
                onPointerUp={stopScrolling}
                onPointerCancel={stopScrolling}
                onClick={() => startScrolling(-1)}
              >
                <img src={scrollLeft} alt="" />
              </button>
            )}
            {canScrollRight && (
              <button
                type="button"
                aria-label="Scroll menu right"
                className="absolute right-0 top-1/2 z-10 -translate-y-1/2 cursor-pointer z-10"
                onPointerEnter={event => { if (event.pointerType !== 'touch') startScrolling(1); }}
                onPointerLeave={stopScrolling}
                onPointerDown={() => startScrolling(1)}
                onPointerUp={stopScrolling}
                onPointerCancel={stopScrolling}
                onClick={() => startScrolling(1)}
              >
                <img src={scrollRight} alt="" />
              </button>
            )}
          </div>
        </nav>
    )
}