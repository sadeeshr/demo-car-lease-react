import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './assets/css/styles.css'
import './assets/fonts/flaticon.css'
import App from './App';
import Demo from './Demo';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Demo />, document.getElementById('root'));
registerServiceWorker();
