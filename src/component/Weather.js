import React from "react";
class Weather extends React.Component {
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
    let month = parseDate(applicable_date).getMonth() + 1;
    let date = parseDate(applicable_date).getDate();
    return (
      <div className="weather">
        <img src={imgLink} alt="Icon" id="icon" />
        <h3>
          {month}/{date}
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

function parseDate(input) {
  var parts = input.match(/(\d+)/g);
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

export default Weather;
