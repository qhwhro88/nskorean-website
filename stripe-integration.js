/**
 * NSKOREAN Stripe 支付集成模块
 * 处理订阅、支付和账单管理
 */

class StripePayment {
  constructor(publishableKey) {
    this.stripe = Stripe(publishableKey);
    this.elements = null;
    this.cardElement = null;
  }

  /**
   * 初始化支付表单
   */
  initPaymentForm(elementId) {
    this.elements = this.stripe.elements();
    this.cardElement = this.elements.create('card');
    this.cardElement.mount(`#${elementId}`);

    // 处理实时验证错误
    this.cardElement.on('change', (event) => {
      const displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
        displayError.style.display = 'block';
      } else {
        displayError.textContent = '';
        displayError.style.display = 'none';
      }
    });
  }

  /**
   * 创建支付意图
   */
  async createPaymentIntent(amount, currency = 'usd', metadata = {}) {
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // 转换为分
          currency,
          metadata
        })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('创建支付意图失败:', error);
      throw error;
    }
  }

  /**
   * 处理支付
   */
  async processPayment(clientSecret, billingDetails) {
    try {
      const result = await this.stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: this.cardElement,
          billing_details: billingDetails
        }
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      return result.paymentIntent;
    } catch (error) {
      console.error('支付处理失败:', error);
      throw error;
    }
  }

  /**
   * 创建订阅
   */
  async createSubscription(priceId, customerId, paymentMethodId) {
    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          customerId,
          paymentMethodId
        })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('创建订阅失败:', error);
      throw error;
    }
  }

  /**
   * 取消订阅
   */
  async cancelSubscription(subscriptionId) {
    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('取消订阅失败:', error);
      throw error;
    }
  }

  /**
   * 更新订阅计划
   */
  async updateSubscription(subscriptionId, newPriceId) {
    try {
      const response = await fetch('/api/update-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId,
          newPriceId
        })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('更新订阅失败:', error);
      throw error;
    }
  }

  /**
   * 获取发票列表
   */
  async getInvoices(customerId) {
    try {
      const response = await fetch(`/api/invoices?customerId=${customerId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('获取发票失败:', error);
      throw error;
    }
  }

  /**
   * 获取支付方法列表
   */
  async getPaymentMethods(customerId) {
    try {
      const response = await fetch(`/api/payment-methods?customerId=${customerId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('获取支付方法失败:', error);
      throw error;
    }
  }

  /**
   * 添加支付方法
   */
  async addPaymentMethod(customerId, paymentMethodId) {
    try {
      const response = await fetch('/api/add-payment-method', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          paymentMethodId
        })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('添加支付方法失败:', error);
      throw error;
    }
  }

  /**
   * 删除支付方法
   */
  async removePaymentMethod(paymentMethodId) {
    try {
      const response = await fetch('/api/remove-payment-method', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentMethodId })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('删除支付方法失败:', error);
      throw error;
    }
  }

  /**
   * 获取订阅状态
   */
  async getSubscriptionStatus(subscriptionId) {
    try {
      const response = await fetch(`/api/subscription-status?subscriptionId=${subscriptionId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('获取订阅状态失败:', error);
      throw error;
    }
  }

  /**
   * 处理 Webhook 事件
   */
  handleWebhookEvent(event) {
    switch (event.type) {
      case 'payment_intent.succeeded':
        this.onPaymentSucceeded(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        this.onPaymentFailed(event.data.object);
        break;
      case 'customer.subscription.created':
        this.onSubscriptionCreated(event.data.object);
        break;
      case 'customer.subscription.updated':
        this.onSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        this.onSubscriptionCanceled(event.data.object);
        break;
      case 'invoice.paid':
        this.onInvoicePaid(event.data.object);
        break;
      case 'invoice.payment_failed':
        this.onInvoicePaymentFailed(event.data.object);
        break;
    }
  }

  /**
   * 支付成功回调
   */
  onPaymentSucceeded(paymentIntent) {
    console.log('支付成功:', paymentIntent);
    // 更新用户订阅状态
    // 发送确认邮件
    // 记录交易日志
  }

  /**
   * 支付失败回调
   */
  onPaymentFailed(paymentIntent) {
    console.log('支付失败:', paymentIntent);
    // 通知用户支付失败
    // 记录失败原因
  }

  /**
   * 订阅创建回调
   */
  onSubscriptionCreated(subscription) {
    console.log('订阅已创建:', subscription);
    // 更新用户订阅信息
    // 发送欢迎邮件
  }

  /**
   * 订阅更新回调
   */
  onSubscriptionUpdated(subscription) {
    console.log('订阅已更新:', subscription);
    // 更新用户订阅信息
  }

  /**
   * 订阅取消回调
   */
  onSubscriptionCanceled(subscription) {
    console.log('订阅已取消:', subscription);
    // 更新用户订阅状态
    // 发送取消确认邮件
  }

  /**
   * 发票已支付回调
   */
  onInvoicePaid(invoice) {
    console.log('发票已支付:', invoice);
    // 更新账户
    // 发送发票邮件
  }

  /**
   * 发票支付失败回调
   */
  onInvoicePaymentFailed(invoice) {
    console.log('发票支付失败:', invoice);
    // 通知用户
    // 重试支付
  }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StripePayment;
}

/**
 * 使用示例
 */

// 初始化
// const stripe = new StripePayment('pk_test_your_publishable_key');

// 初始化支付表单
// stripe.initPaymentForm('card-element');

// 处理支付
// const result = await stripe.createPaymentIntent(9.99, 'usd', {
//   plan: 'professional',
//   userId: 'user_123'
// });

// const paymentIntent = await stripe.processPayment(result.clientSecret, {
//   name: 'John Doe',
//   email: 'john@example.com'
// });

// 创建订阅
// const subscription = await stripe.createSubscription(
//   'price_professional',
//   'cus_123',
//   'pm_123'
// );

// 获取发票
// const invoices = await stripe.getInvoices('cus_123');

// 取消订阅
// await stripe.cancelSubscription('sub_123');
