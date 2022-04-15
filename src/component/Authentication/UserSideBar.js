import React,{Fragment, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import {CryptoState} from '../../CryptoContext';
import { Avatar } from '@material-ui/core';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import {AiFillDelete} from 'react-icons/ai';

const useStyles = makeStyles({
  container:{
    width:350,
    padding: 25,
    height: "100%",
    display: "flex",
    flexDirection:"column",
    fontFamily:"monospace",
  },
  picture: {
    height:200, 
    width: 200,
    cursor: "pointer",
    display: "flex",
    flexDirection:"column",
    backgroundColor: "gold",
    objectFit:"contain",
  },
  profile: {
    flex:1,
    display: "flex",
    flexDirection:"column",
    alignItems:"center",
    gap: "20px",
  },
  logout:{
      backgroundColor: "gold",
      fontWeight:"bold",
      height:"8%",
      marginTop: 20,
      width:"100%",
  },
  watchlist:{
    flex:1,
    width:"100%",
    backgroundColor:"grey",
    borderRadius:10,
    padding:15,
    paddingTop:10,
    display:"flex",
    flexDirection:"column",
    alignItems:"center",
    gap: 12,
    overflow: "scroll",
  },
  coin: {
    padding: 10,
    borderRadius: 5,
    color: "black",
    width: "100%",
    display: "flex",
    justifyContent:"space-between",
    alignItems:"center",
    backgroundColor: "gold",
    boxShadow: "0 0 3px black",
  }
});

export default function UserSideBar() {
  const classes = useStyles();
  const [state, setState] = useState({
    right: false,
  });
  const {user, setAlert, watchlist, coins, symbol, removeFromWatchList} = CryptoState();
  console.log(coins)
  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const logOut = () => {
      signOut(auth);
      setAlert({
          open: true,
          type: "success",
          message:"Logout Successful!"
      })
      toggleDrawer();
  }


  return (
    <div>
      {['right'].map((anchor) => (
        <Fragment key={anchor}>
          <Avatar 
            onClick={toggleDrawer(anchor, true)}
            style={{
                height:38, 
                width: 38,
                marginLeft:15,
                cursor:"pointer",
                backgroundColor: "gold"
            }}
            src={user.photoURL}
            alt={user.displayName || user.email}
          />
          <Drawer 
            anchor={anchor} 
            open={state[anchor]} 
            onClose={toggleDrawer(anchor, false)}
            >
           <div className={classes.container}>
               <div className={classes.profile}>
                <Avatar 
                className={classes.picture}
                src={user.photoURL}
                alt={user.displayName || user.email}
          />
            <span
                style={{
                    width: "100%",
                    fontSize: 25,
                    textAlign: "center",
                    fontWeight:"bolder",
                    wordWrap:"break-word",
                    margin: 20,
                }}>
                {user.displayName || user.email}
            </span>
               </div>
               <div className={classes.watchlist}>
                    <span style={{fontSize: 15, textShadow:"1px 1px 5px black"}}>
                    Watchlist
                    </span>
                    {coins.map((coin) => {
                        if(watchlist.includes(coin.id)) {
                          return(
                            <div className={classes.coin}>
                                <span>{coin.name}</span>
                                <span style={{
                                  // this will give the span full length of the middle space, textAlign locate the text to the end of the space
                                  flex:1,
                                  paddingRight:10,
                                  textAlign:"end",
                                  }}>
                                  {`${symbol} ${coin.current_price.toLocaleString()}`}
                                  </span>
                                <AiFillDelete 
                                  style={{
                                    cursor:"pointer", 
                                  }}
                                  onClick={()=> removeFromWatchList(coin.id)}/>
                              </div>
                          )
                        } else return <></>
                        
                      })}
                </div>
               <Button
                variant="contained"
                className={classes.logout}
                onClick={logOut}
                >
                    Log Out
               </Button>
           </div>
          </Drawer>
        </Fragment>
      ))}
    </div>
  );
}