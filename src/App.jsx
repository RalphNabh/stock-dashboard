import React from 'react';
import Header from './components/Header';
import ChartContainer from './components/ChartContainer';
import './index.css';
import { useTranslation } from 'react-i18next';


function App() {
    const { t } = useTranslation();
  return (
    <div className="container">
      <Header />
      <p className="intro">
        {t('description')}
      </p>

      <ChartContainer />
    </div>
  );
}

export default App;
