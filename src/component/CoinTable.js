import React,{useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {CoinList} from '../config/api';
import { CryptoState } from '../CryptoContext';
import { 
    ThemeProvider, 
    Container, 
    Typography, 
    makeStyles, 
    createTheme,
    TextField,
    TableContainer,
    TableHead,
    LinearProgress,
    TableRow,
    TableCell,
    Paper,
    Table,
    TableBody
} from '@material-ui/core';
import {Pagination} from '@material-ui/lab'

const useStyles = makeStyles({
    title: {
        fontFamily: "Montserrat",
        fontWeight:500,
    },
    table: {},
    row:{
        fontFamily:"Montserrat",
        color: "darkgrey",
        backgroundColor:"black",
        cursor: "pointer",
        "&:hover": {
            backgroundColor: "#3C3B3B",
        }
    },
    pagination:{
        "& .MuiPaginationItem-root": {
            color: "gold",
        },
    }
})


const CoinTable = () => {
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(false);
    const {currency, symbol} = CryptoState()
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1)

    const classes = useStyles();
    const history = useNavigate();
    
    const fetchCoins = async () => {
        setLoading(true);
        const {data} = await axios.get(CoinList(currency))
        
        setCoins(data);
        setLoading(false);
    }
    useEffect(() => {
        fetchCoins();
    },[currency]);

    const darkTheme = createTheme({
        palette: {
            primary: {
                main: '#fff',
            },
            type: "dark",
        },
    })

    const handleSearch = () => {
        return coins.filter(
            (coin) => (
            coin.name.toLowerCase().includes(search) || 
            coin.symbol.toLowerCase().includes(search)
        ))
    }

    const convertNumber = (value) => {
        return Number(value) >= 1.0e+9
        ? (Number(value)/ 1.0e+9).toFixed(2) + "B"
        : Number(value) >= 1.0e+6
        ? (Number(value)/ 1.0e+6).toFixed(2) + "M"
        : Number(value)>= 1.0e+3
        ? (Number(value)/ 1.0e+3).toFixed(2) + "K"
        : Number(value).toLocaleString()
    }

    return (
    <ThemeProvider theme={darkTheme}> 
        <Container style={{textAlign:"center"}}>
            <Typography variant="h4" className={classes.title}>
                Cryptocurrency Prices by Market Cap
            </Typography>
            <TextField
                label="Search for a Crypto Currency"
                variant="outlined"
                style={{
                    marginTop: 15,
                    width: "100%",
                    marginBottom: 20,
                }}
                onChange = {(e)=> setSearch(e.target.value)}
            />
                {loading
                ? <LinearProgress />
                : (<TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple-table">
                        <TableHead 
                            style={{
                                backgroundColor: "#EEBC1D",
                                }}>
                            <TableRow>
                                {["Coin","Price","24h Change","Market Cap"].map((head)=> (
                                        <TableCell
                                            style={{
                                                color: "black",
                                                fontWeight: "700",
                                                fontFamily: "Montserrat",
                                            }}
                                            key = {head}
                                            align={head === "Coin" ? "": "right"}
                                        >
                                        {head}
                                        </TableCell>
                                        ))}
                                </TableRow>
                        </TableHead>
                        <TableBody>
                            {handleSearch()
                                .slice((page-1)*10,(page-1)*10+10)
                                .map((row)=> {
                                const profit = row.price_change_percentage_24h >0;
                                return (
                                    <TableRow
                                        onClick={() => history(`/coins/${row.id}`)}
                                        className={classes.row}
                                        key = {row.name}
                                        >
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            styles={{
                                                display: "flex",
                                                gap: 15,
                                            }}
                                        >
                                            <img
                                              src = {row.image}
                                              alt={row.name}
                                              height="40"
                                              style={{ marginBotton: 10}}
                                            />
                                            <div
                                               style={{display: "flex", flexDirection:"column"}} 
                                            >
                                                <span
                                                style={{ fontSize: 18}}
                                                >
                                                    {row.symbol.toUpperCase()}
                                                </span>
                                                <span style={{color: "darkgrey", fontSize: 14}}>{row.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell 
                                            align="right"
                                            style={{
                                                fontSize:"1.5vw",
                                            }}>
                                            {`${symbol} ${Number(row.current_price).toLocaleString({maximumFractionDigits:3})}`} 
                                        </TableCell>
                                        <TableCell
                                         align="right"
                                         style ={{
                                             color: {profit} > 0 ? "white" : "red",
                                             fontWeight: 500,
                                             fontSize: "1.5vw",
                                        }} 
                                         >
                                        {profit && "+"}{`${Number(row.price_change_percentage_24h).toFixed(2)}%`}
                                        </TableCell>
                                        <TableCell
                                        align="right"
                                        style={{
                                            fontSize:"1.5vw",
                                        }}>
                                            {`${symbol} ${convertNumber(row.market_cap)}`}
                                        </TableCell>
                                    </TableRow>
                                )
                                })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>)}
                
                <Pagination 
                    count={(handleSearch().length/10).toFixed(0)}
                    style={{
                        padding: 20,
                        width: "100%",
                        display: "flex",
                        justifyContent:"center",
                    }}
                    classes ={{ul: classes.pagination}}
                    onChange = {(_,value) => {
                        setPage(value);
                        window.scroll(0,450);
                    }}
                />
            
        </Container>
    </ThemeProvider>
  )
}

export default CoinTable