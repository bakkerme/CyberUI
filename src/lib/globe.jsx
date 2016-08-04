import React from 'react';

var css = require("!style!css!less!./globe.less");

export default class Spinner extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(<div className="container">
				  <div className="ball spin">
				    <div className="lat"></div>
				    <div className="lng"></div>
				    <div className="lat"></div>
				    <div className="lng"></div>
				    <div className="lat"></div>
				    <div className="lng"></div>
				    <div className="lat"></div>
				    <div className="lng"></div>
				    <div className="lat"></div>
				    <div className="lng"></div>
				  </div>
				</div>);
    }
}