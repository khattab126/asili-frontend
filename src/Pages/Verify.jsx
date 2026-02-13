import React from 'react'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import { toast } from 'react-toastify'
import axios from 'axios'

const Verify = () => {
  const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext)
  const [searchParams] = useSearchParams()

  const success = searchParams.get('success')
  const orderId = searchParams.get('orderId')

  const verifyPayment = async () => {
    try {
      if (!token) {
        return null
      }

      // Determine which payment gateway to verify based on the URL
      const path = window.location.pathname;
      let verifyEndpoint = '/verifyStripe';
      
      if (path.includes('fawry')) {
        verifyEndpoint = '/verifyFawry';
      } else if (path.includes('paymob')) {
        verifyEndpoint = '/verifyPaymob';
      }

      const response = await axios.post(
        backendUrl + '/api/order' + verifyEndpoint,
        { success, orderId },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.data.success) {
        setCartItems({})
        navigate('/orders')
      } else {
        navigate('/cart')
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    verifyPayment()
  }, [token])

  return (
    <div>
      <h2>Verifying your payment...</h2>
    </div>
  )
}

export default Verify 