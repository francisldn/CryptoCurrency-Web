
import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Header from './component/Header';
import Homepage from './Pages/Homepage';
import Coinpage from './Pages/Coinpage';
import React from 'react'
import {makeStyles} from '@material-ui/core';
import Alert from './component/Alert';

function App() {

  const useStyles = makeStyles(()=> ({
    App: {
      backgroundColor: "#14161a",
      color:"white",
      minHeight:"100vh",
      backgroundSize: "100% 100vw",
      margin:0,
    }
  }))

  const classes = useStyles()

  return (

      <BrowserRouter>     
        <div className= {classes.App}>
            <Header /> 
            <Routes>
              <Route exact path='/' element={<Homepage />} />
              <Route path='/coins/:id' element={<Coinpage />} />
            </Routes>
        </div>  
        <Alert />
      </BrowserRouter>
      

  );
}

export default App;
