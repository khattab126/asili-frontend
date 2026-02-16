import React from "react"; // Trigger Vercel Rebuild
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from "./ui_components/navbar_ui/Navbar";
import About from "./pages/About";
import Collection from "./pages/Collection";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Product from "./pages/Product";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Hero from "./ui_components/Hero/Hero";
import LatestCollection from "./ui_components/LatestCollection/LatestCollection";
import BestSellers from "./ui_components/BestSellers/BestSeller";
import OurPolicy from "./ui_components/OurPolicy/OurPolicy";
import NewsLetterBox from "./ui_components/NewsLetterBox/NewsLetterBox";
import Footer from "./ui_components/Footer/Footer";
import RelatedProduct from "./ui_components/RelatedProduct/RelatedProduct";
import SearchBar from "./ui_components/SearchBar/SearchBar";
import Verify from './pages/Verify';
import OrderConfirmation from './pages/OrderConfirmation';

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
