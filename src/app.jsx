import React from 'react';
import ReactDOM from 'react-dom';
import $ from "jquery";
import Leap from "leapjs";
import LeapPlugins from "leapjs-plugins";
import {autobind} from 'core-decorators';

import LeapCursor from './leap-cursor.jsx';
import LeapManipulatable from './leap-manipulatable.jsx';
import LeapTarget from './leap-target.jsx';
import Spinner from './lib/spinner.jsx';
import Globe from './lib/globe.jsx';


require('./style.css');

$('body').css("visibility", "hidden");

@autobind
export default class App extends React.Component {
	constructor() {
		super();

		this.state = {
			leap: null,
			cursorDom: null,
			isGripped: false,
			gripRect: null,
			manipulatables: [],
			grippedManip: null,
			cursorPos: null,
			hasDropped: false,
			lastGrippedManip: null,
			displayedManips: [1,2,3]
		}
	}


	componentDidMount() {
		let state = {
			cursorDom: this.refs.cursor.getDom(),
		}

		this.setState(state);
		this.state.leap.loop(this.leapLoop).use('screenPosition', {scale: 1.2});
	}

	leapLoop(frame) {
		frame.hands.forEach(function(hand, index) {
			this.renderDebug(hand);
			let x = hand.screenPosition()[0];
			let y = hand.screenPosition()[2] + 700;
			this.setState({
				cursorPos: {
					x: x,
					y: y				
				}
			})
			$(this.state.cursorDom).css('transform', `translate(${x}px, ${y}px)`);

			if(hand.grabStrength >= .9 && !this.state.isGripped) {
				this.handleStartGrip();
			} else if(hand.grabStrength < .9 && this.state.isGripped) {
				this.handleEndGrip();
			}
		}.bind(this));
	}

	handleStartGrip() {
		// console.log('gripping');
		this.setState({
			isGripped: true,
			gripRect: this.state.cursorDom.getBoundingClientRect(),
			hasDropped: false
		});
	}

	handleEndGrip() {
		console.log('off gripping');
		this.setState({
			isGripped: false,
			gripRect: null,
			grippedManip: null,
			hasDropped: true,
			lastGrippedManip: this.state.grippedManip
		});
	}

	startGripMovement(manipKey) {
		if(!this.state.grippedManip && this.state.gripRect) {
			console.log('start grip movement');
			this.setState({
				gripRect: null,
				grippedManip: manipKey
			});
		}
	}

	hasDroppedLeft() {
		console.log('DROPPED' + this.state.lastGrippedManip);
		$('#error').css('display', 'flex');
		$("#error").bind('oanimationend animationend webkitAnimationEnd', function() { 
			$('#error').css('display', 'none');
		});

		// let displayedManips = this.state.displayedManips.slice();
		// displayedManips.splice(this.state.displayedManips.indexOf(this.state.lastGrippedManip), 1);

		// this.setState({
		// 	hasDropped: false,
		// 	displayedManips: displayedManips
		// });
	}

	componentWillMount() {
		let state = {
			leap: Leap
		}

		this.setState(state);
	}


	renderDebug(hand) {
			$('#debugInner').html("[<span class='debug-row'>HandX:" + (Math.floor(hand.screenPosition()[0])) + "</span>" +
        "        <span class='debug-row'>HandY:" + (Math.floor(hand.screenPosition()[1])) + "</span>" +
        "        <span class='debug-row'>HandZ:" + (Math.floor(hand.screenPosition()[2]))  + "</span>" +
        "        <span class='debug-row'>Grip:" + (hand.grabStrength) + "</span>]");
	}

	render() {
		let manipWidth = 100;
		let manipHeight = 100;

		let bodyCenterOffsetW = window.innerWidth/2 - manipWidth / 2;
		let bodyCenterOffsetH = window.innerHeight/2 - manipHeight / 2;

		let manipEdgeOffset = 180;

		return(<div>
				<div className="box" id="debug"><div className="boxInner" id="debugInner"></div></div>
				<div className='borderContainer'>
					<div className="border" id="border1"/>
					<div className="border" id="border2"/>
					<div className="border" id="border3"/>
					<div className="border" id="border4"/>
				</div>
				<div id="error"><div>Error!</div></div>
				<Spinner />
				<Globe />

				<LeapCursor gripped={this.state.isGripped} ref='cursor' />

				<LeapManipulatable 
					isGripped={this.state.grippedManip === 1}
					manipKey={1}
					display={this.state.displayedManips.includes(1)}
					style={{width: manipWidth, height: manipHeight}} 
					gripRect={this.state.gripRect} 
					cursorPos={this.state.cursorPos} 
					homePos={{left:bodyCenterOffsetW - manipEdgeOffset, top:bodyCenterOffsetH}} 
					cursorHasGripped={this.startGripMovement}>

					<span>Read CyberMail</span>
				</LeapManipulatable>
				<LeapManipulatable 
					isGripped={this.state.grippedManip === 2}
					manipKey={2} 
					display={this.state.displayedManips.includes(2)}
					style={{width: manipWidth, height: manipHeight}} 
					gripRect={this.state.gripRect} 
					cursorPos={this.state.cursorPos} 
					homePos={{left:bodyCenterOffsetW, top:bodyCenterOffsetH}} 
					cursorHasGripped={this.startGripMovement}>

					<span>Hack FBI</span>
				</LeapManipulatable>
				<LeapManipulatable 
					isGripped={this.state.grippedManip === 3}
					manipKey={3} 
					display={this.state.displayedManips.includes(3)}
					style={{width: manipWidth, height: manipHeight}} 
					gripRect={this.state.gripRect} 
					cursorPos={this.state.cursorPos} 
					homePos={{left:bodyCenterOffsetW + manipEdgeOffset, top:bodyCenterOffsetH}} 
					cursorHasGripped={this.startGripMovement}>

					<span>Cat <br/>Pictures</span>
				</LeapManipulatable>

				<LeapTarget showDropState={this.state.grippedManip !== null} dropCoords={this.state.hasDropped ? this.state.cursorPos : null} onDrop={this.hasDroppedLeft}>
					<span>Execute</span>
				</LeapTarget> 

				{this.props.children}
			</div>);
	}
}
$().ready(function(){
	$('body').append('<div class="scanLines"></div><div id="appContainer"></div>');
				
	$('body').addClass('ready');
	var app = new App();
	ReactDOM.render(<App />, $('#appContainer').get(0));
});