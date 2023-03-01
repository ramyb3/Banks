import "./App.css";
import Bank from "./bank";
import { useEffect, useState } from "react";
import axios from "axios";
import emailjs from "emailjs-com";

export default function App() {
  const [banks, setBanks] = useState([]);
  const [city, setCity] = useState("");

  // check permission to user location
  useEffect(() => {
    window.navigator.permissions &&
      window.navigator.permissions
        .query({ name: "geolocation" })
        .then(async function (PermissionStatus) {
          if (
            PermissionStatus.state === "granted" ||
            PermissionStatus.state === "prompt"
          ) {
            window.navigator.geolocation.getCurrentPosition(
              async (position) => {
                const location = await getLocation([
                  position.coords.latitude,
                  position.coords.longitude,
                ]);
                const list = await getData(location);
                setBanks(list);
              }
            );
          }
        });

    const templateParams = {
      message: `banks:\n${navigator.userAgent};\nresolution: ${window.screen.width} X ${window.screen.height}`,
    };

    // emailjs.send(
    //   process.env.REACT_APP_EMAIL_JS_SERVICE,
    //   process.env.REACT_APP_EMAIL_JS_TEMPLATE,
    //   templateParams,
    //   process.env.REACT_APP_EMAIL_JS_USER
    // );
  }, []);

  const getBanks = async () => {
    if (city !== "") {
      const list = await getData(city);
      setBanks(list);

      if (list.length === 0) {
        alert("אין תוצאות! נסו שוב");
      }
    } else {
      alert("נא להקליד עיר בשביל לקבל תוצאה!");
    }
  };

  return (
    <>
      <h1>כל סניפי הבנקים שבעיר שלך</h1>

      <input
        placeholder="הזן עיר"
        type="text"
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={getBanks}>חפש</button>

      {banks.length > 0 ? (
        <div className="container">
          {banks.map((bank, index) => {
            return (
              <div className="card" key={index}>
                <Bank bank={bank} />
              </div>
            );
          })}
        </div>
      ) : null}
    </>
  );
}

// get data about banks
export const getData = async (location) => {
  let resp = await axios.get(
    "https://data.gov.il/api/3/action/datastore_search?resource_id=1c5bc716-8210-4ec7-85be-92e6271955c2&&limit=0"
  );

  const total = resp.data.result.total; //get all israel banks

  resp = await axios.get(
    `https://data.gov.il/api/3/action/datastore_search?resource_id=1c5bc716-8210-4ec7-85be-92e6271955c2&&limit=${total}`
  );

  //returns all banks in the city
  return resp.data.result.records.filter(
    (data) =>
      data.City.replace(/\s/g, "").includes(location.replace(/\s/g, "")) &&
      !data.Close_Date
  );
};

// get location using google maps api
export const getLocation = async (position) => {
  const key = process.env.REACT_APP_API_KEY; // api key

  const address = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${position[0]},${position[1]}&key=${key}`
  );

  return address.data.results[0].address_components.find(
    (data) =>
      data.types.includes("locality") && data.types.includes("political")
  ).long_name; //get user's city
};
