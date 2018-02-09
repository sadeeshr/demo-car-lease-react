import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './assets/css/styles.css'
import './assets/fonts/flaticon.css'
import CarLease from './CarLease';
import registerServiceWorker from './registerServiceWorker';

import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

import rootReducer from './reducers'

const store = createStore(
    rootReducer,
    {},
    applyMiddleware(thunk)
)

ReactDOM.render(
    <Provider store={store}>
        <CarLease />
    </Provider>
    , document.getElementById('root'));
registerServiceWorker();
