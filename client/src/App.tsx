import './App.css';
import { getLatLong } from './Services/services';
import MapComponent, { EVLocation } from './HelperComponents/MapComponent';
import {useState} from 'react';


function App() {
  const [zipcode, setZipcode] = useState<string>("");
  const [latLongRes, setLatLongRes] = useState<EVLocation[]>([]);
  

  const handleSubmit = async () => {
    let res = await getLatLong(zipcode)
    setLatLongRes(res)
    }

  return (
    <div className="App">
      <h2>Get the locations of EV charging stations near you</h2>
      <input type="text" value={zipcode} onChange={(e)=>setZipcode(e.target.value)}></input>
      <button onClick={handleSubmit}>Submit</button>
      <MapComponent latitude={42} longitude={-90} zoom={4} setEVLocations={latLongRes}></MapComponent>
    </div>
  );
}

export default App;
