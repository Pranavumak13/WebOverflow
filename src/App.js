import React from 'react';
import Home from './Home';
import Gallery from './Components/Gallery/Gallery';
import Timeline from './Components/Timeline/Timeline';
import { 
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

export default function App() {
  return(<>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/timeline" element={<Timeline />} />
      </Routes>
    </BrowserRouter>
</>);
}