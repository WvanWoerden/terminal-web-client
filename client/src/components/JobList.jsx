import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import * as actionCreators from '../actions';
import uuid from 'uuid';
import {
	Table
} from 'react-bootstrap';
import Result from './Result';

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
	getStatusClass(job) {
		switch(job.get('status')) {
			case 'SUCCESS':
				return 'success';
			case 'ERROR':
			case 'TIMEOUT':
				return 'danger';
			case 'RUNNING':
				return 'info';
		}
	},
	render: function() {
		return <Table striped bordered condensed hover>
			<thead>
				<tr>
					<th>Status</th>
					<th>Statement</th>
					<th>Axioms</th>
					<th>Result</th>
				</tr>
				{this.getJobs().map(job => 
					<tr className={this.getStatusClass(job)} key={job.get('job_id')}>
						<td>{job.get('status')}</td>
						<td>{job.getIn(['data','statement'])}</td>
						<td>
							<ul className="axiomList">
								{job.getIn(['data','axioms']).map((axiom,key) =>
								<li key={key}>{axiom}</li>
								)}
							</ul>
						</td>
						<td><Result result={this.getResult(job)} />{this.getError(job)}</td>
					</tr>
				)}
			</thead>
		</Table>
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