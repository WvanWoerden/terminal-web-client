import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import * as actionCreators from '../actions';
import uuid from 'uuid';

export const JobList = React.createClass({
	mixins: [PureRenderMixin],
	getJobs() {
		return this.props.jobs || [];
	},
	getResult(job) {
		if( job.get('status') === 'SUCCESS' )
			return job.get('result');
		else
			return null;
	},
	getError(job) {
		if( job.get('status') === 'ERROR' )
			return <span style={{color: 'red'}} >{job.get('error')}</span>;
		else
			return null;
	},
	render: function() {
		return <div className='jobList'>
					<h1>Job List</h1>
					<ul>
						{this.getJobs().map(job => 
							<li key={job.get('job_id')}>{job.get('job_id')} {this.getResult(job)} {this.getError(job)}</li>
						)}
					</ul>
				</div>
	}
});

function mapStateToProps(state) {
	return {
		jobs: state.get('jobs')
	};
}

export const JobListContainer = connect(
	mapStateToProps, 
	actionCreators
)(JobList);