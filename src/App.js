import React, { Component } from "react";
import "./App.css";
import { ClipLoader } from "react-spinners";
import Weather from "./component/Weather";

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

  /**
   * Process inputed text
   * 1. Look up the Where On Earth Identifier associated with the city
   * 2. If found, retrieve the weather data. Otherwise, output error message.
   */
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
                  weatherData = consolidated_weather;
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
  /**
   * Process geographical coordinate
   * 1. Look up the Where On Earth Identifier associated with the coordinate
   * 2. If found, retrieve the weather data. Otherwise, output error message.
   */
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
              weatherData = consolidated_weather;
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
    //Regex to ensure the input is either all letters or a valid coordinate
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
    var weatherCards;
    if (!!this.state.data) {
      weatherCards = this.state.data.map((weatherD, i) => (
        <Weather data={weatherD} key={i} />
      ));
    }

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            <h1>Weather Forecast</h1>
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
          color={"coral"}
          loading={this.state.isLoading}
        />
        {weatherCards}
      </div>
    );
  }
}

export default App;
