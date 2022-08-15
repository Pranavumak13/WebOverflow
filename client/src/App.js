import React, { useState } from "react";
import Home from "./Home";
import Gallery from "./Components/Gallery/Gallery";
import Timeline from "./Components/Timeline/Timeline";
import Upload from "./Components/Auth/Upload";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export const AdminContext = React.createContext();

export default function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(true);

  return (
    <>
      <BrowserRouter>
        <AdminContext.Provider value={{ isAdminLoggedIn, setIsAdminLoggedIn }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery">
              <Route path=":eventName" element={<Gallery />}>
                <Route path=":eventYear" element={<Gallery />} />
              </Route>
            </Route>
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/admin/upload" element={<Upload />} />
            <Route
              path="*"
              element={
                <main style={{ padding: "1rem" }}>
                  <p>There's nothing here!</p>
                </main>
              }
            />
          </Routes>
        </AdminContext.Provider>
      </BrowserRouter>
    </>
  );
}
