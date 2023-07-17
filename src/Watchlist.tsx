/* eslint-disable @typescript-eslint/no-misused-promises */

import WatchlistItem from "./WatchListItem"
interface WatchlistProps {
    watchListRef:React.RefObject<HTMLInputElement>,
    addToWatchList: ()=>Promise<void>,
    watchListItems:[string, number, string, string][],
    updateStockChart: (ticker:string) => Promise<void>,
    removeFromWatchList: (stock:string)=>void

}
const Watchlist = (props: WatchlistProps) => {
    const watchListRef = props.watchListRef;
    const addToWatchList = props.addToWatchList;
    const watchListItems = props.watchListItems;
    const updateStockChart = props.updateStockChart;
    const removeFromWatchlist = props.removeFromWatchList;

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

