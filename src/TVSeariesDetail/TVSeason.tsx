import { type FC, useEffect, useState } from 'react';
import type { SeasonDetails } from '../types';
import settings from '../settings.json';
import { useSelectionContext } from '../SelectionContext';
import { PosterImage } from '../PosterImage/PosterImage';
import { StarRating } from '../StarRating/StarRating';
import circleX from '../assets/x-circle.svg';
import config from '../config.json';

export const TVSeason:FC = () => {
    const [seasonDetails, setSeasonDetails] = useState<SeasonDetails>();
    const context = useSelectionContext();
    const [backdrop, setBackdrop] = useState<string>("");

    const getSeasonDetails = async () => {
        const result = await fetch(`${settings.api}/tv/${context.tmdbId}/season/${context.seasonNumber}`);
        if(!result.ok) {
            console.log(result.statusText);
        }
        const data = await result.json();
        if (data) {
            setSeasonDetails(data);
            await getBackdrops();
        }
    }

    const getBackdrops = async () => {
        const response = await fetch(`${settings.api}/tv/${context.tmdbId}/images`);
        if (!response.ok) {
            throw new Error(`Request failed witb status ${response.status}`);
        }
        const data = await response.json().then((data) => {
            if('backdrops' in data) {
                setBackdrop(`url(${config.images.base_url}${config.images.backdrop_sizes[config.images.backdrop_sizes.length-1]}${data.backdrops[Math.round(Math.random()*data.backdrops.length)].file_path})`);
            } else {
                setBackdrop('none')
            }
        });
    }

    useEffect(() => {
        getSeasonDetails();
    }, []);

    const handleXClick = () => {
        context.pop();
    }

    return(
        <div style={{backgroundImage: backdrop}} className='text-left bg-cover bg-center bg-fixed'>
            <div className='flex flex-col gap-2 relative p-2 '>
            <div className='inline-block relative z-10 top-[48px]' onClick={handleXClick}><img className='invert w-12' src={circleX} /></div>
            {
                (seasonDetails) &&
            <div className='flex flex-col gap-2 relative bg-cover bg-center bg-fixed p-2 '>
                <div className='flex flex-col gap-2 md:flex-row md:basis-auto items-end'> 
                    <div className='grow-0 inline relative bg-transparent p-4 shrink-0 basis-1/3 w-full' ><PosterImage item={{...seasonDetails, media_type: 'tv'}}/></div>
                    <div className='bg-[#fffb] grow text-left p-2 inline-block h-fit'>
                        <h2>{seasonDetails.name}</h2>
                        <div className='text-black text-justify mt-2'>{seasonDetails.overview}</div>
                    </div>
                </div>
                <div className='flex flex-col w-full'>
                    {seasonDetails && seasonDetails.episodes.map(item => {
                        return (
                            <div className='flex flex-row p-2 bg-[#fffb] gap-2 m-2' onClick={()=>{context.push({display:'episode-details', seasonNumber: item.season_number, episodeNumber: item.episode_number})}}>
                                <div className=''>
                                    <img style={{maxWidth: 'none'}} className='w-[140px] md:w-[240px]' src={`${config.images.base_url}/w185/${item.still_path}`} />
                                </div>
                                <div className='text-black p-2'><strong>{item.name}</strong><br/>
                                <div className='text-gray-600'>{item.overview}</div>
                                
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            }
            </div>
        </div>
    )
}