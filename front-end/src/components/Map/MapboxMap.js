import { useState, useEffect, useContext, useMemo } from 'react';
import Map, { Marker, Source, Layer } from 'react-map-gl';

import polyline from '@mapbox/polyline';
import 'mapbox-gl/dist/mapbox-gl.css';

import classes from './MapboxMap.module.css';
import AddressContext from '../../store/address-context';

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const MapboxMap = (props) => {
    const addressCtx = useContext(AddressContext);

    const [viewState, setViewState] = useState({
        latitude: 51.4,
        longitude: -0.8,
        zoom: 6.5
    });

    const [windowSize, setWindowSize] = useState([
        window.innerWidth,
        window.innerHeight,
    ]);

    useEffect(() => {
        let lngs = [], lats = [];
        for (let i in addressCtx.addressList) {
            lngs.push(addressCtx.addressList[i].geometry[0]);
            lats.push(addressCtx.addressList[i].geometry[1]);
        }
        const mapView = {
            minLng: Math.min(...lngs),
            maxLng: Math.max(...lngs),
            minLat: Math.min(...lats),
            maxLat: Math.max(...lats)
        }
        const max_bound = Math.max(Math.abs((mapView.minLat) - (mapView.maxLat)), Math.abs((mapView.minLng) - (mapView.maxLng))) * 111
        const zoom = 13 - Math.log(max_bound);
        setViewState({
            latitude: ((mapView.minLat + mapView.maxLat) / 2) || 51.4,
            longitude: ((mapView.minLng + mapView.maxLng) / 2) || -0.8,
            zoom: (zoom === Infinity || zoom === -Infinity) ? 7 : zoom
        })
    }, [addressCtx.addressList]);

    useEffect(() => {
        const handleWindowResize = () => {
            setWindowSize([window.innerWidth, window.innerHeight]);
        };

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);


    const coordinatesArray = addressCtx.routeDetails && polyline.decode(addressCtx.routeDetails.geometry);
    for (let i in coordinatesArray) {
        const helper = coordinatesArray[i][0];
        coordinatesArray[i][0] = coordinatesArray[i][1];
        coordinatesArray[i][1] = helper;
    }

    const geojson = {
        type: "Feature",
        properties: {},
        geometry: {
            type: "LineString",
            coordinates: coordinatesArray
        }
    };

    const layerStyle = {
        id: 'point',
        type: 'line',
        paint: {
            "line-color": "rgba(3, 170, 238, 0.5)",
            "line-width": 5
        }
    };

    const markers = useMemo(() => addressCtx.addressList.map((address, i) => (
        <Marker longitude={address.geometry[0]} latitude={address.geometry[1]} key={Math.random()} >
            <div className={classes.marker}>
                <span className={i === 0 ? classes.startPoint : undefined}><b>{i !== 0 ? i : 'o'}</b></span>
            </div>
        </Marker>
    )), [addressCtx.addressList])

    return (
        <div className={classes.mapboxMap}>
            <Map
                {...viewState}
                onMove={evt => setViewState(evt.viewState)}
                style={{ width: windowSize[0], height: windowSize[1] }}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                mapboxAccessToken={MAPBOX_TOKEN}
            >
                {addressCtx.addressList && markers}
                {addressCtx.isOptimised && <Source id="my-data" type="geojson" data={geojson}>
                    <Layer {...layerStyle} />
                </Source>}
            </Map>
        </div>
    );
}

export default MapboxMap;