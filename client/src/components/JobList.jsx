import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import * as actionCreators from '../actions';
import uuid from 'uuid';

export const JobList = React.createClass({
	mixins: [PureRenderMixin],
	prepareJob: function() {
		return { job_id: uuid.v4(), statement: "0=1" };
	},
	getJobs() {
		return this.props.jobs || [];
	},
	getResult(job) {
		if( job.get('status') == 'SUCCESS' )
			return job.get('result');
		else
			return null;
	},
	render: function() {
		return <div className='jobList'>
					<h1>Job List</h1>
					<ul>
						{this.getJobs().map(job => 
							<li key={job.get('job_id')}>{job.get('job_id')} {this.getResult(job)}</li>
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