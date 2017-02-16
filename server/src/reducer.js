import {Map, List, fromJS} from 'immutable';

const INITIAL_STATE = Map({
	jobs: Map(),
	queue: List(),
	running: List(),
	done: List()
});

function applyAddJob(state, job, user_id) {
	job['status'] = 'QUEUED';
	job['user_id'] = user_id;
	return state.updateIn(['queue'], arr => arr.push(job.job_id))
				.setIn(['jobs', job.job_id], fromJS(job));
}

function applyMoveToRunning(state, job_id) {
	return state.updateIn(['queue'], arr => arr.filter( id => id !== job_id ))
				.updateIn(['running'], arr => arr.push(job_id))
				.setIn(['jobs', job_id, 'status'], 'RUNNING');
}

function applyMoveToSuccess(state, job_id, result) {
	return state.updateIn(['running'], arr => arr.filter( id => id !== job_id ))
				.updateIn(['done'], arr => arr.push(job_id))
				.setIn(['jobs', job_id, 'status'], 'SUCCESS')
				.setIn(['jobs', job_id, 'result'], result);
}

function applyMoveToError(state, job_id, error) {
	return state.updateIn(['running'], arr => arr.filter( id => id !== job_id ))
				.updateIn(['done'], arr => arr.push(job_id))
				.setIn(['jobs', job_id, 'status'], 'ERROR')
				.setIn(['jobs', job_id, 'error'], error);
}

function applyMoveToTimeout(state, job_id) {
	return state.updateIn(['running'], arr => arr.filter( id => id !== job_id ))
				.updateIn(['done'], arr => arr.push(job_id))
				.setIn(['jobs', job_id, 'status'], 'TIMEOUT');
}

function applyRemoveJob(state, job_id) {
	return state.updateIn(['queue'], arr => arr.filter( id => id !== job_id ))
				.updateIn(['done'], arr => arr.filter( id => id !== job_id ))
				.set('jobs', state.get('jobs').filter( job => (job.get('job_id') !== job_id || job.get('status') === 'RUNNING')));
}

export default function reducer(state = INITIAL_STATE, action) {
	switch(action.type) {
		case 'MOVE_TO_RUNNING':
			return applyMoveToRunning(state, action.job_id);
		case 'MOVE_TO_SUCCESS':
			return applyMoveToSuccess(state, action.job_id, action.result);
		case 'MOVE_TO_ERROR':
			return applyMoveToError(state, action.job_id, action.error);
		case 'MOVE_TO_TIMEOUT':
			return applyMoveToTimeout(state, action.job_id);
		case 'ADD_JOB':
			return applyAddJob(state, action.job, action.user_id);
		case 'REMOVE_JOB':
			return applyRemoveJob(state, action.job_id)
	}
	return state;
}