import React, { useCallback, useEffect, useState } from "react";

const AddressContext = React.createContext({
    addressList: [],
    setAddressList: () => { },
    isOptimised: false,
    routeDetails: null
})

export const AddressContextProvider = props => {
    const [addressList, setAddressList] = useState([]);
    const [isOptimised, setIsOptimised] = useState(false);

    const fetchAddressesHandler = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:3001/addresses');
            const addressListArray = await response.json();
            setAddressList(addressListArray.addresses);
            /* if (addressListArray.addresses && addressListArray.addresses.length > 0) setIsOptimised(true); */
        }
        catch (err) {
            console.log(err);
        }
    }, [setAddressList]);

    /* useEffect(() => {
        fetchAddressesHandler();
    }, [fetchAddressesHandler]); */

    return <AddressContext.Provider value={{ addressList: addressList, setAddressList: fetchAddressesHandler, isOptimised: isOptimised, routeDetails: null }}>
        {props.children}
    </AddressContext.Provider>
}

export default AddressContext;