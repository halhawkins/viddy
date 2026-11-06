import { useState} from 'react'
import './App.css'
import { Trending } from './Trending/Trending';
import { Navbar } from './Navbar/Navbar';
import { SelectionProvider, useSelectionContext } from './SelectionContext';
import { Display } from './Display/Display';
import { SearchInput } from './Search/SearchInput';

function App() {

  // const [displayMode, setDisplayMode] = useState('trending');

  // const getDisplayComponent = () => {
  //   return <Trending />;
  // };
  
  return (
    <>
      <SelectionProvider>
        <div className="flex flex-col h-full bg-black p-4 overflow-y-auto dark">
          <SearchInput />
          <Navbar />
          <Display /> 
        </div>
      </SelectionProvider>
    </>
  )
}

export default App
