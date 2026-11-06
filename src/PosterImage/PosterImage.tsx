import { type FC, useState, useEffect } from 'react';
import config from '../config.json';
import missingPoster from '../assets/poster-placeholder.png';

interface PosterImageProps {
    item: {
        adult: boolean;
        backdrop_path?: string;
        genre_ids: number[]; 
        id: number;
        media_type: string;
        original_language: string;
        original_title: string;
        overview: string;
        popularity: number;
        poster_path: number;
        release_date: string;
        softcore: boolean;
        title: string;
        video: boolean;
        vote_average: number;
        vote_count: number;
    },
    size?: number;
}
export const PosterImage:FC<any> = (props) => {
    const [path, setPath] = useState<string|null>(null);
    const [title, setTitle] = useState<string|null>(null);

    useEffect(() => {
        if (props.item.media_type === 'person') {
            if ('profile_path' in props.item) {
                if (props.item.profile_path !== null){
                    setPath(`${config.images.base_url}w342${props.item.profile_path}`);
                }
                else {
                    setPath(missingPoster);
                }
                setTitle(props.item.name)
            } else {
                setPath(missingPoster);
                if ('title' in props.item){
                    setTitle(props.item.title);
                } else {
                    setTitle(props.item.name)
                }
            }
        }
        if (props.item.media_type === 'movie' || props.item.media_type === 'tv') {
            if (props.item.poster_path != null) {
                setPath(`${config.images.base_url}w342${props.item.poster_path}`);
            }
            if (props.item.media_type === null) {
                 setPath(missingPoster);
            }
        }   
    }, [])
    if (props.item === undefined) return null;
    return <img className='w-full' src={!path?missingPoster:path} alt={!title?"Poster image":title} />
 }
