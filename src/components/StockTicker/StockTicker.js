import React from "react";
import "./StockTicker.css";

const stocks = [
  { symbol: "S&P 500", value: "5,128.42", change: "+0.62%" },
  { symbol: "NASDAQ", value: "16,084.12", change: "+0.88%" },
  { symbol: "DOW", value: "38,211.03", change: "-0.21%" },
  { symbol: "FTSE 100", value: "7,682.14", change: "+0.34%" },
  { symbol: "DAX", value: "17,103.56", change: "+0.51%" },
  { symbol: "NIKKEI", value: "36,220.21", change: "-0.47%" },
  { symbol: "USD/ETB", value: "57.32", change: "+0.12%" },
  { symbol: "GOLD", value: "2,031.40", change: "+0.18%" },
  { symbol: "OIL (WTI)", value: "78.14", change: "-0.66%" },
];

export default function StockTicker() {
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
