import React, { useContext } from "react";
import { AdminContext } from "../../App";

export default function Upload() {
  const { isAdminLoggedIn, setIsAdminLoggedIn } = useContext(AdminContext);

  return isAdminLoggedIn ? (
    <>
      <form
        action="http://localhost:8000/gallery/event/year/images"
        method="post"
        enctype="multipart/form-data"
      >
        <label for="files"> Upload files:</label>
        <input type="file" id="files" name="imagesMedia" multiple />
        <input type="submit" value="Upload" />
      </form>
      <form
        action="http://localhost:8000/gallery/event/year"
        method="post"
        enctype="multipart/form-data"
      >
        <label for="eventname">Event Name:</label>
        <input type="text" id="eventname" />
        <label for="eventyear">Event Year:</label>
        <input type="number" id="eventyear" />
        <input type="submit" value="Create Album" />
      </form>
    </>
  ) : (
    <>Access Denied.</>
  );
}
