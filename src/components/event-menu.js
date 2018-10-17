import React, {Component} from 'react';

class EventMenu extends Component{
	constructor(props){
		super(props);
		const colorItems = [
				"#ccbf7a",
				"#d2e0f7",
				"#7fb0ff",
				"#2c68c9",
				"#ff3030",
				"#a3ff89",
				"#c851ff",
				"#ff6d19",
				"#ff35d6",
				"#4ae03c",
				"#ffbcff",
				"#fcd69c",
				"#abdd66",
				"#f9f218",
				"#ff5735",
				"#cccccc",
				"#fffa75",
				"#4f4f4f",
				"#630a18",
				"#ffffff"
			];
		this.state = {
			style: {
				left: this.props.pageX,
				top: this.props.pageY
			},
			colorItems: colorItems
		}
	}
	componentDidMount() {
		// consider whether the menu leaves the page
    	const menuHeight = this.menuRef.clientHeight;
    	const menuWidth = this.menuRef.clientWidth;
    	let top = this.props.pageY;
    	let left = this.props.pageX;
    	let windowHeight = window.innerHeight;
    	let windowWidth = window.innerWidth;

    	if(windowWidth < this.props.pageX+menuWidth+50){
			left -= menuWidth;
		}
		let edgeDistanceBottom = windowHeight - (this.props.pageY+menuHeight);
    	if(edgeDistanceBottom < 0){
    		top += edgeDistanceBottom;
    	}
    	this.setState({ style: {top, left} });
  	}

	render(){
		let colorItems = this.state.colorItems.map((color) => {
			return <li className="selectable" onClick={()=> this.props.updateColor(color)} style={{background: color, color: color}} key={color}>{color}</li>;
		});
		return (
			<div 
			className="event-menu" 
			style={this.state.style} 
			ref={ (menuRef) => this.menuRef = menuRef}
			>
				<div className="menu-top"><a onClick={() => this.props.unsetMenu()} className="small-icon glyphicon glyphicon-remove pull-right selectable"></a></div>
				<ul>
					<li className="menu-item">
						Varighet:
						<a onClick={() => this.props.changeDuration(-5)} className="small-icon glyphicon glyphicon-minus"></a>
						<a onClick={() => this.props.changeDuration(5)} className="small-icon glyphicon glyphicon-plus"></a>
					</li>
					<li className="menu-item" onClick={() => this.props.removeEvent()}>Slett</li>
					<li className="menu-header">Farge:</li>
					{colorItems}
				</ul>
			</div>
		);

	}
}

export default EventMenu