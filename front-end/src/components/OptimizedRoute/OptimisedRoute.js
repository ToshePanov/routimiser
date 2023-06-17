import { useContext } from 'react';

import Card from '../UI/Card';
import Button from '../UI/Button';

import classes from './OptimisedRoute.module.css';

import AddressContext from '../../store/address-context';

const OptimisedRoute = props => {
    const addressCtx = useContext(AddressContext);

    const travelTime = props.routeDetails && props.routeDetails.duration;
    const travelDistance = props.routeDetails && ((props.routeDetails.distance / 1000).toFixed(1));

    const formatTime = time => {
        const totalMinutes = Math.floor(time / 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return (`${hours} hr ${minutes} min`)
    }

    const showIfOptimised = (<div><p><strong>Total travel time:</strong> {formatTime(travelTime)}</p>
        <p><strong>Total travel distance:</strong> {travelDistance} km</p></div>);

    const showIfNotOptimised = (<Button onClick={props.routeHandler} className={classes.optimiseButton}>Optimize Route!</Button>)

    return (
        <Card className={classes.optimisedRoute}>
            {addressCtx.addressList.map((address, i) => (
                <div key={Math.random()}>
                    <div className={classes.enteredAddress}>
                        <div className={`${classes.addressIndex} ${addressCtx.isOptimised && i === 0 ? classes.startPoint : undefined}`}>
                            {/* {addressCtx.isOptimised && address.waypoint_index === 0 ? 'o' : address.waypoint_index} */}
                            {addressCtx.isOptimised && (i !== 0 ? i : 'o')}
                        </div>
                        <div className={classes.addressText}>
                            {address.searchTerm}
                        </div>
                    </div>
                </div>
            ))
            }

            {addressCtx.isOptimised &&
                <div key={Math.random()}>
                    <div className={classes.enteredAddress}>
                        <div className={`${classes.addressIndex} ${addressCtx.addressList[0] ? classes.startPoint : undefined}`}>
                            {addressCtx.isOptimised && addressCtx.addressList[0] && 'o'}
                        </div>
                        <div className={classes.addressText}>
                            {addressCtx.addressList[0].searchTerm}
                        </div>
                    </div>
                </div>
            }
            {addressCtx.isOptimised && showIfOptimised}
            {!addressCtx.isOptimised && showIfNotOptimised}

        </Card >
    );
};

export default OptimisedRoute;