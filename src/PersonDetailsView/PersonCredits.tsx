import { type FC, useEffect, useState} from "react";
import { type PersonMovieCast, type MovieDetails, type PersonCombinedCredits, type PersonTvShowCast, type TvShowDetails, type MovieWithMediaType, type TVWithMediaType } from "../types";
import settings from '../settings.json';
import config from '../config.json';
import { useSelectionContext } from "../SelectionContext";
import missingPoster from '../assets/poster-placeholder.png';

interface PersonCreditsResponse<T> {
    id: number;
    cast: T[];
    crew: T[];
};

type CreditsResponse = PersonCreditsResponse<MovieWithMediaType|TVWithMediaType>;

const getCreditDate = (item: MovieWithMediaType | TVWithMediaType): string =>
    ('release_date' in item ? item.release_date : item.first_air_date) ?? "";

const sortByReleaseDate = (
    first: MovieWithMediaType | TVWithMediaType,
    second: MovieWithMediaType | TVWithMediaType
): number => getCreditDate(second).localeCompare(getCreditDate(first));

export const PersonCredits:FC = () => {
    const [combinedCredits, setCombinedCredits] = useState<CreditsResponse>();
    const context = useSelectionContext();

    const getCombinedCredits = async () => {
        const response = await fetch(`${settings.api}/person/${context.tmdbId}/combined_credits`);
        if (!response.ok) {
            throw new Error("Encountered error fetching Credits");
        }
        const data = await response.json();
        if (data) {
            setCombinedCredits({
                ...data,
                cast: [...data.cast].sort(sortByReleaseDate),
                crew: [...data.crew].sort(sortByReleaseDate),
            });
        }
    }

    useEffect(() => {
        getCombinedCredits();
    },[])

    const getYear = (iso_8601:string): string => {
        return iso_8601.substring(0,4);
    }

    return (
        <div className="">
            <div className="flex flex-col gap-4">
                <div><strong className="font-lg text-xl text-gray-900">As Cast Member</strong></div>
                {combinedCredits?.cast.map((item,index) => {
                    return (
                        <div key={index} className="flex flex-row gap-2" onClick={() => context.push({
                                display:item.media_type === 'tv' ? "tv-series-details" : "movie-details", 
                                tmdbId: item.id
                            })}>
                            <div className="grow-0">
                                <img className="w-14" src={item.poster_path !== null ? `${config.images.base_url}w92${item.poster_path}` : missingPoster} />
                            </div>
                            <div className="flex flex-col p-2 text-gray-900 grow">
                                <div className=""><strong>{'title' in item ? item.title : item.name}</strong></div>
                                <div><em>{'character' in item ? item.character as string : ""}</em></div>
                                <div className="capitalize">{'media_type' in item ? item.media_type : ""}</div>
                            </div>
                            <div className="align-self-end grow-0">{'release_date' in item ? getYear(item.release_date) : 'first_air_date' in item ? getYear(item.first_air_date) : ""}</div>
                        </div>
                    )
                })}
                <div><strong>As Crew Member</strong></div>
                {combinedCredits?.crew.map((item,index) => {
                    return (
                        <div key={index} className="flex flex-row gap-2" onClick={() => context.push({
                                display:item.media_type === 'tv' ? "tv-series-details" : "movie-details", 
                                tmdbId: item.id
                            })}>
                            <div className="grow-0">
                                <img className="w-14" src={item.poster_path !== null ? `${config.images.base_url}w92${item.poster_path}` : missingPoster} />
                            </div>
                            <div className="flex flex-col p-2 text-gray-900 grow">
                                <div className=""><strong>{'title' in item ? item.title : item.name}</strong></div>
                                <div><em>{'job' in item && typeof item.job === 'string' ? item.job : ''}</em></div>
                                <div className="capitalize">{'media_type' in item ? item.media_type : ""}</div>
                            </div>
                            <div className="align-self-end grow-0">{'release_date' in item ? getYear(item.release_date) : 'first_air_date' in item ? getYear(item.first_air_date) : ""}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
