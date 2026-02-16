import React from "react"; // Trigger Vercel Rebuild
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from "./ui_components/navbar_ui/Navbar";
import About from "./Pages/About";
import Collection from "./Pages/Collection";
import Home from "./Pages/Home";
import Contact from "./Pages/Contact";
import Cart from "./Pages/Cart";
import Product from "./Pages/Product";
import Login from "./Pages/Login";
import PlaceOrder from "./Pages/PlaceOrder";
import Orders from "./Pages/Orders";
import Profile from "./Pages/Profile";
import Hero from "./ui_components/Hero/Hero";
import LatestCollection from "./ui_components/LatestCollection/LatestCollection";
import BestSellers from "./ui_components/BestSellers/BestSeller";
import OurPolicy from "./ui_components/OurPolicy/OurPolicy";
import NewsLetterBox from "./ui_components/NewsLetterBox/NewsLetterBox";
import Footer from "./ui_components/Footer/Footer";
import RelatedProduct from "./ui_components/RelatedProduct/RelatedProduct";
import SearchBar from "./ui_components/SearchBar/SearchBar";
import Verify from './Pages/Verify';
import OrderConfirmation from './Pages/OrderConfirmation';

const App = () => {
  return (
    <div className="App">
      <Navbar />
      <SearchBar />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <LatestCollection />
              <BestSellers />
              <OurPolicy />
              <NewsLetterBox />
              <Footer />
            </>
          }
        />

        <Route
          path="/collection"
          element={
            <>
              <Collection />
              <Footer />
            </>
          }
        />

        <Route
          path="/about"
          element={
            <>
              <About />
              <NewsLetterBox />
              <Footer />
            </>
          }
        />

        <Route
          path="/contact"
          element={
            <>
              <Contact />
              <NewsLetterBox />
              <Footer />
            </>
          }
        />

        <Route
          path="/product/:productId"
          element={
            <>
              <Product />
            </>
          }
        />

        <Route
          path="/orders"
          element={
            <>
              <Orders />
              <Footer />
            </>
          }
        />

        <Route path="/cart" element={<Cart />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/placeorder" element={<PlaceOrder />} />
        <Route path="/verify" element={<Verify />} />
        <Route
          path="/profile"
          element={
            <>
              <Profile />
              <Footer />
            </>
          }
        />
        <Route
          path="/order-confirmation"
          element={
            <>
              <OrderConfirmation />
              <Footer />
            </>
          }
        />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        theme="colored"
      />
    </div>
  );
};

export default App;
