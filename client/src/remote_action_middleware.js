export default socket => store => next => action => {
	if(action.type === 'SET_USER') {
		console.log(action);
		socket.emit('setUser', action);
	}
	else if(action.remote) {
		socket.emit('action', action);
	}
	return next(action);
}