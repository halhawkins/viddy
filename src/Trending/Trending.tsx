import { type FC, useState, useEffect } from 'react';
import trendingData from '../trending.json';
import { useSelectionContext } from '../SelectionContext';
import settings from '../settings.json';
import type { TrendingResults } from '../types/trending';
import { Pagination } from '../Pagination/Pagination';
import { PosterImage } from '../PosterImage/PosterImage';

type TrendingItem = TrendingResults<'all'>['results'][number];

export const Trending: FC = () => {
    const context = useSelectionContext();
    const [trending, setTrending] = useState<TrendingItem[]>([]);
    const [currentPage, setCurrentPage] = useState(context.page ?? trendingData.page);
    const [totalPages, setTotalPages] = useState(trendingData.total_pages);

    const clickedItemHandler = (item: TrendingItem) => {
        if (item.media_type === 'movie') {
            context.push({ display: 'movie-details', tmdbId: item.id, title: item.title, mediaType: 'movie' })
            // context.setMedia('movie', item.id, item.title);
            // context.setDisplay('movie-details');
        } else if (item.media_type === 'tv') {
            context.push({display: 'tv-series-details', tmdbId: item.id, title: item.name, mediaType: 'tv'});
            // context.setMedia('tv', item.id, item.name);
            // context.setDisplay('series-details');
        }
        else if (item.media_type === 'person') {
            context.push({display: 'person-details', tmdbId: item.id})
        }
    }

    const getTrending = async (page: number) => {
        try {
            const response = await fetch(`${settings.api}/trending/all/day?page=${page}`);
            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }
            const data: TrendingResults<'all'> = await response.json();
            setTrending(data.results);
            setCurrentPage(data.page);
            setTotalPages(data.total_pages);
            context.setPage(data.page);
        } catch (error) {
            console.error("Error getting Trending results", error);
        }
    }
    
    useEffect(() => {
        void getTrending(currentPage);
    }, []);


    return (
        <div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
                {trending.map(item => (
                    <div key={item.id} className="bg-gray-800 rounded-lg" onClick={() => clickedItemHandler(item)}>
                        <PosterImage item={item} />
                        <div className="p-2 text-white text-xs hover:text-gray-300">
                            {'title' in item ? item.title : item.name}
                        </div>
                    </div>
                ))}
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={page => void getTrending(page)}
            />
        </div>
    )
}

