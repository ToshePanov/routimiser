import { useState } from 'react';

import SearchResult from './SearchResult';

import classes from './SearchResults.module.css';

const SearchResults = props => {


    const [noSearchResults, setNoSearchResults] = useState(false);
    const [isLoadingResults, setIsLoadingResults] = useState(false);
    return (
        <div className={classes.searchResults}>
            {noSearchResults && <p>Nothing matches your search!</p>}
            {isLoadingResults && <p>Searching...</p>}
            <b>Search Results</b>
            {props.entries.map(entry =>
                /* (<p key={Math.random()}>{entry.searchText}</p>) */
                (<SearchResult key={Math.random()} searchQuery={{ ...entry }} disableSearching={props.disableSearching} />)
            )}
        </div>
    )
}

export default SearchResults;