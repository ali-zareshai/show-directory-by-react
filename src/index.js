import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import configs from './config';
import reportWebVitals from './reportWebVitals';
import App from "./App";
import { StylesProvider, ThemeProvider, jssPreset } from "@material-ui/styles";
import { createTheme } from '@mui/material/styles';
import { create } from "jss";
import rtl from "jss-rtl";
import axios from 'axios';


const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
const theme = createTheme({
  direction: "rtl",
});

axios.defaults.baseURL = configs.API_URL;
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

ReactDOM.render(
  <React.StrictMode>
    <StylesProvider jss={jss}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </StylesProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
