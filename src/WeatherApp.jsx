import { useState } from "react"
import InfoBox from "./InfoBox"
import SearchBox from "./SearchBox"


export default function WeatherApp() {
    let [weatherInfo, setWeayherInfo] = useState({
        city: "Goa",
        feelsLike: 24.3,
        temp: 23.33,
        tempMin: 18.04,
        tempMax: 23.45,
        humidity: 47,
        weather: "haze",
      });


      let updateInfo = (result) => {
        setWeayherInfo(result);
      }
    return(
        <div className="WeatherApp" style={{
            padding: "1rem",
            borderRadius: "1rem",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            width: "90%",
            maxWidth: "600px",
            margin: "auto",
            minHeight: "80vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)"
        }}>
            <h3 style={{
                fontSize: "2rem",
                color: "white",
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                marginBottom: "2rem"
            }}>Weather App by Suryansu</h3>
            <SearchBox updateInfo={updateInfo}/>
            <InfoBox info={weatherInfo}/>
        </div>
    )
}