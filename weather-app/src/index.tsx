import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { StrictMode } from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { App } from './components/App';
import './index.css';

// entrypoint

// add required dayjs plugins
// https://day.js.org/docs/en/plugin/plugin
dayjs.extend(advancedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

// render application
render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
  document.getElementById('root')
);
