import React, { useContext } from 'react';
import './SearchBar.css';
import { ShopContext } from '../../context/ShopContext';
import { assets } from '../../assets/assets';

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);

  if (!showSearch) return null;

  return (
    <div className="search-bar-wrapper">
      <div className="search-box">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
          type="text"
          placeholder="Search"
        />
        <img className="search-icon" src={assets.search_icon} alt="search" />
      </div>
      <img
        onClick={() => setShowSearch(false)}
        className="close-icon"
        src={assets.cross_icon}
        alt="close"
      />
    </div>
  );
};

export default SearchBar;