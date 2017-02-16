import {List, Map, fromJS} from 'immutable';
import {expect} from 'chai';
import {
	addJob,
	removeJob,
	moveToRunning,
	moveToSuccess,
	moveToTimeout,
	moveToError
} from '../src/actions';

import reducer from '../src/reducer';

// shorthand job creators
var job1 = status => ({
	job_id: 'job1',
	user_id: 'user1',
	axioms: ['A=B'],
	statement: '0=1',
	status
});

var job2 = status => ({
	job_id: 'job2',
	user_id: 'user2',
	axioms: ['A=B'],
	statement: 'a=b',
	status
});

describe('reducer', () => {

	it('handles moveToRunning', () => {
		const state = fromJS({
			jobs: { job1: job1('QUEUED'), job2: job2('QUEUED') },
			queue: [ 'job2', 'job1' ],
			running: [],
			done: []
		});
		const action = moveToRunning('job2');
		const nextState = reducer(state, action);
		expect(nextState).to.equal(fromJS({
			jobs: { job1: job1('QUEUED'), job2: job2('RUNNING') },
			queue: [ 'job1' ],
			running: [ 'job2' ],
			done: []
		}));
	});

	it('handles moveToSuccess', () => {
		const state = fromJS({
			jobs: { job1: job1('QUEUED'), job2: job2('RUNNING') },
			queue: [ 'job1' ],
			running: [ 'job2' ],
			done: []
		});
		const action = moveToSuccess('job2', 'a=b');
		const nextState = reducer(state, action);
		expect(nextState).to.equal(fromJS({
			jobs: { job1: job1('QUEUED'), job2: Object.assign( job2('SUCCESS'), { result: 'a=b'} ) },
			queue: [ 'job1' ],
			running: [],
			done: [ 'job2' ]
		}));
	});

	it('handles moveToTimeout', () => {
		const state = fromJS({
			jobs: { job1: job1('QUEUED'), job2: job2('RUNNING') },
			queue: [ 'job1' ],
			running: [ 'job2' ],
			done: []
		});
		const action = moveToTimeout('job2');
		const nextState = reducer(state, action);
		expect(nextState).to.equal(fromJS({
			jobs: { job1: job1('QUEUED'), job2: job2('TIMEOUT') },
			queue: [ 'job1' ],
			running: [],
			done: [ 'job2' ]
		}));
	});

	it('handles moveToError', () => {
		const state = fromJS({
			jobs: { job1: job1('QUEUED'), job2: job2('RUNNING') },
			queue: [ 'job1' ],
			running: [ 'job2' ],
			done: []
		});
		const action = moveToError('job2', 'errmsg');
		const nextState = reducer(state, action);
		expect(nextState).to.equal(fromJS({
			jobs: { job1: job1('QUEUED'), job2: Object.assign( job2('ERROR'), { error: 'errmsg' }) },
			queue: [ 'job1' ],
			running: [],
			done: [ 'job2' ]
		}));
	});

	it('handles addJob', () => {
		const state = fromJS({
			jobs: { job1: job1('QUEUED') },
			queue: [ 'job1'],
			running: [],
			done: []
		});
		let strippedJob2 = job2('');
		delete strippedJob2.status;
		delete strippedJob2.user_id;
		const action = addJob(strippedJob2, 'user2');
		const nextState = reducer(state, action);
		expect(nextState).to.equal(fromJS({
			jobs: { job1: job1('QUEUED'), job2: job2('QUEUED') },
			queue: [ 'job1', 'job2' ],
			running: [],
			done: []
		}));
	});

	it('handles removeJob with job in queue', () => {
		const state = fromJS({
			jobs: { job1: job1('QUEUED'), job2: job2('RUNNING') },
			queue: [ 'job1' ],
			running: [ 'job2' ],
			done: []
		});
		const action = removeJob('job1');
		const nextState = reducer(state, action);
		expect(nextState).to.equal(fromJS({
			jobs: { job2: job2('RUNNING') },
			queue: [ ],
			running: [ 'job2' ],
			done: []
		}));
	});

	it('handles removeJob with job in running (doesn\'t delete', () => {
		const state = fromJS({
			jobs: { job1: job1('QUEUED'), job2: job2('RUNNING') },
			queue: [ 'job1' ],
			running: [ 'job2' ],
			done: []
		});
		const action = removeJob('job2');
		const nextState = reducer(state, action);
		expect(nextState).to.equal(state);
	});

});