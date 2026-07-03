import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Home from './pages/Home';
import Menu from './pages/Menu';
import OrderForm from './pages/OrderForm';
import TrackOrder from './pages/TrackOrder';
import AdminPanel from './pages/AdminPanel';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Add item to cart
  const addToCart = (item) => {
    const existingItem = cart.find(c => c._id === item._id);
    if (existingItem) {
      setCart(cart.map(c =>
        c._id === item._id ? { ...c, quantity: c.quantity + 1 } : c
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCart(cart.filter(c => c._id !== itemId));
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_BASE}/orders/all`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchOrders();
    }
  }, [isAdmin]);

  return (
    <div className="App">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <h1>🍽️ كشري الدكتور</h1>
            <p>أطعم وألذ كشري في الشروق</p>
          </div>
          <nav className="nav">
            <button 
              className={currentPage === 'home' ? 'active' : ''} 
              onClick={() => setCurrentPage('home')}
            >
              🏠 الرئيسية
            </button>
            <button 
              className={currentPage === 'menu' ? 'active' : ''} 
              onClick={() => setCurrentPage('menu')}
            >
              📋 القائمة ({cart.length})
            </button>
            <button 
              className={currentPage === 'order' ? 'active' : ''} 
              onClick={() => setCurrentPage('order')}
            >
              🛒 اطلب الآن
            </button>
            <button 
              className={currentPage === 'track' ? 'active' : ''} 
              onClick={() => setCurrentPage('track')}
            >
              📍 تتبع الطلب
            </button>
            <button 
              className={isAdmin ? 'admin-active' : ''} 
              onClick={() => setIsAdmin(!isAdmin)}
            >
              ⚙️ {isAdmin ? 'خروج من الإدارة' : 'إدارة'}
            </button>
          </nav>
        </div>
      </header>

      <main className="main-content">
        {currentPage === 'home' && <Home />}
        {currentPage === 'menu' && <Menu cart={cart} addToCart={addToCart} />}
        {currentPage === 'order' && (
          <OrderForm 
            cart={cart} 
            removeFromCart={removeFromCart}
            clearCart={clearCart}
            api={API_BASE}
          />
        )}
        {currentPage === 'track' && <TrackOrder api={API_BASE} />}
        {isAdmin && currentPage === 'home' && (
          <AdminPanel orders={orders} api={API_BASE} />
        )}
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>📍 عنواننا</h3>
            <p>المتميز - خلف بريد مدينة الشروق</p>
          </div>
          <div className="footer-section">
            <h3>📞 تواصل معنا</h3>
            <p>01016868999 | 01100443049 | 01204304343</p>
            <p>
              <a href="https://wa.me/201208889346" target="_blank" rel="noopener noreferrer">
                💬 واتساب: اضغط هنا
              </a>
            </p>
          </div>
          <div className="footer-section">
            <h3>⏰ ساعات العمل</h3>
            <p>24 ساعة يومياً</p>
            <p>نعمل في جميع أيام الأسبوع</p>
          </div>
          <div className="footer-section">
            <h3>📱 تابعنا</h3>
            <p>
              <a href="https://www.facebook.com/kosharyaldoctor" target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 كشري الدكتور - جميع الحقوق محفوظة ❤️</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
