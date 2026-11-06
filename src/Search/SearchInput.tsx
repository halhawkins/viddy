import { useState, useEffect, type FC, type ChangeEvent, type KeyboardEvent } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { useSelectionContext } from '../SelectionContext';

export const SearchInput:FC = () => {
    const [ inputVal, setInputVal] = useState<string>("");
    const ctx = useSelectionContext();
    const { setQueryString } = ctx;

    const debounceInput = useDebounce<string>(inputVal, 500);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
  };

  useEffect(() => {
    setQueryString(debounceInput);
  }, [debounceInput, setQueryString]);

  const handleClick = () => {
    if (ctx.display !== 'search') {
      ctx.setPage(1);
    }
    ctx.setDisplay('search');
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleClick();
    }
  };

    return (          
      <div className="search-bar flex ">
        <input 
          type="text" 
          className="basis-3/4 border-box bg-gray-700 p-2 text-gray-300" 
          value={inputVal}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="search" />
        <button type="submit" className="bg-gray-700 p-2 relative left-[-32px]" onClick={handleClick}><span className="text-white">🔎︎</span></button>
      </div>
    )
}