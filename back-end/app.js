if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require('express');
const app = express();
const fetch = require('node-fetch');

const cors = require('cors');

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

const geocoder = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });

app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(express.json())

catchAsync = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}

const reactAddresses = [];

app.get('/optimiseRoute', catchAsync(async (req, res) => {
    const roundNum = (number, decimal_digit = 2) => {
        let powerOften = Math.pow(10, decimal_digit);
        let result = Math.round(number * powerOften) / powerOften;
        return result;
    }

    const getOptimisedRoute = async (addresses) => {
        let url = 'https://api.mapbox.com/optimized-trips/v1/mapbox/driving/';
        const mapboxToken = `?access_token=${process.env.MAPBOX_TOKEN}`;
        addresses.sort((a1, a2) => a1.index > a2.index ? 1 : -1);
        for (let i = 0; i < addresses.length; i++) {
            url = url + addresses[i].geometry[0] + ',' + addresses[i].geometry[1];
            if (i < addresses.length - 1) {
                url = url + ';';
            }
        }

        url = url + mapboxToken;
        const result = await fetch(url);
        return await result.json();
    }

    const json = await getOptimisedRoute(reactAddresses);

    for (let i = reactAddresses.length - 1; i >= 0; i--) {
        for (let j = json.waypoints.length - 1; j >= 0; j--) {
            if ((roundNum(json.waypoints[j].location[0]) === roundNum(reactAddresses[i].geometry[0])) &&
                (roundNum(json.waypoints[j].location[1]) === roundNum(reactAddresses[i].geometry[1]))) {
                reactAddresses[i].waypoint_index = json.waypoints[j].waypoint_index;
                json.waypoints.splice(j, 1);
            }
        }
    }
    reactAddresses.sort((a1, a2) => a1.waypoint_index > a2.waypoint_index ? 1 : -1);
    res.json({ optimisedRoute: reactAddresses, routeDetails: json.trips[0] });
}));


app.post('/addAddress', (req, res) => {
    if (reactAddresses.length > 11) {
        return res.json({ message: 'error' });
    }
    const payload = req.body;
    payload.index = reactAddresses.length + 1;
    if (reactAddresses.length === 0) payload.waypoint_index = 0;
    reactAddresses.push(payload);
    for (let i of reactAddresses) {
        if (i.waypoint_index !== 0) i.waypoint_index = null;
    }
    res.json({ message: 'success' });
});

app.post('/searchSuggestions', catchAsync(async (req, res) => {
    const searchTerm = req.body.searchTerm;
    const suggestedAddresses = [];

    if (searchTerm.length > 0) {
        const geoData = await geocoder.forwardGeocode({
            query: searchTerm,
            countries: ['GB']
        }).send()
        for (let i in geoData.body.features) {
            const searchResult = geoData.body.features[i];
            suggestedAddresses.push({ searchText: searchResult.place_name, geometry: searchResult.geometry.coordinates });
        }

        res.json({ message: 'success', searchSuggestions: suggestedAddresses });
    } else {
        res.json({ message: 'error' });
    }
}));

app.get('/addresses', (req, res) => {
    res.json({ addresses: reactAddresses });
})

app.listen(process.env.PORT, () => {
    console.log(`Example app listening at http://localhost:${process.env.PORT}`)
})
