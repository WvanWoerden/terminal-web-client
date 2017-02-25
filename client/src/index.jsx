import React from 'react';
import ReactDom from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import io from 'socket.io-client';
import reducer from './reducer';
import remoteActionMiddleWare from './remote_action_middleware';
import App from './components/App';
import Result from './components/Result';
import {CreatorContainer} from './components/Creator';
import {JobListContainer} from './components/JobList';
import getClientId from './client_id';
import {setUser} from './actions';
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
import Style from './style/style.css';

const socket = io('http://localhost:8090');

const createStoreWithMiddleware = applyMiddleware(
	remoteActionMiddleWare(socket)
)(createStore);

const store = createStoreWithMiddleware(reducer);

socket.on('jobs', jobs =>
	store.dispatch(jobs)
);

store.dispatch(setUser(getClientId()));

ReactDom.render(
	<Provider store={store}>
		<App store={store}>
			<div>
				<CreatorContainer />
				<JobListContainer />
			</div>
		</App>
	</Provider>,
	document.getElementById('app')
);