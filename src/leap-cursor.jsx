import React from 'react';
import ReactDOM from 'react-dom';
import $ from "jquery";
import {autobind} from 'core-decorators';

@autobind
export default class LeapCursor extends React.Component {
	constructor(props) {
		super(props);
	}

	getDom() {
		return this.refs.cursor;
	}

	render() {
		// let props = [];
		let [gripped, className, ...other] = this.props;

		let classes = [];
		classes.push('cursor');
		if(this.props.gripped) {
			classes.push('gripped');
		}

		return(
			<div ref="cursor" className={classes.join(' ')} {...other}><div className="cursor-gripped"></div></div>	
		);
	}

}