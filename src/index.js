import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './assets/css/styles.css'
import './assets/fonts/flaticon.css'
import Main from './components/Main';
import Home from './components/Home';
import Members from './components/Members';
import AddMember from './components/AddMember';
import Invest from './components/Invest';
import Invoices from './components/Invoices';
import registerServiceWorker from './registerServiceWorker';

import { createStore, applyMiddleware } from 'redux'
import createHistory from 'history/createBrowserHistory'
import { Route, Switch } from 'react-router-dom'
import { ConnectedRouter, routerMiddleware } from 'react-router-redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

import rootReducer from './reducers/index'
import routes from './routes';

const history = createHistory()
const middleware = routerMiddleware(history)
let storeUpdates = {}

const store = createStore(
    rootReducer,
    {},
    applyMiddleware(middleware, thunk)
)

store.subscribe(() => {
    storeUpdates = store.getState()
    console.log("STORE UPDATES: ", storeUpdates);
})

const App = () => {
    return (
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <div className="main-body">
                    <div className="content-wrapper">
                        {routes}
                    </div>
                </div>

            </ConnectedRouter>
        </Provider>
    )
}


ReactDOM.render(
    <App />,
    document.getElementById('root'));
registerServiceWorker();
