import React from 'react';
import { makeStyles, Container, Typography} from '@material-ui/core';
import BannerImage from './banner.jpg';
import Carousel from './Carousel'

const useStyles = makeStyles(() => ({
    
    banner: {
        background: `url(${BannerImage}) no-repeat`,
        display:"flex",
        flexDirection: "column",
        alignItems:"center",
        backgroundSize: "100%",
    },
    bannerContent: {
        height: 350,
        display: "flex",
        width:"100% 100vw",
        alignItems:"stretch",
        backgroundSize: "100% 100vw",
        left: 0,
        justifyContent: "space-around",
    }, 
    tagTitle: {
        fontSize: 65,
        fontWeight: "bold",
        fontFamily:"Montserrat",
    },
    tagLine: {
        fontSize: 18,
        color:"darkgrey",
        fontFamily: "Montserrat",
    },
    carousel: {
        display:"flex",
        alignContent: "center",
        paddingTop: 40,
        height: "100%"
    }

})) 

const Banner = () => {
    
    const classes = useStyles();

    return (
        <div className={classes.bannerContent}>
            <Container className={classes.banner}>
                <Typography className={classes.tagTitle}>Crypto Tracker</Typography>
                <Typography className={classes.tagLine}>Create your Own Crypto Watchlist Today</Typography>
                <div className={classes.carousel}>
                    <Carousel/>
                </div>
            </Container>
        </div>
    )
}

export default Banner;