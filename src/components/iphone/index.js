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
			temp1: "",
			temp2: "",
			temp3: "",
			currentTemp: "",
			currentDescription: "",
			locate:"",
			description: "",
			description1: "",
			description2: "",
			description3: "",
			time:"",
			time1:"",
			time2:"",
			time3:"",
			displayCurrent: true,
			display: true,
			display2: true,
			home:true,
			dpage: false,
			disruptions:[]
		};
	}

	fetchCurrentWeather = () =>{
		var url = "http://api.openweathermap.org/data/2.5/weather?q=London&units=metric&APPID=776b7cbe36ab4e4ce2cd647150265193";
		$.ajax({
			url: url,
			dataType: "jsonp",
			success : (data) => this.parseCurrentWeather(data,"weather"),
			error : function(req, err){ console.log('API call failed ' + err); }
		})
		// once the data grabbed, hide the button
		this.setState({ displayCurrent: false });
	}

	// a call to fetch weather data via openweathermap
	fetchWeatherData = () => {
		// API URL with a structure of: http://api.openweathermap.org/data/2.5/weather?q=city,country&APPID=apikey
		var url = "https://api.openweathermap.org/data/2.5/forecast?id=524901&q=London&units=metric&appid=776b7cbe36ab4e4ce2cd647150265193";
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
		  const url = `https://api.tfl.gov.uk/Line/${lines}/Disruption`;
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


	setToHome = () => {
		this.setState({home:true})
		this.setState({dpage:false})
		this.setState({display2:false})
		this.setState({display:true})
		this.setState({displayCurrent:true})
	}

	setToDisruption = () => {
		this.setState({home:false})
		this.setState({dpage:true})
		this.setState({display:false})
		this.setState({display2:true})
		this.setState({displayCurrent:false})
	}

	render() {
		const tempStyles = this.state.currentTemp ? `${style.temperature} ${style.filled}` : style.temperature;
		const tableStyle = this.state.temp||this.state.temp1||this.state.temp2||this.state.temp3 ? `${style_iphone.temperature} ${style_iphone.filled}` : null;
	
		return (
		<div class={ style.container }>
			{this.state.home && !this.state.displayCurrent?
			<div class={ style.header }>
				<div class={style.city}>{this.state.locate}</div>
				<span class={tempStyles}>{this.state.currentTemp}</span>
				<div class={style.desc}>{this.state.currentDescription}</div>
			</div>
			: null
	        }
			{this.state.home && !this.state.display? 
			<div class={style_iphone.table}>
				<h2>Home</h2>
				<table>
					<tr>
						<td>{this.state.time}</td>
						<td>{this.state.time1}</td>
						<td>{this.state.time2}</td>
						<td>{this.state.time3}</td>
					</tr>
					<tr>
						<td>{this.state.description}</td>
						<td>{this.state.description1}</td>
						<td>{this.state.description2}</td>
						<td>{this.state.description3}</td>
					</tr>
					<tr>
						<td class={tableStyle}>{this.state.temp}</td>
						<td class={tableStyle}>{this.state.temp1}</td>
						<td class={tableStyle}>{this.state.temp2}</td>
						<td class={tableStyle}>{this.state.temp3}</td>
					</tr>
				</table>
			</div>
			:null
	        }
			<div class= { style_iphone.container }> 
				<div class={style_iphone.button}>
					{this.state.displayCurrent && this.state.home? <Button class={style_iphone.button} clickFunction={this.fetchCurrentWeather} >Display Current Weather</Button> : null}
				</div>
				<div class={style_iphone.button}>
					{this.state.display && this.state.home? <Button class={style_iphone.button} clickFunction={this.fetchWeatherData} >Display Home Weather</Button> : null}
				</div>
			  	{ this.state.display2 && this.state.dpage ? 
					<div>
					  <Button class={ style_iphone.button } clickFunction={ this.fetchDisruptionData }>Display Disruptions</Button>
					</div>
					: null 
			 	}
			 	{ this.state.disruptions.length && this.state.dpage && !this.state.display2> 0 ?
				<div class={style.header}>
					<h2>Disruptions:</h2>
				  	{this.state.disruptions.map((disruption, i) => (
					<p key={i}>{disruption}</p>
				  	))}
				</div>
				: null
			  }
			</div>
			<div class={style_iphone.footer}>
				<table>
					<td><Button class={ style_iphone.button } clickFunction={ this.setToHome }>Home Page</Button></td>
					<td><Button class={ style_iphone.button } clickFunction={ this.setToDisruption}>Disruptions Page</Button></td>
				</table>
			</div>
		</div>
		);
	}

	parseCurrentWeather = (parsed_json, type) => {
		if (type === "weather") {
			const location = parsed_json.name;
			const currentDescription = parsed_json.weather[0].description;
			const currentTemp = parsed_json.main.temp;
			this.setState({
				locate: location,
				currentDescription: currentDescription,
				currentTemp: currentTemp
			});

		}
	}
	
	parseResponse = (parsed_json, type) => {
		if (type === "weather") {
		  	const temp = parsed_json.list[0].main.temp;
		  	const description = parsed_json.list[0].weather[0].description;
			const time = parsed_json.list[0].dt_txt;
			const temp1 = parsed_json.list[1].main.temp;
		  	const description1 = parsed_json.list[1].weather[0].description;
			const time1 = parsed_json.list[1].dt_txt;
			const temp2 = parsed_json.list[2].main.temp;
		  	const description2 = parsed_json.list[2].weather[0].description;
			const time2 = parsed_json.list[2].dt_txt;
			const temp3 = parsed_json.list[3].main.temp;
		  	const description3 = parsed_json.list[3].weather[0].description;
			const time3 = parsed_json.list[3].dt_txt;
		  	this.setState({
				temp: temp,
				description: description,
				time: time,
				temp1: temp1,
				description1: description1,
				time1: time1,
				temp2: temp2,
				description2: description2,
				time2: time2,
				temp3: temp3,
				description3: description3,
				time3: time3,
		  	});
		}
	}
}