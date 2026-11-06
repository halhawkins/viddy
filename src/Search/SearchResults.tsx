import { type FC, useEffect, useState } from "react";
import { useSelectionContext } from "../SelectionContext"
import type { MultiSearchResult } from "../types";
import { Pagination } from "../Pagination/Pagination";
import settings from '../settings.json';
import { PosterImage } from "../PosterImage/PosterImage";

type SearchResultItem = MultiSearchResult['results'][number];

export const SearchResults: FC = () => {
    const ctx = useSelectionContext();
    const [queryResults, setQueryResults] = useState<MultiSearchResult|null>(null)
    const [ currentPage, setCurrentPage] = useState<number>(ctx.page ?? 1);
    const [ totalPages, setTotalPages] = useState<number>(1);
    
    const clickedItemHandler = (_item: SearchResultItem) => {
        ctx.push({
            display: _item.media_type === 'tv' ? 'tv-series-details' : _item.media_type === 'movie' ? 'movie-details' : 'person-details',
            mediaType: _item.media_type === 'person' ? 'none' : _item.media_type,
            tmdbId: _item.id
        });
    }
    
    const getSearchResults = async (page: number) => {
        if (!ctx.query) return;
        try {
            const response = await fetch(`${settings.api}/search/multi?page=${page}&query=${ctx.query}`);
            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }
            const data: MultiSearchResult = await response.json();
            if (data !== null){
                if ("page" in data) {
                    setCurrentPage(data.page as number);
                    ctx.setPage(data.page as number);
                    if ("total_pages" in data) {
                        setTotalPages(data.total_pages as number);
                        setQueryResults(data);
                    }
                }
            }
        } catch (error) {
            console.error("Error getting Search results", error);
        }
    }

    useEffect(() => {
        if (ctx.display === 'search') {
            getSearchResults(currentPage);
        }
    }, [ctx.display])

    useEffect(() => {
        if (ctx.display === 'search')
            getSearchResults(currentPage);
    }, [ctx.query])

    return (
        <div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
                {queryResults !== null && "results" in queryResults && Array.isArray(queryResults.results) ? queryResults.results.map(item => (
                    <div key={item.id} className="bg-gray-800 rounded-lg" onClick={() => clickedItemHandler(item)}>
                        <PosterImage item={{ ...item}} />
                        <div className="p-2 text-white text-xs hover:text-gray-300">
                            {'name' in item ? item.name : item.title}
                        </div>
                    </div>
                )):null}
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={page => void getSearchResults(page)} />
        </div>
    )
}
