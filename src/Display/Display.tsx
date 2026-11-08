import { type FC, useState, useEffect } from 'react';
import { useSelectionContext } from '../SelectionContext';
import { Trending } from '../Trending/Trending';
// import conf from '../auth.json';
import { OnToday } from '../NewShows/OnToday';
import { PopularTVList } from '../Popular/PopularTVList';
import { PopularMoviesList } from '../Popular/PopularMoviesList';
import { SearchResults } from '../Search/SearchResults';
import { TVSeriesDetail } from '../TVSeariesDetail/TVSeriesDetail';
import { MovieDetail } from '../MovieDetails/MovieDetails';
import { CastList } from '../FullCast/FullCast';
import { TVSeason } from '../TVSeariesDetail/TVSeason';
import { TVEpisode } from '../TVSeariesDetail/TVEpisode';
import { PersonDetailsView } from '../PersonDetailsView/PersonDetailsView';
import { ImageBrowser } from '../ImagesCollection/ImagesCollection';

export const Display: FC = () => {
    const selectionCtx = useSelectionContext();
    const [selection, setSelection] = useState("");
    const getDisplayComponent = () => {
        switch (selectionCtx.display) {
          case 'trending':
            return <Trending />;
            selectionCtx.reset({display:'trending', page:selectionCtx.page});
            break;
          case 'new':
            return <OnToday />
            selectionCtx.reset({display:'new'})
            break;
          case 'search':
            return <SearchResults />
            selectionCtx.reset({display:'search'})
            break;
          case 'popular-tv':
            return <PopularTVList />
            selectionCtx.reset({display:'popular-tv'})
            break;
          case 'popular-movies':
            return <PopularMoviesList />
            selectionCtx.reset({display:'popular-movies'})
          // Add cases for other displays
          case 'tv-series-details':
            return <TVSeriesDetail />;
            selectionCtx.reset({display:'tv-series-details'})
            break;
          case 'movie-details':
            return <MovieDetail />
            break;
          case 'movie-credits':
            return <CastList />
            break;
          case 'episode-credits':
            return <CastList />
          case 'season-details': 
            return <TVSeason />
            break;
          case 'episode-details':
            return <TVEpisode />
          case 'person-details':
            return <PersonDetailsView />
          case 'image-browser':
            return <ImageBrowser />
          default:
            return <Trending />;
        }
    };

    useEffect(() => {
        setSelection(selectionCtx.display);
    },[selectionCtx.history.length, selectionCtx.display])

    return (getDisplayComponent());
};

const TestComponent:FC = () => {
    const [requestToken, setRequestToken] = useState<string | null>(null);

    const [submitForm, setSubmitForm] = useState(false);

    const fetchRequestToken = async () => {
        // try {
        //     const response = await fetch('https://api.themoviedb.org/3/authentication/token/new?api_key=' + conf.api_Key);
        //     const data = await response.json();
        //     if (data.success) {
        //         setRequestToken(data.request_token);
        //         setSubmitForm(false);
        //     }
        // } catch (error) {
        //     console.error('Error fetching request token:', error);
        // }
    };

    const authenticateUser = async () => {
        // if (!requestToken) {
        //     console.error('No request token available for authentication.');
        //     return;
        // }
        // try {
        //     const response = await fetch('https://www.themoviedb.org/authenticate/' + requestToken);
        //     if (response.ok) {
        //         console.log('User authenticated successfully.');
        //         createSession();
        //     } else {
        //         console.error('Error authenticating user:', response.statusText);
        //     }
        // } catch (error) {
        //     console.error('Error authenticating user:', error);
        // }
    };

    const createSession = async () => {
        // if (!requestToken) {
        //     console.error('No request token available for session creation.');
        //     return;
        // }
        // try {
        //     const response = await fetch('https://api.themoviedb.org/3/authentication/session/new?api_key=' + conf.api_Key, {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify({
        //             request_token: requestToken
        //         })
        //     });
        //     const data = await response.json();
        //     if (data.success) {
        //         console.log('Session created successfully.');
        //     } else {
        //         console.error('Error creating session:', data.status_message);
        //     }
        // } catch (error) {
        //     console.error('Error creating session:', error);
        // }
    };

    useEffect(() => {
        if (submitForm) {
            authenticateUser();
        }
    }, [submitForm]);

        // fetchRequestToken();

    return(
        <div className="text-red-500 flex flex-col gap-2 items-center">
            <h2>Test Component</h2>
            <div className="text-white flex flex-col gap-2 w-1/4">
                <input type="text" className="border-box bg-gray-700 p-2 text-gray-300" placeholder="User name" />
                <input type="password" className="border-box bg-gray-700 p-2 text-gray-300" placeholder="Password" />
                <button type="submit" className="bg-gray-700 p-2 text-white" onClick={fetchRequestToken}>Submit</button>
            </div>
        </div>
    )
}
