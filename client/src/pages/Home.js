import React from 'react';
import '../styles/Home.css';

function Home() {
  return (
    <div className="home">
      <div className="hero">
        <div className="hero-content">
          <h1>🍽️ أهلاً وسهلاً في كشري الدكتور</h1>
          <p>أطعم وألذ كشري في مدينة الشروق</p>
          <div className="hero-features">
            <div className="feature">
              <span className="icon">⚡</span>
              <h3>سرعة التوصيل</h3>
              <p>نوصل طلبك في أسرع وقت</p>
            </div>
            <div className="feature">
              <span className="icon">😋</span>
              <h3>جودة عالية</h3>
              <p>أفضل المكونات والطعم اللذيذ</p>
            </div>
            <div className="feature">
              <span className="icon">💰</span>
              <h3>أسعار مناسبة</h3>
              <p>أفضل قيمة مقابل السعر</p>
            </div>
            <div className="feature">
              <span className="icon">📞</span>
              <h3>خدمة عملاء</h3>
              <p>متوفرة 24 ساعة</p>
            </div>
          </div>
        </div>
      </div>

      <section className="info-section">
        <div className="info-card">
          <h2>📍 أين نحن؟</h2>
          <p>المتميز - خلف بريد مدينة الشروق</p>
          <p>مدينة الشروق - محافظة القاهرة</p>
        </div>

        <div className="info-card">
          <h2>⏰ ساعات العمل</h2>
          <p>مفتوح 24 ساعة يومياً</p>
          <p>جميع أيام الأسبوع بدون استثناء</p>
        </div>

        <div className="info-card">
          <h2>📞 تواصل معنا</h2>
          <p>☎️ 01016868999</p>
          <p>📲 01100443049</p>
          <p>💬 <a href="https://wa.me/201208889346">واتساب</a></p>
        </div>
      </section>

      <section className="menu-preview">
        <h2>🍴 من قائمتنا المميزة</h2>
        <div className="menu-items-preview">
          <div className="menu-preview-item">
            <span>🍲</span>
            <h3>كشري عادي</h3>
            <p>الكشري التقليدي بنكهة تميز</p>
          </div>
          <div className="menu-preview-item">
            <span>🥩</span>
            <h3>كشري شيش</h3>
            <p>كشري مع لحم شيش لذيذ</p>
          </div>
          <div className="menu-preview-item">
            <span>🍖</span>
            <h3>كشري دجاج</h3>
            <p>كشري مع دجاج مشوي طازة</p>
          </div>
          <div className="menu-preview-item">
            <span>🥘</span>
            <h3>طاجن</h3>
            <p>طاجن لحم بصلصة خاصة</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>هل أنت جائع؟ 😋</h2>
        <p>اطلب الآن من خلال تطبيقنا واستمتع بأفضل كشري في الشروق</p>
        <button className="cta-button">ابدأ الطلب الآن 🛒</button>
      </section>

      <section className="testimonials">
        <h2>⭐ تقييمات عملائنا</h2>
        <div className="testimonials-container">
          <div className="testimonial">
            <p className="stars">⭐⭐⭐⭐⭐</p>
            <p>"أفضل كشري في الشروق! الطعم رائع والتوصيل سريع جداً"</p>
            <p className="author">- أحمد محمد</p>
          </div>
          <div className="testimonial">
            <p className="stars">⭐⭐⭐⭐⭐</p>
            <p>"الجودة عالية والسعر مناسب جداً، سأطلب مرة أخرى"</p>
            <p className="author">- فاطمة علي</p>
          </div>
          <div className="testimonial">
            <p className="stars">⭐⭐⭐⭐⭐</p>
            <p>"خدمة ممتازة والطعم اللذيذ أعطاني رغبة في الطلب المرة الثانية"</p>
            <p className="author">- محمود حسن</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
