import { type FC, useEffect, useState } from 'react';
import type { Movie, PopularMovies } from '../types';
import { useSelectionContext } from '../SelectionContext';
import settings from '../settings.json';
import { Pagination } from '../Pagination/Pagination';
import { PosterImage } from '../PosterImage/PosterImage';

export const PopularMoviesList:FC = () => {
    const context = useSelectionContext();
    const [popularMoviesResults, setPopularMoviesResults] = useState<PopularMovies|null>(null);
    const [currentPage, setCurrentPage] = useState<number>(context.page ?? 1);
    const [totalPages, setTotalPages] = useState<number>(1);

    
    const clickedItemHandler = (item: Movie) => {
        context.push({ display: 'movie-details', mediaType: 'movie', tmdbId: item.id, title: item.title });
    }

    const getPopularTV = async (page: number) => {
        try {
            const response = await fetch(`${settings.api}/movie/popular?page=${page}`);
            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }
            const data: PopularMovies = await response.json();
            setPopularMoviesResults(data);
            setCurrentPage(data.page);
            setTotalPages(data.total_pages);
            context.setPage(data.page);
        } catch (error) {
            console.error("Error getting Popular TV Shows results", error);
        }
    }

    useEffect(() => {
        void getPopularTV(currentPage);
    },[])

    return (
        <div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
                {popularMoviesResults?.results.map(item => (
                    <div key={item.id} className="bg-gray-800 rounded-lg" onClick={() => clickedItemHandler(item)}>
                        <PosterImage item={{ ...item, media_type: 'movie' }} />
                        <div className="p-2 text-white text-xs hover:text-gray-300">
                            {item.title}
                        </div>
                    </div>
                ))}
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={page => void getPopularTV(page)} />
        </div>
    )
}