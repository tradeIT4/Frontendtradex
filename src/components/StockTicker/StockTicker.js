import React, { useEffect, useState } from "react";
import "./StockTicker.css";

export default function StockTicker() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  const symbols = ["SPY", "QQQ", "DIA", "GLD", "USO"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `https://api.marketstack.com/v1/eod?access_key=${process.env.REACT_APP_MARKETSTACK_KEY}&symbols=${symbols.join(
            ","
          )}&limit=1`
        );

        const json = await res.json();

        if (!json.data) {
          setStocks([]);
          return;
        }

        // Marketstack returns multiple entries → we group by symbol
        const latestBySymbol = {};

        json.data.forEach((item) => {
          if (!latestBySymbol[item.symbol]) {
            latestBySymbol[item.symbol] = item;
          }
        });

        const formatted = Object.values(latestBySymbol).map((item) => {
          const changePct =
            item.open && item.close
              ? ((item.close - item.open) / item.open) * 100
              : 0;

          return {
            symbol: item.symbol,
            value: item.close
              ? item.close.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : "—",
            change: `${changePct >= 0 ? "+" : ""}${changePct.toFixed(2)}%`,
          };
        });

        setStocks(formatted);
      } catch (err) {
        console.error("Stock API error:", err);
        setStocks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="ticker">
      <div className="tickerTrack">
        {loading ? (
          <div className="tickerItem">Loading market data...</div>
        ) : stocks.length === 0 ? (
          <div className="tickerItem">Market data unavailable</div>
        ) : (
          [...stocks, ...stocks].map((item, i) => {
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
          })
        )}
      </div>
    </div>
  );
}
