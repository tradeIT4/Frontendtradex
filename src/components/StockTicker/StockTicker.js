import React, { useEffect, useState } from "react";
import "./StockTicker.css";

export default function StockTicker() {
  const [stocks, setStocks] = useState([]);

  const symbols = ["SPY", "QQQ", "DIA", "GLD", "USO"];

  const generateRandomStocks = () => {
    return symbols.map((symbol) => {
      const basePrice = Math.random() * 400 + 50; // random price
      const changePct = (Math.random() * 4 - 2).toFixed(2); // -2% to +2%

      return {
        symbol,
        value: basePrice.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        change: `${changePct >= 0 ? "+" : ""}${changePct}%`,
      };
    });
  };

  useEffect(() => {
    setStocks(generateRandomStocks());

    // optional: refresh every 5 seconds
    const interval = setInterval(() => {
      setStocks(generateRandomStocks());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="ticker">
      <div className="tickerTrack">
        {[...stocks, ...stocks].map((item, i) => {
          const up = item.change.startsWith("+");

          return (
            <div className="tickerItem" key={i}>
              <span className="tickerSymbol">{item.symbol}</span>
              <span className="tickerValue">{item.value}</span>
              <span className={`tickerChange ${up ? "up" : "down"}`}>
                {item.change}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
