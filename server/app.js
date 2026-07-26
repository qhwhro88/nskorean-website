/**
 * NSKOREAN 后端服务器
 * Node.js + Express
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// 加载环境变量
dotenv.config();

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('../'));

// 数据库连接
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nskorean', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// 数据库模型
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  avatar: String,
  createdAt: { type: Date, default: Date.now }
});

const toolSchema = new mongoose.Schema({
  name: String,
  icon: String,
  category: String,
  description: String,
  longDescription: String,
  url: String,
  pricing: String,
  rating: Number,
  views: Number,
  tags: [String],
  features: [String],
  pros: [String],
  cons: [String],
  status: String,
  date: Date,
  createdAt: { type: Date, default: Date.now }
});

const commentSchema = new mongoose.Schema({
  toolId: String,
  userId: String,
  username: String,
  email: String,
  rating: Number,
  content: String,
  likes: { type: Number, default: 0 },
  helpful: { type: Number, default: 0 },
  unhelpful: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Tool = mongoose.model('Tool', toolSchema);
const Comment = mongoose.model('Comment', commentSchema);

// 认证中间件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// ==================== 用户 API ====================

// 用户注册
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 检查用户是否已存在
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: '用户已存在' });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建新用户
    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();

    // 生成 JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user._id, username, email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 用户登录
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: '用户不存在' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: '密码错误' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user._id, username: user.username, email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== 工具 API ====================

// 获取所有工具
app.get('/api/tools', async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    let query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let tools = Tool.find(query);

    if (sort === 'rating') {
      tools = tools.sort({ rating: -1 });
    } else if (sort === 'views') {
      tools = tools.sort({ views: -1 });
    } else {
      tools = tools.sort({ createdAt: -1 });
    }

    const result = await tools.limit(50);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取单个工具
app.get('/api/tools/:id', async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool) {
      return res.status(404).json({ error: '工具不存在' });
    }
    res.json(tool);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建工具（需要认证）
app.post('/api/tools', authenticateToken, async (req, res) => {
  try {
    const tool = new Tool(req.body);
    await tool.save();
    res.json(tool);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 更新工具（需要认证）
app.put('/api/tools/:id', authenticateToken, async (req, res) => {
  try {
    const tool = await Tool.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(tool);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 删除工具（需要认证）
app.delete('/api/tools/:id', authenticateToken, async (req, res) => {
  try {
    await Tool.findByIdAndDelete(req.params.id);
    res.json({ message: '工具已删除' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== 评论 API ====================

// 获取工具评论
app.get('/api/comments/:toolId', async (req, res) => {
  try {
    const comments = await Comment.find({ toolId: req.params.toolId })
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建评论
app.post('/api/comments', async (req, res) => {
  try {
    const comment = new Comment(req.body);
    await comment.save();
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 点赞评论
app.post('/api/comments/:id/like', async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 标记有用
app.post('/api/comments/:id/helpful', async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpful: 1 } },
      { new: true }
    );
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== 邮件 API ====================

// 发送咨询邮件
app.post('/api/mail/consult', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // 使用 FormSubmit 或 Mailgun
    // 这里仅作示例
    console.log(`收到咨询：${name} (${email}): ${message}`);

    res.json({ message: '咨询已发送' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== 统计 API ====================

// 获取统计数据
app.get('/api/stats', async (req, res) => {
  try {
    const totalTools = await Tool.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalComments = await Comment.countDocuments();
    const avgRating = await Comment.aggregate([
      { $group: { _id: null, avg: { $avg: '$rating' } } }
    ]);

    res.json({
      totalTools,
      totalUsers,
      totalComments,
      avgRating: avgRating[0]?.avg || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== 健康检查 ====================

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ==================== 错误处理 ====================

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '服务器错误' });
});

// ==================== 启动服务器 ====================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 NSKOREAN 后端服务运行在 http://localhost:${PORT}`);
});

module.exports = app;
