import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../../context/ShopContext'
import './CartTotal.css'
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CartTotal = () => {
    const {currency, delivery, getCartAmount, token, backendUrl} = useContext(ShopContext);
    const [discountCode, setDiscountCode] = useState('');
    const [discount, setDiscount] = useState(null);
    const [discountError, setDiscountError] = useState('');

    // Load discount from localStorage on component mount
    useEffect(() => {
        const savedDiscount = localStorage.getItem('cartDiscount');
        if (savedDiscount) {
            try {
                const parsedDiscount = JSON.parse(savedDiscount);
                setDiscount(parsedDiscount);
                setDiscountCode(parsedDiscount.code);
            } catch (error) {
                console.error('Error loading discount from localStorage:', error);
                localStorage.removeItem('cartDiscount');
            }
        }
    }, []);

    const handleApplyDiscount = async () => {
        try {
            setDiscountError('');
            const response = await axios.post(
                `${backendUrl}/api/discount/validate`,
                { code: discountCode },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                const newDiscount = response.data.discount;
                setDiscount(newDiscount);
                // Store discount in localStorage
                localStorage.setItem('cartDiscount', JSON.stringify(newDiscount));
                toast.success('Discount code applied successfully!');
            }
        } catch (error) {
            setDiscount(null);
            setDiscountCode('');
            setDiscountError(error.response?.data?.message || 'Invalid discount code');
            toast.error(error.response?.data?.message || 'Invalid discount code');
        }
    };

    const handleRemoveDiscount = () => {
        setDiscount(null);
        setDiscountCode('');
        setDiscountError('');
        // Remove discount from localStorage
        localStorage.removeItem('cartDiscount');
    };

    const calculateTotal = () => {
        const subtotal = getCartAmount();
        if (discount) {
            const discountAmount = (subtotal * discount.percentage) / 100;
            return subtotal - discountAmount + delivery;
        }
        return subtotal + delivery;
    };

    return (
        <div className='carttotal_content'>
            <div className='carttotal_title'>
                <h2>TOTALS</h2>
            </div>

            <div className='carttotal_info'>
                <div className='cart_subtotal'>
                    <p>Subtotal</p>
                    <p>{currency} {getCartAmount()}.00</p>
                </div>
                <hr />
                <div className='cart_shippingfee'>
                    <p>Shipping Fee</p>
                    <p>{currency}{delivery}</p>
                </div>
                {discount && (
                    <>
                        <hr />
                        <div className='cart_discount'>
                            <p>Discount ({discount.percentage}% off)</p>
                            <p>-{currency} {((getCartAmount() * discount.percentage) / 100).toFixed(2)}</p>
                        </div>
                    </>
                )}
                <hr />
                <div className='carttotal_price'>
                    <b>Total</b>
                    <b>{currency}{calculateTotal().toFixed(2)}</b>
                </div>
            </div>

            <div className="discount-section">
                <h3>Have a discount code?</h3>
                <div className="discount-input">
                    <input
                        type="text"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                        placeholder="Enter discount code"
                    />
                    {discount ? (
                        <button onClick={handleRemoveDiscount} className="remove-discount-btn">
                            Remove
                        </button>
                    ) : (
                        <button onClick={handleApplyDiscount}>Apply</button>
                    )}
                </div>
                {discountError && <p className="error-message">{discountError}</p>}
            </div>
        </div>
    )
}

export default CartTotal