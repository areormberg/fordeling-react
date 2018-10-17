import React, {Component} from 'react';
import EventBox from './event-box';
import { DropTarget} from 'react-dnd';
import TimeSlot from './time-slot';
import InlineEdit from 'react-edit-inline';

function nearestTimeSlot(elementTime, shiftStart, stride){
	return (Math.floor(elementTime - shiftStart) / stride);
}

const PersonColumn = (props) => {
	function selectTarget(data){
		props.selectTarget(data)
	}
	let rowArray = [];

	function newEvent(start, end, text){
		props.newEvent(start, end, text, props.pnum);
	}

	function highlightTime(time){
		props.highlightTime(time);
	}

	for(let i = props.shiftStart; i <= props.shiftEnd; i += props.stride) {
		let content;
		props.events.map((event) => {
			if(event){
				if(event && event.props.start >= i && event.props.start < i + props.stride){
					content = event;
				}
			}
		});
		
		rowArray.push(
			<tr key={i} time={i}>
				<TimeSlot 
					key={i} 
					time={i} 
					columnProps={props} 
					unsetStartTime={props.unsetStartTime} 
					selectionStart={props.selectionStart} 
					newEvent={newEvent}
					highlightTime={highlightTime}
				>
					{content}
				</TimeSlot>
			</tr>);
		
	}

	let personIcon = "glyphicon-pawn";
	if(props.av){
		personIcon = "glyphicon-queen";
	}

	let title = <span>{"" + props.pname}</span>

	
	title = 	<InlineEdit
          			validate={customValidateText}
          			activeClassName="editing"
          			text={"" + props.pname}
          			paramName="message"
          			change={updateColumnName}
        		/>

	function customValidateText(text) {
      return (text.length > 0);
    }

    function toggleAV(){
    	props.setAV((props.av ? false : true), props.pnum);
    }

    function updateColumnName(text){
		props.updateColumnName(text.message, props.pnum);
	}

	return <table className="person-column" key={props.pnum}>
		<tbody>
			<tr><th>
				<span className={"left-span glyphicon " + personIcon} onClick={() => toggleAV()}>
				</span>
				<span className="left-span">
					{title}
            	</span>
            	<span className="glyphicon glyphicon-remove-sign" onClick={() => props.removeColumn(props.pnum)}/>
			</th></tr>
			{rowArray}
		</tbody>
	</table>
}

export default PersonColumn;