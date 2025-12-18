import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useCart } from '../hooks/useCart';

const PageLayout: React.FC = () => {
    const cart = useCart();
    const navigate = useNavigate();

    const handleCartClick = () => {
        navigate('/?view=cart');
    };

    const handleMenuClick = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-white font-inter flex flex-col">
            <Header
                cartItemsCount={cart.getTotalItems()}
                onCartClick={handleCartClick}
                onMenuClick={handleMenuClick}
            />

            <main className="flex-grow">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

export default PageLayout;
