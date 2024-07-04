import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import { Provider } from 'react-redux';
import { store } from './store/index.ts';
import PageNotFound from './pages/PageNotFound.tsx';
ReactDOM.createRoot(document.getElementById('root')!).render(

  <React.StrictMode>
    <BrowserRouter>
      <ToastContainer></ToastContainer>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
)
