/* eslint-disable @typescript-eslint/no-misused-promises */

import './WatchListItem.css'

interface WatchListItemProps {
    stock:string,
    updateStockChart:(ticker:string)=>Promise<void>,
    removeFromWatchlist:(ticker:string)=>void,
    price: number,
    amountChange: string,
    percentChange: string
}

const WatchlistItem = (props: WatchListItemProps
) => {
    const {stock, updateStockChart, removeFromWatchlist, price, amountChange, percentChange} = props;
    console.log("props: ", props)

    return (    
    <div className={"watchListItem"}>
        <span onClick={()=>updateStockChart(stock)} className="watchListText">{stock}</span>
        <span className="currentPrice">{price === -1 ? '' : price}</span>
        {amountChange && ['+', '0'].includes(amountChange[0])  ? <span className="amountChange green">{amountChange}</span>: <span className="amountChange red">{amountChange}</span>}
        {(percentChange && percentChange.length >= 2 && percentChange[1] === '+' || percentChange === '0') ? <span className="percentChange green">{percentChange}</span>: <span className="percentChange red">{percentChange}</span>}
        <button onClick={()=>removeFromWatchlist(stock)}>Remove</button>
        </div>
    )

}

export default WatchlistItem