import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import reducer from './reducer';
import startServer from './server';
import { startJobIfPossible } from './actions';

const middleware = [ thunk ];
if (process.env.NODE_ENV !== 'production') {
	middleware.push(createLogger())
}

const store = createStore(
	reducer,
	applyMiddleware(...middleware)
);

setInterval( 
	() => store.dispatch(startJobIfPossible())
, 1000);

startServer(store);