import { useContext, useState } from 'react';

import OptimisedRoute from './OptimisedRoute';

import AddressContext from '../../store/address-context';

const Optimisation = () => {
    const addressCtx = useContext(AddressContext);

    const [optimisedRoute, setOptimisedRoute] = useState([]);
    const [routeDetails, setRouteDetails] = useState([]);

    const optimiseRouteHandler = async () => {
        try {
            if (optimisedRoute.length === 0) {
                const response = await fetch('http://localhost:3001/optimiseRoute');
                const optimisedRouteArray = await response.json();
                setOptimisedRoute(optimisedRouteArray.optimisedRoute);
                setRouteDetails(optimisedRouteArray.routeDetails);
                addressCtx.isOptimised = true;
            }
        }
        catch (err) {
            console.log(err);
        }
    };

    return (<div>
        {addressCtx.isOptimised && <OptimisedRoute route={optimisedRoute} routeDetails={routeDetails} />}
        {!addressCtx.isOptimised && <OptimisedRoute route={addressCtx.addressList} routeDetails={routeDetails} routeHandler={optimiseRouteHandler} />}
    </div>)
}

export default Optimisation;