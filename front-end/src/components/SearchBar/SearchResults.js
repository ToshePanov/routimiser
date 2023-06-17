import SearchResult from './SearchResult';

import classes from './SearchResults.module.css';

const SearchResults = props => {
    return (
        <div className={classes.searchResults}>
            {props.noSearchResults && <b>Nothing matches your search!</b>}
            {props.isLoadingResults && <b>Searching...</b>}
            {props.isAddressListFull && <b>Maximum 12 addresses allowed!</b>}
            {!props.isLoadingResults && !props.noSearchResults && <b>Search Results</b>}
            {props.entries.map(entry =>
                /* (<p key={Math.random()}>{entry.searchText}</p>) */
                (<SearchResult key={Math.random()} searchQuery={{ ...entry }} disableSearching={props.disableSearching} />)
            )}
        </div>
    )
}

export default SearchResults;