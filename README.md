# 豆包生图工具

一个基于豆包视觉模型的图片生成网站，支持输入提示词和参考图片生成高质量图片。

## 功能特点

- **API配置**：支持配置API Key和其他参数
- **模型选择**：支持选择不同的豆包视觉模型
- **多图片上传**：支持上传多张参考图片（最多14张）
- **生成模式**：支持单图和组图生成
- **尺寸配置**：支持多种图片尺寸选择
- **图片下载**：支持下载生成的图片
- **错误处理**：生成失败时显示详细的错误信息

## 快速开始

### 配置API Key

1. 复制 `config.local.js.example` 文件为 `config.local.js`
2. 在 `config.local.js` 文件中填写您的API Key

### 本地运行

1. 使用Python内置服务器：
   ```bash
   python -m http.server 8080
   ```

2. 在浏览器中访问 `http://localhost:8080`

## 部署到GitHub

### 步骤1：创建GitHub仓库

1. 登录GitHub账号
2. 创建一个新的仓库（可以是公开或私有）
3. 复制仓库的SSH或HTTPS地址

### 步骤2：初始化本地仓库

1. 打开命令行，进入项目目录
2. 初始化Git仓库：
   ```bash
   git init
   ```

3. 添加远程仓库：
   ```bash
   git remote add origin <your-github-repo-url>
   ```

4. 检查.gitignore文件是否存在，确保config.local.js不会被推送

### 步骤3：提交和推送代码

1. 添加文件：
   ```bash
   git add .
   ```

2. 提交代码：
   ```bash
   git commit -m "Initial commit"
   ```

3. 推送代码：
   ```bash
   git push -u origin main
   ```

### 步骤4：启用GitHub Pages（可选）

1. 进入GitHub仓库设置
2. 找到 "Pages" 选项
3. 选择 `main` 分支作为源
4. 点击 "Save" 按钮
5. 等待几分钟，GitHub会生成一个访问URL

## 配置说明

### 本地配置文件

`config.local.js` 文件包含以下配置：

```javascript
const localConfig = {
    // API配置
    api: {
        key: 'your-api-key-here', // 填写您的豆包API Key
    },
    
    // GitHub配置（可选）
    github: {
        username: 'your-github-username', // 您的GitHub用户名
        repo: 'your-repo-name', // 您的GitHub仓库名
    },
    
    // 默认值配置
    defaults: {
        apiKey: 'your-api-key-here', // 默认API Key
        prompt: '参考提供的图片风格，生成一组小狗图片...', // 默认提示词
        model: 'doubao-seedream-4-5-251128', // 默认模型
        generationMode: 'disabled', // 默认生成模式
        size: '2048x2048', // 默认尺寸
        maxImages: 2 // 生成图片的最大数量
    }
};
```

### 注意事项

1. **API Key安全**：`config.local.js` 文件不会被推送到GitHub，确保您的API Key安全
2. **GitHub Pages**：如果使用GitHub Pages部署，由于是静态网站，API Key会在前端暴露
3. **CORS问题**：若遇到跨域错误，可能需要配置CORS或使用后端代理
4. **访问速度**：GitHub Pages的访问速度可能因地区而异

## 技术栈

- HTML5
- CSS3
- JavaScript

## 许可证

MIT