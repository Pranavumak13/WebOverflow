import React from "react";
import Home from "./Home";
import Gallery from "./Components/Gallery/Gallery";
import Timeline from "./Components/Timeline/Timeline";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery">
            <Route path=":eventName" element={<Gallery />}>
              <Route path=":eventYear" element={<Gallery />} />
            </Route>
          </Route>
          <Route path="/timeline" element={<Timeline />} />
          <Route
            path="*"
            element={
              <main style={{ padding: "1rem" }}>
                <p>There's nothing here!</p>
              </main>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}
