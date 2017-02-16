

export const setUser = (user_id) => ({
	type: 'SET_USER',
	remote: true,
	user_id
});

export const addJob = (job) => ({
	type: 'ADD_JOB',
	remote: true,
	job
});

export const removeJob = (job_id) => ({
	type: 'REMOVE_JOB',
	remote: true,
	job_id
});