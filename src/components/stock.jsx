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

  const [openPrices, setOpenPrices] = useState({});

  useEffect(() => {
    if (localStorage.getItem('openPrices')) {
      const storedOpenPrices = JSON.parse(localStorage.getItem('openPrices'));
      setOpenPrices(storedOpenPrices);
    } else {
      fetchOpenPrices();
    }
  }, []);

  const fetchOpenPrices = async () => {
    const openPricesObj = {};

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
            } else {
              const openPrice = data['Global Quote']['02. open'];
              openPricesObj[symbol] = openPrice;
            }
          })
          .catch((error) => {
            console.log('An error occurred:', error);
          });
      });

      await Promise.all(requests);
      setOpenPrices(openPricesObj);
      localStorage.setItem('openPrices', JSON.stringify(openPricesObj));
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
        {stockData.map((stock) => {
          const { symbol, companyName } = stock;
          const openPrice = openPrices[symbol];

          return (
            <option key={symbol} value={symbol}>
              {companyName} - {openPrice}
            </option>
          );
        })}
      </select>

      {selectedStock && (
        <div>
          <h2>{stockData.find((stock) => stock.symbol === selectedStock)?.companyName}</h2>
          <p>Open Price: {openPrices[selectedStock]}</p>
        </div>
      )}
    </div>
  );
};

export default StockTable;
