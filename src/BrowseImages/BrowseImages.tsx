import { type FC, useState } from "react";
import config from '../config.json';
import settings from '../settings.json';
import { useSelectionContext } from "../SelectionContext";

type ImageItem = {
    aspect_ratio: number,
    file_path: string,
    height: number;
    iso_639_1: string,
    iso_3166_1: string,
    vote_average: number,
    vote_count: number,
    width: number,
}

interface BrowseImagesProps  {
    view: string;
};

export const BrowseImages:FC<BrowseImagesProps> = ({view}) => {
    const [backdrops, setBackdrops] = useState<ImageItem[]>([]);
    const [posters, setPosters] = useState<ImageItem[]>([]);
    const [url, setUrl] = useState<string>('');
    const context = useSelectionContext();

    const getImages = async () => {
        switch(view) {
            case 'season':
                setUrl(`${settings.api}/${context.tmdbId}/season/${context.seasonNumber}/images`);
                break;
            case 'series':
                setUrl(`${settings.api}/tv/${context.tmdbId}/images`);
                break;
            case 'movie':
                setUrl(`${settings.api}/movie/${context.tmdbId}/images`);
                break;
        }

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Request failed witb status ${response.status}`);
        }
        const data = await response.json();
    }

    return (
        <>
        </>
    )
}