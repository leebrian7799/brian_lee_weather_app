import React, {Component} from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: true,
      value: '',
      message: 'e.g. 36.96,-122.02 or London',
      data: null,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.processText = this.processText.bind(this);
    this.processCoord = this.processCoord.bind(this);
  }

  processText(text){
    let today = new Date().toJSON().slice(0,10).replace(/-/g,'/');
    fetch('https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/search/?query='+this.state.value)
      .then(res => res.json())
      .then(data =>{
            switch(data.length){
              case 0:
                this.setState({message: 'City not found. Please try another one.'});
                break;
              case 1:
                fetch(`https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/${data[0].woeid}/${today}`)
                  .then(resp=>resp.json())
                  .then(weather=>{
                      this.setState({data: weather[0]});
                  });
                console.log(`https://www.metaweather.com/api/location/${data[0].woeid}/${today}`);
                break;
              default:
                this.setState({message: 'Please narrow down your search.'});
                break;
              }
          }
      )
  }

  processCoord(coord){
      let today = new Date().toJSON().slice(0,10).replace(/-/g,'/');
      fetch('https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/search/?lattlong='+coord)
      .then(res => res.json())
      .then(data =>{
          fetch(`https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/${data[0].woeid}/${today}`).then(resp=>resp.json())
          .then(weather=>{
              this.setState({data: weather[0]});
          }
        )
      }
    )
  }

  handleSubmit = event => {
    var letters = /^[A-Za-z\s]+$/;
    var lattlong = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/;

    event.preventDefault();
    event.target.reset();
    this.setState({message: ''});
    if (this.state.value.match(letters)) {
      this.processText(this.state.value);
    }else if(this.state.value.match(lattlong)) {
      this.processCoord(this.state.value);
    }else{
      this.setState({message: 'Please enter a valid input.'});
    }
  }

  handleChange(event) {
    this.setState({
      value: event.target.value,
      data: null
    });
  }

  render() {
    var {
      isLoaded
    } = this.state;

    if (isLoaded) {
      return (
        <div>
          <form onSubmit = {this.handleSubmit} >
            <label>
              <h1>Today's Weather</h1>
              <input type = "text" value = {this.state.value}
                placeholder = 'Search Location'
                onChange = {this.handleChange}/>
            </label>
            <input type = "submit" value = "Search" / >
            <div id='message'>{this.state.message}</div>
            <Weather data={this.state.data} id='weather'> </Weather>
          </form>
        </div>
      )
    }
  };
}

const Weather = (props) => {
    if (!!props.data){
      let imgLink = "https://www.metaweather.com/static/img/weather/"+props.data.weather_state_abbr+".svg";
      console.log(imgLink);
      return (
        <div className='weather' >
            <img src={imgLink} alt='Icon' id='icon'/>
            <div>{props.data.weather_state_name}</div>
            <div>Temperature: {parseInt(props.data.the_temp)}°C / {parseInt(props.data.the_temp*9/5+32)}°F</div>
            <div>High: {parseInt(props.data.max_temp)}°C / {parseInt(props.data.max_temp*9/5+32)}°F</div>
            <div>Low: {parseInt(props.data.min_temp)}°C / {parseInt(props.data.min_temp*9/5+32)}°F</div>
            <div>Humidity {parseInt(props.data.humidity)}%</div>
            <div>Wind: {parseInt(props.data.wind_speed)}mph ({props.data.wind_direction_compass})</div>
        </div>
    )}else{
      return (
        <div></div>
      )
    }
}

export default App;
