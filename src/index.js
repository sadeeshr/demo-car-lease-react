import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './assets/css/styles.css'
import './assets/fonts/flaticon.css'
<<<<<<< HEAD
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
=======
import App from './App';
import Demo from './Demo';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Demo />, document.getElementById('root'));
>>>>>>> e27c0c698c40223e99b802e4ae4e6a71213b7d3a
registerServiceWorker();
