import { type FC, useEffect, useState } from "react";
import settings from '../settings.json';
import config from '../config.json';
import { useSelectionContext } from "../SelectionContext";

interface ImageItem {
    aspect_ratio: number;
    height: number;
    iso_639_1: string;
    file_path: string;
    vote_average: number;
    vote_count: number;
    width: number;
}
interface ImageCollection {
    id: number;
    backdrops?: ImageItem[];
    logos?: ImageItem[];
    posters?: ImageItem[];
    profiles?: ImageItem[];
}
type ImageTab = 'backdrops' | 'logos' | 'posters' | 'profiles';

export const ImagesCollection:FC = () => {
    const [imagesCollection, setImagesCollection] = useState<ImageCollection>();
    const [imageNumber, setImageNumber] = useState<number>(0);
    const [tabNames, setTabNames] = useState<ImageTab[]>([]);
    const [tab, setTab] = useState<ImageTab>();
    const context = useSelectionContext();

    const getImages = async () => {
        const response = await fetch(`${settings.api}/${context.mediaType}/${context.tmdbId}/images`)
        if (!response.ok) {
            throw new Error("Error fetching images");
        }

        const data = await response.json();
        const keys = Object.keys(data).filter(st => st !== 'id') as ImageTab[];
        setTabNames(keys);
        setImagesCollection(data);
    }

    useEffect(() => {
        getImages();
    },[])

    return (
        <div className="w-full flex flex-col p-4 contents">
            <div className="flex flex-row p-2">
                {tabNames.map((item, index) => {
                    return <><div 
                        onClick={() => setTab(item)} 
                        key={index} 
                        className={`capitalize inline-block text-lg font-bold px-6 ${tab === item ? 'bg-black text-white rounded-r-full rounded-l-full' : 'bg-trandparent text-black'}`}>
                            {item}
                        </div>&nbsp;|&nbsp;</>
                })}
            </div>
            <div className="grid grid-cols-3 gap-y-6">
                {
                    (imagesCollection && tab) && imagesCollection[tab]?.map((item, index) => {
                    return (
                        <img 
                            className="w-60 hover:w-65 h-auto" 
                            src={`${config.images.base_url}original${imagesCollection[tab]?.[index]?.file_path}`} alt={`${tab} image`} 
                            title={`${context.title}\nLamguage: ${item.iso_639_1}`}
                        />
                    )
                }
            )}
            </div>
            {/* <div className="flex content-center">{
                (imagesCollection && tab && imagesCollection[tab]?.[imageNumber]) ?
                <div className="p-4 relative">
                    <div className="inline-flex flex-col bg-red-500 text-white justify-center flex-nowrap"><div>&lt;</div></div>
                    <img src={`${config.images.base_url}original${imagesCollection[tab]?.[imageNumber]?.file_path}`} alt="image" />
                    <div className="inline bg-red-500 text-white right-full translate-y-1/2 fixed z-10">&gt;</div>
                </div> : null
            }
            <div></div>
            </div> */}
        </div>
    )
}