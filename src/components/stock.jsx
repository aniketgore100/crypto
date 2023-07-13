import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './stock.css';

const StockTable = () => {
  const API_KEY = 'YEIMUP7M7FLPYY5M';
  const stockData = [
    { symbol: 'RELIANCE.BSE', companyName: 'Reliance' },
    { symbol: 'GOOGL', companyName: 'Alphabet Inc.' },
    { symbol: 'AAPL', companyName: 'Apple Inc.' },
    { symbol: 'MSFT', companyName: 'Microsoft Corporation' },
  ];

  const [stockPrices, setStockPrices] = useState([]);

  useEffect(() => {
    if (localStorage.getItem('stockPrices')) {
      const storedStockPrices = JSON.parse(localStorage.getItem('stockPrices'));
      setStockPrices(storedStockPrices);
    } else {
      fetchStockPrices();
    }
  }, []);

  const fetchStockPrices = async () => {
    try {
      const requests = stockData.map((stock) => {
        const { symbol } = stock;
        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;

        return axios
          .get(url)
          .then((response) => {
            const data = response.data;
            if ('Error Message' in data) {
              console.log('Error:', data['Error Message']);
              return null;
            } else {
              const stockPrice = {
                symbol: symbol,
                companyName: stock.companyName,
                openPrice: data['Global Quote']['02. open'],
                currentPrice: data['Global Quote']['05. price']
              };
              return stockPrice;
            }
          })
          .catch((error) => {
            console.log('An error occurred:', error);
            return null;
          });
      });

      const resolvedRequests = await Promise.all(requests);
      const validStockPrices = resolvedRequests.filter(stock => stock !== null);
      setStockPrices(validStockPrices);
      localStorage.setItem('stockPrices', JSON.stringify(validStockPrices));
    } catch (error) {
      console.log('An error occurred:', error);
    }
  };

  const [selectedStock, setSelectedStock] = useState('');
  const handleStockSelect = (event) => {
    setSelectedStock(event.target.value);
  };

  return (
    <div>
      <select id="stock-select" onChange={handleStockSelect}>
        <option value="">Select a Stock</option>
        {stockPrices.map((stock) => {
          const { symbol, companyName, currentPrice } = stock;

          return (
            <option key={symbol} value={symbol}>
              {companyName} - {currentPrice}
            </option>
          );
        })}
      </select>

      {selectedStock && (
        <div>
          <h2>{stockPrices.find((stock) => stock.symbol === selectedStock)?.companyName}</h2>
          <p>Open Price: {stockPrices.find((stock) => stock.symbol === selectedStock)?.openPrice}</p>
          <p>Current Price: {stockPrices.find((stock) => stock.symbol === selectedStock)?.currentPrice}</p>
        </div>
      )}
    </div>
  );
};

export default StockTable;
