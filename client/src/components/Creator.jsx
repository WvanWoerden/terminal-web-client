import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import * as actionCreators from '../actions';
import uuid from 'uuid';

export const Creator = React.createClass({
	mixins: [PureRenderMixin],
	prepareJob: function() {
		return { job_id: uuid.v4(), statement: "0=1" };
	},
	render: function() {
		return <div className='creator'>
					<button onClick={() => this.props.addJob(this.prepareJob())}>Send {this.props.user_id}</button>
				</div>
	}
});

function mapStateToProps(state) {
	return {
		user_id: state.get('user_id')
	};
}

export const CreatorContainer = connect(
	mapStateToProps, 
	actionCreators
)(Creator);