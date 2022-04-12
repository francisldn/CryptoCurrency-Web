import React,{useState} from 'react'
import { createContext, useContext, useEffect } from 'react';

const Crypto= createContext();

//this is used to wrap the App and pass the state to the App
const CryptoContext = ({children}) => {
  const [currency, setCurrency] = useState("GBP");
  const [symbol, setSymbol] = useState('£')
  
  useEffect(()=> {
      if(currency === 'GBP') setSymbol("£");
      else if(currency ==='USD') setSymbol('$');
      // currency is the dependency
  }, [currency])

    return (
        // send props to other components as an object
    <Crypto.Provider value={{currency,symbol, setCurrency}}>{children}</Crypto.Provider>
  )
}

export default CryptoContext;

// this is exported to the relevant component as a hook
export const CryptoState=() => {
    return useContext(Crypto);
}