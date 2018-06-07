import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './assets/css/styles.css'
import './assets/fonts/flaticon.css'
import registerServiceWorker from './registerServiceWorker';

import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/omega/theme.css';
// import 'font-awesome/css/font-awesome.css';

import { createStore, applyMiddleware } from 'redux'
import createHistory from 'history/createBrowserHistory'
import { ConnectedRouter, routerMiddleware } from 'react-router-redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

import rootReducer from './reducers/index'
import routes from './routes';

const history = createHistory()
const middleware = routerMiddleware(history)
// let storeUpdates = {}

const store = createStore(
    rootReducer,
    {},
    applyMiddleware(middleware, thunk)
)

// store.subscribe(() => {
//     storeUpdates = store.getState()
//     // console.log("STORE UPDATES: ", storeUpdates);
// })

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
