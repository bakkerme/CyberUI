import React from 'react';

var css = require("!style!css!less!./spinner.less");

export default class Spinner extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(<div className="loader">
				  <div className="part">
				    <div className="part">
				      <div className="part">
				        <div className="part">
				          <div className="part"></div>
				        </div>
				      </div>
				    </div>
				  </div>
				</div>);
    }
}