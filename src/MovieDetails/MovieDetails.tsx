import { type FC, useEffect, useState } from 'react';
import type { Credits, Cast, Crew, MovieDetails, TvEpisodeCredit } from '../types';
import { useSelectionContext } from '../SelectionContext';
import settings from '../settings.json';
import { PosterImage } from '../PosterImage/PosterImage';
import config  from '../config.json';
import circleX from '../assets/x-circle.svg';
import { StarRating } from '../StarRating/StarRating';
import missingPoster from '../assets/poster-placeholder.png';
import { ImagesCollection } from '../ImagesCollection/ImagesCollection';

export const MovieDetail:FC = () => {
    const [movieDetail, setMovieDetail] = useState<MovieDetails|null>(null)
    const [topCredits, setTopCredits] = useState<Credits|null>(null);
    const ctx = useSelectionContext();
    const [tab, setTab] = useState<tabView>("cast");
    const imageHost = "https://image.tmdb.org/t/p/";

    const getDetails = async () => {
        const response = await fetch(`${settings.api}/movie/${ctx.tmdbId}`);
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }
        const details = await response.json();
        setMovieDetail(details);
    }

    const getTopCredits = async () => {
        const response = await fetch(`${settings.api}/movie/${movieDetail?.id}/credits`);
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`)
        }
        const credits = await response.json();
        setTopCredits(credits);
    }

    useEffect(() => {
        if (movieDetail) {
            // alert(`movie id ${movieDetail.id}`)
            getTopCredits();
        }
    }, [movieDetail?.id])

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

    // useEffect(() => {},[])
    return (
        <div className='text-left'>
            <div className='inline-block relative z-10 top-[48px]' onClick={handleXClick}><img className='invert w-12' src={circleX} /></div>
            {
                (movieDetail) &&
            <div style={{ backgroundImage: `url(${imageHost}original${movieDetail?.backdrop_path})`}} className='flex flex-col gap-2 relative bg-cover bg-center bg-fixed p-2 '>
                <div className='flex flex-col gap-2 md:flex-row md:basis-auto items-end'> 
                    <div className='grow-0 inline relative bg-transparent p-4 shrink-0 basis-1/3 w-full' ><PosterImage item={{...movieDetail, media_type: 'movie'}}/></div>
                    <div className='bg-[#fffb] grow text-left p-2 inline-block h-fit'>
                        <h2>{movieDetail.title}</h2>
                        <div className='my-2'><StarRating value={movieDetail.vote_average} />{movieDetail.vote_average}</div>
                        <div className='text-black text-justify mt-2'>{movieDetail.overview}</div>
                    </div>
               </div>
               <div className='flex flex-col w-full bg-[#fffb] p-4'>
                    <div className='p-2 flex flex-row align-start text-black'>
                        <div onClick={() => setTab('cast')} className={`inline-block text-lg font-bold px-6 ${tab === 'cast' ? 'bg-black text-white rounded-r-full rounded-l-full' : 'bg-trandparent text-black'}`}>Cast</div>&nbsp;|&nbsp;
                        <div onClick={() => setTab('crew')} className={`inline-block text-lg font-bold px-6 ${tab === 'crew' ? 'bg-black text-white rounded-r-full rounded-l-full' : 'bg-trandparent text-black'}`}>Crew</div>&nbsp;|&nbsp;
                        <div onClick={() => setTab('images')} className={`inline-block text-lg font-bold px-6 ${tab === 'images' ? 'bg-black text-white rounded-r-full rounded-l-full' : 'bg-trandparent text-black'}`}>Images</div>
                    </div>
                    {
                        (tab === 'cast' || tab === 'crew') && topCredits && <TopCastList castAndCrew={topCredits} view={tab} />
                    }
                    {
                        // tab === 'seasons' && movieDetail.seasons && <Seasons seasons={movieDetail.seasons} />
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

export type tabView = 'cast' | 'crew' | 'images';

type TopCastListProps = {
    castAndCrew: Credits | TvEpisodeCredit,
    view: tabView;
}

export const TopCastList: FC<TopCastListProps> = ({castAndCrew, view}) => {
    const castList = view === 'cast' ? ('guest_stars' in castAndCrew ? [...castAndCrew.cast, ...castAndCrew.guest_stars] : castAndCrew.cast) : castAndCrew.crew;
    const context = useSelectionContext();

    function handleMore(){
        alert(`media_type= ${context.mediaType}`)
        switch(context.display) {
            case 'movie-details':
                context.push({display: 'movie-credits'});
                break;
            case 'series-details':
                context.push({display: 'series-credits'});
                break;
            case 'episode-details':
                context.push({display: 'episode-credits'});
                break;
        }
    }

    useEffect(() => {
        console.log("TopCastList",castAndCrew)
        console.log("castList",castList)
    }, [])

    return (
        <div>
            {
                castList.slice(0, 10).map(item => {
                    return (
                    <div onClick={()=>context.push({display: "person-details", tmdbId: item.id, mediaType: 'none'})} key={item.id} className='flex flex-row p-2 gap-2'>
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
                        <div className='flex flex-col text-left px-4 mt-[-0.2rem]'>
                            <div><strong>{item.name}</strong></div>
                            <div><em>{'character' in item ? item.character : item.job}</em></div>
                        </div>
                    </div>
                    )
                })
            }
            <div className='cursor-pointer' onClick={handleMore}>&apos;smore...</div>
        </div>
    )
}
