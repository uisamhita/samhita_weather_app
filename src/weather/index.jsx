import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "./style.scss";
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../CommonComponents/Loader";

const WeatherForecast = () => {
  const API_KEY = process.env.REACT_APP_API_KEY; // Add in local .env file

  const appId = "15ca787f2d191cf1f09525804a2ce85d";

  const [city, setCity] = useState("");
  const [dataError, setDataError] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loader, setLoader] = useState(false);

  function formattedDate(dateVar) {
    const [year, month, day] = dateVar.split(" ")[0].split("-");

    return `${day}/${month}/${year}`;
  }

  function getWeatherData() {
    if (city) {
      axios
        .get(
          // `https://api.openweathermap.org/data/2.5/forecast?appid=${API_KEY}&q=${city}`
          `https://api.openweathermap.org/data/2.5/forecast?appid=${appId}&q=${city}`
        )
        .then((resp) => {
          setDataError(null);
          // Get Data for UNique Date. Means Per day only one record
          const uniqueDates = resp.data.list.reduce((acc, current) => {
            const date = current.dt_txt.split(" ")[0];

            if (!acc.some((item) => item.dt_txt.split(" ")[0] === date)) {
              acc.push(current);
            }

            return acc;
          }, []);

          setWeatherData(uniqueDates);

          console.log(uniqueDates);

          console.log(resp.data.list);
        })
        .catch((error) => {
          setDataError(error.response.data.message);
        });
    } else {
      setWeatherData(null);
    }
    setLoader(false);
  }

  function submitForm(e) {
    e.preventDefault();
    setLoader(true);
    getWeatherData();
  }

  return (
    <Container fluid>
      <Row className="py-5">
        <Col md={6}>
          <h3 className="app-heading">Weather in your city</h3>
        </Col>
        <Col md={6}>
          <Form onSubmit={submitForm}>
            <div className="input-group mb-3 search-block">
              <input
                type="text"
                className="form-control"
                id="cityInput"
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-warning mx-3"
                  type="button"
                  id="searchBtn"
                  onClick={submitForm}
                >
                  Search
                </button>
              </div>

              {loader && <Loader width={38} />}
            </div>
          </Form>
        </Col>
      </Row>
      <div className="weather-card-outer">
        {!dataError &&
          weatherData?.slice(0, 5).map((day, index) => {
            return (
              <div className="weather-card" key={index}>
                <table className="table table-bordered">
                  <thead className="bg-warning text-white">
                    <tr>
                      <th colSpan="2">Date: {formattedDate(day.dt_txt)}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="grey-bg">
                      <td colSpan="2">Temperature</td>
                    </tr>
                    <tr className="grey-bg">
                      <td>Min</td>
                      <td>Max</td>
                    </tr>
                    <tr className="grey-bg">
                      <td>{day.main.temp_min}</td>
                      <td>{day.main.temp_max}</td>
                    </tr>
                    <tr>
                      <td>Pressure</td>
                      <td>{day.main.pressure}</td>
                    </tr>
                    <tr>
                      <td>Humidity</td>
                      <td>{day.main.humidity}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          })}

        {dataError && <p className="text-center">{dataError}</p>}
      </div>
    </Container>
  );
};

export default WeatherForecast;
