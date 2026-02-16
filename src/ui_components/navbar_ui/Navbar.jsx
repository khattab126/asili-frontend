import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';
import logo from "../../assets/logo.png";
import search_icon from "../../assets/search_icon.png";
import profile_icon from "../../assets/profile_icon.png";
import cart_icon from "../../assets/cart_icon.png";
import "./Navbar.css";
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const { setShowSearch, token, settoken, setCartItems, cartItems } = useContext(ShopContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);

  const handleCart = () => navigate("/Cart");

  const logout = () => {
    localStorage.removeItem("token");
    settoken('');
    setCartItems({});
    setShowDropdown(false);
    navigate("/login");
  };

  const getCartCount = () => {
    let count = 0;
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        count += cartItems[itemId][size];
      }
    }
    return count;
  };

  // Close dropdown and mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside mobile menu and not on the menu button
      if (isMobileMenuOpen && 
          mobileMenuRef.current && 
          !mobileMenuRef.current.contains(event.target) && 
          !mobileMenuButtonRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
      
      // Check if click is outside profile dropdown
      if (showDropdown && 
          dropdownRef.current && 
          !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside); // For touch devices
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMobileMenuOpen, showDropdown]);

  return (
    <div className="Navbar">
      <div className="Navbar-container">
        {/* Left: Logo */}
        <div className="navbar-left">
          <Link to="/" onClick={() => setShowSearch(false)}>
            <img src={logo} alt="Logo" className="logo" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          ref={mobileMenuButtonRef}
          className={`mobile-menu-button${isMobileMenuOpen ? ' open' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="hamburger"></span>
        </button>

        {/* Center: Navigation Links */}
        <div className={`navbar-center ${isMobileMenuOpen ? 'mobile-open' : ''}`} ref={mobileMenuRef}>
          <ul>
            <li><NavLink to="/" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={() => {setShowSearch(false); setIsMobileMenuOpen(false);}}>HOME</NavLink></li>
            <li><NavLink to="/collection" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={() => {setShowSearch(false); setIsMobileMenuOpen(false);}}>COLLECTION</NavLink></li>
            <li><NavLink to="/about" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={() => {setShowSearch(false); setIsMobileMenuOpen(false);}}>ABOUT</NavLink></li>
            <li><NavLink to="/contact" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={() => {setShowSearch(false); setIsMobileMenuOpen(false);}}>CONTACT</NavLink></li>
            {/* <li><button className="admin-btn">Admin Panel</button></li> */}
          </ul>
        </div>

        {/* Right: Search, Profile Dropdown, Cart */}
        <div className="navbar-right">
          <img
            src={search_icon}
            alt="Search"
            onClick={() => {
              setShowSearch(true);     
              navigate("/collection");  
            }}
            style={{ cursor: 'pointer' }}
          />
          
          <div className="profile-dropdown" ref={dropdownRef}>
            <img
              src={profile_icon}
              alt="Profile"
              onClick={() => {
                if (!token) {
                  navigate("/login");
                } else {
                  setShowDropdown(prev => !prev);
                }
              }}
              style={{ cursor: 'pointer' }}
            />

            { showDropdown && (
              <div className={`dropdown-menu${showDropdown ? ' show' : ''}`}>
                <Link to="/profile" onClick={() => setShowDropdown(false)}>Profile</Link>
                <Link to="/orders" onClick={() => setShowDropdown(false)}>Orders</Link>
                <Link to="/login" onClick={() => {setShowDropdown(false); logout();}}>Logout</Link>
              </div>
            )}
          </div>

          <div className="char-icon" onClick={handleCart}>
            <img src={cart_icon} alt="Cart" />
            <span className="cart-count">{getCartCount()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;