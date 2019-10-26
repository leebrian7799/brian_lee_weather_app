import React, { Component } from "react";
import "./App.css";
import { ClipLoader } from "react-spinners";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      value: "",
      message: "e.g. 36.96,-122.02 or London",
      data: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.processText = this.processText.bind(this);
    this.processCoord = this.processCoord.bind(this);
  }

  processText(text) {
    fetch(
      "https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/search/?query=" +
        this.state.value
    )
      .then(res => res.json())
      .then(data => {
        let message;
        let weatherData;
        switch (data.length) {
          case 0:
            message = "City not found. Please try another one.";
            this.setState({ message, data: weatherData, isLoading: false });
            break;
          case 1:
            fetch(
              `https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/${data[0].woeid}/`
            )
              .then(resp => resp.json())
              .then(({ consolidated_weather }) => {
                if (!!consolidated_weather) {
                  weatherData = consolidated_weather[0];
                } else {
                  message = "No weather data";
                }
                this.setState({ message, data: weatherData, isLoading: false });
              });
            break;
          default:
            message = "Please narrow down your search.";
            this.setState({ message, data: weatherData, isLoading: false });
            break;
        }
      });
  }

  processCoord(coord) {
    fetch(
      "https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/search/?lattlong=" +
        coord
    )
      .then(res => res.json())
      .then(data => {
        let message;
        let weatherData;
        fetch(
          `https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/${data[0].woeid}/`
        )
          .then(resp => resp.json())
          .then(({ consolidated_weather }) => {
            if (!!consolidated_weather) {
              weatherData = consolidated_weather[0];
            } else {
              message = "No weather data";
            }
            this.setState({ message, data: weatherData, isLoading: false });
          });
      });
  }

  handleSubmit = event => {
    event.preventDefault();
    event.target.reset();
    var letters = /^[A-Za-z\s]+$/;
    var lattlong = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/;

    this.setState({ message: "", isLoading: true });
    if (this.state.value.match(letters)) {
      this.processText(this.state.value);
    } else if (this.state.value.match(lattlong)) {
      this.processCoord(this.state.value);
    } else {
      this.setState({
        message: "Please enter a valid input.",
        isLoading: false
      });
    }
  };

  handleChange(event) {
    this.setState({
      value: event.target.value,
      data: null
    });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            <h1>Today's Weather</h1>
            <input
              type="text"
              value={this.state.value}
              placeholder="Search Location"
              onChange={this.handleChange}
            />
          </label>
          <input type="submit" value="Search" />
          <div id="message">{this.state.message}</div>
        </form>
        <ClipLoader
          sizeUnit={"px"}
          size={125}
          color={"red"}
          loading={this.state.isLoading}
        />
        <Weather data={this.state.data} id="weather">
          {" "}
        </Weather>
      </div>
    );
  }
}

const Weather = props => {
  if (!!props.data) {
    let imgLink =
      "https://www.metaweather.com/static/img/weather/" +
      props.data.weather_state_abbr +
      ".svg";
    return (
      <div className="weather">
        <img src={imgLink} alt="Icon" id="icon" />
        <div>{props.data.weather_state_name}</div>
        <div>
          Temperature: {parseInt(props.data.the_temp)}°C /{" "}
          {parseInt((props.data.the_temp * 9) / 5 + 32)}°F
        </div>
        <div>
          High: {parseInt(props.data.max_temp)}°C /{" "}
          {parseInt((props.data.max_temp * 9) / 5 + 32)}°F
        </div>
        <div>
          Low: {parseInt(props.data.min_temp)}°C /{" "}
          {parseInt((props.data.min_temp * 9) / 5 + 32)}°F
        </div>
        <div>Humidity {parseInt(props.data.humidity)}%</div>
        <div>
          Wind: {parseInt(props.data.wind_speed)}mph (
          {props.data.wind_direction_compass})
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
};

export default App;
