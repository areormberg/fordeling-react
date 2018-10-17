import React, {Component} from 'react';
import EventBox from './event-box';
//import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import { findDOMNode } from 'react-dom';

const eventListTarget = {
  canDrop(props, monitor) {
    return true;
  },

  hover(props, monitor, component) {
    // This is fired very often and lets you perform side effects
    // in response to the hover. You can't handle enter and leave
    // here—if you need them, put monitor.isOver() into collect() so you
    // can just use componentWillReceiveProps() to handle enter/leave.
    const item = monitor.getItem();
   // console.log(item);

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
    const itemTime = item.props.start;
    const listProps = {
      columnProps : {
        pnum : -1 // -1 is the pnum of the event list.
      },
      time: itemTime
    }
    item.props.moveEvent(item, listProps)


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

class EventList extends Component {
  constructor(props){
    super(props);
    this.state = {
      show: false
    }
  }

  toggleShow() {  
    if(this.state.show) this.setState({show:false});
    else this.setState({show:true});
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

  render(){
    let glyphicon;
    let show;
    if (this.state.show){
      glyphicon = "glyphicon-triangle-right";
      show = "open";
    }
    else {
      glyphicon = "glyphicon-triangle-left";
      show = "closed";
    }

    const { canDrop, isOver, connectDropTarget } = this.props;
    const isActive = canDrop && isOver;
    return connectDropTarget(
      <div className={"event-list " + show}>
        <div className={"show-hide-sidebar"} onClick={() => this.toggleShow()}>
          <a className={"show-hide-sidebar glyphicon " + glyphicon}></a>
        </div>
        <div className="event-list-content">
        <h2>Ikke fordelte oppgaver:</h2>
          {this.props.events}
        </div>
      </div>
    );
  }
}

export default DropTarget('event', eventListTarget, collect)(EventList)