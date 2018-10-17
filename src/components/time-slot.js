import React, {Component} from 'react';
import EventBox from './event-box';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import { findDOMNode } from 'react-dom';

/**
 * Specifies the drop target contract.
 * All methods are optional.
 */
const timeSlotTarget = {
  canDrop(props, monitor) {
    const item = monitor.getItem();
    let sameItem = false;
    if(props.children != null && item.props == props.children.props) sameItem = true;
    return (props.children == null || sameItem);
  },

  hover(props, monitor, component) {
    // This is fired very often and lets you perform side effects
    // in response to the hover. You can't handle enter and leave
    // here—if you need them, put monitor.isOver() into collect() so you
    // can just use componentWillReceiveProps() to handle enter/leave.
    const item = monitor.getItem();

    // You can access the coordinates if you need them
    const clientOffset = monitor.getClientOffset();
    const componentRect = findDOMNode(component).getBoundingClientRect();

    // You can check whether we're over a nested drop target
    const isJustOverThisOne = monitor.isOver({ shallow: true });

    // You will receive hover() even for items for which canDrop() is false
    const canDrop = monitor.canDrop();
  },

  drop(props, monitor, component) {
//  	console.log(monitor.getItem());
 // 	console.log(props);
    if (monitor.didDrop()) {
      // If you want, you can check whether some nested
      // target already handled drop
      return;
    }

    // Obtain the dragged item
    const item = monitor.getItem();

  	item.props.moveEvent(item, props);


    // You can do something with it
    // ChessActions.movePiece(item.fromPosition, props.position);

    // You can also do nothing and return a drop result,
    // which will be available as monitor.getDropResult()
    // in the drag source's endDrag() method
    return { moved: true };
  }
};

/**
 * Specifies which props to inject into your component.
 */
function collect(connect, monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDropTarget: connect.dropTarget(),
    // You can ask the monitor about the current drag state:
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType()
  };
}

class TimeSlot extends Component{

  constructor(props){
    super(props);
    this.state = {
      className: ""
    }
  }

	componentWillReceiveProps(nextProps) {
	    if (!this.props.isOver && nextProps.isOver) {
        // enter
	    }

	    if (this.props.isOver && !nextProps.isOver) {
	      // You can use this as leave handler
	    }

	    if (this.props.isOverCurrent && !nextProps.isOverCurrent) {
	      // You can be more specific and track enter/leave
	      // shallowly, not including nested targets
	    }
	}

  handleMouseDown(e){
    if(e.ctrlKey){
      e.preventDefault();
      this.props.selectionStart(this.props.time);
    }
  }

  handleMouseUp(e){
  //  console.log(e.target);
    this.newEvent("Ny hendelse");
    this.setState({className: ""})
  }

  handleMouseOver(e){
   // this.props.highlightTime(this.props.time); //Too expensive, re-renders all columns
    if(e.ctrlKey){
      e.preventDefault();
    }
  }

  newEvent(text){
    if (this.props.children != null){
      this.props.unsetStartTime();
      return;
    }
    let start = this.props.time;
    let end = this.props.time;
    this.props.newEvent(start, end, text);
    this.props.unsetStartTime();
  }

	render(){
		const { canDrop, isOver, connectDropTarget } = this.props;
		const isActive = canDrop && isOver;
		let className;
		if(isOver && canDrop) className =" fieldHover";
		return connectDropTarget(
			<td onMouseOver={this.handleMouseOver.bind(this)} onMouseDown={this.handleMouseDown.bind(this)} onMouseUp={this.handleMouseUp.bind(this)} className={this.state.className + className}>{this.props.children}{'\u00A0'}
    		</td>
		);
	}
}

export default DropTarget('event', timeSlotTarget, collect)(TimeSlot)