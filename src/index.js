import Promise from 'promise-polyfill'; 
import 'whatwg-fetch';
import React, {Component} from 'react';
import ReactDom from 'react-dom';
import ShiftSchedule from './components/day-schedule';
import NavBar from './components/navbar';
import moment from 'moment';
import pick from 'lodash';
import ItemTypes from './components/item-types';
import * as ShiftTimes from './components/shift-times';
import {scheduleConflict} from './components/time-functions';
import {getGradientByDate} from './components/color-seasons';

let importedJSON = [];

const pwd_placeholder = "lechon";

function updatePersonList(state, props){
 		let selectedDate = importedJSON.filter(x => x._id === state.startDate.format("YYYY-MM-DD"))[0];
	 	if((selectedDate == null && this.state.template != undefined) || this.state.redigerMal){
			selectedDate = this.state.template[state.startDate.day()];
	 	}
		return {
			persons: selectedDate[state.shift],
			sidebar: selectedDate.sidebar
		};
}
	
class App extends Component {
	constructor(props){
		const currentDate = moment();
		currentDate.locale('nb-no');
		const currentMins = currentDate._d.getMinutes()+(currentDate._d.getHours()*60);
		let shift;
		if(currentMins >= ShiftTimes.START_D && currentMins < ShiftTimes.START_A){
			shift = 'd';
		}
		else if(currentMins < ShiftTimes.END_A){
			shift = 'a';
		}
		else {
			shift = 'n';
		}

		super(props);
		this.state = {
			startDate: currentDate,
			shift: shift,
			persons: [],
			sidebar: [],
			stride: 5,
			redigerMal: false,
			isLoading: true
		};
		//this.openBook('mal.mal');
	}

	/*componentDidUpdate(){
		this.setState(updatePersonList);
	}*/

	componentWillReceiveProps(){
		if(this.state.template == undefined) return;
		let selectedDate = importedJSON.filter(x => x._id === this.state.startDate.format("YYYY-MM-DD"))[0];
 		if((selectedDate == undefined && this.state.template != undefined) || this.state.redigerMal){
			selectedDate = this.state.template[state.startDate.day()];
 		}
		this.setState({persons: selectedDate[this.state.shift]});
		return;
	}

	openLocalJSON(fileName){
		var request = new XMLHttpRequest();
		let data;
		request.open('GET', fileName, true);
		let that = this;
		
		request.onload = function() {
		    if (this.status >= 200 && this.status < 400) {
		        data = JSON.parse(this.response);
		       	that.setState((state, props) => {
					return {
						isLoading: false,
						template: data,
						persons: data[state.startDate.day()][state.shift]
					}
				});
		    } else {
		        console.error('Response received and there was an error');
		    }
		};

		request.onerror = function() {
		    console.error('Request error');
		};

		request.send();

		/*
		return fetch(fileName, { method: 'GET', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }})
			.then((response) => response.json()
			.then((obj) => {
				this.setState((state, props) => {
					return {
						isLoading: false,
						template: obj,
						persons: obj[state.startDate.day()][state.shift]
					}
				})
			})
			)
			.catch((error) => { console.error(error); });*/
	}

	incrementDate(days){
		let newDate = this.props.state.startDate.add(days, 'days');
		this.setState({
			startDate: newDate
		});
		this.setState(updatePersonList);
	}

	moveEvent(event, destination, date, shift){
		if(this.state.redigerMal){
			this.moveEventTemplate(event, destination, date, shift);
			return;
		}
		let selectedDate = importedJSON.filter(x => x._id === date.format("YYYY-MM-DD"))[0];
		if(selectedDate == null){
			let templateCopy = JSON.parse(JSON.stringify(this.state.template[date.day()]));
			templateCopy._id = date.format("YYYY-MM-DD");
			importedJSON.push(templateCopy);
			selectedDate = importedJSON.filter(x => x._id === date.format("YYYY-MM-DD"))[0];
		}
		let personId1 = event.props.personId;
		let personId2 = destination.columnProps.pnum;
		// remove original event:
		if(personId1 == -1){ //if moving from sidebar
			let index = _.findIndex(selectedDate.sidebar, {id: event.props.id} );
			selectedDate.sidebar.splice(index, 1);
		}
		else {
			let index = _.findIndex(selectedDate[shift][personId1].events, {id: event.props.id} );
			selectedDate[shift][personId1].events.splice(index, 1);
		}

		// copy of original event
		let eventCopy = _.pick(event.props, ['id', 'color', 'start', 'end', 'content']);

		// change time for old event
		let duration = eventCopy.end - eventCopy.start;
		eventCopy.start = destination.time;
		eventCopy.end = destination.time + duration;

		// add copy to JSON
		if(personId2 == -1){
			selectedDate.sidebar.push(eventCopy);
		}
		else{
			selectedDate[shift][personId2].events.push(eventCopy);
		}
		this.setState(updatePersonList);
	}

	moveEventTemplate(event, destination, date, shift){
		let selectedDay = this.state.template[date.day()];
		let personId1 = event.props.personId;
		let personId2 = destination.columnProps.pnum;
		// remove original event:
		if(personId1 == -1){ //if moving from sidebar
			selectedDay.sidebar.splice(event.props.id, 1);
		}
		else {
			let index = _.findIndex(selectedDay[shift][personId1].events, {id: event.props.id} );
			selectedDay[shift][personId1].events.splice(index, 1);
		}

		// copy of original event
		let eventCopy = _.pick(event.props, ['id', 'color', 'start', 'end', 'content']);

		// change time for old event
		let duration = eventCopy.end - eventCopy.start;
		eventCopy.start = destination.time;
		eventCopy.end = destination.time + duration;

		// add copy
		if(personId2 == -1){
			selectedDay.sidebar.push(eventCopy);
		}
		else{
			selectedDay[shift][personId2].events.push(eventCopy);
		}

		this.setState(updatePersonList);
	}

	incrementStride(inc){
		let newStride = inc + this.state.stride;
		if((newStride <= 0) || (newStride > 30)) return;
		this.setState({stride: newStride});
	}

	onUpdate(state){
 		this.setState(state);
		this.setState(updatePersonList);
	}

	updateContent(text, eId, pId){
		if(this.state.redigerMal){
			this.updateContentTemplate(text, eId, pId);
			return;
		}
		let selectedDate = importedJSON.filter(x => x._id === this.state.startDate.format("YYYY-MM-DD"))[0];
		if(selectedDate == null){
			let templateCopy = JSON.parse(JSON.stringify(this.state.template[this.state.startDate.day()]));
			templateCopy._id = this.state.startDate.format("YYYY-MM-DD");
			importedJSON.push(templateCopy);
			selectedDate = importedJSON.filter(x => x._id === this.state.startDate.format("YYYY-MM-DD"))[0];
		}
		if(pId == -1){ //if editing in sidebar
			selectedDate.sidebar.find(x => x.id === eId).content = text;
		}
		else {
			//selectedDate[this.state.shift][pId].events[eId].content = text;
			selectedDate[this.state.shift][pId].events.find(x => x.id === eId).content = text;
		}
		this.setState(updatePersonList);
	}

	updateContentTemplate(text, eId, pId){
		let selectedDay = this.state.template[this.state.startDate.day()];

		if(pId == -1){ //if editing in sidebar
			selectedDay.sidebar.find(x => x.id === eId).content = text;
		}
		else {
			selectedDay[this.state.shift][pId].events.find(x => x.id === eId).content = text;
		}
		this.setState(updatePersonList);
	}

	updateColumnName(text, pId){
		let selectedDate = importedJSON.filter(x => x._id === this.state.startDate.format("YYYY-MM-DD"))[0];
		if(selectedDate == null){
			let templateCopy = JSON.parse(JSON.stringify(this.state.template[this.state.startDate.day()]));
			templateCopy._id = this.state.startDate.format("YYYY-MM-DD");
			importedJSON.push(templateCopy);
			selectedDate = importedJSON.filter(x => x._id === this.state.startDate.format("YYYY-MM-DD"))[0];
		}
		selectedDate[this.state.shift][pId].id = text;
		this.setState(updatePersonList);
	}

	setColumnAV(av, pId){
		let selectedDate = importedJSON.filter(x => x._id === this.state.startDate.format("YYYY-MM-DD"))[0];
		if(selectedDate == null){
			let templateCopy = JSON.parse(JSON.stringify(this.state.template[this.state.startDate.day()]));
			templateCopy._id = this.state.startDate.format("YYYY-MM-DD");
			importedJSON.push(templateCopy);
			selectedDate = importedJSON.filter(x => x._id === this.state.startDate.format("YYYY-MM-DD"))[0];
		}
		selectedDate[this.state.shift][pId].av = av;
		this.setState(updatePersonList);
	}

	addEvent(start, end, text, pId){
		let selectedDate;
		if(this.state.redigerMal) {
			selectedDate = this.state.template[this.state.startDate.day()];
		}
		else{
			selectedDate = this.getSelectedDate();
		}
		let uid = (new Date).getTime();
		selectedDate[this.state.shift][pId].events.push({
					id: uid,
					color: "yellow",
					start: start,
					end: end,
					content: text
				});
		this.setState(updatePersonList);
	}

	changeEventDuration(min, eId, pId){
		let selectedDate;
		if(this.state.redigerMal) {
			selectedDate = this.state.template[this.state.startDate.day()];
		}
		else{
			selectedDate = this.getSelectedDate();
		}

		let event1 = selectedDate[this.state.shift][pId].events.find(x => x.id === eId)
		let newEnd = event1.end + min;
		let conflict = false;

		if(newEnd > event1.start){
			selectedDate[this.state.shift][pId].events.map((event2, pId2) => {
				if(pId != pId2 && 
					scheduleConflict(event1, event2) && 
					min > 0)
				{
					conflict = true;
				}
			});
			if(!conflict){
				event1.end = newEnd;
			}
		}
		this.setState(updatePersonList);
	}

	removeEvent(eId, pId){
		let selectedDate;
		if(this.state.redigerMal) {
			selectedDate = this.state.template[this.state.startDate.day()];
		}
		else{
			selectedDate = this.getSelectedDate();
		}
		let eIndex =  selectedDate[this.state.shift][pId].events.findIndex(x => x.id === eId)
		selectedDate[this.state.shift][pId].events.splice(eIndex, 1);
		this.setState(updatePersonList);
	}

	updateColor(color, eId, pId){
		let selectedDate;
		if(this.state.redigerMal) {
			selectedDate = this.state.template[this.state.startDate.day()];
		}
		else{
			selectedDate = this.getSelectedDate();
		}
		selectedDate[this.state.shift][pId].events.find(x => x.id === eId).color = color;
		this.setState(updatePersonList);
	}

	getSelectedDate(){
		let selectedDate = importedJSON.filter(x => x._id === this.state.startDate.format("YYYY-MM-DD"))[0];
		if(selectedDate == null){
			let templateCopy = JSON.parse(JSON.stringify(this.state.template[this.state.startDate.day()]));
			templateCopy._id = this.state.startDate.format("YYYY-MM-DD");
			importedJSON.push(templateCopy);
			selectedDate = importedJSON.filter(x => x._id === this.state.startDate.format("YYYY-MM-DD"))[0];
		}
		return selectedDate;
	}

	addPerson(){
		let selectedDate;
		if(this.state.redigerMal) {
			selectedDate = this.state.template[this.state.startDate.day()];
		}
		else{
			selectedDate = this.getSelectedDate();
		}
		selectedDate[this.state.shift].push({
			id: selectedDate[this.state.shift].length,
			events: [],
			av: false
		})
		this.setState(updatePersonList);
		window.scrollTo(window.scrollMaxX, window.scrollY);
	}

	removePerson(pnum){
		let selectedDate;
		if(this.state.redigerMal) {
			selectedDate = this.state.template[this.state.startDate.day()];
		}
		else{
			selectedDate = this.getSelectedDate();
		}
		selectedDate[this.state.shift].splice(pnum, 1);
		this.setState(updatePersonList);
	}

	openBook(file) {
		let fileReader = new FileReader();
		let that = this;
		fileReader.readAsText(file);
		fileReader.onload = function(event) {
			let parsedResult = JSON.parse(event.target.result);
			if(file.name.split(".")[1] == "mal"){
				that.setState((state, props) => {
					return {
						isLoading: false,
						template: parsedResult,
						persons: parsedResult[state.startDate.day()][state.shift]
					}
				});
			}
    		else importedJSON = parsedResult;
    		that.setState(updatePersonList);
 		};
	}

	redigerMalToggle(){
		if(this.state.redigerMal || prompt("Passord:") == pwd_placeholder){
			let truth = (this.state.redigerMal ? false:true);
			this.setState({redigerMal: truth});
		}
		this.setState(updatePersonList);
	}

/*
	specialAccessToggle(){
		if(this.state.specialAccess || prompt("Passord:") == pwd_placeholder){
			let truth = (this.state.specialAccess ? false:true);
			this.setState({specialAccess: truth});
		}
		this.setState(updatePersonList);
	}
	*/

 	render() {
 		//document.body.style.backgroundImage = getGradientByDate(this.state.startDate);
  		let nav = 
 			<NavBar 
  				redigerMal={this.state.redigerMal} 
  				redigerMalToggle={this.redigerMalToggle.bind(this)}
  	//			specialAccess={this.state.specialAccess}
  	//			specialAccessToggle={this.specialAccessToggle.bind(this)}
  				templateString={JSON.stringify(this.state.template)}
  				JSONString={JSON.stringify(importedJSON)} 
  				open={this.openBook.bind(this)} 
  				onUpdate={this.onUpdate.bind(this)} 
  				date={this.state.startDate} 
  				incrementDate={this.incrementDate.bind(this)} 
  				incrementStride={this.incrementStride.bind(this)} 
  				state={this.state}
  			/>

		let overlay = 
			<div className="overlay">
  				<div className="loader" />
  				<span />
  			</div>

  		if(this.state.isLoading){
			return (
				<div className="overflow-scroll">
		  			{nav}
				  	<div className="container-main scroll-x">

		  			</div>
					{overlay}
	      		</div> 
	  		)
	  	}

	  	else {
			return (
				<div className="overflow-scroll">
		  			{nav}
				  	<div className="container-main scroll-x">
						<ShiftSchedule 
							changeDuration={this.changeEventDuration.bind(this)}//
							updateColumnName={this.updateColumnName.bind(this)} //
							updateContent={this.updateContent.bind(this)} //\\\///
							removeColumn={this.removePerson.bind(this)}///////////
							updateColor={this.updateColor.bind(this)} ////\\\\////
							moveEvent={this.moveEvent.bind(this)} /////////\\/////
							onUpdate={this.onUpdate.bind(this)} ////////////\\\\\\
							persons={this.state.persons} /////////////*//*///\\\\\
							stride={this.state.stride} /////*/////////////////\\\\
							shift={this.state.shift} //////////////*///*///////\\\
							date={this.state.startDate} /////////////*//////////\\
							eventList={this.state.sidebar} //////////////////////\
							newEvent={this.addEvent.bind(this)} //////////////////
							addPerson={this.addPerson.bind(this)} /////////*//////
							removeEvent={this.removeEvent.bind(this)}/////////////
							setColumnAV={this.setColumnAV.bind(this)}/////////////
					//		specialAccess={this.state.specialAccess}//////////////
						/>
		  			</div>
	      		</div> 
	  		)
	  	}
  	}
}
export default App;

ReactDom.render(<App />, document.querySelector('.app'))

/*
    ____               __     ___            
   / __/___  _________/ /__  / (_)___  ____ _
  / /_/ __ \/ ___/ __  / _ \/ / / __ \/ __ `/
 / __/ /_/ / /  / /_/ /  __/ / / / / / /_/ / 
/_/  \____/_/   \__,_/\___/_/_/_/ /_/\__, /  
                                    /____/   
Copyright Are Johansen Ormberg 2018
*/