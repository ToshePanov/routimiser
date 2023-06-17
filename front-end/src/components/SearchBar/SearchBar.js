import { useState, useEffect, useCallback, useContext } from 'react';

import SearchResults from './SearchResults.js';

import AddressContext from '../../store/address-context.js';

import classes from './SearchBar.module.css';

const SearchBar = (props) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    const [noSearchResults, setNoSearchResults] = useState(false);
    const [isLoadingResults, setIsLoadingResults] = useState(false);
    const [isAddressListFull, setIsAddressListFull] = useState(false);


    const addressCtx = useContext(AddressContext);

    const disableSearching = () => {
        setIsSearching(false);
        setSearchResults([]);
        setSearchTerm('');
        addressCtx.setAddressList();
        addressCtx.isOptimised = false;
    }

    const fetchSearchResultsHandler = useCallback(async () => {
        if (searchTerm.trim() === '') return;
        if (addressCtx.addressList && addressCtx.addressList.length > 11) {
            setIsAddressListFull(true);
            return;
        }
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
            if (searchConfirmation.searchSuggestions && searchConfirmation.searchSuggestions.length > 0) {
                setNoSearchResults(false);
                setSearchResults(searchConfirmation.searchSuggestions);
            } else {
                setNoSearchResults(true);
            }

            setIsLoadingResults(false);
        }
        catch (err) {
            console.log(err);
        }
    }, [searchTerm]);

    useEffect(() => {
        setIsLoadingResults(true);

        const delayInputFn = setTimeout(() => {
            fetchSearchResultsHandler();
        }, 1000)
        return () => clearTimeout(delayInputFn)
    }, [searchTerm])

    const searchInputChangeHandler = event => {
        setSearchResults([]);
        setSearchTerm(event.target.value);
        if (event.target.value.trim() === '') {
            setIsSearching(false);
            setSearchResults([]);
            setIsAddressListFull(false);
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
            {isSearching && <SearchResults
                entries={searchResults}
                disableSearching={disableSearching}
                noSearchResults={noSearchResults}
                isLoadingResults={isLoadingResults}
                isAddressListFull={isAddressListFull} />}
        </div>
    )
}

export default SearchBar;