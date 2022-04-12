import React,{useState, useEffect} from 'react'
import axios from 'axios';
import {TrendingCoins} from '../config/api'
import {CryptoState} from '../CryptoContext';
import AliceCarousel from 'react-alice-carousel';
import {Link} from 'react-router-dom';
import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles(() => ({

    carouselText: {
        color: "white",
        display:"flex",
        alignItems: "center",
        marginLeft: 15,
    }

}))


const Carousel = () => {
    const {currency, symbol} = CryptoState();
    const [trending, setTrending] = useState([])
    const classes = useStyles();

    const fetchTrendingCoins = async () => {
        const { data } = await axios.get(TrendingCoins(currency));
        console.log(data);
        setTrending(data);
    }

    useEffect(() => {
        fetchTrendingCoins();
    },[currency]);

    const responsive = {
        0: {
            items: 2,
        },
        512: {
            items: 4,
        },
    }

    const items = trending.map((coin, key)=> {
        let profit = coin.price_change_percentage_24h_in_currency >=0;
        return (
            <Link
                key = {coin.id}
                to={`/coins/${coin.id}`}
            >
                <div>
                    <img 
                        src={coin.image}
                        alt = {coin.name}
                        height= "80"
                        style={{marginBottom:10}}
                    />
                    <Typography 
                        className={classes.carouselText}>
                        {`${coin.symbol.toUpperCase()}  `}
                        &nbsp;
                        <br />
                        <span
                        style = {{
                            color: profit >0 ? "white" : "red",
                            fontWeight: 500,
                            alignItems: "center",
                            fontSize: 15,
                        }}>{profit && "+"}{`${Number(coin.price_change_percentage_24h_in_currency).toFixed(2)}%`}</span>
                    </Typography>
                    <Typography
                        style= {{
                            display: "flex",
                            alignItems: "center",
                            marginLeft: 15,
                            color:"white",
                            fontSize: 20,
                        }}
                    >{`${symbol} ${Number(coin.current_price).toLocaleString()}`}</Typography>
                    <Typography
                    className={classes.carouselText}
                    >
                        
                    </Typography>
                </div>
                
            </Link>
        )
    })

    return (
        <div>
            <AliceCarousel 
                mouseTracking
                // doesnt' finish scrolling 
                infinite
                // autoplay every second
                autoPlayInterval ={1000}
                animationDuration = {1500}
                disableDotsControls
                disableButtonsControls
                responsive = {responsive}
                autoPlay
                items = {items}
            />
        </div>
    )
}

export default Carousel