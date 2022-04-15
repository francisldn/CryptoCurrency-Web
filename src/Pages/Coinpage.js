import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {CryptoState} from '../CryptoContext';
import {SingleCoin} from '../config/api';
import axios from 'axios';
import { makeStyles, Typography, LinearProgress, Button } from '@material-ui/core';
import CoinInfo from '../component/CoinInfo';
import {convertNumber} from '../component/CoinTable';
import { db } from '../firebase';
import { doc,setDoc } from 'firebase/firestore';

const useStyles = makeStyles((theme) => ({
    container: {
        display: "flex",
        [theme.breakpoints.down("md")]: {
            flexDirection:"column",
            alignItems: "center",
        },
    },
    image: {
        display:"flex",
        justifyContent:"center",
        [theme.breakpoints.down("md")]: {
            display:"flex",
            justifyContent: "space-around"
        },
        [theme.breakpoints.down("sm")]: {
            flexDirection:"column",
            alignItems: "center",
        }
    },
    sidebar: {
        width: "30%",
        [theme.breakpoints.down("md")]: {
            width: "100%",
        },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: 25,
        borderRight: "2px solid grey",
    },
    heading: {
        fontFamily:"Montserrat",
        fontSize: "3.0vw",
        fontWeight:"bold",
    },
    description: {
        fontFamily: "Montserrat",
        fontSize: "max(2.5vw,10)",
        margin: 10,
        paddingLeft: 15,
    },
    marketData: {
        fontFamily: "Montserrat",
        fontSize:"max(2.5vw,15)",
        position:"relative",
        alignSelf: "start",
        [theme.breakpoints.down("md")]: {
            display:"flex",
            justifyContent: "space-around"
        },
        [theme.breakpoints.down("sm")]: {
            flexDirection:"row",
            alignItems: "center",
        },
        [theme.breakpoints.down("xs")]: {
            alignItems:"start",
        }
    },
    watchlist: {
        width: "100%",
        height: 40,
        color:"black",
        backgroundColor: "gold",
        cursor:"pointer",
        "&:hover": {
            backgroundColor:"lightblue",
        }
    }

}))


const Coinpage = () => {
    // id is passed from App Router :id
    const {id} = useParams();
    const [coin, setCoin]= useState()
    const [coinName, setCoinName] = useState();
    const [coinDes, setCoinDes] = useState();
    const [coinRank, setCoinRank] = useState();
    const [coinPrice, setCoinPrice] = useState();
    const [coinMktCap, setCoinMktCap] = useState();
    const {currency, symbol, user, setAlert, watchlist, removeFromWatchList} = CryptoState();
     

    // function to remove html tags
    function removeTags(str) {
        if((str===null) || (str==='')) return false;
        else str = str.toString();
        return str.replace(/(<([^>]+)>)/ig,'');
    }
    
    const fetchCoin = async () => {
        const {data} = await axios.get(SingleCoin(id));
        setCoin(data);
        setCoinName(data.name)
        setCoinRank(data.coingecko_rank)
        setCoinMktCap(data.market_data.market_cap[currency.toLowerCase()])
        setCoinPrice(data.market_data.current_price[currency.toLowerCase()].toLocaleString())
        setCoinDes(removeTags(data.description.en.split('. ')[0]))
    }

    const classes = useStyles();

    

    useEffect(() => {
        fetchCoin();
    },[currency]);

    const inWatchList = watchlist.includes(id)

    // create an instance of the coin list (coinRef) from db using 'doc' function
    // then update coinRef then write to database using setDoc
    const addToWatchList = async () => {
        // locate the coin instance in the database
        const coinRef = doc(db, "watchlist", user.uid)
        try{
            // update the coin instance in database
            await setDoc(coinRef, {
                // if existing watchlist = true, add coin.id
                coins: watchlist ? [...watchlist, id]: [id]
            })
            setAlert({
                open:true,
                message: `${coin.name} added to the watchlist`,
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

    //removeCoinFromWatchList is moved to CryptoContext
    

    if(!coin) return <LinearProgress />

    return (
    <div className={classes.container}>
        <div className={classes.sidebar}>
            <div>
                <img 
                    src= {coin? coin.image.large: ""}
                    alt = {coinName}
                    style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                    }}
                />
            </div>
            <Typography 
                variant="h3" 
                className={classes.heading}
                style={{marginBottom:15}}
            >{coinName}
            </Typography>
            <Typography 
                variant="subtitle1"
                className={classes.description}
            >{coinDes+"."}
            </Typography>
            <div style={{display: "flex", flexDirection:"column"}}>
                <Typography 
                variant="h5"
                className={classes.marketData}
                style={{margin: 10}}>
                    <span style={{
                        fontWeight:"bold",
                        marginRight:5,
                        }}>Rank:</span> {` ${coinRank}`}
                </Typography>
                <Typography 
                variant="h5"
                className={classes.marketData}
                style={{margin: 10}}>
                    <span style={{
                        fontWeight:"bold",
                        marginRight: 5,
                    }}>Current Price:</span>{` ${symbol} ${coinPrice}`}
                </Typography>
                <Typography 
                variant="h5"
                className={classes.marketData}
                style={{
                    margin: 10,
                }}>
                    <span style={{
                        fontWeight:"bold",
                        marginRight:5,}}>Market Cap:</span> {` ${symbol} ${convertNumber(coinMktCap)}`}
                </Typography>
                {user && (
                    <Button
                        variant="outlined"
                        className={classes.watchlist}
                        style={{
                            backgroundColor: inWatchList? "#ff0000": classes.watchlist.backgroundColor,
                        }}
                        onClick={inWatchList? () => removeFromWatchList(id): addToWatchList}
                    >
                        {inWatchList? "Remove from Watchlist": "Add to Watchlist"}
                    </Button>
                )}
            </div>
        </div>
        <CoinInfo coin={coin}/>
    </div>
  )
}

export default Coinpage;