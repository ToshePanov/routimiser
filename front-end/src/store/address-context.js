import React, { useCallback, useEffect, useState } from "react";

const AddressContext = React.createContext({
    addressList: [],
    setAddressList: () => { },
    isOptimised: false
})

export const AddressContextProvider = props => {
    const [addressList, setAddressList] = useState([]);

    const fetchAddressesHandler = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:3001/addresses');
            const addressListArray = await response.json();
            setAddressList(addressListArray.addresses);
        }
        catch (err) {
            console.log(err);
        }
    }, [setAddressList]);

    useEffect(() => {
        fetchAddressesHandler();
    }, [fetchAddressesHandler]);

    return <AddressContext.Provider value={{ addressList: addressList, setAddressList: fetchAddressesHandler, isOptimised: false }}>
        {props.children}
    </AddressContext.Provider>
}

export default AddressContext;