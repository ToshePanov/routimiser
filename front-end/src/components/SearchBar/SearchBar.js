import { useState, useEffect, useCallback, useContext } from 'react';

import SearchResults from './SearchResults.js';

import AddressContext from '../../store/address-context.js';

import classes from './SearchBar.module.css';

const SearchBar = (props) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    const addressCtx = useContext(AddressContext);

    const disableSearching = () => {
        setIsSearching(false);
        setSearchResults([]);
        setSearchTerm('');
        addressCtx.setAddressList();
    }

    const fetchSearchResultsHandler = useCallback(async () => {
        if (searchTerm.trim() === '') return;
        try {
            const response = await fetch('http://localhost:3001/searchSuggestions', {
                method: 'POST',
                body: JSON.stringify({
                    'searchTerm': searchTerm
                }),
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            })
            const searchConfirmation = await response.json();
            setSearchResults(searchConfirmation.searchSuggestions);
        }
        catch (err) {
            console.log(err);
        }
    }, [searchTerm]);

    useEffect(() => {
        const delayInputFn = setTimeout(() => {
            fetchSearchResultsHandler();
        }, 1500)
        return () => clearTimeout(delayInputFn)
    }, [searchTerm])

    const searchInputChangeHandler = event => {
        setSearchTerm(event.target.value);
        if (event.target.value.trim() === '') {
            setIsSearching(false);
            return;
        }
        setIsSearching(true);
    };

    const searchBarClasses = `${classes.searchInput} ${isSearching && classes.isSearching}`;

    return (
        <div className={classes.searchbar}>
            <input type="text" value={searchTerm} id="searchbar" placeholder="Add waypoint" className={searchBarClasses}
                onChange={searchInputChangeHandler} >
            </input>
            {isSearching && <SearchResults entries={searchResults} disableSearching={disableSearching} />}
        </div>
    )
}

export default SearchBar;