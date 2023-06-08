import { useState, useEffect, useContext } from 'react';
import Map, { Marker } from 'react-map-gl';
import { Source, Layer } from 'react-map-gl';

import polyline from '@mapbox/polyline';
import 'mapbox-gl/dist/mapbox-gl.css';

import classes from './MapboxMap.module.css';
import AddressContext from '../../store/address-context';

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
console.log(MAPBOX_TOKEN);

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
        const handleWindowResize = () => {
            setWindowSize([window.innerWidth, window.innerHeight]);
        };

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    const coordinatesArray = polyline.decode('}`d{Hn_LoD_k@xISqGuGnCqoAwGcR|b@wdAru@qq@j|@oCfc@fLf_Abz@r}FUfvAnz@dxAbFl{D|uAzqBpN`sA|nBdkA|n@zvA~B`HnXz^tS{HpB}FmE{A|_@zS~}A}O~g@Sl_BbDpP~SjCrGlZcdA`\\iEeO|@veBx}A~xDbGbaByt@vpAq[hjBeqC`kCom@hRwTpZmIfw@hOhxC}sAhrFsaAnc@}zAz_D{|@dZmjA}D}}@lr@~EmHoyAkdB{Lyt@__AqlAk{@~V}Tkc@}`@yTjAcJdwBg~EbAuhAiw@o|AyjAmtDsh@aTo~ByuBhi@k`CiTa`CkEgmCg\\mn@}e@qG{Yis@eCu`AhMseAw\\{vApEwfAiKabApJe]a_@eqA');

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

    return (
        <div className={classes.mapboxMap}>
            <Map
                {...viewState}
                onMove={evt => setViewState(evt.viewState)}
                style={{ width: windowSize[0], height: windowSize[1] }}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                mapboxAccessToken={MAPBOX_TOKEN}
            >
                {addressCtx.addressList.length > 0 && addressCtx.addressList.map((address, i) => (
                    <Marker longitude={address.geometry[0]} latitude={address.geometry[1]} color={address.waypoint_index ? 'blue' : 'red'} key={Math.random()} >
                        {/*  {i + 1} */}
                    </Marker>
                ))}
                <Source id="my-data" type="geojson" data={geojson}>
                    <Layer {...layerStyle} />
                </Source>

                {/* <Source id="route" type="geojson" data={geojson}>
                    <Layer {...layerStyle} />
                </Source> */}
            </Map>
        </div>
    );
}

export default MapboxMap;