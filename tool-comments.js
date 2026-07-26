/**
 * 工具页面评论组件
 * 在首页工具卡片上显示评论统计和快速评论
 */

class ToolCommentWidget {
  constructor(toolId, options = {}) {
    this.toolId = toolId;
    this.storageKey = 'nskorean_comments_v2';
    this.comments = this.loadComments();
    this.options = options;
  }

  loadComments() {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  getToolComments() {
    return this.comments.filter(c => c.toolId === this.toolId);
  }

  getStats() {
    const toolComments = this.getToolComments();
    if (toolComments.length === 0) {
      return {
        count: 0,
        avgRating: 0,
        distribution: [0, 0, 0, 0, 0]
      };
    }

    const avgRating = (toolComments.reduce((sum, c) => sum + c.rating, 0) / toolComments.length).toFixed(1);
    const distribution = [0, 0, 0, 0, 0];
    toolComments.forEach(c => {
      distribution[c.rating - 1]++;
    });

    return {
      count: toolComments.length,
      avgRating,
      distribution
    };
  }

  renderMiniWidget() {
    const stats = this.getStats();
    
    if (stats.count === 0) {
      return `
        <div class="text-xs text-slate-500 mt-2">
          <span>暂无评价</span>
        </div>
      `;
    }

    return `
      <div class="text-xs mt-2">
        <div class="flex items-center gap-1">
          <span class="text-yellow-500">★</span>
          <span class="font-semibold text-slate-900">${stats.avgRating}</span>
          <span class="text-slate-500">(${stats.count} 条评价)</span>
        </div>
      </div>
    `;
  }

  renderDetailedWidget() {
    const stats = this.getStats();
    const toolComments = this.getToolComments();

    if (stats.count === 0) {
      return `
        <div class="bg-slate-50 rounded-lg p-4 text-center">
          <p class="text-sm text-slate-500">暂无用户评价</p>
          <button class="mt-3 text-sm text-blue-600 hover:text-blue-500 font-medium">
            成为第一个评价者
          </button>
        </div>
      `;
    }

    const recentComments = toolComments.slice(0, 3);

    return `
      <div class="space-y-4">
        <!-- 评分统计 -->
        <div class="bg-slate-50 rounded-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <span class="font-semibold text-slate-900">用户评价</span>
            <span class="text-lg font-bold text-yellow-500">${stats.avgRating} ★</span>
          </div>
          <p class="text-xs text-slate-500 mb-3">基于 ${stats.count} 条评价</p>
          
          <!-- 评分分布 -->
          <div class="space-y-1">
            ${[5, 4, 3, 2, 1].map((rating, idx) => `
              <div class="flex items-center gap-2">
                <span class="text-xs w-6">${rating}★</span>
                <div class="flex-1 bg-white rounded-full h-1.5">
                  <div class="bg-yellow-400 h-1.5 rounded-full" style="width: ${stats.count > 0 ? (stats.distribution[rating - 1] / stats.count * 100) : 0}%"></div>
                </div>
                <span class="text-xs text-slate-500 w-6 text-right">${stats.distribution[rating - 1]}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 最近评论 -->
        <div>
          <h4 class="text-sm font-semibold text-slate-900 mb-3">最近评价</h4>
          <div class="space-y-2">
            ${recentComments.map(comment => `
              <div class="bg-slate-50 rounded-lg p-3">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs font-medium text-slate-900">${this.escapeHtml(comment.name)}</span>
                  <span class="text-xs text-yellow-500">★ ${comment.rating}</span>
                </div>
                <p class="text-xs text-slate-600 line-clamp-2">${this.escapeHtml(comment.content)}</p>
                <span class="text-xs text-slate-400 mt-1 block">${this.formatTime(comment.timestamp)}</span>
              </div>
            `).join('')}
          </div>
          <button class="mt-3 w-full text-xs text-blue-600 hover:text-blue-500 font-medium py-2 rounded-lg hover:bg-blue-50 transition-colors">
            查看全部评价 →
          </button>
        </div>
      </div>
    `;
  }

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
  module.exports = ToolCommentWidget;
}
