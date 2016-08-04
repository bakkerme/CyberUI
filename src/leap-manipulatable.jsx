import React from 'react';
import ReactDOM from 'react-dom';

export default class LeapManipulatable extends React.Component {
	static propTypes = {
		manipId: React.PropTypes.string,
		gripRect: React.PropTypes.object, 
		cursorHasGripped: React.PropTypes.func,
		homePos: React.PropTypes.object.isRequired,
		cursorPos: React.PropTypes.object,
		manipKey: React.PropTypes.number,
		isGripped: React.PropTypes.bool,
		display: React.PropTypes.bool
	};

	constructor(props) {
		super(props);

		this.state = {
			beingDragged: false,
			atCurrentHome: true
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
	    if((nextProps.gripRect && nextProps.gripRect !== this.props.gripRect) ||
	    	this.props.isGripped ||
	    	this.props.display) {
	    	return true;
	    }

	    return false;
	}

	componentWillReceiveProps(nextProps) {
		//GripRect has updated, check for collision
		// console.log(nextProps.gripRect && nextProps.gripRect !== this.props.gripRect);
		if(nextProps.gripRect && nextProps.gripRect !== this.props.gripRect) {
			if(this.props.cursorHasGripped) {
				let bounds = this.getBoundingRect();

				if(this.intersectRect(nextProps.gripRect, bounds)) {
					//Colision has occured
					//Hit callback
					this.props.cursorHasGripped(this.props.manipKey);
					this.setState({beingDragged: true});

					console.log('intersection found');
				} else {
					this.turnOffDrag();
				}
			} else {
			this.turnOffDrag();
			}
		} else {
			this.turnOffDrag();
		}
	}

	turnOffDrag() {
		let state = {};
		//Check currentHome now
		let currentHome = this.atCurrentHome();
		if(this.state.atCurrentHome != currentHome) {
			state.atCurrentHome = currentHome;
		}

		//Either there is no collision or no griprect
		state.beingDragged = false;

		this.setState(state);
	}

	intersectRect(r1, r2) {
		return !(r2.left > r1.right || 
				r2.right < r1.left || 
				r2.top > r1.bottom ||
				r2.bottom < r1.top);
	}

	getBoundingRect() {
		if(!this.refs.manip) {
			return null
		}
		return this.refs.manip.getBoundingClientRect()	
	}

	atCurrentHome() {
		let rect = this.getBoundingRect();
		if(!rect) {
			return true;
		}
		if(rect.left != this.props.homePos.left &&
			rect.top != this.props.homePos.top ) {
			return false;
		}

		return true;
	}

	render() {
		let [gripRect, cursorHasGripped, manipId, style, ...other] = this.props;
		let styles = {}

		if(this.props.style) {
			styles = this.props.style;
		} 

		if(!this.props.isGripped && this.props.display) {
			styles.transform = `translate(${this.props.homePos.left}px, ${this.props.homePos.top}px)`;
			styles.transition = "transform 1s ease-out";
		} else {
			styles.transform = `translate(${this.props.cursorPos.x- styles.width / 2}px, ${this.props.cursorPos.y - styles.height / 2}px)`;
		}

		let classes = ['manipulatable'];

		if(!this.props.display) {
			console.log('display');
			classes.push('fadeOut');
		}

		return (
			<div ref='manip' className={classes.join(' ')} style={styles} {...other}>{this.props.children}</div>
		);
	}
}
