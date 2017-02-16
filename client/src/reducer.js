import {Map, fromJS} from 'immutable';

function setJobs(state, jobList) {
	return state.set('jobs', fromJS(jobList));
}

function setUser(state, user_id) {
	return state.set('user_id', user_id);
}

export default function(state = Map(), action) {
	switch(action.type) {
		case 'SET_USER': 
			return setUser(state, action.user_id);
		case 'SET_JOBS':
			return setJobs(state, action.jobs);
	}
	return state;
}