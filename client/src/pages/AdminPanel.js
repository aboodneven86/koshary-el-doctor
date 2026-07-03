import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdminPanel.css';

function AdminPanel({ api }) {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  });

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    } else if (activeTab === 'products') {
      fetchProducts();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${api}/orders/all`);
      setOrders(response.data);
      setError('');
    } catch (err) {
      setError('فشل تحميل الطلبات');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${api}/products`);
      setProducts(response.data);
      setError('');
    } catch (err) {
      setError('فشل تحميل المنتجات');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`${api}/orders/${orderId}`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      setError('فشل تحديث حالة الطلب');
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData._id) {
        await axios.put(`${api}/products/${formData._id}`, formData);
      } else {
        await axios.post(`${api}/products`, formData);
      }
      setFormData({ name: '', description: '', price: '', category: '' });
      fetchProducts();
    } catch (err) {
      setError('فشل حفظ المنتج');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('هل تريد حذف هذا المنتج؟')) {
      try {
        await axios.delete(`${api}/products/${productId}`);
        fetchProducts();
      } catch (err) {
        setError('فشل حذف المنتج');
      }
    }
  };

  const handleEditProduct = (product) => {
    setFormData(product);
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>⚙️ لوحة التحكم الإدارية</h1>
        <p>إدارة الطلبات والمنتجات</p>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          📦 الطلبات
        </button>
        <button
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          🍴 المنتجات
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {activeTab === 'orders' && (
        <div className="orders-section">
          <h2>📋 قائمة الطلبات</h2>
          {loading ? (
            <p className="loading">جاري التحميل...</p>
          ) : orders.length > 0 ? (
            <div className="orders-table-container">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>رقم الطلب</th>
                    <th>العميل</th>
                    <th>الهاتف</th>
                    <th>الإجمالي</th>
                    <th>الحالة</th>
                    <th>التاريخ</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id}>
                      <td>{order.orderNumber}</td>
                      <td>{order.customer.name}</td>
                      <td>{order.customer.phone}</td>
                      <td>{order.totalPrice} ج.م</td>
                      <td>
                        <select
                          value={order.status}
                          onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                          className="status-select"
                        >
                          <option value="جديد">جديد</option>
                          <option value="قيد المعالجة">قيد المعالجة</option>
                          <option value="جاهز للتوصيل">جاهز للتوصيل</option>
                          <option value="تم التوصيل">تم التوصيل</option>
                          <option value="ملغي">ملغي</option>
                        </select>
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString('ar-EG')}</td>
                      <td>
                        <button
                          className="details-btn"
                          onClick={() => setSelectedOrder(selectedOrder?._ === order._id ? null : order)}
                        >
                          {selectedOrder?._ === order._id ? 'إغلاق' : 'التفاصيل'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-data">لا توجد طلبات</p>
          )}

          {selectedOrder && (
            <div className="order-details-modal">
              <div className="modal-content">
                <h3>تفاصيل الطلب: {selectedOrder.orderNumber}</h3>
                <div className="modal-body">
                  <h4>بيانات العميل:</h4>
                  <p><strong>الاسم:</strong> {selectedOrder.customer.name}</p>
                  <p><strong>الهاتف:</strong> {selectedOrder.customer.phone}</p>
                  <p><strong>البريد الإلكتروني:</strong> {selectedOrder.customer.email || 'غير متوفر'}</p>
                  <p><strong>العنوان:</strong> {selectedOrder.customer.address || 'غير متوفر'}</p>

                  <h4>المنتجات:</h4>
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
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.name}</td>
                          <td>{item.price} ج.م</td>
                          <td>{item.quantity}</td>
                          <td>{item.price * item.quantity} ج.م</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <h4>معلومات الطلب:</h4>
                  <p><strong>طريقة التوصيل:</strong> {selectedOrder.deliveryMethod}</p>
                  <p><strong>طريقة الدفع:</strong> {selectedOrder.paymentMethod}</p>
                  <p><strong>الملاحظات:</strong> {selectedOrder.notes || 'لا توجد ملاحظات'}</p>
                </div>
                <button className="close-btn" onClick={() => setSelectedOrder(null)}>إغلاق</button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'products' && (
        <div className="products-section">
          <div className="products-container">
            <div className="add-product-form">
              <h2>➕ إضافة / تعديل منتج</h2>
              <form onSubmit={handleProductSubmit}>
                <div className="form-group">
                  <label>اسم المنتج</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>الوصف</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>السعر</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>الفئة</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>

                <button type="submit" className="submit-btn">
                  {formData._id ? '✏️ تحديث' : '➕ إضافة'}
                </button>
              </form>
            </div>

            <div className="products-list">
              <h2>📜 قائمة المنتجات</h2>
              {loading ? (
                <p className="loading">جاري التحميل...</p>
              ) : products.length > 0 ? (
                <div className="products-grid">
                  {products.map(product => (
                    <div key={product._id} className="product-card">
                      <h3>{product.name}</h3>
                      <p className="description">{product.description}</p>
                      <p className="price">{product.price} ج.م</p>
                      <p className="category">{product.category}</p>
                      <div className="product-actions">
                        <button
                          className="edit-btn"
                          onClick={() => handleEditProduct(product)}
                        >
                          ✏️ تعديل
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteProduct(product._id)}
                        >
                          🗑️ حذف
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-data">لا توجد منتجات</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
