/*
## MyToDoReact version 1.0.
##
## Copyright (c) 2021 Oracle, Inc.
## Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/

import React from 'react';
import ReactDOM from 'react-dom';
import './theme/tokens.css';
import './theme/global.css';
import './theme/shell.css';
import './theme/auth.css';
import './theme/modal.css';
import './theme/components.css';
import './theme/octobuddy.css';
import './theme/octobuddy-decor.css';
import './components/layout/OctoPage.css';
import './index.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
