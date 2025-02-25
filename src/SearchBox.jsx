import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "./SearchBox.css";
import { useState } from "react";

export default function SearchBox({updateInfo}) {
  const API_URL = "https://api.openweathermap.org/data/2.5/weather";
  const API_KEY = "8ccbdd1a783e07265865197f43ec4746";

  let [city, setCity] = useState("");
  let [error, setError] = useState(false);

  let getWeatherInfo = async () => {
    try {
      let response = await fetch(
        `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`
      );
      let jsonResponse = await response.json();
      // console.log(jsonResponse);
  
      let result = {
        city: city,
        temp: jsonResponse.main.temp,
        tempMin: jsonResponse.main.temp_min,
        tempMax: jsonResponse.main.temp_max,
        humidity: jsonResponse.main.humidity,
        feelsLike: jsonResponse.main.feels_like,
        weather: jsonResponse.weather[0].description,
      };
  
      console.log(result);
      return result;
    } catch(err) {
      throw err;
    }


  };

  let handleChange = (event) => {
    setCity(event.target.value);
  };

  let handleSubmit = async (event) => {
    try {
      event.preventDefault();
      console.log(city);
      setCity("");
      let newInfo = await getWeatherInfo();
      updateInfo(newInfo); 
      setError(false);
    } catch (err) {
      setError(true);
    }


  
  };

  return (
    <div className="SearchBox">
      <form action="" style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem"
      }}>
        <TextField
          id="city"
          label="City Name"
          variant="outlined"
          required
          value={city}
          onChange={handleChange}
          sx={{
            width: "100%",
            maxWidth: "400px",
            "& .MuiOutlinedInput-root": {
              background: "rgba(255, 255, 255, 0.1)",
              color: "white",
              "& fieldset": {
                borderColor: "rgba(255, 255, 255, 0.3)"
              },
              "&:hover fieldset": {
                borderColor: "rgba(255, 255, 255, 0.5)"
              }
            },
            "& .MuiInputLabel-root": {
              color: "rgba(255, 255, 255, 0.7)"
            }
          }}
        />
        <Button 
          variant="contained" 
          type="submit" 
          onClick={handleSubmit}
          sx={{
            background: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(10px)",
            "&:hover": {
              background: "rgba(255, 255, 255, 0.3)"
            }
          }}
        >
          Search
        </Button>
        {error && <p className="err" style={{
          color: "#ff6b6b",
          fontWeight: "bold",
          textShadow: "1px 1px 2px rgba(0,0,0,0.2)"
        }}>No such place found!</p>}
      </form>
    </div>
  );
}
