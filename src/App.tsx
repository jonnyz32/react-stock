/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
//alpha vantage api key 6KFEPWZX4P58N7VR
// Second api key TN4REAKJA1FP8L3N

import { useState, useMemo } from 'react'
import moment from 'moment';
import './App.css'
import { useRef } from 'react';
import HighchartsReact from 'highcharts-react-official';
import HighchartsStk from "highcharts/highstock";
import Watchlist from './Watchlist';
import TextField from '@mui/material/TextField/TextField';
import Button from '@mui/material/Button/Button';
import { environment } from './environments';
import {Trie} from './trie';
import {nasdaq} from './../nasdaq';
// import {amex} from '../amex';
// import {tsx} from './../tsx';
import {nyse} from './../nyse';




// interface ApiRes {
//     "Time Series (Daily)": any
// }



const App = (props: any) => {
  const trie = new Trie();
  const [currentStock, setCurrentStock] = useState<string>("");
  const [data, setData] = useState<[number, number][]>([])



  

  const options2 = useMemo(() => {
    const numberFormat = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0});

    const options = {
      chart: {
        height: '100%',
        // events: {
        //   load: function() {
        //     const series = this.series[0];
        //     const data = series.data;
    
        //     // Set the initial range to show the data at the end
        //     this.xAxis[0].setExtremes(data[data.length - 10][0], data[data.length - 1][0]);
        //   }
        // }
        // width: 600
      },
      // xAxis: {
      //   events: {
      //     afterSetExtremes: function(e) {
      //       const chart = this.chart;
      //       // Update the range to match the selected timeframe
      //       const start = e.min;
      //       const end = e.max;
      //       chart.xAxis[0].setExtremes(start, end);
      //     }
      //   }
      // },
      yAxis: [{
        opposite: false,  
        labels: {
          formatter: function (this: {value}) {
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
        formatter: function (this:{x,y}) {
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
    }
    // Compute or get your options object here
    return options;
  }, [currentStock, data]);

  // for (const index of [nasdaq, amex, tsx, nyse]){
    for (const index of [nasdaq, nyse]){

    for (const stock of index){
      trie.insert(stock[0])
    }
  }

  const [menuItems, setMenuItems] = useState<string[]>([])
  // const [option, setOption] = useState(options)

  // const [watchListItems, setWatchListItems] = useState<[string, number, string, string][]>([["AAPL", -1, '0', '0']])
  const inputRef = useRef<HTMLInputElement>(null);
  // const watchListRef = useRef<HTMLInputElement>(null);
// const APIKEY = 'TN4REAKJA1FP8L3N'

const getData = async (ticker:string, size: 'full' | 'compact'):Promise<[number, number][]> => {
  let json:[number, number][] = []
  try{
    const res = await fetch(`${environment.baseUrl}/getData/${ticker}/${size}`)
    json = await res.json() as [number, number][]

    console.log("json: ", json)

  } catch(e){
    console.log("Caught error", e)
  }

  // const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&outputsize=${size}&apikey=${APIKEY}`
  // try {
  //   const res = await fetch(url)
  //   const json:ApiRes = await res.json();
  //   if (!json["Time Series (Daily)"]){
  //     throw Error("Couldn't get data")
  //   }
  //   const returnedData: [number, number][] = []
  //   const keys = Object.keys(json["Time Series (Daily)"]);
  //   for (let i = keys.length - 1; i >= 0; i--){
  //     const dateObject = new Date(keys[i]);
  //     const timestamp = Math.floor(dateObject.getTime());
  //     returnedData.push([timestamp, parseFloat(json["Time Series (Daily)"][keys[i]]["4. close"])])
  //   }
    return Promise.resolve(json);

  } 
  // catch(e){
  //   console.log("Caught error: ", e)
  //   return []
  // }
// }


  const updateStockChart = async (ticker:string)=>{
    const data = await getData(ticker, 'full');
    console.log("setting data as ", data)
    setData(data);
    setCurrentStock(ticker)
  }

  const setOptions = (prefix:string) =>{
    if (prefix === ''){
      setMenuItems([])
    } else {
      setMenuItems(trie.find(prefix.toUpperCase()))
    }
  }

  
  const chartComponentRef = useRef<any>(null);

  return (
    <div className='outerContainer'>
          <h1>Enter a stock to search</h1>
    <form className='stockForm'>
    {/* <input className='stockSearch' ref={inputRef} placeholder='IBM'></input> */}
    {/* <div className="inputContainer"> */}
    <TextField onChange={(e)=>{setOptions(e.target.value)}} className='stockSearch' ref={inputRef} id="standard-basic" label="Enter a stock" variant="standard">
    </TextField>
    <div className='menuItemsOuterContainer'>
      <div className='menuItemsInnerContainer'>
      {menuItems.slice(0,5).map(item =>(<div onClick={()=>{
        (inputRef.current!.children[1].children[0] as HTMLInputElement).value = item;
        setMenuItems([])
        }} className='stockMenuItem'>{item}</div>))}
      </div>
    </div>
    {/* </div> */}
    

    {/* <input className='stockSubmit' type='submit' onClick={(e)=>{
      e.preventDefault()
      updateStockChart(inputRef.current!.value)
      }}></input> */}
      <Button className="getStock" variant="contained" type='submit' onClick={(e)=>{
      e.preventDefault()
      // updateStockChart(inputRef.current!.value)
      updateStockChart((inputRef.current!.children[1].children[0] as HTMLInputElement).value)
      setMenuItems([])

      }}>Submit</Button>

  </form>
  {/* {menuItems.slice(0,5).map(item =>(<div className='stockMenuItem'>{item}</div>))} */}


  <div className='container'>
   

<Watchlist 
    getData={getData}
    updateStockChart={updateStockChart}
    ></Watchlist>

  <div className='chartContainer'>
    <HighchartsReact
      highcharts={HighchartsStk}
      constructorType={'stockChart'}
      options={options2}
      ref={chartComponentRef}
      {...props}
    />
  </div>
  </div>
    </div>
    
  );
};

export default App
