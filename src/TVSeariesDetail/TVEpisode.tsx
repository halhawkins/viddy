import { useEffect, useState, type FC } from "react";
import { useSelectionContext } from "../SelectionContext";
import type { Credits, Episode } from "../types";
import settings from '../settings.json';
import config from '../config.json';
import { TopCastList, type CastView } from "../MovieDetails/MovieDetails";
import { StarRating } from "../StarRating/StarRating";
import circleX from '../assets/x-circle.svg';
import { PosterImage } from "../PosterImage/PosterImage";

export const TVEpisode:FC = () => {
    const [episodeDetail, setEpisodeDetail] = useState<Episode|null>(null)
    const [topCredits, setTopCredits] = useState<Credits|null>(null);
    const [backdrop, setBackdrop] = useState<string>("");
    const ctx = useSelectionContext();
    const [tab, setTab] = useState<CastView>("cast");
    const imageHost = "https://image.tmdb.org/t/p/";

    const getDetails = async () => {
        const response = await fetch(`${settings.api}/tv/${ctx.tmdbId}/season/${ctx.seasonNumber}/episode/${ctx.episodeNumber}`);
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }
        const details = await response.json();
        setEpisodeDetail(details);
        await getTopCredits();
        await getBackdrops();
    }

    const getBackdrops = async () => {
        const response = await fetch(`${settings.api}/tv/${ctx.tmdbId}/images`);
        if (!response.ok) {
            throw new Error(`Request failed witb status ${response.status}`);
        }
        const data = await response.json().then((data) => {
            if('backdrops' in data) {
                setBackdrop(`url(${config.images.base_url}${config.images.backdrop_sizes[config.images.backdrop_sizes.length-1]}${data.backdrops[0].file_path})`);
            } else {
                setBackdrop('none')
            }
        });
    }

    const getTopCredits = async () => {
        const response = await fetch(`${settings.api}/tv/${ctx.tmdbId}/season/${ctx.seasonNumber}/episode/${ctx.episodeNumber}/credits`);
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`)
        }
        const credits = await response.json();
        setTopCredits(credits);
    }

    useEffect(() => {
        console.log("👻👻", backdrop);
    }, [backdrop])

    useEffect(() => {
        if (episodeDetail) {
            // alert(`movie id ${episodeDetail.id}`)
            getTopCredits();
        }
    }, [episodeDetail?.id])

    useEffect(() => {
        try {
            getDetails();
        }
        catch(error) {
            console.log("Error getting movie details.", error)
        }
    },[]);

    const handleXClick = () => {
        ctx.pop();
    }


    return (
        <div style={{ backgroundImage: backdrop, backgroundSize: "cover" }} className='text-left'>
            <div data-identifier="backdrop" className='inline-block relative z-10 top-[48px]' onClick={handleXClick}><img className='invert w-12' src={circleX} /></div>
            {
                (episodeDetail) &&
            <div className='flex flex-col gap-2 relative bg-cover bg-center bg-fixed p-2 '>
                <div className='flex flex-col gap-2 md:flex-row md:basis-auto items-end'> 
                    <div className='grow-0 inline relative bg-transparent p-4 shrink-0 basis-1/3 w-full' ><img style={{maxWidth: "none"}} className="w-120" src={`${config.images.base_url}/original/${episodeDetail.still_path}`} /></div>
                    <div className='bg-[#fffb] grow text-left p-2 inline-block h-fit'>
                        <h2>{episodeDetail.name}</h2>
                        <div className='my-2'><StarRating value={episodeDetail.vote_average} />{episodeDetail.vote_average}</div>
                        <div className='text-black text-justify mt-2'>{episodeDetail.overview}</div>
                    </div>
               </div>
               <div className='flex flex-col w-full bg-[#fffb] p-4'>
                    <div className='p-2 flex flex-row align-start text-black'>
                        <div onClick={() => setTab('cast')} className={`inline-block text-lg font-bold px-6 ${tab === 'cast' ? 'bg-black text-white rounded-r-full rounded-l-full' : 'bg-trandparent text-black'}`}>Cast</div>&nbsp;|&nbsp;
                        <div onClick={() => setTab('crew')} className={`inline-block text-lg font-bold px-6 ${tab === 'crew' ? 'bg-black text-white rounded-r-full rounded-l-full' : 'bg-trandparent text-black'}`}>Crew</div>
                    </div>
                    {
                        topCredits && <TopCastList castAndCrew={topCredits} view={tab} />
                    }
                    {
                        // tab === 'seasons' && episodeDetail.seasons && <Seasons seasons={episodeDetail.seasons} />
                    }
                    {topCredits && topCredits[tab].length > 10 ? <div className="cursor-pointer" onClick={() => ctx.push({display:'episode-credits'})}>more...</div> : <></>}
            </div>
        </div>
            }
        </div>
    );

}