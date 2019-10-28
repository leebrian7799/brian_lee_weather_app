import React from "react";
class Weather extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      applicable_date,
      weather_state_abbr,
      weather_state_name,
      the_temp,
      max_temp,
      min_temp,
      humidity,
      wind_speed,
      wind_direction_compass
    } = this.props.data;
    let imgLink =
      "https://www.metaweather.com/static/img/weather/" +
      weather_state_abbr +
      ".svg";
    let date = new Date(applicable_date);
    return (
      <div className="weather">
        <img src={imgLink} alt="Icon" id="icon" />
        <h3>
          {date.getMonth()}/{date.getDate()}
        </h3>
        <div>{weather_state_name}</div>
        <div>
          Temperature: {parseInt(the_temp)}°C / {cToF(the_temp)}°F
        </div>
        <div>
          High: {parseInt(max_temp)}°C / {cToF(max_temp)}
          °F
        </div>
        <div>
          Low: {parseInt(min_temp)}°C / {cToF(min_temp)}°F
        </div>
        <div>Humidity {parseInt(humidity)}%</div>
        <div>
          Wind: {parseInt(wind_speed)}mph ({wind_direction_compass})
        </div>
      </div>
    );
  }
}

function cToF(celsius) {
  var cTemp = celsius;
  var fTemp = (cTemp * 9) / 5 + 32;
  return parseInt(fTemp);
}

export default Weather;
