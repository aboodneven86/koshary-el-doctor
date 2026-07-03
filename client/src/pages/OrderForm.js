import React, { useState } from 'react';
import axios from 'axios';
import '../styles/OrderForm.css';

function OrderForm({ cart, removeFromCart, clearCart, api }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    deliveryMethod: 'استلام من المحل',
    paymentMethod: 'عند الاستلام',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone) {
      setError('الرجاء ملء جميع البيانات المطلوبة');
      return;
    }

    if (cart.length === 0) {
      setError('الرجاء اختيار منتجات قبل الطلب');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const orderData = {
        customer: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: formData.address
        },
        items: cart.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalPrice,
        deliveryMethod: formData.deliveryMethod,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes
      };

      const response = await axios.post(`${api}/orders/create`, orderData);

      setOrderNumber(response.data.order.orderNumber);
      setSubmitted(true);
      clearCart();
      setFormData({
        name: '',
        phone: '',
        email: '',
        address: '',
        deliveryMethod: 'استلام من المحل',
        paymentMethod: 'عند الاستلام',
        notes: ''
      });
    } catch (err) {
      setError('حدث خطأ في إنشاء الطلب. الرجاء المحاولة مرة أخرى.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="order-form">
        <div className="success-message">
          <div className="success-icon">✅</div>
          <h2>تم استقبال طلبك بنجاح!</h2>
          <p>رقم الطلب: <strong>{orderNumber}</strong></p>
          <p>سيتم التواصل معك قريباً لتأكيد الطلب</p>
          <div className="contact-info">
            <p>📞 يمكنك متابعة طلبك من خلال:</p>
            <p>☎️ 01016868999</p>
            <p>📲 01100443049</p>
            <p>
              <a href="https://wa.me/201208889346" target="_blank" rel="noopener noreferrer">
                💬 واتساب
              </a>
            </p>
          </div>
          <button className="new-order-btn" onClick={() => setSubmitted(false)}>
            اطلب مرة أخرى 🛒
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-form">
      <h1>🛒 نموذج الطلب</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="form-container">
        <div className="cart-section">
          <h2>📋 ملخص الطلب</h2>
          {cart.length > 0 ? (
            <>
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item._id} className="cart-item">
                    <div className="item-info">
                      <h4>{item.name}</h4>
                      <p>{item.price} ج.م × {item.quantity}</p>
                    </div>
                    <div className="item-total">
                      {item.price * item.quantity} ج.م
                      <button
                        className="remove-btn"
                        onClick={() => removeFromCart(item._id)}
                      >
                        ❌
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cart-total">
                <strong>الإجمالي: {totalPrice} ج.م</strong>
              </div>
            </>
          ) : (
            <p className="empty-cart">لم تختر أي منتجات</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="order-details">
          <h2>👤 بيانات العميل</h2>

          <div className="form-group">
            <label>الاسم *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="أدخل اسمك الكامل"
              required
            />
          </div>

          <div className="form-group">
            <label>رقم الهاتف *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="01xxxxxxxxx"
              required
            />
          </div>

          <div className="form-group">
            <label>البريد الإلكتروني</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="example@email.com"
            />
          </div>

          <div className="form-group">
            <label>العنوان</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="عنوان التوصيل"
            />
          </div>

          <div className="form-group">
            <label>طريقة التوصيل *</label>
            <select
              name="deliveryMethod"
              value={formData.deliveryMethod}
              onChange={handleInputChange}
            >
              <option value="استل��م من المحل">استلام من المحل</option>
              <option value="توصيل">توصيل</option>
            </select>
          </div>

          <div className="form-group">
            <label>طريقة الدفع *</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
            >
              <option value="عند الاستلام">عند الاستلام</option>
              <option value="تحويل بنكي">تحويل بنكي</option>
            </select>
          </div>

          <div className="form-group">
            <label>ملاحظات إضافية</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="أي ملاحظات على الطلب..."
              rows="4"
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading || cart.length === 0}>
            {loading ? 'جاري المعالجة...' : '✅ تأكيد الطلب'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default OrderForm;
