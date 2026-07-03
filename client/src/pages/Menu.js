import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Menu.css';

function Menu({ cart, addToCart }) {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('كشري');
  const [loading, setLoading] = useState(true);

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const categories = ['كشري', 'شيش', 'طاجن', 'دواجن', 'صلصات', 'مشروبات'];

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/menu/all`);
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = menuItems.filter(item => item.category === selectedCategory);

  const getCategoryEmoji = (category) => {
    const emojis = {
      'كشري': '🍲',
      'شيش': '🥩',
      'طاجن': '🥘',
      'دواجن': '🍖',
      'صلصات': '🍯',
      'مشروبات': '🥤'
    };
    return emojis[category] || '🍴';
  };

  return (
    <div className="menu">
      <div className="menu-header">
        <h1>📋 قائمة الطعام</h1>
        <p>اختر من أفضل الأطباق</p>
      </div>

      <div className="categories">
        {categories.map(category => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {getCategoryEmoji(category)} {category}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">جاري التحميل...</div>
      ) : (
        <div className="menu-items">
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <div key={item._id} className="menu-item">
                <div className="item-image">
                  {item.image ? (
                    <img src={item.image} alt={item.name} />
                  ) : (
                    <div className="placeholder">{getCategoryEmoji(item.category)}</div>
                  )}
                </div>
                <div className="item-details">
                  <h3>{item.name}</h3>
                  {item.description && <p className="description">{item.description}</p>}
                  <div className="item-footer">
                    <span className="price">{item.price} ج.م</span>
                    {item.available ? (
                      <button
                        className="add-btn"
                        onClick={() => addToCart(item)}
                      >
                        ➕ أضف للسلة
                      </button>
                    ) : (
                      <button className="unavailable-btn" disabled>
                        غير متاح
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-items">لا توجد منتجات في هذه الفئة</div>
          )}
        </div>
      )}

      {cart.length > 0 && (
        <div className="cart-summary">
          <p>لديك {cart.length} عنصر في السلة</p>
          <p>الإجمالي: {cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)} ج.م</p>
        </div>
      )}
    </div>
  );
}

export default Menu;
