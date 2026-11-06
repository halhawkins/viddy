import { type FC, useState, useEffect } from 'react';
import trendingData from '../trending.json';
import { useSelectionContext } from '../SelectionContext';
import settings from '../settings.json';
import { Pagination } from '../Pagination/Pagination';
import type { TvShowsAiringToday, OnTheAir } from '../types';
import { PosterImage } from '../PosterImage/PosterImage';

type newShowsItem = TvShowsAiringToday['results'][number];

export const OnToday: FC = () => {
    const context = useSelectionContext();
    const [newShows, setNewShows] = useState<newShowsItem[]>([]);
    const [currentPage, setCurrentPage] = useState(context.page ?? trendingData.page);
    const [totalPages, setTotalPages] = useState(trendingData.total_pages);

    const clickedItemHandler = (item: newShowsItem) => {
        context.push({ display: 'tv-series-details', mediaType: 'tv', tmdbId: item.id, title: item.name });
    }

    const getNewShows = async (page: number) => {
        try {
            const response = await fetch(`${settings.api}/tv/airing_today?page=${page}`);
            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }
            const data: OnTheAir = await response.json();
            setNewShows(data.results);
            setCurrentPage(data.page);
            setTotalPages(data.total_pages);
            context.setPage(data.page);
        } catch (error) {
            console.error("Error getting Trending results", error);
        }
    }
    useEffect(() => {
        void getNewShows(currentPage);
    }, []);

    return (
        <div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
                {newShows && newShows.map(item => (
                    <div key={item.id} className="bg-gray-800 rounded-lg" onClick={() => clickedItemHandler(item)}>
                        <PosterImage item={{ ...item, media_type: 'tv' }} />
                        <div className="p-2 text-white text-xs">
                            {item.name}
                        </div>
                    </div>
                ))}
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={page => void getNewShows(page)}
            />
        </div>
    )
}

