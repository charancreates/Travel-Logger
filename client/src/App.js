// @ts-nocheck
import * as React from "react";
import { useEffect, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl/maplibre";
// @ts-ignore
import "maplibre-gl/dist/maplibre-gl.css";

import { listLogEntries } from "./Api";
import LogEntryForm from "./LogEntryForm";
import "./index.css";

const App = () => {
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState({}); // Changed from [] to {} since you access it by ID
  const [addEntryLocation, setAddEntryLocation] = useState(null);
  const [viewState, setViewState] = useState({
    latitude: 37.8,
    longitude: -95.665,
    zoom: 3,
  });

  const getEntries = async () => {
    const logEntries = await listLogEntries();
    setLogEntries(logEntries);
    console.log("Log Entries:", logEntries);
  };

  useEffect(() => {
    getEntries();
  }, []);

  const showAddMarkerPopup = (event) => {
    setAddEntryLocation({
      latitude: event.lngLat.lat,
      longitude: event.lngLat.lng,
    });
  };

  return (
    <Map
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      style={{
        width: "100vw",
        height: "100vh",
        position: "absolute",
        top: 0,
        left: 0,
      }}
      onDblClick={showAddMarkerPopup}
      doubleClickZoom={false}
      mapStyle={`https://api.maptiler.com/maps/streets-v2-dark/style.json?key=${process.env.REACT_APP_MAPTILER_TOKEN}`}>
      {logEntries.map((entry) => (
        <React.Fragment key={entry._id}>
          <Marker
            latitude={entry.latitude}
            longitude={entry.longitude}
            anchor="bottom">
            <div onClick={() => setShowPopup({ [entry._id]: true })}>
              <svg
                className="marker yellow"
                style={{
                  height: `${6 * viewState.zoom}px`,
                  width: `${6 * viewState.zoom}px`,
                }}
                version="1.1"
                id="Layer_1"
                viewBox="0 0 512 512">
                <g>
                  <path d="M256,0C153.755,0,70.573,83.182,70.573,185.426c0,126.888,165.939,313.167,173.004,321.035 c6.636,7.391,18.222,7.378,24.846,0c7.065-7.868,173.004-194.147,173.004-321.035C441.425,83.182,358.244,0,256,0z M256,278.719 c-51.442,0-93.292-41.851-93.292-93.293S204.559,92.134,256,92.134s93.291,41.851,93.291,93.293S307.441,278.719,256,278.719z" />
                </g>
              </svg>
            </div>
          </Marker>

          {showPopup[entry._id] ? (
            <Popup
              longitude={entry.longitude}
              latitude={entry.latitude}
              dynamicPosition={true}
              anchor="top"
              closeButton={true}
              closeOnClick={false}
              onClose={() => setShowPopup({})}>
              <div className="popup">
                <h3>{entry.title}</h3>
                <p>{entry.comments}</p>
                <small>
                  Visited on: {new Date(entry.visitDate).toLocaleDateString()}
                </small>
                {entry.rating > 0 && (
                  <div
                    style={{
                      color: "#f5bc42",
                      fontSize: "1.2rem",
                      marginBottom: "5px",
                    }}>
                    {"★".repeat(entry.rating)}
                    {"☆".repeat(5 - entry.rating)}
                  </div>
                )}
                <p>{entry.description}</p>
                {entry.image && <img src={entry.image} alt={entry.title} />}
              </div>
            </Popup>
          ) : null}
        </React.Fragment>
      ))}

      {addEntryLocation ? (
        <>
          <Marker
            latitude={addEntryLocation.latitude}
            longitude={addEntryLocation.longitude}
            anchor="bottom">
            <div>
              <svg
                className="marker red"
                style={{
                  height: `${6 * viewState.zoom}px`,
                  width: `${6 * viewState.zoom}px`,
                }}
                version="1.1"
                id="Layer_1"
                viewBox="0 0 512 512">
                <g>
                  <path d="M256,0C153.755,0,70.573,83.182,70.573,185.426c0,126.888,165.939,313.167,173.004,321.035 c6.636,7.391,18.222,7.378,24.846,0c7.065-7.868,173.004-194.147,173.004-321.035C441.425,83.182,358.244,0,256,0z M256,278.719 c-51.442,0-93.292-41.851-93.292-93.293S204.559,92.134,256,92.134s93.291,41.851,93.291,93.293S307.441,278.719,256,278.719z" />
                </g>
              </svg>
            </div>
          </Marker>

          <Popup
            longitude={addEntryLocation.longitude}
            latitude={addEntryLocation.latitude}
            dynamicPosition={true}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setAddEntryLocation(null)}>
            <div className="popup">
              <LogEntryForm
                onClose={() => {
                  setAddEntryLocation(null);
                  getEntries();
                }}
                lat={addEntryLocation.latitude}
                lng={addEntryLocation.longitude}
              />
            </div>
          </Popup>
        </>
      ) : null}
    </Map>
  );
};

export default App;
