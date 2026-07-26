/**
 * 评论系统模块
 * 支持本地存储和评论管理
 */

class CommentSystem {
  constructor(containerId = 'commentsContainer') {
    this.containerId = containerId;
    this.storageKey = 'nskorean_comments';
    this.comments = this.loadComments();
  }

  /**
   * 从 localStorage 加载评论
   */
  loadComments() {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * 保存评论到 localStorage
   */
  saveComments() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.comments));
  }

  /**
   * 添加新评论
   */
  addComment(data) {
    const comment = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      rating: parseInt(data.rating),
      content: data.content,
      timestamp: new Date().toISOString(),
      replies: []
    };

    this.comments.unshift(comment);
    this.saveComments();
    return comment;
  }

  /**
   * 添加回复
   */
  addReply(commentId, data) {
    const comment = this.comments.find(c => c.id === commentId);
    if (!comment) return null;

    const reply = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      content: data.content,
      timestamp: new Date().toISOString()
    };

    comment.replies.push(reply);
    this.saveComments();
    return reply;
  }

  /**
   * 删除评论（需要密码验证）
   */
  deleteComment(commentId, password) {
    // 简单的密码验证（生产环境应使用后端验证）
    if (password !== 'admin123') {
      return false;
    }
    this.comments = this.comments.filter(c => c.id !== commentId);
    this.saveComments();
    return true;
  }

  /**
   * 获取评论统计
   */
  getStats() {
    const totalComments = this.comments.length;
    const avgRating = this.comments.length > 0
      ? (this.comments.reduce((sum, c) => sum + c.rating, 0) / this.comments.length).toFixed(1)
      : 0;

    const ratingDistribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    };

    this.comments.forEach(c => {
      ratingDistribution[c.rating]++;
    });

    return {
      totalComments,
      avgRating,
      ratingDistribution
    };
  }

  /**
   * 格式化时间
   */
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

  /**
   * 渲染星级评分
   */
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

  /**
   * 渲染评论列表
   */
  render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const stats = this.getStats();

    let html = `
      <!-- 评论统计 -->
      <div class="bg-white border border-slate-200/80 rounded-2xl p-6 mb-8 shadow-sm">
        <h3 class="text-2xl font-bold text-slate-900 mb-6">用户评价</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <!-- 平均评分 -->
          <div class="text-center">
            <div class="text-4xl font-bold text-slate-900 mb-2">${stats.avgRating}</div>
            <div class="flex justify-center mb-2">
              ${this.renderStars(Math.round(stats.avgRating))}
            </div>
            <div class="text-sm text-slate-500">基于 ${stats.totalComments} 条评价</div>
          </div>

          <!-- 评分分布 -->
          <div class="md:col-span-2">
            ${[5, 4, 3, 2, 1].map(rating => `
              <div class="flex items-center gap-3 mb-2">
                <span class="text-sm font-medium text-slate-600 w-12">${rating} ★</span>
                <div class="flex-1 bg-slate-100 rounded-full h-2">
                  <div class="bg-yellow-400 h-2 rounded-full" style="width: ${stats.totalComments > 0 ? (stats.ratingDistribution[rating] / stats.totalComments * 100) : 0}%"></div>
                </div>
                <span class="text-sm text-slate-500 w-8">${stats.ratingDistribution[rating]}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- 评论表单 -->
      <div class="bg-white border border-slate-200/80 rounded-2xl p-6 mb-8 shadow-sm">
        <h3 class="text-xl font-bold text-slate-900 mb-6">发表评价</h3>
        
        <form id="commentForm" class="space-y-4">
          <!-- 用户信息 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" id="commentName" placeholder="您的名字" required class="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors">
            <input type="email" id="commentEmail" placeholder="您的邮箱" required class="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors">
          </div>

          <!-- 评分选择 -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">评分</label>
            <div id="ratingStars" class="flex gap-2 text-3xl">
              ${this.renderStars(0, true)}
            </div>
            <input type="hidden" id="commentRating" value="0" required>
          </div>

          <!-- 评论内容 -->
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
        ${this.comments.length === 0 ? `
          <div class="text-center py-12 text-slate-500">
            <p>暂无评价，成为第一个评价者吧！</p>
          </div>
        ` : this.comments.map(comment => `
          <div class="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <!-- 评论头部 -->
            <div class="flex items-start justify-between mb-4">
              <div>
                <div class="font-bold text-slate-900">${this.escapeHtml(comment.name)}</div>
                <div class="text-sm text-slate-500">${this.formatTime(comment.timestamp)}</div>
              </div>
              <div class="flex gap-1">
                ${this.renderStars(comment.rating)}
              </div>
            </div>

            <!-- 评论内容 -->
            <p class="text-slate-700 mb-4 leading-relaxed">${this.escapeHtml(comment.content)}</p>

            <!-- 回复按钮 -->
            <button class="reply-btn text-sm text-blue-600 hover:text-blue-500 font-medium" data-comment-id="${comment.id}">
              回复
            </button>

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
                        <div class="font-medium text-slate-900 text-sm">${this.escapeHtml(reply.name)}</div>
                        <div class="text-xs text-slate-500">${this.formatTime(reply.timestamp)}</div>
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

  /**
   * 附加事件监听器
   */
  attachEventListeners() {
    // 评分星级选择
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

  /**
   * 转义 HTML 特殊字符
   */
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
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CommentSystem;
}
