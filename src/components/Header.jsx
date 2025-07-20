import React from 'react';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      marginBottom: '2rem'
    }}>
      <h1>{t('title')}</h1>
      <select onChange={changeLanguage} defaultValue={i18n.language}>
        <option value="en">EN</option>
        <option value="fr">FR</option>
      </select>
    </header>
  );
};

export default Header;
