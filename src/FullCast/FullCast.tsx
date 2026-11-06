import { type FC, useEffect, useState} from 'react';
import type { Credits, Cast, Crew } from "../types";
import config from '../config.json';
import settings from '../settings.json';
import missingPoster from '../assets/poster-placeholder.png';
import { useSelectionContext } from '../SelectionContext';
type CastView = 'cast' | 'crew';

// type CastListProps = {
//     castAndCrew: Credits,
//     // view: CastView;
// }

export const CastList: FC = () => {
    const [castAndCrew, setCastAndCrew] = useState<Credits>();
    const context = useSelectionContext();

    useEffect(() => {
        // get credits
        if (!castAndCrew) {
            getCretits();
        }
    }, [])

    const getCretits = async () => {
        let url = `${settings.api}`
        // decide what it is we are getting credits for- 'tv', 'movie', 'episode'= then use the right endpoint 
        switch( context.display) {
            case 'movie-credits':
                url = `${settings.api}/movie/${context.tmdbId}/credits`;
                break
            case 'series-credits':
                url = `${settings.api}/tv/${context.tmdbId}/credits`;
                break;
            case 'episode-credits':
                // https://api.themoviedb.org/3/tv/{series_id}/season/{season_number}/episode/{episode_number}/credits
                url = `${settings.api}/tv/${context.tmdbId}/season/${context.seasonNumber}/episode/${context.episodeNumber}/credits`;
                break;
            default:
                break;
        }
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Request failed with status ${res.status}`)
        }
        const credits = await res.json();
        setCastAndCrew(credits);
    }
    return (
        <div className='relative'>
                        <div 
                            className='absolute text-white z-10 text-base border-white border p-1 w-8 h-8 rounded-full cursor-pointer forn-bold hover:bg-gray-700' 
                            onClick={() => context.pop()}>⤶</div>
            <div className='block text-white text-xl font-bold'>Cast</div>
            {
                castAndCrew && castAndCrew.cast.map((item,index) => {
                    return (
                    <div key={index} className='flex flex-row p-2 gap-2'>
                        {/* <div style={{height: "48px", width: "48px", borderRadius: "50%", overflow: "hidden"}}> */}
                        {/* <div className="w-16 h-16 overflow-hidden rounded-full"> */}
                            <img 
                                style={{
                                    width: "48px",
                                    aspectRatio: "1 / 1",
                                    borderRadius: "50%",
                                    objectFit: "cover"
                                }} 
                                // className='w-full h-full object-cover object-top'
                                src={item.profile_path !== null ? `${config.images.base_url}${config.images.profile_sizes[1]}${item.profile_path}` : missingPoster} 
                                alt={item.name} 
                                title={item.name}/>
                        {/* </div> */}
                        {/* </div> */}
                        <div className='flex flex-col text-left px-4 mt-[-0.2rem] text-gray-300'>
                            <div><strong>{item.name}</strong></div>
                            <div><em>{item.character}</em></div>
                        </div>
                    </div>
                    )
                })}<div className='block text-white text-xl font-bold'>Crew</div>{
                castAndCrew && castAndCrew.crew.map((item, index) => {
                    return (
                    <div key={index} className='flex flex-row p-2 gap-2'>
                        {/* <div style={{height: "48px", width: "48px", borderRadius: "50%", overflow: "hidden"}}> */}
                        {/* <div className="w-16 h-16 overflow-hidden rounded-full"> */}
                            <img 
                                style={{
                                    width: "48px",
                                    aspectRatio: "1 / 1",
                                    borderRadius: "50%",
                                    objectFit: "cover"
                                }} 
                                // className='w-full h-full object-cover object-top'
                                src={item.profile_path !== null ? `${config.images.base_url}${config.images.profile_sizes[1]}${item.profile_path}` : missingPoster} 
                                alt={item.name} 
                                title={item.name}/>
                        {/* </div> */}
                        {/* </div> */}
                        <div className='flex flex-col text-left px-4 mt-[-0.2rem] text-gray-300'>
                            <div><strong>{item.name}</strong></div>
                            <div><em>{item.job}</em></div>
                        </div>
                    </div>
                    )
                })
            }
        </div>
    )
}
