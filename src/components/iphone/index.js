// import preact
import { h, render, Component } from 'preact';
// import stylesheets for ipad & button
import style from './style';
import style_iphone from '../button/style_iphone';
// import jquery for API calls
import $ from 'jquery';
// import the Button component
import Button from '../button';

export default class Iphone extends Component {

	// a constructor with initial set states
	constructor(props){
		super(props);
		// temperature state
		this.state = {
			temp: "",
			description: "",
			display: true,
			display2: true,
			disruptions:[]
		};
	}

	// a call to fetch weather data via openweathermap
	fetchWeatherData = () => {
		// API URL with a structure of: http://api.openweathermap.org/data/2.5/weather?q=city,country&APPID=apikey
		var url = "http://api.openweathermap.org/data/2.5/weather?q=London&units=metric&APPID=0b5ada9e11785005df4e2b993928203c";
		$.ajax({
			url: url,
			dataType: "jsonp",
			success : (data) => this.parseResponse(data, "weather"),
			error : function(req, err){ console.log('API call failed ' + err); }
		});
		// once the data grabbed, hide the button
		this.setState({ display: false });
	}

	fetchDisruptionData = () => {
		const lines = ["northern", "central", "circle", "district", "jubilee", "metropolitan", "northern", "piccadilly", "victoria", "bakerloo"];
		const promises = lines.map(line => {
		  const url = `https://api.tfl.gov.uk/Line/${line}/Disruption`;
		  return $.ajax({
			url: url,
			dataType: "json",
		  });
		});
		Promise.all(promises).then(responses => {
		  const disruptions = responses.map(response => {
			const description = response[0].description;
			return description;
		  });
		  this.setState({
			disruptions: disruptions
		  });
		}).catch(error => {
		  console.log('API call failed ' + error);
		});
		this.setState({ display2: false });
	  }

	fetch4HourWeather = () =>{
	    var url ="https://api.openweathermap.org/data/2.5/forecast?id=524901&q=London&units=metric&appid=0b5ada9e11785005df4e2b993928203c";
		$.ajax({
			url: url,
			dataType: "jsonp",
			success : this.parse4hours,
			error : function(req, err){ console.log('API call failed ' + err); }
		})
	}

	

	render() {
		const tempStyles = this.state.temp ? `${style.temperature} ${style.filled}` : style.temperature;
	
		return (
		<div class={ style.container }>
			<div class={ style.header }>
			  <div class={ style.temperature }>{ this.state.temp }</div>
			  <div class={ style.description }>{ this.state.description }</div>
			</div>
			<div class= { style_iphone.container }> 
				<div class={style_iphone.button}>
					{this.state.display ? <Button class={style_iphone.button} clickFunction={this.fetchWeatherData} >Display Weather</Button> : null}
				</div>
			  	{ this.state.display2 ? 
					<div>
					  <Button class={ style_iphone.button } clickFunction={ this.fetchDisruptionData }>Display Disruptions</Button>
					</div>
					: null 
			 	}
			 	{ this.state.disruptions.length > 0 ?
				<div>
					<h2>Disruptions:</h2>
				  	{this.state.disruptions.map((disruption, i) => (
					<p key={i}>{disruption}</p>
				  	))}
				</div>
				: null
			  }
			</div>
		</div>
		);
	}

	parse4hours = (parsed_json) =>{
		const temperature1 = parsed_json['list']['0']['main']['temp'];
		const timestamp1 = parsed_json['list']['0']['dt_txt'];
		const description1 = parsed_json['list']['0']['weather']['0']['description'];
		const temperature2 =parsed_json['list']['1']['main']['temp'];
		const timestamp2 = parsed_json['list']['1']['dt_txt'];
		const description2 = parsed_json['list']['1']['weather']['0']['description'];
		const temperature3 =parsed_json['list']['2']['main']['temp'];
		const timestamp3 = parsed_json['list']['2']['dt_txt'];
		const description3 = parsed_json['list']['2']['weather']['0']['description'];
		const temperature4 =parsed_json['list']['3']['main']['temp'];
		const timestamp4 = parsed_json['list']['3']['dt_txt'];
		const description4 = parsed_json['list']['3']['weather']['0']['description'];

		this.setState({
			temp1: temperature1,
			time1: timestamp1,
			desc1: description1,
			temp2: temperature2,
			time2: timestamp2,
			desc2: description2,
			temp3: temperature3,
			time3: timestamp3,
			desc3: description3,
			temp4: temperature4,
			time4: timestamp4,
			desc4: description4
		});
	}
	
	
	  parseResponse = (parsed_json, type) => {
		if (type === "weather") {
		  const temp = parsed_json.main.temp;
		  const description = parsed_json.weather[0].description;
		  this.setState({
			temp: temp,
			description: description
		  });
		}
	  }
	}