import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default React.createClass({
	mixins: [PureRenderMixin],
	render: function() {
		if( this.props.result === null )
			return null;
		else if( this.props.result.size === 0 )
			return <span>Cannot be proved or disproved</span>;
		else
			return (
				<ul className="resultList">
					<li>{this.props.result.get(0)}={this.props.result.get(1)}</li>
					{this.props.result.slice(2,this.props.result.length).map((result,key) =>
						<li key={key}>={result}</li>
					)}
				</ul>
			);
	}
});