import React from 'react';
import axios from 'axios';
import Navigation from './src/navigation/Navigation';

/* yellowbox fix */
/* eslint-disable no-underscore-dangle, no-console, consistent-return */
global.__old_console_warn = global.__old_console_warn || console.warn;
global.console.warn = (str) => {
  const tst = `${str || ''}`;
  if (tst.startsWith('Warning: isMounted(...) is deprecated')) {
    return;
  }
  return global.__old_console_warn.apply(console, [str]);
};
global.appUrl = 'http://gouomp-production-backend.herokuapp.com';
axios.defaults.baseURL = appUrl;
/* eslint-enable no-underscore-dangle, no-console, consistent-return */

const App = () => (
  <Navigation />
);

export default App;
