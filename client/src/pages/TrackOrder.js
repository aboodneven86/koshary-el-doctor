import React, { useState } from 'react';
import axios from 'axios';
import '../styles/TrackOrder.css';

function TrackOrder({ api }) {
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const getStatusColor = (status) => {
    const colors = {
      'جديد': '#FFA500',
      'قيد المعالجة': '#3498db',
      'جاهز للتوصيل': '#2ecc71',
      'تم التوصيل': '#27ae60',
      'ملغي': '#e74c3c'
    };
    return colors[status] || '#95a5a6';
  };

  const getStatusEmoji = (status) => {
    const emojis = {
      'جديد': '📝',
      'قيد المعالجة': '👨‍🍳',
      'جاهز للتوصيل': '🎁',
      'تم التوصيل': '✅',
      'ملغي': '❌'
    };
    return emojis[status] || '📦';
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!orderNumber.trim()) {
      setError('الرجاء إدخال رقم الطلب');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSearched(true);

      const response = await axios.get(`${api}/orders/track/${orderNumber}`);
      setOrder(response.data);
    } catch (err) {
      setError('لم يتم العثور على الطلب. الرجاء التحقق من رقم الطلب.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleNewSearch = () => {
    setOrderNumber('');
    setOrder(null);
    setError('');
    setSearched(false);
  };

  return (
    <div className="track-order">
      <div className="track-header">
        <h1>📍 تتبع الطلب</h1>
        <p>أدخل رقم طلبك للتحقق من حالته</p>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="أدخل رقم الطلب (مثال: ORD-001)"
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'جاري البحث...' : '🔍 بحث'}
          </button>
        </div>
      </form>

      {error && (
        <div className="error-message">
          {error}
          {searched && (
            <button className="retry-btn" onClick={handleNewSearch}>
              بحث جديد
            </button>
          )}
        </div>
      )}

      {order && (
        <div className="order-details">
          <div className="order-header">
            <h2>رقم الطلب: {order.orderNumber}</h2>
            <p className="order-date">التاريخ: {new Date(order.createdAt).toLocaleDateString('ar-EG')}</p>
          </div>

          <div className="customer-info">
            <h3>👤 بيانات العميل</h3>
            <p><strong>الاسم:</strong> {order.customer.name}</p>
            <p><strong>الهاتف:</strong> {order.customer.phone}</p>
            {order.customer.email && <p><strong>البريد الإلكتروني:</strong> {order.customer.email}</p>}
            {order.customer.address && <p><strong>العنوان:</strong> {order.customer.address}</p>}
          </div>

          <div className="order-status">
            <h3>📦 حالة الطلب</h3>
            <div className="status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>
              {getStatusEmoji(order.status)} {order.status}
            </div>
          </div>

          <div className="order-items">
            <h3>🍴 المنتجات</h3>
            <table className="items-table">
              <thead>
                <tr>
                  <th>المنتج</th>
                  <th>السعر</th>
                  <th>الكمية</th>
                  <th>الإجمالي</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.price} ج.م</td>
                    <td>{item.quantity}</td>
                    <td>{item.price * item.quantity} ج.م</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="order-summary">
            <p><strong>طريقة التوصيل:</strong> {order.deliveryMethod}</p>
            <p><strong>طريقة الدفع:</strong> {order.paymentMethod}</p>
            {order.notes && <p><strong>ملاحظات:</strong> {order.notes}</p>}
            <div className="total-price">
              <strong>الإجمالي: {order.totalPrice} ج.م</strong>
            </div>
          </div>

          <div className="contact-support">
            <h3>📞 هل تحتاج مساعدة؟</h3>
            <p>تواصل معنا عبر:</p>
            <div className="contact-buttons">
              <a href="tel:01016868999" className="contact-btn">
                ☎️ اتصل بنا
              </a>
              <a href="https://wa.me/201208889346" target="_blank" rel="noopener noreferrer" className="contact-btn whatsapp">
                💬 واتساب
              </a>
            </div>
          </div>

          <button className="new-search-btn" onClick={handleNewSearch}>
            بحث عن طلب آخر 🔍
          </button>
        </div>
      )}

      {searched && !order && !error && (
        <div className="no-results">
          لم يتم العثور على الطلب
        </div>
      )}

      {!searched && (
        <div className="info-section">
          <h3>💡 معلومات مهمة</h3>
          <ul>
            <li>يمكنك تتبع طلبك في الوقت الفعلي</li>
            <li>رقم الطلب يُرسل لك عند تأكيد الطلب</li>
            <li>للمزيد من المساعدة، تواصل معنا مباشرة</li>
            <li>نعمل 24 ساعة يومياً</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default TrackOrder;
