import React,{useState} from 'react'
import { createContext, useContext, useEffect } from 'react';
import axios from 'axios';
import {CoinList} from './config/api'
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { db } from './firebase';
import { doc,setDoc, onSnapshot } from 'firebase/firestore';

const Crypto= createContext();

//this is used to wrap the App and pass the state to the App
const CryptoContext = ({children}) => {
  const [currency, setCurrency] = useState("GBP");
  const [symbol, setSymbol] = useState('£');
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [alert, setAlert] = useState({
      open: false,
      message: "",
      type: "success",
  })
  const [watchlist, setWatchList] = useState([])

  const removeFromWatchList = async(id) => {
    const coinRef = doc(db, "watchlist", user.uid)
    try{
            // update the coin instance in database
            await setDoc(coinRef, {
                // remove coin
                coins: watchlist.filter((watch)=> watch !== id)
            },
            //join with the existing data, it the deleted coin will be removed
            { merge: "true"}
        );
        setAlert({
            open:true,
            message: `${id[0].toUpperCase()+id.substr(1)} removed from the watchlist`,
            type: "success",
        });
    } catch(error) {
        setAlert({
            open:true,
            message:error.message,
            type: "error",
        })
    }
}
  // to execute setWatchList
  useEffect(()=> {
    // check user is logged in
    if(user) {
        // create an instance of coinlist in database
        const coinRef = doc(db, "watchlist", user.uid);
        // check if coin exists in the database
        // after a snapshot is done, then unsubscribe
        var unsubscribe = onSnapshot(coinRef, (coin) => {
                if(coin.exists()) {
                    setWatchList(coin.data().coins);
                } else {
                    console.log("No items in the watchlist");
                }
            })
            return ()=> {
                unsubscribe();
            };
        }
    }, [user])

  useEffect(()=> {
      onAuthStateChanged(auth, user=> {
          if(user) setUser(user);
          else setUser(null);
      })
  },[])
  
  const fetchCoins = async () => {
    setLoading(true);
    const {data} = await axios.get(CoinList(currency));
    setCoins(data);
    setLoading(false);
}

  useEffect(()=> {
      if(currency === 'GBP') setSymbol("£");
      else if(currency ==='USD') setSymbol('$');
      // currency is the dependency
  }, [currency])

    return (
        // send props to other components as an object
    <Crypto.Provider value={{
        currency,
        symbol, 
        setCurrency, 
        coins, 
        loading, 
        fetchCoins,
        alert, 
        setAlert,
        user,
        watchlist,
        removeFromWatchList
    }}>{children}</Crypto.Provider>
  )
}

export default CryptoContext;

// this is exported to the relevant component as a hook
export const CryptoState=() => {
    return useContext(Crypto);
}