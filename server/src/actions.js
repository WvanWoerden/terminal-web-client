import boogCommand from './commands/boog';
var exec = require('child-process-promise').exec;

// QUEUE movement actions
export const addJob = (job, user_id) => ({
	type: 'ADD_JOB',
	job,
	user_id
});

export const removeJob = job_id => ({
	type: 'REMOVE_JOB',
	job_id
});

export const moveToRunning = job_id => ({
	type: 'MOVE_TO_RUNNING',
	job_id
});

export const moveToSuccess = (job_id, result) => ({
	type: 'MOVE_TO_SUCCESS',
	job_id,
	result
});

export const moveToTimeout = job_id => ({
	type: 'MOVE_TO_TIMEOUT',
	job_id
});

export const moveToError = (job_id, error) => ({
	type: 'MOVE_TO_ERROR',
	job_id,
	error
});

export const startJob = job_id => (dispatch, getState) => {
	dispatch(moveToRunning(job_id));

	let boogCmd = new boogCommand(getState().getIn(['jobs', job_id, 'data']).toJS());
	if( boogCmd.hasError() ) {
		dispatch(moveToError(job_id, boogCmd.getError()));
	} else {
		let execCommand = boogCmd.getCommand();

		return exec(execCommand)
			.then( result => JSON.parse(result.stdout) )
			.then( result => {
			if( result.type === 'TIMEOUT')
				dispatch(moveToTimeout(job_id));
			else if( result.type === 'ERROR' )
				dispatch(moveToError(job_id, result.error));
			else
				dispatch(moveToSuccess(job_id, result.result));
			dispatch(startJobIfPossible());
		}).catch( error => {
			console.log(error);
			dispatch(moveToError(job_id, error));
			dispatch(startJobIfPossible());
		});
	}

	
}

export const startJobIfPossible = () => (dispatch, getState) => {
	if( getState().get('running').size == 0 && getState().get('queue').size > 0 ) {
		console.log('start run');
		let job_id = getState().getIn(['queue', 0]);
		return dispatch(startJob(job_id));
	}
}
