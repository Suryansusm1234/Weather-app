import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import AcUnitIcon from '@mui/icons-material/AcUnit';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';



import "./InfoBox.css";

export default function InfoBox({ info }) {
  const IMG_URL =
    "https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

  const HOT_URL =
    "https://images.pexels.com/photos/30595686/pexels-photo-30595686/free-photo-of-breathtaking-sunset-over-tranquil-lake.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const COLD_URL =
    "https://images.hindi.news18.com/ibnkhabar/uploads/2016/01/gulmarg-3.jpg?im=Resize,width=700,aspect=fit,type=normal";
  const RAIN_URL =
    "https://images.pexels.com/photos/243971/pexels-photo-243971.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

  return (
    <div className="InfoBox">
      <br />
      <div className="cardContainer">
        <Card sx={{ maxWidth: 345 }}>
          <CardMedia
            sx={{ height: 140 }}
            image={
              info.humidity > 80
                ? RAIN_URL
                : info.temp > 15
                ? HOT_URL
                : COLD_URL
            }
            title="Weather Image"
          />

          
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {info.city} {
              info.humidity > 80
                ? <ThunderstormIcon/>
                : info.temp > 15
                ? <WbSunnyIcon/>
                : <AcUnitIcon/>
            }
            </Typography>

            <div className="showInfo">
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                component={"span"}
              >
                <div className="info">Temprature : {info.temp} &deg;C</div>
                <div className="info">Humidity : {info.humidity}</div>
                <div className="info">
                  Min Tempraturn : {info.tempMin}&deg;C
                </div>
                <div className="info">
                  Max Temprature : {info.tempMax}&deg;C
                </div>
                <div className="info">
                  The Weather's Like <b>{info.weather}</b> Feels Like{" "}
                  {info.feelsLike}
                </div>
              </Typography>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
