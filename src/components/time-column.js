import React, {Component} from 'react';
import {minsToTime} from './time-functions';

class TimeColumn extends Component {
	constructor(props){
		super(props);
		this.state={
			style: {}
		}
	}
	shouldComponentUpdate(nextProps, nextState){
		if(nextProps != this.props) return true;
		else if(nextState.style.top == this.state.style.top) return false;
		else return true;
	}

	render(){
		const that = this;
		let prevScroll = window.scrollY;
		document.addEventListener('scroll', function(e){
			that.setState({
				style: {top: (-window.scrollY+60)+"px"}
			});
		});
		let rowArray = [];
		for(let i = this.props.shiftStart; i <= this.props.shiftEnd; i += this.props.stride){
			let tdClass = "";
			if(i == this.props.highlight){
				tdClass = "highlight"
			}
			rowArray.push(<tr key={i}><td className={tdClass}>{minsToTime(i)}</td></tr>);
		}
		return( 
			<table className="time-column" style={this.state.style} key="time-column">
				<tbody>
					<tr><th>
						{'\u00A0'}
					</th></tr>
					{rowArray}
				</tbody>
			</table>
		);
	}
}

export default TimeColumn;