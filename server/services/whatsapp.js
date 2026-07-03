const axios = require('axios');

const SHOP_PHONE = process.env.SHOP_PHONE || '201208889346';

const statusMessages = {
  'جديد': '📋 تم استقبال طلبك بنجاح!',
  'قيد الإعداد': '👨‍🍳 الطلب قيد الإعداد الآن...',
  'جاهز': '✅ طلبك جاهز للاستلام!',
  'قيد التوصيل': '🚚 الطلب في الطريق إليك',
  'تم التسليم': '🎉 تم استلام طلبك بنجاح!',
  'ملغي': '❌ تم إلغاء الطلب'
};

const sendWhatsAppMessage = async (order, isUpdate = false) => {
  try {
    const message = formatOrderMessage(order, isUpdate);
    
    console.log('📱 WhatsApp Message:');
    console.log(message);
    
    // سيتم تفعيل الـ Twilio API لاحقاً
    
    return true;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return false;
  }
};

const formatOrderMessage = (order, isUpdate = false) => {
  let message = '';
  
  if (isUpdate) {
    message += `${statusMessages[order.status]}\\n\\n`;
    message += `📌 رقم الطلب: ${order.orderNumber}\\n`;
  } else {
    message += `🎉 شكراً لطلبك من كشري الدكتور!\\n\\n`;
    message += `📌 رقم الطلب: ${order.orderNumber}\\n`;
    message += `👤 اسم العميل: ${order.customer.name}\\n`;
    message += `📱 الهاتف: ${order.customer.phone}\\n\\n`;
    message += `🍽️ تفاصيل الطلب:\\n`;
    
    order.items.forEach((item, index) => {
      message += `${index + 1}. ${item.name} x${item.quantity} - ${item.price * item.quantity} ج.م\\n`;
    });
    
    message += `\\n💰 الإجمالي: ${order.totalPrice} ج.م\\n`;
    message += `🚚 نوع التوصيل: ${order.deliveryMethod}\\n`;
  }
  
  message += `\\n⏱️ الحالة: ${order.status}\\n`;
  message += `\\n---\\nكشري الدكتور 🍴`;
  message += `\\n24 ساعة | المتميز - خلف بريد الشروق`;
  message += `\\n01016868999 | 01100443049`;
  
  return message;
};

module.exports = { sendWhatsAppMessage };
