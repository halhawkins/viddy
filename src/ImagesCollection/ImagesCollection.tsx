import { type FC, useEffect, useState } from "react";
import settings from '../settings.json';
import config from '../config.json';
import { useSelectionContext } from "../SelectionContext";
import circleX from '../assets/x-circle.svg';
import leftArrow from '../assets/arrow-left-cricle.svg';
import rightArrow from '../assets/arrow-right-cricle.svg';

export interface ImageItem {
    aspect_ratio: number;
    height: number;
    iso_639_1: string;
    file_path: string;
    vote_average: number;
    vote_count: number;
    width: number;
}
export interface ImageCollection {
    id: number;
    backdrops?: ImageItem[];
    logos?: ImageItem[];
    posters?: ImageItem[];
    profiles?: ImageItem[];
}
type ImageTab = 'backdrops' | 'logos' | 'posters' | 'profiles';

export const ImagesCollection:FC = () => {
    const [imagesCollection, setImagesCollection] = useState<ImageCollection>();
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

    const handleImageClick = (index:number) => {
        if (imagesCollection && tab) {
            context.push({
                display: 'image-browser',
                imageSelection: index,
                imageCollection: imagesCollection[tab] 
            });
        }
    }

    return (
        <div className="w-full relative contents">
        <div className="w-full flex flex-col p-4 contents t-10">
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
                            onClick={() => handleImageClick(index)}
                            className="w-60 hover:w-65 h-auto" 
                            src={`${config.images.base_url}original${imagesCollection[tab]?.[index]?.file_path}`} alt={`${tab} image`} 
                            title={`${context.title}\nLamguage: ${item.iso_639_1}`}
                        />
                    )
                }
            )}
            </div>
        </div>
        </div>
    )
}

export const ImageBrowser:FC = () => {
    const context = useSelectionContext();
    const [collection] = useState<ImageItem[]>(context.imageCollection ?? []);
    const [imageIndex, setImageIndex] = useState(context.imageSelection ?? 0);

    return (        
        <div className='text-left'>
            <div className='inline-block relative w-[45px] h-[45px] rounded-full z-10 top-[55px] border-2 text-shadow-blue-950 z-20 bg-[#fff5] bg-opacity-80 hover:bg-[#fffa]' onClick={() => context.pop()}>
                <img className='w-10' src={circleX} />
            </div>
            {collection[imageIndex] && (
                <div className='relative inline-block max-w-full align-top'>
                    <img
                        className='block max-w-full h-auto'
                        src={`${config.images.base_url}original${collection[imageIndex].file_path}`}
                        alt='Selected image'
                    />
                    <button
                        type='button'
                        aria-label='Previous image'
                        className='absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-[#fff5] hover:bg-[#fffa]'
                        onClick={() => setImageIndex((current) => (current - 1 + collection.length) % collection.length)}
                    >
                        <img className='w-[45px] h-[45px]' src={leftArrow} alt='' />
                    </button>
                    <button
                        type='button'
                        aria-label='Next image'
                        className='absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-[#fff5] hover:bg-[#fffa]'
                        onClick={() => setImageIndex((current) => (current + 1) % collection.length)}
                    >
                        <img className='w-[45px] h-[45px]' src={rightArrow} alt='' />
                    </button>
                </div>
            )}
        </div>
    )
}