# 生物实验模拟平台

这是一个交互式的生物实验模拟平台，旨在帮助学生更好地理解生物学概念和原理。通过可视化的网页模拟实验，学生可以直观地观察和理解各种生物学现象。

## 现有实验

### 1. 基因分离模拟实验 v1.0
- 模拟孟德尔第一定律
- 通过交互式界面展示基因分离现象
- 包含实验操作和数据统计功能

### 2. 自由组合模拟实验 v1.1
- 模拟孟德尔第二定律
- 展示不同性状间的自由组合规律
- 提供数据分析和可视化功能

## 使用方法

1. 克隆仓库到本地：
```bash
git clone git@github.com:wjim116/biology-simulation-experiments.git
```

2. 直接打开 index.html 文件，或使用本地服务器运行项目：
```bash
# 使用 Python 启动简单的 HTTP 服务器
python -m http.server 8000
```

3. 在浏览器中访问对应的实验页面：
- 主页：http://localhost:8000
- 基因分离实验：http://localhost:8000/基因分离模拟实验v1.0/
- 自由组合实验：http://localhost:8000/自由组合模拟实验v1.1/

## 技术栈

- HTML5
- CSS3
- JavaScript
- 可视化库（如有使用）

## 贡献指南

欢迎贡献新的实验模拟或改进现有实验！请遵循以下步骤：

1. Fork 本仓库
2. 创建新的分支：`git checkout -b feature/实验名称`
3. 提交更改：`git commit -m '添加新实验：实验名称'`
4. 推送到分支：`git push origin feature/实验名称`
5. 提交 Pull Request

## 许可证

MIT License 