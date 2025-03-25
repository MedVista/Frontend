import React from 'react';
import ReactDOM from 'react-dom';
import Home from './components/Home';
import CallUser from './components/Calluser';
import { BrowserRouter,Routes,Route,createBrowserRouter,RouterProvider,Link}  from 'react-router-dom';
import App from './App';
import { ContextProvider } from './Context';
import './Index.css';
const router=createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    
  },
  {
    path: '/calluser',
    element: <CallUser/>,

  },
]);

ReactDOM.render(
  <ContextProvider>
    {/* <RouterProvider router={router}>
      
    </RouterProvider> */}
    <App />
    
  </ContextProvider>,
  document.getElementById('root'),
);
// ReactDOM.render(<App/>,document.getElementById('root'));
