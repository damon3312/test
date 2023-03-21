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
			home:true,
			dpage: false,
			disruptions:[],
			recommendation: [],
			disruptionsDisplayed: false,
		};

		this.fetchCurrentWeather();
		this.fetchWeatherData();
		this.fetchUniWeatherData();
		this.fetchDisruptionData();
		this.fetchRecommendations();
	}


	fetchCurrentWeather = () =>{
		var url = "http://api.openweathermap.org/data/2.5/weather?q=London&units=metric&APPID=ff6197ed77d6bc29a776c3d6b8bca419";
		$.ajax({
			url: url,
			dataType: "jsonp",
			success : (data) => this.parseCurrentWeather(data,"weather"),
			error : function(req, err){ console.log('API call failed ' + err); }
		})
	}

	// a call to fetch weather data via openweathermap
	fetchWeatherData = () => {
		// API URL with a structure of: http://api.openweathermap.org/data/2.5/weather?q=city,country&APPID=apikey
		var url = "https://api.openweathermap.org/data/2.5/forecast?id=524901&q=London&units=metric&appid=ff6197ed77d6bc29a776c3d6b8bca419";
		$.ajax({
			url: url,
			dataType: "jsonp",
			success : (data) => this.parseResponse(data, "weather"),
			error : function(req, err){ console.log('API call failed ' + err); }
		});
		
	}

	// a call to fetch weather data via openweathermap
	fetchNextWeatherData = () => {
		// API URL with a structure of: http://api.openweathermap.org/data/2.5/weather?q=city,country&APPID=apikey
		var url = "https://api.openweathermap.org/data/2.5/forecast?id=524901&q=London&units=metric&appid=ff6197ed77d6bc29a776c3d6b8bca419";
		$.ajax({
			url: url,
			dataType: "jsonp",
			success : (data) => this.parseNextResponse(data, "weather"),
			error : function(req, err){ console.log('API call failed ' + err); }
		});
	}

	// a call to fetch weather data via openweathermap
	fetchUniWeatherData = () => {
		// API URL with a structure of: http://api.openweathermap.org/data/2.5/weather?q=city,country&APPID=apikey
		var url = "https://api.openweathermap.org/data/2.5/forecast?id=524901&lon=-0.046230&lat=51.521870&units=metric&appid=ff6197ed77d6bc29a776c3d6b8bca419";
		$.ajax({
			url: url,
			dataType: "jsonp",
			success : (data) => this.parseUniResponse(data, "weather"),
			error : function(req, err){ console.log('API call failed ' + err); }
		});
	}

	// a call to fetch weather data via openweathermap
	fetchNextUniWeatherData = () => {
		// API URL with a structure of: http://api.openweathermap.org/data/2.5/weather?q=city,country&APPID=apikey
		var url = "https://api.openweathermap.org/data/2.5/forecast?id=524901&lon=-0.046230&lat=51.521870&units=metric&appid=ff6197ed77d6bc29a776c3d6b8bca419";
		$.ajax({
			url: url,
			dataType: "jsonp",
			success : (data) => this.parseNextUniResponse(data, "weather"),
			error : function(req, err){ console.log('API call failed ' + err); }
		});
		// once the data grabbed, hide the button
	}

	fetchDisruptionData = () => {
        const lines = ["northern", "district", "circle", "central", "jubilee", "metropolitan", "northern", "piccadilly", "victoria", "bakerloo"];
        const promises = lines.map(line => {
          const url = `https://api.tfl.gov.uk/Line/${line}/Disruption`;
          return $.ajax({
            url: url,
            dataType: "json",
          });
        });
        Promise.all(promises).then(responses => {
          const disruptions = responses.map((response, index) => {
            const lineName = lines[index];
            const description = response.length > 0 ? response[0].description : `${lineName} line: No disruptions.`;
            return description;
          });
          this.setState({
            disruptions: disruptions,
            disruptionsDisplayed: true

          });
        }).catch(error => {
          console.log('API call failed ' + error);
        });
    }

	fetchRecommendations = () =>{
		var url = "http://api.openweathermap.org/data/2.5/weather?q=London&units=metric&APPID=ff6197ed77d6bc29a776c3d6b8bca419";
		$.ajax({
			url: url,
			dataType: "jsonp",
			success : (data) => this.parseRecommendation(data,"weather"),
			error : function(req, err){ console.log('API call failed ' + err); }
		});
	
	}

	setToHome = () => {
		this.setState({
			home:true,
			dpage:false
		
		});
	}

	setToDisruption = () => {
		this.setState({
			home:false,
			dpage:true
		});
	}

	render() {
		const tempStyles = this.state.currentTemp ? `${style.temperature} ${style.filled}` : style.temperature;
		const tableStyle = this.state.temp||this.state.temp1||this.state.temp2||this.state.temp3 ? `${style.temperature1} ${style.filled1}` : null;
		let recommendation = this.state.recommendation;
	
		return (
		<div class={ style.container }>
			{this.state.home?
			<div class={ style.header }>
				<div class={style.city}>{this.state.locate}</div>
				<span class={tempStyles}>{this.state.currentTemp}</span>
				<div class={style.desc}>{this.state.currentDescription}</div>
			</div>
			: null
	        }
			{this.state.home? 
			<div>
				<table>
					<tr>
						<td>
							<Button class={style.leftArrow} clickFunction={this.fetchWeatherData}><img src="../../assets/icons/lArrow.png" height="25" width="20"></img></Button>
						</td>
						<td class={style.table}>
							<h2>Home</h2>
							<table>
								<tr>
									<td>{this.state.time}</td>
									<td>{this.state.time1}</td>
									<td>{this.state.time2}</td>
									<td>{this.state.time3}</td>
								</tr>
								<tr>
									<td>
										<img src={this.state.icon}></img>
										<br></br>
										{this.state.description}
									</td>
									<td>
										<img src={this.state.icon1}></img>
										<br></br>
										{this.state.description1}
									</td>
									<td>
						   			 <img src={this.state.icon2}></img>
										<br></br>
										{this.state.description2}
									</td>
									<td>
										<img src={this.state.icon3}></img>
										<br></br>
										{this.state.description3}
									</td>
								</tr>
								<tr>
									<td class={tableStyle}>{this.state.temp}</td>
									<td class={tableStyle}>{this.state.temp1}</td>
									<td class={tableStyle}>{this.state.temp2}</td>
									<td class={tableStyle}>{this.state.temp3}</td>
								</tr>
							</table>
						</td>
						<td>
							<Button class={style.rightArrow} clickFunction={this.fetchNextWeatherData}><img src="../../assets/icons/rArrow.png" height="25" width="20"></img></Button>
						</td>
					</tr>
				</table>
			</div>
			:null
	        }
			{this.state.home? 
			<div>
				<table>
					<tr>
						<td>
							<Button class={style.leftArrow} clickFunction={this.fetchUniWeatherData}><img src="../../assets/icons/lArrow.png" height="25" width="20"></img></Button>
						</td>
						<td class={style.table}>
							<h2>Queen Mary University of London</h2>
							<table>
								<tr>
									<td>{this.state.Unitime}</td>
									<td>{this.state.Unitime1}</td>
									<td>{this.state.Unitime2}</td>
									<td>{this.state.Unitime3}</td>
								</tr>
								<tr>
									<td>
										<img src={this.state.Uniicon}></img>
										<br></br>
										{this.state.Unidescription}
									</td>
									<td>
										<img src={this.state.Uniicon1}></img>
										<br></br>
										{this.state.Unidescription1}
									</td>
									<td>
									    <img src={this.state.Uniicon2}></img>
										<br></br>
										{this.state.Unidescription2}
									</td>
									<td>
										<img src={this.state.Uniicon3}></img>
										<br></br>
										{this.state.Unidescription3}
									</td>
								</tr>
								<tr>
									<td class={tableStyle}>{this.state.Unitemp}</td>
									<td class={tableStyle}>{this.state.Unitemp1}</td>
									<td class={tableStyle}>{this.state.Unitemp2}</td>
									<td class={tableStyle}>{this.state.Unitemp3}</td>
								</tr>
							</table>
						</td>
						<td>
							<Button class={style.rightArrow} clickFunction={this.fetchNextUniWeatherData}><img src="../../assets/icons/rArrow.png" height="25" width="20"></img></Button>
						</td>
					</tr>
				</table>	
			</div>
			:null
	        }
			{this.state.home ?
			<div class={style.recommendation}>
				<h2>Weather Recommendations</h2>
				<ul>
					{this.state.recommendation.map((recommendation) => (
					<li>{recommendation}</li>
					))}
				</ul>
			</div>
			:null
			}
			<div class= { style_iphone.container }> 
			{this.state.disruptions.length >= 1 && this.state.dpage ?
				<div class={style.disruptions}>
					<h2>Disruptions:</h2>
					<ul>
						{this.state.disruptions.map((disruption, i) => (
						<li key={i}>{disruption}</li>
						))}
					</ul>
				</div>
			: null
			}
			</div>
			<div class={style.footer}>
				<table>
					<td><Button class={ style.button } clickFunction={ this.setToHome }>Home Page</Button></td>
					<td><Button class={ style.button } clickFunction={ this.setToDisruption}>Disruptions Page</Button></td>
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

	parseRecommendation = (parsed_json,type) =>{
		if (type === "weather") {
			const currentDescription = parsed_json.weather[0].description;
			const currentTemp = parsed_json.main.temp;
			let recommendation = [];

			if (currentTemp > 15){
				recommendation.push('It will be warm today so remember to wear light clothing.');
			}
			else if (currentTemp > 10){
				recommendation.push('It is not too cold but still remember to put on a jacket.');
			} 
			else{
				recommendation.push('It may be a bit chilly today so wrap up warm.');
			}	

			if (currentDescription.includes('rain')){
				recommendation.push('It may rain so remeber to wear a coat or bring an umbrella.');
			} 
			else if (currentDescription.includes('clouds')){
				recommendation.push('It is cloudy, so prepare for the possibility of rain.');
			} 

		this.setState({
			recommendation: recommendation
		});

		}
	}
	
	parseResponse = (parsed_json, type) => {
		if (type === "weather") {
		  	const temp = parsed_json.list[0].main.temp;
		  	const description = parsed_json.list[0].weather[0].description;
			const time = parsed_json.list[0].dt_txt;
			const icon = parsed_json.list[0].weather[0].main;
			const temp1 = parsed_json.list[1].main.temp;
		  	const description1 = parsed_json.list[1].weather[0].description;
			const time1 = parsed_json.list[1].dt_txt;
			const icon1 = parsed_json.list[1].weather[0].main;
			const temp2 = parsed_json.list[2].main.temp;
		  	const description2 = parsed_json.list[2].weather[0].description;
			const time2 = parsed_json.list[2].dt_txt;
			const icon2 = parsed_json.list[2].weather[0].main;
			const temp3 = parsed_json.list[3].main.temp;
		  	const description3 = parsed_json.list[3].weather[0].description;
			const time3 = parsed_json.list[3].dt_txt;
			const icon3 = parsed_json.list[3].weather[0].main;
			
		  	this.setState({
				temp: temp,
				description: description,
				time: time,
				icon: `../../assets/icons/${icon}.png`,
				temp1: temp1,
				description1: description1,
				time1: time1,
				icon1: `../../assets/icons/${icon1}.png`,
				temp2: temp2,
				description2: description2,
				time2: time2,
				icon2: `../../assets/icons/${icon2}.png`,
				temp3: temp3,
				description3: description3,
				time3: time3,
				icon3: `../../assets/icons/${icon3}.png`
		  	});
		}
	}

	parseNextResponse = (parsed_json, type) => {
		if (type === "weather") {
		  	const temp = parsed_json.list[4].main.temp;
		  	const description = parsed_json.list[4].weather[0].description;
			const time = parsed_json.list[4].dt_txt;
			const icon = parsed_json.list[4].weather[0].main;
			const temp1 = parsed_json.list[5].main.temp;
		  	const description1 = parsed_json.list[5].weather[0].description;
			const time1 = parsed_json.list[5].dt_txt;
			const icon1 = parsed_json.list[5].weather[0].main;
			const temp2 = parsed_json.list[6].main.temp;
		  	const description2 = parsed_json.list[6].weather[0].description;
			const time2 = parsed_json.list[6].dt_txt;
			const icon2 = parsed_json.list[6].weather[0].main;
			const temp3 = parsed_json.list[7].main.temp;
		  	const description3 = parsed_json.list[7].weather[0].description;
			const time3 = parsed_json.list[7].dt_txt;
			const icon3 = parsed_json.list[7].weather[0].main;
			
		  	this.setState({
				temp: temp,
				description: description,
				time: time,
				icon: `../../assets/icons/${icon}.png`,
				temp1: temp1,
				description1: description1,
				time1: time1,
				icon1: `../../assets/icons/${icon1}.png`,
				temp2: temp2,
				description2: description2,
				time2: time2,
				icon2: `../../assets/icons/${icon2}.png`,
				temp3: temp3,
				description3: description3,
				time3: time3,
				icon3: `../../assets/icons/${icon3}.png`
		  	});
		}
	}

	parseUniResponse = (parsed_json, type) => {
		if (type === "weather") {
		  	const Unitemp = parsed_json.list[0].main.temp;
		  	const Unidescription = parsed_json.list[0].weather[0].description;
			const Unitime = parsed_json.list[0].dt_txt;
			const Uniicon = parsed_json.list[0].weather[0].main;
			const Unitemp1 = parsed_json.list[1].main.temp;
		  	const Unidescription1 = parsed_json.list[1].weather[0].description;
			const Unitime1 = parsed_json.list[1].dt_txt;
			const Uniicon1 = parsed_json.list[0].weather[0].main;
			const Unitemp2 = parsed_json.list[2].main.temp;
		  	const Unidescription2 = parsed_json.list[2].weather[0].description;
			const Unitime2 = parsed_json.list[2].dt_txt;
			const Uniicon2 = parsed_json.list[0].weather[0].main;
			const Unitemp3 = parsed_json.list[3].main.temp;
		  	const Unidescription3 = parsed_json.list[3].weather[0].description;
			const Unitime3 = parsed_json.list[3].dt_txt;
			const Uniicon3 = parsed_json.list[0].weather[0].main;
			
		  	this.setState({
				Unitemp: Unitemp,
				Unidescription: Unidescription,
				Unitime: Unitime,
				Uniicon: `../../assets/icons/${Uniicon}.png`,
				Unitemp1: Unitemp1,
				Unidescription1: Unidescription1,
				Unitime1: Unitime1,
				Uniicon1: `../../assets/icons/${Uniicon1}.png`,
				Unitemp2: Unitemp2,
				Unidescription2: Unidescription2,
				Unitime2: Unitime2,
				Uniicon2: `../../assets/icons/${Uniicon2}.png`,
				Unitemp3: Unitemp3,
				Unidescription3: Unidescription3,
				Unitime3: Unitime3,
				Uniicon3: `../../assets/icons/${Uniicon3}.png`
		  	});
		}
	}

	parseNextUniResponse = (parsed_json, type) => {
		if (type === "weather") {
		  	const Unitemp = parsed_json.list[4].main.temp;
		  	const Unidescription = parsed_json.list[4].weather[0].description;
			const Unitime = parsed_json.list[4].dt_txt;
			const Uniicon = parsed_json.list[4].weather[0].main;
			const Unitemp1 = parsed_json.list[5].main.temp;
		  	const Unidescription1 = parsed_json.list[5].weather[0].description;
			const Unitime1 = parsed_json.list[5].dt_txt;
			const Uniicon1 = parsed_json.list[5].weather[0].main;
			const Unitemp2 = parsed_json.list[6].main.temp;
		  	const Unidescription2 = parsed_json.list[6].weather[0].description;
			const Unitime2 = parsed_json.list[6].dt_txt;
			const Uniicon2 = parsed_json.list[6].weather[0].main;
			const Unitemp3 = parsed_json.list[7].main.temp;
		  	const Unidescription3 = parsed_json.list[7].weather[0].description;
			const Unitime3 = parsed_json.list[7].dt_txt;
			const Uniicon3 = parsed_json.list[7].weather[0].main;
			
		  	this.setState({
				Unitemp: Unitemp,
				Unidescription: Unidescription,
				Unitime: Unitime,
				Uniicon: `../../assets/icons/${Uniicon}.png`,
				Unitemp1: Unitemp1,
				Unidescription1: Unidescription1,
				Unitime1: Unitime1,
				Uniicon1: `../../assets/icons/${Uniicon1}.png`,
				Unitemp2: Unitemp2,
				Unidescription2: Unidescription2,
				Unitime2: Unitime2,
				Uniicon2: `../../assets/icons/${Uniicon2}.png`,
				Unitemp3: Unitemp3,
				Unidescription3: Unidescription3,
				Unitime3: Unitime3,
				Uniicon3: `../../assets/icons/${Uniicon3}.png`
		  	});
		}
	}
}