import React, {Component} from 'react';
import PersonColumn from './person-column';
import TimeColumn from './time-column';
import EventBox from './event-box';
import HTML5Backend from 'react-dnd-html5-backend';
import {DragDropContext} from 'react-dnd';
import EventList from './event-list';
import * as ShiftTimes from './shift-times';

let shiftStart = 450;
let shiftEnd = 855;

class ShiftSchedule extends Component {
	constructor(props){
		super(props);
		this.state = {
			stride: this.props.stride,
			selectionActive: false,
			selectionStartTime: null,
			highlightTime: 0
		}
	}
	onUpdate(state){
		this.props.onUpdate(state);
	}

	moveEvent(element, destination){
		this.props.moveEvent(element, destination, this.props.date, this.props.shift);
	}

	updateContent(text, eId, pId){
		this.props.updateContent(text, eId, pId);
	}

	updateColumnName(text, pId){
		this.props.updateColumnName(text, pId);
	}

	setAV(av, pId){
		this.props.setColumnAV(av, pId);
	}

	newEvent(start, end, text, pId){
		if(this.state.selectionActive){
			this.setState({selectionActive: false});
			if(this.state.selectionStartTime <= end) this.props.newEvent(this.state.selectionStartTime, end + this.props.stride, text, pId);
		}
	}

	selectionStart(startTime){
		this.setState(function (state, props){
			return {selectionActive: true, selectionStartTime: startTime}
			}
		);
	}

	unsetStartTime(){
		this.setState({selectionActive: false});
	}

	removeColumn(num){
		if(confirm("Vil du fjerne denne kolonnen?")){
			this.props.removeColumn(num);
		}
	}

	removeEvent(eId, pId){
		this.props.removeEvent(eId, pId);
	}

	highlightTime(time){
		this.setState({highlightTime: time});
	}
	changeDuration(min, eId, pId){
		this.props.changeDuration(min, eId, pId);
	}

	render(){
		if(this.props.shift == 'd'){
			shiftStart = ShiftTimes.START_D;
			shiftEnd = ShiftTimes.END_D;
		}
		else if(this.props.shift == 'a'){
			shiftStart = ShiftTimes.START_A;
			shiftEnd = ShiftTimes.END_A;
		}
		else if(this.props.shift == 'n'){
			shiftStart = ShiftTimes.START_N;
			shiftEnd = ShiftTimes.END_N;
		}
		let eventListEvents = this.props.eventList.map((event, eIndex) => {
			return <EventBox				
					removeEvent={this.removeEvent.bind(this)} 
					updateColor={this.props.updateColor} 
					updateContent={this.updateContent.bind(this)} 
					moveEvent={this.moveEvent.bind(this)} 
					onUpdate={this.onUpdate.bind(this)} 
					changeDuration={this.changeDuration.bind(this)}
					key={event.id} 
					id={event.id} 
					color={event.color} 
					start={event.start} 
					end={event.end} 
					content={event.content} 
					shiftStart={shiftStart} 
					date={this.props.date} 
					personId="-1" //for sidebar/eventlist
					stride={this.props.stride}>
				</EventBox>;
		});
		let personColumns = this.props.persons.map((person, pIndex) => {
			let selectedEvents = person.events.map((event, eIndex) => {
				return <EventBox
					removeEvent={this.removeEvent.bind(this)} 
					updateColor={this.props.updateColor} 
					updateContent={this.updateContent.bind(this)} 
					moveEvent={this.moveEvent.bind(this)} 
					onUpdate={this.onUpdate.bind(this)} 
					changeDuration={this.changeDuration.bind(this)}
					key={event.id} 
					id={event.id} 
					color={event.color} 
					start={event.start} 
					end={event.end} 
					content={event.content} 
					shiftStart={shiftStart} 
					date={this.props.date} 
					personId={pIndex}
					stride={this.props.stride}>
				</EventBox>;
			});
			if(person.av == undefined){
				person.av = false;
			}
			return <PersonColumn 
				removeColumn={this.removeColumn.bind(this)} 
				unsetStartTime={this.unsetStartTime.bind(this)} 
				selectionStart={this.selectionStart.bind(this)} 
				newEvent={this.newEvent.bind(this)} 
				updateColumnName={this.updateColumnName.bind(this)} 
				highlightTime={this.highlightTime.bind(this)}
				setAV={this.setAV.bind(this)}
				key={pIndex} 
				pnum={pIndex} 
				pname={person.id} 
				av={person.av}
				events={selectedEvents} 
				shiftStart={shiftStart} 
				shiftEnd={shiftEnd} 
				stride={this.props.stride}
				specialAccess={this.props.specialAccess} />;

		});
		return(
			<div>
				<TimeColumn highlight={this.state.highlightTime} shiftStart={shiftStart} shiftEnd={shiftEnd} stride={this.props.stride} onUpdate={this.onUpdate.bind(this)}/>
				<div className="container-columns" id="container-columns">
					{personColumns}
					<div className="add-column" onClick={() => this.props.addPerson()}><span className="glyphicon glyphicon-plus-sign"></span></div>
					<EventList events={eventListEvents} />
				</div>
			</div>
		)
	} 
}

export default DragDropContext(HTML5Backend)(ShiftSchedule);