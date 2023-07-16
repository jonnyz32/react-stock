/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import moment from 'moment';
import './App.css'

import React, { useRef } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsStk from "highcharts/highstock";

//alpha vantage api key 6KFEPWZX4P58N7VR


// The wrapper exports only a default component that at the same time is a
// namespace for the related Props interface (HighchartsReact.Props) and
// RefObject interface (HighchartsReact.RefObject). All other interfaces
// like Options come from the Highcharts module itself.


interface ApiRes {
    "Time Series (Daily)": any
}

const numberFormat = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0});


const getData = async (ticker:string):Promise<[number, number][]> => {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${ticker}&outputsize=full&apikey=6KFEPWZX4P58N7VR`
  try {
    const res = await fetch(url)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const json:ApiRes = await res.json();
    const returnedData: [number, number][] = []
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const keys = Object.keys(json["Time Series (Daily)"]);
    for (let i = keys.length - 1; i >= 0; i--){
      const dateObject = new Date(keys[i]);
      const timestamp = Math.floor(dateObject.getTime());

      // console.log("keys: ", json["Time Series (Daily)"][keys[i]]["4. close"])

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      returnedData.push([timestamp, parseFloat(json["Time Series (Daily)"][keys[i]]["4. close"])])
    }
    return returnedData;

  } catch(e){
    console.log("Caught error: ", e)
    return []
  }

}

// const ibmdata = await getData("IBM");




// React supports function components as a simple way to write components that
// only contain a render method without any state (the App component in this
// example).

const App = (props: HighchartsReact.Props) => {
  const [data, setData] = useState<[number, number][]>([])
  const inputRef = useRef(null);

  useEffect(()=>{
    const fetchData = async ()=>{
      const data = await getData("IBM");
      console.log("setting data as ", data)
      setData(data);
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    // fetchData()
  }, [])

  const options: Highcharts.Options = {
    chart: {
      height: 600,
      width: 600
    },
    yAxis: [{
      opposite: false,
      // offset: 50,
  
      labels: {
        formatter: function (this) {
          return numberFormat.format(this.value as number) 
        },
        // x: 0,
        // style: {
        //   "color": "#000", "position": "absolute"
        // },
        // align: 'left'
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
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        return numberFormat.format(this.y as number) +  '</b><br/>' + moment(this.x).format('MMMM Do YYYY, h:mm')
      }
    },
      title: {
          text: 'My chart'
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

  <div className='watchlist'>
    <h2>Watchlist</h2>
    <div className='watchlistItem'>AAPL</div>
    <div className='watchlistItem'>GOOG</div>
    <div className='watchlistItem'>IBM</div>
  </div>

  <div className='chartContainer'>
  <form>
    <label>Enter your stock</label>
    <input ref={inputRef} placeholder='IBM'></input>
    <input type='submit' onClick={(e)=>{
      e.preventDefault()
      const fetchData = async ()=>{
        const data = await getData(inputRef.current!.value);
        console.log("setting data as ", data)
        setData(data);
      }
      fetchData()
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
