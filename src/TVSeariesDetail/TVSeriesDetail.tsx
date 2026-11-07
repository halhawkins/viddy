import { type FC, useEffect, useState } from 'react';
import type { AggregateCredits, Crew, Season, TvShowDetails } from '../types';
import { useSelectionContext } from '../SelectionContext';
import settings from '../settings.json';
import { PosterImage } from '../PosterImage/PosterImage';
import config  from '../config.json';
import circleX from '../assets/x-circle.svg';
import { StarRating } from '../StarRating/StarRating';
import missingposter from '../assets/poster-placeholder.png';
import { ImagesCollection } from '../ImagesCollection/ImagesCollection';

export const TVSeriesDetail:FC = () => {
    const [seriesDetail, setSeriesDetail] = useState<TvShowDetails|null>(null)
    const [aggregateCredits, setAggregateCredits] = useState<AggregateCredits|null>(null);
    const ctx = useSelectionContext();
    const [tab, setTab] = useState<string>("seasons");
    const imageHost = "https://image.tmdb.org/t/p/";

    const getDetails = async () => {
        const response = await fetch(`${settings.api}/tv/${ctx.tmdbId}`);
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }
        const details = await response.json();
        setSeriesDetail(details);
    }

    const getAggregateCredits = async () => {
        const response = await fetch(`${settings.api}/tv/${seriesDetail?.id}/aggregate_credits`);
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`)
        }
        const credits = await response.json();
        setAggregateCredits(credits);
    }

    useEffect(() => {
        if (seriesDetail) {
            // alert(`Series id ${seriesDetail.id}`)
            getAggregateCredits();
        }
    }, [seriesDetail?.id])

    useEffect(() => {
        try {
            getDetails();
        }
        catch(error) {
            console.log("Error getting series details.", error)
        }
    },[]);

    const handleXClick = () => {
        ctx.pop();
    }

    // useEffect(() => {},[])
    return (
        <div className='text-left contents'>
            <div className='inline-block relative z-10 top-[48px]' onClick={handleXClick}><img className='invert w-12' src={circleX} /></div>
            {
                (seriesDetail) &&
            <div style={{ backgroundImage: `url(${imageHost}original${seriesDetail?.backdrop_path})`}} className='flex flex-col gap-2 relative bg-cover bg-center bg-fixed p-2 '>
                <div className='flex flex-col gap-2 md:flex-row md:basis-auto items-end'> 
                    <div className='grow-0 inline relative bg-transparent p-4 shrink-0 basis-1/3 w-full' ><PosterImage item={{...seriesDetail, media_type: 'tv'}}/></div>
                    <div className='bg-[#fffb] grow text-left p-2 inline-block h-fit'>
                        <h2>{seriesDetail.name}</h2>
                        <div className='my-2'><StarRating value={seriesDetail.vote_average} />{seriesDetail.vote_average}</div>
                        <div className='text-black text-justify mt-2'>{seriesDetail.overview}</div>
                    </div>
               </div>
               <div className='flex flex-col w-full bg-[#fffb]'>
                    <div className='p-2 flex flex-row align-start text-black'>
                        <div onClick={() => setTab('seasons')} className={`inline-block text-lg font-bold px-6 ${tab === 'seasons' ? 'bg-black text-white rounded-r-full rounded-l-full' : 'bg-trandparent text-black'}`}>Seasons</div >&nbsp;|&nbsp;
                        <div onClick={() => setTab('cast')} className={`inline-block text-lg font-bold px-6 ${tab === 'cast' ? 'bg-black text-white rounded-r-full rounded-l-full' : 'bg-trandparent text-black'}`}>Cast</div>&nbsp;|&nbsp;
                        <div onClick={() => setTab('crew')} className={`inline-block text-lg font-bold px-6 ${tab === 'crew' ? 'bg-black text-white rounded-r-full rounded-l-full' : 'bg-trandparent text-black'}`}>Crew</div>&nbsp;|&nbsp;
                        <div onClick={() => setTab('images')} className={`inline-block text-lg font-bold px-6 ${tab === 'crew' ? 'bg-black text-white rounded-r-full rounded-l-full' : 'bg-trandparent text-black'}`}>Images</div>
                    </div>
                    {
                        tab === 'cast' && aggregateCredits && <AggregateCastList castAndCrew={aggregateCredits} show={"cast"}/>
                    }
                    {
                        tab === 'crew' && aggregateCredits && <AggregateCastList castAndCrew={aggregateCredits} show={"crew"}/>
                    }
                    {
                        tab === 'seasons' && seriesDetail.seasons && <Seasons seasons={seriesDetail.seasons} />
                    }
                    {
                        tab === 'images' && <ImagesCollection />
                    }
                </div>
            </div>
            }
        </div>
    );
}

interface AggregateCastListProps {
    castAndCrew: any;
    show: "cast" | "crew";
}

const AggregateCastList: FC<AggregateCastListProps> = (props:AggregateCastListProps) => {
    const [cast, setCast] = useState<AggregateCredits>(props.castAndCrew);
    const context = useSelectionContext();

    return (
        <>
            {
                props.show === 'cast' ? cast && cast.cast.slice(0, Math.min(cast.cast.length-1,9)).map( item => {
                    return (
                    <div key={item.id} className='flex flex-row p-2 gap-2' onClick={() => context.push({display: "person-details", tmdbId: item.id})}>
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
                                src={`${config.images.base_url}${config.images.profile_sizes[1]}${item.profile_path}`} 
                                alt={item.name} 
                                title={item.name}/>
                        {/* </div> */}
                        {/* </div> */}
                        <div className='flex flex-col text-left px-4 mt-[-0.2rem]'>
                            <div><strong>{item.name}</strong></div>
                            <div><em>{item.roles[0].character}</em></div>
                        </div>
                    </div>
                    )
                }) :
                props.show === 'crew' ? cast && cast.crew.slice(0, Math.min(cast.crew.length-1,9)).map( item => {
                    return (
                    <div key={item.id} className='flex flex-row p-2 gap-2' onClick={() => context.push({display: "person-details", tmdbId: item.id})}>
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
                                src={item.profile_path !== null ? `${config.images.base_url}${config.images.profile_sizes[1]}${item.profile_path}` : missingposter} 
                                alt={item.name} 
                                title={item.name}/>
                        {/* </div> */}
                        {/* </div> */}
                        <div className='flex flex-col text-left px-4 mt-[-0.2rem]'>
                            <div><strong>{item.name}</strong></div>
                            {
                                item.jobs.map((job,index) => <div key={index}><em>{job.job}</em></div>)
                            }
                        </div>
                    </div>
                    )
                }) : null   
            } 
            {          
                cast[props.show].length > 10 ? (<div className='cursor-pointer'>floore...</div>) : ""
            }
        </>
    )
}

interface SeasonProps {
    seasons: Season[]
}

const Seasons:FC<SeasonProps> = (props:SeasonProps) => {
    const context = useSelectionContext();
    const imageHost = "https://image.tmdb.org/t/p/";
    return (
        <div style={{gridTemplateColumns: "64px 1fr"}} className='grid gap-4'>
        <div className='w-20'></div>
        <div className='w-32'>Name</div>
        {props.seasons.map(item => {
            return (
                <>
                <div className='p-1' onClick={() => context.push({display:"season-details", seasonNumber: item.season_number})}>
                    <PosterImage item={{...item, media_type: 'tv'}} />
                </div>
                <div className='px-2 font-bold p-2'>
                    {item.name}
                </div>
            </>)
        })}
        </div>
    )
}