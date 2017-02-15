import Server from 'socket.io';

function emitUserStates(state, io, authConnections) {
	let userStates = {};
	for( let user_id in authConnections ) {
		userStates[user_id] = []; // to hold jobs
	}

	for( let job_id of state.done.concat(state.running).concat(state.queue) ) {
		let job = state.jobs[job_id];
		if( userStates[job.user_id] ) {
			userStates[job.user_id].push( job );
		}
	}

	for( let user_id in authConnections ) {
		let sockets = authConnections[user_id];
		for( let socket of sockets )
			socket.emit('state', { state: userStates[user_id] });
	}

}

export default function startServer(store) {
	const io = new Server().attach(8090);

	let authConnections = {}; // user_id => [...sockets]

	store.subscribe(
		() => emitUserStates(store.getState().toJS(), io, authConnections)
	);

	io.on('connection', (socket) => {
		console.log('connection', authConnections);
		socket.on('setUser', (handshake) => {
			console.log(handshake, socket.id);
			if( 'user_id' in handshake ) {
				console.log(handshake.user_id);
				socket.user_id = handshake.user_id;
				if( authConnections[handshake.user_id] )
					authConnections[handshake.user_id].push( socket );
				else
					authConnections[handshake.user_id] = [ socket ];

				emitUserStates(store.getState().toJS(), io, authConnections);

				socket.on('action', store.dispatch.bind(store)); //insecure

				socket.on('disconnect', function() {
					let user_id = socket.user_id;
					console.log(user_id);
					var index = authConnections[user_id].indexOf(socket);
					if (index != -1) {
						authConnections[user_id].splice(index, 1);
						console.log('Client gone (id=' + socket.id + ').');
					}
				});
			}
			console.log(authConnections);
		});
	});


}