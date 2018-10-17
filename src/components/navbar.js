import React, {Component} from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

class NavBar extends Component {

	handleChange(date){
		this.update({
			startDate: date
		});
	}
	
	incrementDate(days){
		let newDate = this.props.state.startDate.add(days, 'days');
		this.update({
			startDate: newDate
		});
	}

	isActive(value){
    	return ((value===this.props.state.shift) ?'shift-selected':'');
 	}

 	setShift(s){
 		this.update({
 			shift: s
 		});
 	}

 	update(state){
 		this.props.onUpdate(state);
 	}

	render() {
		return (
		  	<nav className="navbar navbar-inverse navbar-fixed-top">
		 		<div className="container">
		 			<div className="navbar-container">
		 				<div onClick={() => this.props.specialAccessToggle()} className={this.props.specialAccess ? "navbar-brand golden":"navbar-brand"}>
		 					FORDELING
						</div>
		 				<ul className="nav navbar-nav">
		  					<li>
		  						<a onClick={() => document.getElementById("openFile").click()}>Åpne</a>
								<input type="file" accept=".json, .mal" id="openFile" ref="openFile" onChange={() => this.props.open(this.refs.openFile.files[0])}/>
							</li>
		  					<li>
		  						<a ref="saveFile" download={this.props.redigerMal ? "mal.mal" : "fordeling.json"} href={"data:text/plain;charset=utf-8," + (this.props.redigerMal ? encodeURIComponent(this.props.templateString) : encodeURIComponent(this.props.JSONString))}>Lagre</a>
		  					</li>
		  					<li>
		  						<a onClick={() => this.props.redigerMalToggle()} className={this.props.redigerMal ? "option-selected":""}>Rediger mal</a>
		  					</li>
		  				</ul>
		  				<ul className="nav navbar-nav navbar-right">
		  					<li>
		  						<div className="weekday">{this.props.date.format("dddd")}</div>
		  					</li>
			  				<li>
		  						<a className="glyphicon glyphicon-chevron-left" onClick={() => this.incrementDate(-1)}></a>
		  					</li>
		  					<li>
		  						<DatePicker dateFormat="DD/MM/YYYY" selected={this.props.date} onChange={this.handleChange.bind(this)} todayButton="I dag" locale="nb-no" showWeekNumbers className="date-field" />
		  					</li>
		  					<li>
		  						<a className="glyphicon glyphicon-chevron-right" onClick={() => this.incrementDate(1)}></a>
		  					</li>
		  					<li>
			  					<a className={this.isActive('d')} onClick={() => this.setShift('d')}>Dag</a>
			  				</li>
			  				<li>
			  					<a className={this.isActive('a')} onClick={() => this.setShift('a')}>Kveld</a>
			  				</li>
			  				<li>
			  					<a className={this.isActive('n')} onClick={() => this.setShift('n')}>Natt</a>
			  				</li>
							{
							/*<li>
			 					<a className="small-icon glyphicon glyphicon-minus" onClick={() => this.props.incrementStride(5)}></a>
			  				</li>
							<li>
			 					<a className="small-icon glyphicon glyphicon-plus" onClick={() => this.props.incrementStride(-5)}></a>
			  				</li>*/
			  				}
		  				</ul>
		  			</div>
		 		</div>
	  		</nav>
	  	)
	}
}
export default NavBar;