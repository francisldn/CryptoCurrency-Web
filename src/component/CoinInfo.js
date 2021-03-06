import React,{useState, useEffect} from 'react'
import {HistoricalChart} from '../config/api';
import {CryptoState} from '../CryptoContext';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import { createTheme, ThemeProvider, makeStyles, CircularProgress } from '@material-ui/core';
import {Line} from 'react-chartjs-2';
import {chartDays} from '../config/data'
import SelectButton from './SelectButton'
import Chart from 'chart.js/auto';

const useStyles = makeStyles((theme) => ({
    container: {
        width: "75%",
        display: "flex",
        flexDirection:"column",
        alignItems:"center",
        justifyContent: "center",
        marginTop: 25,
        padding: 40,
        [theme.breakpoints.down("md")]: {
            width: "100%",
            marginTop: 0,
            padding: 20,
            paddingTop: 0,
        }
    },
}))

const CoinInfo = () => {
    const [historicalData, setHistoricalData] = useState([]);
    const [days, setDays] = useState(1);
    const {currency} = CryptoState();
    const {id} = useParams();

    const fetchHistoricalData = async () => {
        const {data} = await axios.get(HistoricalChart(id, days, currency));
        setHistoricalData(data.prices);
    }

    const classes = useStyles();

    useEffect(() => {
        fetchHistoricalData();
    },[currency, id, days]);

    const darkTheme = createTheme({
        palette: {
            primary: {
                main: '#fff',
            },
            type: "dark",
        }
    })

return (
    <ThemeProvider theme={darkTheme}>
        <div className={classes.container}>
            {
                !Array.isArray(historicalData)
                ? (<CircularProgress
                    style={{color: "gold"}} 
                    size={250}
                    thickness={1}
                    />)
                : (
                    <>
                      <Line 
                        data={{
                            labels: historicalData.map((coin) => {
                                let date = new Date(coin[0]);
                                let time = date.getHours() > 12
                                        ? `${date.getHours()-12}:${date.getMinutes()} PM`
                                        : `${date.getHours()}:${date.getMinutes()} AM`
                                return days===1? time: date.toLocaleDateString();
                            }),
                            datasets:[
                                {
                                data: historicalData.map((coin)=> coin[1]),
                                label: `Price (Past ${days} Days) in ${currency}`,
                                borderColor: "gold",
                                },
                            ], 
                        }}
                        options={{
                            elements: {
                                point: {
                                    radius: 1,
                                }
                            }
                        }}
                      />
                      <div style={{
                          display:"flex",
                          marginTop: 20,
                          justifyContent: "space-around",
                          width: "100%"
                      }}>
                          {chartDays.map(day => (
                              <SelectButton
                              key={day.value}
                              onClick={()=> setDays(day.value)}
                              selected={day.value===days}>
                                  {day.label}
                              </SelectButton>
                          ))}
                      </div>
                    </>
                )
            }
        </div>
    </ThemeProvider>
  )
}

export default CoinInfo;