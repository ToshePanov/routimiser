if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require('express');
const app = express();
const methodOverride = require('method-override');
const fetch = require('node-fetch');

const cors = require('cors');

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

const geocoder = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN })

const mapboxUrl = 'https://api.mapbox.com/optimized-trips/v1/mapbox/driving/';
const mapboxToken = `?access_token=${process.env.MAPBOX_TOKEN}`;

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(cors());
app.use(express.json())

catchAsync = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}

const reactAddresses = [];

app.get('/optimiseRoute', async (req, res) => {
    let url = mapboxUrl;

    for (let i = 0; i < reactAddresses.length; i++) {
        url = url + reactAddresses[i].geometry[0] + ',' + reactAddresses[i].geometry[1];
        if (i < reactAddresses.length - 1) {
            url = url + ';';
        }
    }

    url = url + mapboxToken;
    let result = await fetch(url);
    const json = await result.json();

    function roundNum(number, decimal_digit = 3) {
        let powerOften = Math.pow(10, decimal_digit);
        let result = Math.round(number * powerOften) / powerOften;
        return result
    }
    for (let i = 0; i < json.waypoints.length; i++) {
        for (let j = 0; j < reactAddresses.length; j++) {
            if ((roundNum(json.waypoints[i].location[0]) === roundNum(reactAddresses[j].geometry[0])) &&
                (roundNum(json.waypoints[i].location[1]) === roundNum(reactAddresses[j].geometry[1]))) {
                reactAddresses[j].waypoint_index = json.waypoints[i].waypoint_index;
            }
        }
        reactAddresses.sort((a1, a2) => a1.waypoint_index > a2.waypoint_index ? 1 : -1);
    }
    res.json({ optimisedRoute: reactAddresses, routeDetails: json.trips[0] });
});


app.post('/addAddress', async (req, res) => {
    const payload = req.body;
    if (reactAddresses.length === 0) payload.waypoint_index = 0;
    reactAddresses.push(payload);
    res.json({ message: 'success' });
});


app.post('/searchSuggestions', async (req, res) => {
    const searchTerm = req.body.searchTerm;
    const suggestedAddresses = [];

    if (searchTerm.length > 0) {
        const geoData = await geocoder.forwardGeocode({
            query: searchTerm,
            countries: ['GB']
        }).send()
        for (let i = 0; i < geoData.body.features.length; i++) {
            const searchResult = geoData.body.features[i];
            suggestedAddresses.push({ searchText: searchResult.place_name, geometry: searchResult.geometry.coordinates });
        }
    }
    res.json({ message: 'success', searchSuggestions: suggestedAddresses });
});

app.get('/addresses', (req, res) => {
    res.json({ addresses: reactAddresses });
})

app.listen(process.env.PORT, () => {
    console.log(`Example app listening at http://localhost:${process.env.PORT}`)
})
