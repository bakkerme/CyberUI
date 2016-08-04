import React from 'react';
import ReactDOM from 'react-dom';

export default class LeapTarget extends React.Component {
	static propTypes = {
		dropCoords: React.PropTypes.object,
		onDrop: React.PropTypes.func,
		showDropState: React.PropTypes.bool
	};

	shouldComponentUpdate(nextProps, nextState) {
	    if(nextProps.dropCoords === this.props.dropCoords)  {
	    	return false;	
	    }

	    return true;
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.dropCoords && nextProps.dropCoords !== this.props.dropCoords) {
			let boundingRect = this.getBoundingRect();
			if(nextProps.dropCoords.x < boundingRect.right &&
			   nextProps.dropCoords.x > boundingRect.left &&
			   nextProps.dropCoords.y < boundingRect.bottom &&
			   nextProps.dropCoords.y > boundingRect.top) {

			   	this.props.onDrop();
			}

		}
	}

	getBoundingRect() {
		if(!this.refs.target) {
			return null
		}
		return this.refs.target.getBoundingClientRect()	
	}

	render() {
		let style = {
			width: 150, 
			height: 200,
			bottom: 32,
			left: 85,
			transform: "rotate(-90deg)"
		}

		let substyle = {
			transform: "rotate(90deg) translate(86px, 0px)",
		    fontSize: 18
		}

		let classes = ['target', 'box'];

		if(this.props.showDropState) {
			classes.push('dropState');
		}

		return(<div ref='target' className={classes.join(' ')} style={style}>
					<div className="boxInner">
						<div style={substyle}>
							{this.props.children}
						</div>
					</div>
				</div>);

	}
}