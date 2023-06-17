import classes from './SearchResult.module.css';

const SearchResult = ({ searchQuery, disableSearching }) => {
    const clickHandler = async () => {
        try {
            const response = await fetch('http://localhost:3001/addAddress', {
                method: 'POST',
                body: JSON.stringify({
                    'searchTerm': searchQuery.searchText,
                    'geometry': searchQuery.geometry
                }),
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            })
            disableSearching();
            /* const searchConfirmation = await response.json(); */
        }
        catch (err) {
            console.log(err);
        }
    }
    return (
        <p className={classes.searchResult} onClick={clickHandler}>
            {searchQuery.searchText}
        </p>
    )
}

export default SearchResult;