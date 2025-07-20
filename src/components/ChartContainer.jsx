import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

const API_KEY = "d1ui20hr01qpci1cna7gd1ui20hr01qpci1cna80";
const companies = ["AAPL", "MSFT", "GOOGL", "AMZN", "META"];
const companyNames = ["Apple", "Microsoft", "Google", "Amazon", "Meta"];

const ChartContainer = () => {
  const { t } = useTranslation();
  const [livePrices, setLivePrices] = useState([]);
  const [percentChanges, setPercentChanges] = useState([]);
  const [lastUpdated, setLastUpdated] = useState('');
  const [selectedCompany, setSelectedCompany] = useState("Apple");

  const fetchPrices = async () => {
    try {
      const responses = await Promise.all(
        companies.map(symbol =>
          fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`)
            .then(res => res.json())
        )
      );

      const prices = responses.map(data => data.c);
      const changes = responses.map(data => data.dp);

      setLivePrices(prices);
      setPercentChanges(changes);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Error fetching stock data:", err);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const barData = {
    labels: companyNames,
    datasets: [{
      label: t('barChartTitle'),
      data: livePrices.length > 0 ? livePrices : [0, 0, 0, 0, 0],
      backgroundColor: livePrices.map(price => price >= 200 ? '#00ff88' : '#ff4444')
    }]
  };

  const monthlyData = {
    Apple: [170, 175, 180, 182, 185, 189],
    Microsoft: [200, 203, 208, 210, 211, 212],
    Google: [120, 123, 126, 128, 130, 131],
    Amazon: [110, 112, 116, 120, 123, 124],
    Meta: [290, 295, 300, 305, 306, 307]
  };

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  const lineData = {
    labels: months,
    datasets: [{
      label: t('lineChartTitle'),
      data: monthlyData[selectedCompany],
      borderColor: '#00aaff',
      backgroundColor: 'rgba(0, 170, 255, 0.2)',
      tension: 0.4,
      fill: true
    }]
  };

  return (
    <div>
      <div className="chart-box">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={fetchPrices} style={{ backgroundColor: '#222', color: '#fff', border: '1px solid #555', padding: '0.5rem', borderRadius: '5px' }}>
             {t('refresh')}
          </button>
          <span style={{ fontSize: '0.9rem', color: '#ccc' }}>
            {t('lastUpdated')}: {lastUpdated || '—'}
          </span>
        </div>

        <Bar data={barData} options={{
          responsive: true,
          plugins: {
            legend: { labels: { color: 'white' } }
          },
          scales: {
            x: { ticks: { color: 'white' } },
            y: { ticks: { color: 'white' } }
          }
        }} />

        <ul style={{ listStyle: 'none', paddingLeft: 0, marginTop: '1rem', textAlign: 'center' }}>
          {companyNames.map((name, i) => (
            <li key={name} style={{ marginBottom: '0.3rem' }}>
              <strong>{name}:</strong> {livePrices[i] ? `$${livePrices[i].toFixed(2)}` : '—'}
              {' '}
              <span style={{ color: percentChanges[i] >= 0 ? '#00ff88' : '#ff4444' }}>
                ({percentChanges[i]?.toFixed(2)}%)
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="chart-box">
        <label htmlFor="company-select">{t('selectCompany')}: </label>
        <select
          id="company-select"
          value={selectedCompany}
          onChange={e => setSelectedCompany(e.target.value)}
        >
          {companyNames.map((company) => (
            <option key={company} value={company}>{t(company.toLowerCase())}</option>
          ))}
        </select>

        <Line data={lineData} options={{
          responsive: true,
          plugins: {
            legend: { labels: { color: 'white' } }
          },
          scales: {
            x: { ticks: { color: 'white' } },
            y: { ticks: { color: 'white' } }
          }
        }} />
      </div>
    </div>
  );
};

export default ChartContainer;
