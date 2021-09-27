// @ts-ignore
import * as React from 'react'

import { Provider } from 'react-redux'
import { store } from './app/store'
import 'semantic-ui-css/semantic.min.css'
import './index.css'
import App from './components/App'
import * as ReactDOM from 'react-dom'
import { BrowserRouter } from "react-router-dom"
// import reportWebVitals from './reportWebVitals'


ReactDOM.render(
       <Provider store={ store }>
           <BrowserRouter basename={process.env.PUBLIC_URL}>
                <App />
           </BrowserRouter>
       </Provider>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals()
