import { type FC, useEffect, useState } from "react";
import { type PersonDetails } from "../types";
import settings from '../settings.json';
import config from '../config.json';
import { useSelectionContext } from "../SelectionContext";
import { PosterImage } from "../PosterImage/PosterImage";
import circleX from '../assets/x-circle.svg';
import { buildUrl } from "../Helpers/url";
import wikiIcon from '../assets/wikipedia-icon.svg';
import { PersonCredits } from "./PersonCredits";


export const PersonDetailsView:FC = () => {
    const [personData, setPersonData] = useState<PersonDetails>();
    const [externalIDs, setExternalIDs] = useState<any>();
    const [wikiID, setWikiID] = useState<string>("");
    const [wikiURL, setWikiURL] = useState<string>("")
    const context = useSelectionContext();

    const getPersonDetails = async () => {
        const response = await fetch(`${settings.api}/person/${context.tmdbId}`);
        if (!response.ok) {
            throw new Error(`Request failed witb status ${response.status}`)
        }
        const data = await response.json()
        setPersonData(data);
        getExternalIds(data);
    }

    const getExternalIds = async (item:PersonDetails) => {
        const response = await fetch(`${settings.api}/person/${item.id}/external_ids`);
        if (!response.ok) {
            throw new Error(`Request failed witb status ${response.status}`);
        }
        const data = await response.json();
        setExternalIDs(data);
        console.log("DATA ",data);
        if ('wikidata_id' in data) {
            setWikiID(data.wikidata_id);
        }
        console.log("rrRRrrRR", data)
        setWikiID(data.wikidata_id)
        getWikiBio(data.wikidata_id);
    }

    interface WikidataSearh {
        action: string;
        ids: string;
        props: string;
        languages: string;
        format: string;
        origin: string;
    }

    const getWikiBio = async (id: string) => {
        // const wikidataUrl = new URL("https://www.wikidata.org/w/api.php");
        // const params:WikidataSearh = ;
        const wikiUrl = buildUrl("https://www.wikidata.org/w/api.php",{
            action: "wbgetentities",
            ids: id,
            props: "descriptions|sitelinks",
            languages: "en",
            format: "json",
            origin: "*",
        })
        // wikidataUrl.search = new URLSearchParams(params as Record<string, string>).toString();
        console.log("wikidataUrl.href",wikiUrl);

        const wikiDataResponse = await fetch(wikiUrl);
        if (!wikiDataResponse.ok) {
            throw new Error("Encountered error fetching Wikidata");
        } 

        const wikidata = await wikiDataResponse.json();
        const entity = wikidata.entities?.[id];
        const description = entity?.descriptions?.en?.value;
        const wikipediaTitle = entity?.sitelinks?.enwiki?.title;

        let extract;
        if (wikipediaTitle) {
            console.log("******$^U^&*$")
            const wikipediaUrl = buildUrl("https://en.wikipedia.org/w/api.php",{
                action: "query",
                prop: "extracts",
                exintro: "1",
                explaintext: "1",
                titles: wikipediaTitle,
                format: "json",
                formatversion: "2",
                origin: "*",
            })

            const wikipediaResponse = await fetch(wikipediaUrl);  
            if (!wikipediaResponse.ok) {
                throw new Error("Encountered error fetching Wikipedia");
            }
            const wikipedia = await wikipediaResponse.json();
            extract = wikipedia.query?.pages?.[0]?.extract;
            console.log("wiki link:", wikipedia,extract)
            setWikiURL(`https://en.wikipedia.org/wiki/${wikipediaTitle}`)
        }
 
    }

    useEffect(() => {
        getPersonDetails()
    }, [])

    return (
        <div className='text-left'>
            <div className='inline-block relative z-10 top-[48px]' onClick={() => context.pop()}><img className='invert w-12' src={circleX} /></div>
            {
                (personData) &&
            <div 
                // style={{ backgroundImage: `url(${imageHost}original${movieDetail?.backdrop_path})`}} 
                className='flex flex-col gap-2 relative bg-cover bg-center bg-fixed p-2 '>
                <div className='flex flex-col gap-2 md:flex-row md:basis-auto items-end'> 
                    <div className='grow-0 inline relative bg-transparent p-4 shrink-0 basis-1/3 w-full' ><PosterImage item={{...personData, media_type: 'person'}}/></div>
                    <div className='bg-[#fffb] grow text-left p-2 inline-block h-fit'>
                        <h2>{personData.name}</h2>
                        {/* <div className='my-2'><StarRating value={movieDetail.vote_average} />{movieDetail.vote_average}</div> */}
                        <div className='text-black text-justify mt-2'>{personData.biography.substring(0,200)}...</div>
                        <div className="m-2"><a href={wikiURL}><img className="w-6 inline-block" src={wikiIcon} alt="Wikipedia" /> {personData.name} - Wikipedia</a></div>
                    </div>
               </div>
               <div className='flex flex-col w-full bg-[#fffb] p-4'>
                <PersonCredits />
                    {/* <div className='p-2 flex flex-row align-start text-black'>
                        <div onClick={() => setTab('cast')} className={`inline-block text-lg font-bold px-6 ${tab === 'cast' ? 'bg-black text-white rounded-r-full rounded-l-full' : 'bg-trandparent text-black'}`}>Cast</div>&nbsp;|&nbsp;
                        <div onClick={() => setTab('crew')} className={`inline-block text-lg font-bold px-6 ${tab === 'crew' ? 'bg-black text-white rounded-r-full rounded-l-full' : 'bg-trandparent text-black'}`}>Crew</div>
                    </div>
                    {
                        topCredits && <TopCastList castAndCrew={topCredits} view={tab} />
                    }
                    {
                        // tab === 'seasons' && movieDetail.seasons && <Seasons seasons={movieDetail.seasons} />
                    } */}
            </div>
        </div>
            }
        </div>
    )
}