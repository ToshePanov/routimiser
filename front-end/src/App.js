import MapboxMap from './components/Map/MapboxMap';
import Sidebar from './components/UI/Sidebar';

import { AddressContextProvider } from './store/address-context';

function App() {

  return (
    <AddressContextProvider>
      <Sidebar />
      <MapboxMap />
    </AddressContextProvider>
  )
}

export default App;


