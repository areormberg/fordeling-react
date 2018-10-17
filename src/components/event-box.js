import React, {Component} from 'react';
import { DragSource } from 'react-dnd';
import ItemTypes from './item-types';
import InlineEdit from 'react-edit-inline';
import EventMenu from './event-menu';
import {minsToTime} from './time-functions';

const eventSource = {
  beginDrag(props) {
    return {props};
  }
};

function hexToHSL(hex) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  let r = parseInt(result[1], 16);
  let g = parseInt(result[2], 16);
  let b = parseInt(result[3], 16);
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if(max == min){
      h = s = 0; // achromatic
    }else{
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch(max){
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
  var HSL = new Object();
  HSL['h']=h;
  HSL['s']=s;
  HSL['l']=l;
  return HSL;
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

class EventBox extends Component {

	constructor(props){
		super(props);
		this.updateContent = this.updateContent.bind(this);
		this.hide = this.hide.bind(this);
		this.show = this.show.bind(this);
		this.state = {
			color: props.color,
			hidden: false,
			showMenu: false,
			menuX: 0,
			menuY: 0,
			start: props.start,
			end: props.end
		}
	}

	hide(){
		console.log("hide");
		this.setState({hidden: true});
	}

	show(){
		this.setState({hidden: false});
	}

	updateContent(text){
		this.props.updateContent(text.message.replace('/\s/g', '\xa0'), this.props.id, this.props.personId);
	}

	update(state){
		this.props.onUpdate(state);
	}

	customValidateText(text) {
    	return (text.length > 0);
    }

    handleDoubleClick(e){
		this.setState({menuX: e.clientX, menuY: e.clientY, showMenu: true});
    }

    updateColor(color){
    	this.setState({color: color, showMenu: false});
    	this.props.updateColor(color, this.props.id, this.props.personId);
    }

    removeEvent(){
    	this.setState({showMenu: false});
		this.props.removeEvent(this.props.id, this.props.personId);
    }

    unsetMenu(){
		this.setState({showMenu: false});
    }

  	makeInvisible(){
   		this.setState({className: "invisible"});
  	}

	render(){
		const { connectDragSource, isDragging } = this.props;

		let textColor = "black";
		if(this.state.color.charAt(0) == "#"){
			let colorHSL = hexToHSL(this.state.color);
			if (colorHSL.l < 0.5 || colorHSL.s == 1){
				textColor = "white";
			}
		}

		let style = {
			marginTop: ((this.props.start % this.props.stride) / this.props.stride) * 20 + 'px',
			height: ((this.props.end - this.props.start) / this.props.stride) * 100 + '%',
			background: this.state.color,
			color: textColor
		}

		if (this.state.hidden){
			style.visibility = "hidden";
		}

		let menu = null;

		if(this.state.showMenu){
			menu = <EventMenu 
				unsetMenu={this.unsetMenu.bind(this)} 
				removeEvent={this.removeEvent.bind(this)} 
				updateColor={this.updateColor.bind(this)} 
				changeDuration={(mins) => this.props.changeDuration(mins, this.props.id, this.props.personId)}
				pageX={this.state.menuX} 
				pageY={this.state.menuY} 
				start={this.state.start}
				end={this.state.end}
			/>;
		} 
		return connectDragSource(
		<div 
			className="event-box" 
			style={style}
			onDoubleClick={this.handleDoubleClick.bind(this)}
		>
		{menu}
			<div className="timestamp">{minsToTime(this.props.start) + " - " + minsToTime(this.props.end)}</div>
			 <InlineEdit
              validate={this.customValidateText}
              activeClassName="editing"
              text={this.props.content}
              editingElement="textarea"
              paramName="message"
              change={this.updateContent}
            />
			</div>
		)
	}

}

export default DragSource('event', eventSource, collect)(EventBox);