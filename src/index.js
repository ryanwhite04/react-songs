import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

ReactDOM.render(
  <App style={{
    display: 'flex',
    flexDirection: 'column',
    'flex': 1,
  }} />,
  document.getElementById('root')
);
