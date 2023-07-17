/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
//alpha vantage api key 6KFEPWZX4P58N7VR

import { useEffect, useState } from 'react'
import moment from 'moment';
import './App.css'
import { useRef } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsStk from "highcharts/highstock";
import Watchlist from './Watchlist';

interface ApiRes {
    "Time Series (Daily)": any
}

const App = (props: HighchartsReact.Props) => {
  const [data, setData] = useState<[number, number][]>([])
  const [currentStock, setCurrentStock] = useState<string>("");
  const [watchListItems, setWatchListItems] = useState<[string, number, string, string][]>([["AAPL", -1, '0', '0']])
  const inputRef = useRef<HTMLInputElement>(null);
  const watchListRef = useRef<HTMLInputElement>(null);
  const numberFormat = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0});
const APIKEY = '6KFEPWZX4P58N7VR'

const getData = async (ticker:string, size: 'full' | 'compact'):Promise<[number, number][]> => {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${ticker}&outputsize=${size}&apikey=${APIKEY}`
  try {
    const res = await fetch(url)
    const json:ApiRes = await res.json();
    const returnedData: [number, number][] = []
    const keys = Object.keys(json["Time Series (Daily)"]);
    for (let i = keys.length - 1; i >= 0; i--){
      const dateObject = new Date(keys[i]);
      const timestamp = Math.floor(dateObject.getTime());
      returnedData.push([timestamp, parseFloat(json["Time Series (Daily)"][keys[i]]["4. close"])])
    }
    return returnedData;

  } catch(e){
    console.log("Caught error: ", e)
    return []
  }
}

  const updateStockChart = async (ticker:string)=>{
    const data = await getData(ticker, 'full');
    console.log("setting data as ", data)
    setData(data);
    setCurrentStock(ticker)
  }

  const addToWatchList = async () => {
    const stock = watchListRef.current!.value.toUpperCase();
    const [lastPrice, amountChangeStr, percentChangeStr] = await getStockWatchListData(stock);
    setWatchListItems([...watchListItems, [stock, lastPrice, amountChangeStr, percentChangeStr]])
  }

  const removeFromWatchlist = (stock:string): void => {
    const newItems = watchListItems.filter(item => item[0] !== stock.toUpperCase())
    console.log("watchlistitems", newItems)
    setWatchListItems([...newItems])
  }

  const getStockWatchListData = async (ticker: string): Promise<[number, string, string]> =>{
    const data = await getData(ticker, 'compact')
    const lastPrice = data[data.length - 1][1]
    const secondLastPrice = data[data.length - 2][1]
    const amountChange = parseFloat((lastPrice - secondLastPrice).toFixed(2))
    const amountChangeStr = amountChange >= 0 ? `+${amountChange}` : `${amountChange}`
    const percentChange = parseFloat((amountChange / secondLastPrice * 100).toFixed(2))
    const percentChangeStr = percentChange >= 0 ? `(+${percentChange}%)` : `(${percentChange}%)`
    return [lastPrice, amountChangeStr, percentChangeStr]
  }

  useEffect(()=>{
    const updateWatchListData = async() => {
      for (let i = 0; i < watchListItems.length; i++){
        const [lastPrice, amountChangeStr, percentChangeStr] = await getStockWatchListData(watchListItems[i][0])
        watchListItems[i][1] = lastPrice
        watchListItems[i][2] = amountChangeStr
        watchListItems[i][3] = percentChangeStr
      }
      setWatchListItems([...watchListItems])
  }
  updateWatchListData()
  }, [])

  const options: Highcharts.Options = {
    chart: {
      height: 600,
      width: 600
    },
    yAxis: [{
      opposite: false,  
      labels: {
        formatter: function (this) {
          return numberFormat.format(this.value as number) 
        },
      },
    },
    ],
    plotOptions: {
      series: {
        showInNavigator: true,
        gapSize: 6,
  
      }
    },
  
  
    tooltip: {
      shared: true,
      formatter: function (this) {
        return numberFormat.format(this.y as number) +  '</b><br/>' + moment(this.x).format('MMMM Do YYYY, h:mm')
      }
    },
      title: {
          text: currentStock
      },
      legend: {
        enabled: true
      },
      rangeSelector: {
        buttons: [{
          type: 'day',
          count: 1,
          text: '1D',
        }, {
          type: 'day',
          count: 5,
          text: '5D'
        }, {
          type: 'month',
          count: 1,
          text: '1M'
        }, {
          type: 'month',
          count: 6,
          text: '6M'
        },
        {
          type: 'year',
          count: 1,
          text: '1Y'
        },
        {
          type: 'year',
          count: 5,
          text: '5Y'
        },
  
          {
          type: 'all',
          text: 'Max'
        }],
        selected: 4
      },
      
      series: [{
          name: 'Price',
          type: 'spline',
          data: data
      }],
      credits: {
        enabled: false
      }
  };
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

  return (
  <div className='container'>
    <Watchlist watchListRef={watchListRef}
    addToWatchList={addToWatchList}
    watchListItems={watchListItems}
    updateStockChart={updateStockChart}
    removeFromWatchList={removeFromWatchlist}></Watchlist>

  <div className='chartContainer'>
  <form>
    <label>Enter your stock</label>
    <input ref={inputRef} placeholder='IBM'></input>
    <input type='submit' onClick={(e)=>{
      e.preventDefault()
      updateStockChart(inputRef.current!.value)
      }}></input>
  </form>
    <HighchartsReact
      highcharts={HighchartsStk}
      constructorType={'stockChart'}
      options={options}
      ref={chartComponentRef}
      {...props}
    />
  </div>
  </div>
  );
};

export default App
