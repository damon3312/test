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
			home:true,
			dpage: false,
			disruptions:[]
		};
	}

	// a call to fetch weather data via openweathermap
	fetchWeatherData = () => {
		// API URL with a structure of: http://api.openweathermap.org/data/2.5/weather?q=city,country&APPID=apikey
		var url = "http://api.openweathermap.org/data/2.5/weather?q=London&units=metric&APPID=776b7cbe36ab4e4ce2cd647150265193";
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
	}

	setToDisruption = () => {
		this.setState({home:false})
		this.setState({dpage:true})
		this.setState({display:false})
		this.setState({display2:true})
	}

	render() {
		const tempStyles = this.state.temp ? `${style.temperature} ${style.filled}` : style.temperature;
	
		return (
		<div class={ style.container }>
			{this.state.home && !this.state.display?
			<div class={ style.header }>
				<div class={style.city}>{this.state.locate}</div>
				<div class={style.conditions}>{this.state.cond}</div>
				<span class={tempStyles}>{this.state.temp}</span>
				<div class={style.desc}>{this.state.description}</div>
			</div>
			: null
	        }
			<div class= { style_iphone.container }> 
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
					<td>
						<Button class={ style_iphone.button } clickFunction={ this.setToHome }>Home Page</Button>
					</td>
					<td>
						<Button class={ style_iphone.button } clickFunction={ this.setToDisruption}>Disruption Page</Button>
					</td>
				</table>
			</div>
		</div>
		);
	}
	
	
	  parseResponse = (parsed_json, type) => {
		if (type === "weather") {
			const location = parsed_json.name;
		  	const temp = parsed_json.main.temp;
		  	const description = parsed_json.weather[0].description;
		  	this.setState({
				locate: location,
				temp: temp,
				description: description
		  	});
		}
	  }
	}