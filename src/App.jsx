import { useEffect, useState } from 'react';
import { data } from './data';
import './App.css';

function getSystemThemePref() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function App() {
  const [theme, setTheme] = useState(localStorage.theme || getSystemThemePref());
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  function handleThemeChange() {
    const changedTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(changedTheme);
  }

  function handleCountryChange(e) {
    setCountry(e.target.value.toLowerCase());
  }

  function handleSelectChange(e) {
    setRegion(e.target.value);
  }

  function handleCountryClick(countryData) {
    setSelectedCountry(countryData);
  }

  function handleBackClick() {
    setSelectedCountry(null);
  }

  const regions = Array.from(new Set(data.map(x => x.region)));

  return (
    <div className={`container ${theme}`}>
      <div className="header" style={{ backgroundColor: theme === 'dark' ? '#2B3844' : '#fff' }}>
        <h3>Where in the world?</h3>
        <div className="input" onClick={handleThemeChange} style={{ cursor: 'pointer' }}>
          <p style={{ color: theme === 'dark' ? '#fff' : '#000' }}></p>
          <label>
            <input
              type="checkbox"
              onChange={handleThemeChange}
              checked={theme === 'dark'}
              style={{ display: 'none' }}
            />
          </label>
          {theme === 'dark' ? (
            <img src="./public/img/dark-mode.svg"  />
          ) : (
            <img src="./public/img/light-mode.svg"  />
          )}
        </div>
      </div>

      {selectedCountry ? (
        <>
          <button className="back-btn" onClick={handleBackClick} style={
                {
                  boxShadow: theme === 'dark' ? '0px 0px 7px 0px #0000004B;' : '0px 0px 7px 0px #0000004B',
                  backgroundColor: theme === 'dark' ? '#2B3844' : '#fff',
                  color: theme === 'dark' ? '#fff' : '#111517'
                }}>
            <div className="back">
              <div className="inner">
                {theme === 'dark' ? (
                  <img src="./public/img/light-arrow.svg" alt="Back" />
                ) : (
                  <img src="./public/img/dark-arrow.svg" alt="Back" />
                )}
                Back
              </div>
            </div>
          </button>
          <CountryDetails
            flagUrl={selectedCountry.flags.png}
            name={selectedCountry.name.common}
            nativeName={selectedCountry.name.official}
            population={selectedCountry.population}
            region={selectedCountry.region}
            subregion={selectedCountry.subregion}
            capital={selectedCountry.capital}
            languages={selectedCountry.languages}
            currencies={selectedCountry.currencies}
            theme={theme}
          />
        </>
      ) : (
        <>
          <div className="filter-part">
            <input
              type="text"
              onChange={handleCountryChange}
              placeholder="search for a country"
              style={
                {
                  backgroundColor: theme === 'dark' ? '#2B3844' : '#fff',
                  color: theme === 'dark' ? '#fff' : '#C4C4C4'
                }}
            />
            <select
              onChange={handleSelectChange}
              style={
                {
                  backgroundColor: theme === 'dark' ? '#2B3844' : '#fff',
                  color: theme === 'dark' ? '#fff' : '#111517'

                }}
            >
              <option value="" style={{ backgroundColor: theme === 'dark' ? '#252945' : '#fff'}}>Filter by Region</option>
              {regions.map(x => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </div>
          <div className="cards">
            {data
              .filter(x => x.name.common.toLowerCase().includes(country) && x.region.includes(region))
              .map(x => (
                <Card
                  key={x.name.common}
                  name={x.name.common}
                  population={x.population}
                  region={x.region}
                  capital={x.capital}
                  flagUrl={x.flags.png}
                  onClick={() => handleCountryClick(x)}
                  theme={theme}
                />
              ))}
          </div>
        </>
      )}
    </div>
  );
}

function CountryDetails({ flagUrl, name, nativeName, population, region, subregion, capital, languages, currencies, theme }) {
  return (
    <div className="detail">
      <div className="flag-img">
        <img src={flagUrl} alt={name} />
      </div>
      <div className="country-detail">
        <h2 style={{ color: theme === 'dark' ? '#fff' : '#000' }}>{name}</h2>
        <p><strong>Native Name:</strong> {nativeName}</p>
        <p><strong>Population:</strong> {population}</p>
        <p><strong>Region:</strong> {region}</p>
        <p><strong>Subregion:</strong> {subregion}</p>
        <p><strong>Capital:</strong> {capital}</p>
        <p><strong>Languages:</strong> {Object.values(languages).join(', ')}</p>
        <p><strong>Currencies:</strong> {Object.values(currencies).map(currency => currency.name).join(', ')}</p>
      </div>
    </div>
  );
}

function Card({ name, population, region, capital, flagUrl, onClick, theme }) {
  capital = Array.isArray(capital) ? capital.join(', ') : capital;

  return (
    <div className="card" onClick={onClick}>
      <img src={flagUrl} className='flag' alt={name} />
      <h3>{name}</h3>
      <p><strong>Population:</strong> {population}</p>
      <p><strong>Region:</strong> {region}</p>
      <p><strong>Capital:</strong> {capital}</p>
    </div>
  );
}