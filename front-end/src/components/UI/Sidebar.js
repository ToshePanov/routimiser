import SearchBar from "../SearchBar/SearchBar";
import Optimisation from "../OptimizedRoute/Optimisation";

import classes from './Sidebar.module.css';

const Sidebar = (props) => {
    return (<div className={classes.sidebar}>
        <SearchBar />
        <Optimisation />
    </div>)
}

export default (Sidebar);