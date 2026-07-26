/**
 * 高级评论系统模块
 * 支持搜索、过滤、排序、点赞、投票、实时通知等功能
 */

class AdvancedCommentSystem {
  constructor(containerId = 'commentsContainer', options = {}) {
    this.containerId = containerId;
    this.storageKey = 'nskorean_comments_v2';
    this.votesKey = 'nskorean_votes';
    this.likesKey = 'nskorean_likes';
    this.bestKey = 'nskorean_best_comments';
    this.verifiedKey = 'nskorean_verified_emails';
    
    this.comments = this.loadComments();
    this.votes = this.loadVotes();
    this.likes = this.loadLikes();
    this.bestComments = this.loadBestComments();
    this.verifiedEmails = this.loadVerifiedEmails();
    
    this.filterType = 'all';
    this.sortType = 'newest';
    this.searchQuery = '';
    this.ratingFilter = 0;
    
    this.options = {
      enableEmail: options.enableEmail !== false,
      enableRecaptcha: options.enableRecaptcha || false,
      recaptchaKey: options.recaptchaKey || '',
      enableNotifications: options.enableNotifications !== false,
      ...options
    };
  }

  // ============ 数据管理 ============

  loadComments() {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  loadVotes() {
    const stored = localStorage.getItem(this.votesKey);
    return stored ? JSON.parse(stored) : {};
  }

  loadLikes() {
    const stored = localStorage.getItem(this.likesKey);
    return stored ? JSON.parse(stored) : {};
  }

  loadBestComments() {
    const stored = localStorage.getItem(this.bestKey);
    return stored ? JSON.parse(stored) : [];
  }

  loadVerifiedEmails() {
    const stored = localStorage.getItem(this.verifiedKey);
    return stored ? JSON.parse(stored) : [];
  }

  saveComments() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.comments));
  }

  saveVotes() {
    localStorage.setItem(this.votesKey, JSON.stringify(this.votes));
  }

  saveLikes() {
    localStorage.setItem(this.likesKey, JSON.stringify(this.likes));
  }

  saveBestComments() {
    localStorage.setItem(this.bestKey, JSON.stringify(this.bestComments));
  }

  saveVerifiedEmails() {
    localStorage.setItem(this.verifiedKey, JSON.stringify(this.verifiedEmails));
  }

  // ============ 评论操作 ============

  addComment(data) {
    // 验证邮箱
    if (!this.validateEmail(data.email)) {
      throw new Error('邮箱格式不正确');
    }

    // 检查重复提交
    if (this.isDuplicate(data)) {
      throw new Error('请勿重复提交相同内容');
    }

    const comment = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      rating: parseInt(data.rating),
      content: data.content,
      timestamp: new Date().toISOString(),
      replies: [],
      likes: 0,
      helpful: 0,
      notHelpful: 0,
      isVerified: this.verifiedEmails.includes(data.email),
      isBest: false,
      toolId: data.toolId || null
    };

    this.comments.unshift(comment);
    this.saveComments();

    // 发送邮件通知
    if (this.options.enableEmail) {
      this.sendNotificationEmail(comment);
    }

    // 触发实时通知
    this.notifyNewComment(comment);

    return comment;
  }

  addReply(commentId, data) {
    const comment = this.comments.find(c => c.id === commentId);
    if (!comment) return null;

    const reply = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      content: data.content,
      timestamp: new Date().toISOString(),
      isVerified: this.verifiedEmails.includes(data.email)
    };

    comment.replies.push(reply);
    this.saveComments();

    // 发送邮件通知
    if (this.options.enableEmail) {
      this.sendReplyNotificationEmail(comment, reply);
    }

    return reply;
  }

  // ============ 互动功能 ============

  likeComment(commentId) {
    if (!this.likes[commentId]) {
      this.likes[commentId] = 0;
    }
    this.likes[commentId]++;
    this.saveLikes();
    return this.likes[commentId];
  }

  markHelpful(commentId) {
    const comment = this.comments.find(c => c.id === commentId);
    if (comment) {
      comment.helpful++;
      this.saveComments();
    }
    return comment ? comment.helpful : 0;
  }

  markNotHelpful(commentId) {
    const comment = this.comments.find(c => c.id === commentId);
    if (comment) {
      comment.notHelpful++;
      this.saveComments();
    }
    return comment ? comment.notHelpful : 0;
  }

  markBest(commentId, password = 'admin123') {
    if (password !== 'admin123') {
      throw new Error('权限不足');
    }

    const comment = this.comments.find(c => c.id === commentId);
    if (comment) {
      comment.isBest = !comment.isBest;
      if (comment.isBest) {
        this.bestComments.push(commentId);
      } else {
        this.bestComments = this.bestComments.filter(id => id !== commentId);
      }
      this.saveComments();
      this.saveBestComments();
    }
    return comment ? comment.isBest : false;
  }

  verifyEmail(email, verificationCode) {
    // 简单的验证逻辑（生产环境应使用后端验证）
    if (verificationCode === '123456') {
      if (!this.verifiedEmails.includes(email)) {
        this.verifiedEmails.push(email);
        this.saveVerifiedEmails();
      }
      return true;
    }
    return false;
  }

  // ============ 搜索和过滤 ============

  searchComments(query) {
    const q = query.toLowerCase();
    return this.comments.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.content.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  }

  filterByRating(rating) {
    if (rating === 0) return this.comments;
    return this.comments.filter(c => c.rating === rating);
  }

  filterByType(type) {
    switch (type) {
      case 'best':
        return this.comments.filter(c => c.isBest);
      case 'verified':
        return this.comments.filter(c => c.isVerified);
      case 'helpful':
        return this.comments.filter(c => c.helpful > 0);
      case 'recent':
        return this.comments.slice(0, 10);
      default:
        return this.comments;
    }
  }

  sortComments(comments, sortType) {
    const sorted = [...comments];
    switch (sortType) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      case 'highest':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return sorted.sort((a, b) => a.rating - b.rating);
      case 'most-liked':
        return sorted.sort((a, b) => (this.likes[b.id] || 0) - (this.likes[a.id] || 0));
      case 'most-helpful':
        return sorted.sort((a, b) => b.helpful - a.helpful);
      default:
        return sorted;
    }
  }

  getFilteredComments() {
    let filtered = this.comments;

    // 应用搜索
    if (this.searchQuery) {
      filtered = this.searchComments(this.searchQuery);
    }

    // 应用评分过滤
    if (this.ratingFilter > 0) {
      filtered = filtered.filter(c => c.rating === this.ratingFilter);
    }

    // 应用类型过滤
    if (this.filterType !== 'all') {
      filtered = this.filterByType(this.filterType);
    }

    // 应用排序
    return this.sortComments(filtered, this.sortType);
  }

  // ============ 统计分析 ============

  getStats() {
    const totalComments = this.comments.length;
    const avgRating = totalComments > 0
      ? (this.comments.reduce((sum, c) => sum + c.rating, 0) / totalComments).toFixed(1)
      : 0;

    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    this.comments.forEach(c => {
      ratingDistribution[c.rating]++;
    });

    const totalReplies = this.comments.reduce((sum, c) => sum + c.replies.length, 0);
    const totalLikes = Object.values(this.likes).reduce((sum, v) => sum + v, 0);
    const bestCommentCount = this.comments.filter(c => c.isBest).length;
    const verifiedCount = this.comments.filter(c => c.isVerified).length;

    return {
      totalComments,
      avgRating,
      ratingDistribution,
      totalReplies,
      totalLikes,
      bestCommentCount,
      verifiedCount,
      engagementRate: ((totalLikes + totalReplies) / (totalComments || 1)).toFixed(2)
    };
  }

  getCommentsByTool(toolId) {
    return this.comments.filter(c => c.toolId === toolId);
  }

  getHotComments(limit = 5) {
    return this.comments
      .sort((a, b) => {
        const aScore = (this.likes[a.id] || 0) + a.helpful + a.replies.length;
        const bScore = (this.likes[b.id] || 0) + b.helpful + b.replies.length;
        return bScore - aScore;
      })
      .slice(0, limit);
  }

  // ============ 验证和防垃圾 ============

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isDuplicate(data) {
    const recent = this.comments.slice(0, 5);
    return recent.some(c =>
      c.name === data.name &&
      c.email === data.email &&
      c.content === data.content &&
      new Date() - new Date(c.timestamp) < 60000 // 1分钟内
    );
  }

  isSpam(content) {
    const spamKeywords = ['买', '卖', '赚钱', '点击', '链接', 'http', 'www'];
    const contentLower = content.toLowerCase();
    return spamKeywords.some(keyword => contentLower.includes(keyword));
  }

  // ============ 通知系统 ============

  sendNotificationEmail(comment) {
    // 使用 FormSubmit 或 Mailgun API
    const emailData = {
      email: 'admin@nskorean.com',
      subject: `新评论：${comment.name} - ${comment.rating}★`,
      message: `
新用户评论：
用户名：${comment.name}
邮箱：${comment.email}
评分：${comment.rating}★
内容：${comment.content}
时间：${new Date(comment.timestamp).toLocaleString('zh-CN')}
      `
    };

    // 可选：发送到 FormSubmit
    // fetch('https://formsubmit.co/admin@nskorean.com', {
    //   method: 'POST',
    //   body: new FormData(Object.entries(emailData).reduce((form, [key, value]) => {
    //     form.append(key, value);
    //     return form;
    //   }, new FormData()))
    // });
  }

  sendReplyNotificationEmail(comment, reply) {
    const emailData = {
      email: comment.email,
      subject: `您的评论有新回复 - NSKOREAN`,
      message: `
您好 ${comment.name}，

您的评论有新回复：

原评论：${comment.content}

新回复来自 ${reply.name}：
${reply.content}

时间：${new Date(reply.timestamp).toLocaleString('zh-CN')}

请访问网站查看完整内容。
      `
    };
  }

  notifyNewComment(comment) {
    // 触发自定义事件
    const event = new CustomEvent('newComment', { detail: comment });
    document.dispatchEvent(event);

    // 浏览器通知（如果用户授予权限）
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('NSKOREAN - 新评论', {
        body: `${comment.name} 发表了新评论：${comment.content.substring(0, 50)}...`,
        icon: '⭐'
      });
    }
  }

  // ============ 工具函数 ============

  formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins} 分钟前`;
    if (diffHours < 24) return `${diffHours} 小时前`;
    if (diffDays < 7) return `${diffDays} 天前`;

    return date.toLocaleDateString('zh-CN');
  }

  renderStars(rating, interactive = false) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
      if (interactive) {
        html += `<span class="star-rating cursor-pointer text-2xl" data-rating="${i}" style="color: ${i <= rating ? '#fbbf24' : '#e5e7eb'}">★</span>`;
      } else {
        html += `<span style="color: ${i <= rating ? '#fbbf24' : '#e5e7eb'}">★</span>`;
      }
    }
    return html;
  }

  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  // ============ 渲染 ============

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const stats = this.getStats();
    const filteredComments = this.getFilteredComments();

    let html = `
      <!-- 评论统计 -->
      <div class="bg-white border border-slate-200/80 rounded-2xl p-6 mb-8 shadow-sm">
        <h3 class="text-2xl font-bold text-slate-900 mb-6">用户评价</h3>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div class="text-center">
            <div class="text-3xl font-bold text-slate-900">${stats.totalComments}</div>
            <div class="text-xs text-slate-500 mt-1">总评论</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-yellow-500">${stats.avgRating}</div>
            <div class="text-xs text-slate-500 mt-1">平均评分</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-500">${stats.bestCommentCount}</div>
            <div class="text-xs text-slate-500 mt-1">最佳评论</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-green-500">${stats.verifiedCount}</div>
            <div class="text-xs text-slate-500 mt-1">认证用户</div>
          </div>
        </div>

        <!-- 评分分布 -->
        <div class="space-y-2">
          ${[5, 4, 3, 2, 1].map(rating => `
            <div class="flex items-center gap-3">
              <span class="text-sm font-medium text-slate-600 w-12">${rating} ★</span>
              <div class="flex-1 bg-slate-100 rounded-full h-2">
                <div class="bg-yellow-400 h-2 rounded-full" style="width: ${stats.totalComments > 0 ? (stats.ratingDistribution[rating] / stats.totalComments * 100) : 0}%"></div>
              </div>
              <span class="text-sm text-slate-500 w-8">${stats.ratingDistribution[rating]}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- 搜索和过滤 -->
      <div class="bg-white border border-slate-200/80 rounded-2xl p-6 mb-8 shadow-sm">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" id="commentSearch" placeholder="搜索评论..." class="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500">
          
          <select id="ratingFilterSelect" class="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-blue-500">
            <option value="0">所有评分</option>
            <option value="5">5 星</option>
            <option value="4">4 星</option>
            <option value="3">3 星</option>
            <option value="2">2 星</option>
            <option value="1">1 星</option>
          </select>

          <select id="sortSelect" class="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-blue-500">
            <option value="newest">最新</option>
            <option value="oldest">最早</option>
            <option value="highest">评分最高</option>
            <option value="lowest">评分最低</option>
            <option value="most-liked">最赞</option>
            <option value="most-helpful">最有用</option>
          </select>
        </div>

        <!-- 快速过滤按钮 -->
        <div class="flex flex-wrap gap-2 mt-4">
          <button class="filter-quick-btn px-3 py-1.5 text-xs font-medium rounded-full bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-600 transition-all" data-filter="all">全部</button>
          <button class="filter-quick-btn px-3 py-1.5 text-xs font-medium rounded-full bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-600 transition-all" data-filter="best">最佳评论</button>
          <button class="filter-quick-btn px-3 py-1.5 text-xs font-medium rounded-full bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-600 transition-all" data-filter="verified">认证用户</button>
          <button class="filter-quick-btn px-3 py-1.5 text-xs font-medium rounded-full bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-600 transition-all" data-filter="helpful">最有用</button>
        </div>
      </div>

      <!-- 评论表单 -->
      <div class="bg-white border border-slate-200/80 rounded-2xl p-6 mb-8 shadow-sm">
        <h3 class="text-xl font-bold text-slate-900 mb-6">发表评价</h3>
        
        <form id="commentForm" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" id="commentName" placeholder="您的名字" required class="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors">
            <input type="email" id="commentEmail" placeholder="您的邮箱" required class="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors">
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">评分</label>
            <div id="ratingStars" class="flex gap-2 text-3xl">
              ${this.renderStars(0, true)}
            </div>
            <input type="hidden" id="commentRating" value="0" required>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">您的评价</label>
            <textarea id="commentContent" placeholder="分享您对这个工具的看法..." rows="4" required class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors resize-none"></textarea>
          </div>

          <button type="submit" class="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg transition-all">
            提交评价
          </button>
        </form>
      </div>

      <!-- 评论列表 -->
      <div class="space-y-4">
        ${filteredComments.length === 0 ? `
          <div class="text-center py-12 text-slate-500">
            <p>暂无评价，成为第一个评价者吧！</p>
          </div>
        ` : filteredComments.map(comment => `
          <div class="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow ${comment.isBest ? 'border-yellow-400 bg-yellow-50/30' : ''}">
            <!-- 评论头部 -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-slate-900">${this.escapeHtml(comment.name)}</span>
                  ${comment.isVerified ? '<span class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">✓ 认证</span>' : ''}
                  ${comment.isBest ? '<span class="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">⭐ 最佳</span>' : ''}
                </div>
                <div class="text-sm text-slate-500 mt-1">${this.formatTime(comment.timestamp)}</div>
              </div>
              <div class="flex gap-1">
                ${this.renderStars(comment.rating)}
              </div>
            </div>

            <!-- 评论内容 -->
            <p class="text-slate-700 mb-4 leading-relaxed">${this.escapeHtml(comment.content)}</p>

            <!-- 互动按钮 -->
            <div class="flex items-center gap-4 text-sm text-slate-600 mb-4 pb-4 border-b border-slate-100">
              <button class="like-btn flex items-center gap-1 hover:text-blue-600 transition-colors" data-comment-id="${comment.id}">
                👍 <span class="like-count">${this.likes[comment.id] || 0}</span>
              </button>
              <button class="helpful-btn flex items-center gap-1 hover:text-green-600 transition-colors" data-comment-id="${comment.id}">
                ✓ 有用 <span class="helpful-count">${comment.helpful}</span>
              </button>
              <button class="not-helpful-btn flex items-center gap-1 hover:text-red-600 transition-colors" data-comment-id="${comment.id}">
                ✗ 无用 <span class="not-helpful-count">${comment.notHelpful}</span>
              </button>
              <button class="reply-btn text-blue-600 hover:text-blue-500 font-medium" data-comment-id="${comment.id}">
                回复
              </button>
            </div>

            <!-- 回复表单（隐藏） -->
            <div class="reply-form mt-4 hidden">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <input type="text" class="reply-name bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500" placeholder="您的名字" required>
                <input type="email" class="reply-email bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500" placeholder="您的邮箱" required>
              </div>
              <textarea class="reply-content w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none" rows="2" placeholder="输入回复..." required></textarea>
              <div class="flex gap-2 mt-3">
                <button class="submit-reply bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all">
                  提交回复
                </button>
                <button type="button" class="cancel-reply text-slate-600 hover:text-slate-900 text-sm font-medium px-4 py-2">
                  取消
                </button>
              </div>
            </div>

            <!-- 回复列表 -->
            ${comment.replies.length > 0 ? `
              <div class="mt-6 pt-6 border-t border-slate-100 space-y-4">
                <div class="font-bold text-slate-900 text-sm">回复 (${comment.replies.length})</div>
                ${comment.replies.map(reply => `
                  <div class="bg-slate-50 rounded-lg p-4">
                    <div class="flex items-start justify-between mb-2">
                      <div>
                        <div class="flex items-center gap-2">
                          <span class="font-medium text-slate-900 text-sm">${this.escapeHtml(reply.name)}</span>
                          ${reply.isVerified ? '<span class="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">✓</span>' : ''}
                        </div>
                        <div class="text-xs text-slate-500 mt-1">${this.formatTime(reply.timestamp)}</div>
                      </div>
                    </div>
                    <p class="text-slate-700 text-sm leading-relaxed">${this.escapeHtml(reply.content)}</p>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `;

    container.innerHTML = html;
    this.attachEventListeners();
  }

  attachEventListeners() {
    // 评分选择
    document.querySelectorAll('#ratingStars .star-rating').forEach(star => {
      star.addEventListener('click', (e) => {
        const rating = e.target.dataset.rating;
        document.getElementById('commentRating').value = rating;
        document.querySelectorAll('#ratingStars .star-rating').forEach((s, i) => {
          s.style.color = (i + 1) <= rating ? '#fbbf24' : '#e5e7eb';
        });
      });

      star.addEventListener('mouseover', (e) => {
        const rating = e.target.dataset.rating;
        document.querySelectorAll('#ratingStars .star-rating').forEach((s, i) => {
          s.style.color = (i + 1) <= rating ? '#fbbf24' : '#e5e7eb';
        });
      });
    });

    document.getElementById('ratingStars').addEventListener('mouseleave', () => {
      const rating = document.getElementById('commentRating').value;
      document.querySelectorAll('#ratingStars .star-rating').forEach((s, i) => {
        s.style.color = (i + 1) <= rating ? '#fbbf24' : '#e5e7eb';
      });
    });

    // 提交评论
    document.getElementById('commentForm').addEventListener('submit', (e) => {
      e.preventDefault();

      const rating = document.getElementById('commentRating').value;
      if (rating === '0') {
        alert('请选择评分');
        return;
      }

      try {
        this.addComment({
          name: document.getElementById('commentName').value,
          email: document.getElementById('commentEmail').value,
          rating: rating,
          content: document.getElementById('commentContent').value
        });

        document.getElementById('commentForm').reset();
        document.getElementById('commentRating').value = '0';
        document.querySelectorAll('#ratingStars .star-rating').forEach(s => {
          s.style.color = '#e5e7eb';
        });

        this.render();
        alert('感谢您的评价！');
      } catch (error) {
        alert('错误：' + error.message);
      }
    });

    // 搜索
    document.getElementById('commentSearch').addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      this.render();
    });

    // 评分过滤
    document.getElementById('ratingFilterSelect').addEventListener('change', (e) => {
      this.ratingFilter = parseInt(e.target.value);
      this.render();
    });

    // 排序
    document.getElementById('sortSelect').addEventListener('change', (e) => {
      this.sortType = e.target.value;
      this.render();
    });

    // 快速过滤
    document.querySelectorAll('.filter-quick-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.filterType = e.target.dataset.filter;
        this.render();
      });
    });

    // 点赞
    document.querySelectorAll('.like-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const commentId = parseInt(e.target.closest('.like-btn').dataset.commentId);
        const count = this.likeComment(commentId);
        e.target.closest('.like-btn').querySelector('.like-count').textContent = count;
      });
    });

    // 有用
    document.querySelectorAll('.helpful-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const commentId = parseInt(e.target.closest('.helpful-btn').dataset.commentId);
        const count = this.markHelpful(commentId);
        e.target.closest('.helpful-btn').querySelector('.helpful-count').textContent = count;
      });
    });

    // 无用
    document.querySelectorAll('.not-helpful-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const commentId = parseInt(e.target.closest('.not-helpful-btn').dataset.commentId);
        const count = this.markNotHelpful(commentId);
        e.target.closest('.not-helpful-btn').querySelector('.not-helpful-count').textContent = count;
      });
    });

    // 回复按钮
    document.querySelectorAll('.reply-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const form = e.target.closest('.bg-white').querySelector('.reply-form');
        form.classList.toggle('hidden');
      });
    });

    // 提交回复
    document.querySelectorAll('.submit-reply').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const card = e.target.closest('.bg-white');
        const commentId = card.querySelector('.reply-btn').dataset.commentId;
        const name = card.querySelector('.reply-name').value;
        const email = card.querySelector('.reply-email').value;
        const content = card.querySelector('.reply-content').value;

        if (!name || !email || !content) {
          alert('请填写所有字段');
          return;
        }

        this.addReply(parseInt(commentId), { name, email, content });
        this.render();
        alert('感谢您的回复！');
      });
    });

    // 取消回复
    document.querySelectorAll('.cancel-reply').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const form = e.target.closest('.reply-form');
        form.classList.add('hidden');
      });
    });
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdvancedCommentSystem;
}
