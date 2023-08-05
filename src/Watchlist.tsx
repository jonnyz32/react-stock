/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-misused-promises */

import WatchlistItem from "./WatchListItem"
import './Watchlist.css'
import { useState, useRef, useEffect } from "react"
interface WatchlistProps {
    updateStockChart: (ticker:string) => Promise<void>,
    getData: (ticker:string, size: 'full'|'compact') => Promise<[number, number][]>

}
const Watchlist = (props: WatchlistProps) => {
  const watchListRef = useRef<HTMLInputElement>(null);
  const [watchListItems, setWatchListItems] = useState<[string, number, string, string][]>([["AAPL", -1, '0', '0']])

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

  const getStockWatchListData = async (ticker: string): Promise<[number, string, string]> =>{
    const data = await props.getData(ticker, 'compact')
    const lastPrice = data[data.length - 1][1]
    const secondLastPrice = data[data.length - 2][1]
    const amountChange = parseFloat((lastPrice - secondLastPrice).toFixed(2))
    const amountChangeStr = amountChange >= 0 ? `+${amountChange}` : `${amountChange}`
    const percentChange = parseFloat((amountChange / secondLastPrice * 100).toFixed(2))
    const percentChangeStr = percentChange >= 0 ? `(+${percentChange}%)` : `(${percentChange}%)`
    return [lastPrice, amountChangeStr, percentChangeStr]
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

    const updateStockChart = props.updateStockChart;

    return(<div className='watchlist'>
    <h2>Watchlist</h2>
    <input ref={watchListRef} placeholder='AAPL'></input>
    <button onClick={addToWatchList}>Add to watchlist</button>
    {watchListItems.map(
      (stock)=>(<WatchlistItem 
        key={stock[0].toUpperCase()}
        stock={stock[0].toUpperCase()} 
      updateStockChart={updateStockChart} 
      removeFromWatchlist={removeFromWatchlist} 
      price={stock[1]} 
      amountChange={stock[2]}
      percentChange={stock[3]}/>))}  
    </div>);

}
export default Watchlist;
