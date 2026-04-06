// 初始化函数
function init() {
    // 加载本地配置
    loadLocalConfig();
    
    // 初始化模型选择下拉框
    initModelSelect();
    
    // 初始化默认值
    initDefaults();
    
    // 初始化事件监听器
    initEventListeners();
}

// 加载本地配置
function loadLocalConfig() {
    // 尝试加载localConfig
    if (typeof window !== 'undefined' && window.localConfig) {
        const localConfig = window.localConfig;
        
        // 合并API配置
        if (localConfig.api) {
            if (localConfig.api.key) {
                config.api.key = localConfig.api.key;
            }
        }
        
        // 合并默认值配置
        if (localConfig.defaults) {
            Object.assign(config.defaults, localConfig.defaults);
        }
    }
}

// 初始化默认值
function initDefaults() {
    if (window.config && window.config.defaults) {
        const defaults = window.config.defaults;
        
        // 设置默认API Key
        const apiKeyInput = document.getElementById('api-key');
        if (apiKeyInput) {
            // 优先使用config.api.key（从localConfig合并的值）
            if (config.api.key) {
                apiKeyInput.value = config.api.key;
            } else if (defaults.apiKey) {
                apiKeyInput.value = defaults.apiKey;
            }
        }
        
        // 设置默认提示词
        const promptInput = document.getElementById('prompt');
        if (promptInput && defaults.prompt) {
            promptInput.value = defaults.prompt;
        }
        
        // 设置默认模型
        const modelSelect = document.getElementById('model');
        if (modelSelect && defaults.model) {
            modelSelect.value = defaults.model;
        }
        
        // 设置默认生成模式
        const generationModeSelect = document.getElementById('generation-mode');
        if (generationModeSelect && defaults.generationMode) {
            generationModeSelect.value = defaults.generationMode;
        }
        
        // 设置默认尺寸
        const sizeSelect = document.getElementById('size');
        if (sizeSelect && defaults.size) {
            sizeSelect.value = defaults.size;
        }
        
        // 设置默认最大图片数量
        const maxImagesInput = document.getElementById('max-images');
        if (maxImagesInput && defaults.maxImages) {
            maxImagesInput.value = defaults.maxImages;
        }
    }
}

// 初始化模型选择下拉框
function initModelSelect() {
    const modelSelect = document.getElementById('model');
    if (modelSelect && window.config && window.config.models) {
        modelSelect.innerHTML = '';
        Object.values(window.config.models).forEach(model => {
            const option = document.createElement('option');
            option.value = model.id;
            option.textContent = model.name;
            modelSelect.appendChild(option);
        });
    }
}

// 初始化事件监听器
function initEventListeners() {
    // 图片预览功能
    const imageInput = document.getElementById('image');
    const imagePreview = document.getElementById('image-preview');
    
    imageInput.addEventListener('change', function(e) {
        const files = e.target.files;
        if (files.length > 0) {
            imagePreview.innerHTML = '';
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    imagePreview.appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        }
    });
    
    // 生成按钮点击事件
    const generateBtn = document.getElementById('generate-btn');
    generateBtn.addEventListener('click', handleGenerate);
}

// 处理生成请求
function handleGenerate() {
    const apiKey = document.getElementById('api-key').value;
    const model = document.getElementById('model').value;
    const generationMode = document.getElementById('generation-mode').value;
    const size = document.getElementById('size').value;
    const prompt = document.getElementById('prompt').value;
    const maxImages = parseInt(document.getElementById('max-images').value) || 4;
    const files = document.getElementById('image').files;

    // 验证输入
    if (!apiKey) {
        showError('请输入API Key');
        return;
    }

    if (!prompt) {
        showError('请输入提示词');
        return;
    }

    // 显示加载状态
    const result = document.getElementById('result');
    result.innerHTML = '<p>生成中...</p>';

    // 处理图片文件
    processImages(files)
        .then(images => {
            // 构建请求数据
            const requestData = {
                model: model,
                prompt: prompt,
                size: size,
                sequential_image_generation: generationMode
            };
            
            // 当生成模式为auto时，添加组图配置
            if (generationMode === 'auto') {
                requestData.sequential_image_generation_options = {
                    max_images: maxImages
                };
            }

            if (images && images.length > 0) {
                requestData.image = images.length === 1 ? images[0] : images;
            }

            // 发送API请求
            return sendApiRequest(requestData, apiKey);
        })
        .then(data => {
            handleApiResponse(data);
        })
        .catch(error => {
            handleApiError(error);
        });
}

// 处理图片文件
function processImages(files) {
    return new Promise((resolve) => {
        if (!files || files.length === 0) {
            resolve(null);
            return;
        }

        const images = [];
        let processed = 0;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();
            reader.onload = function(e) {
                images.push(e.target.result);
                processed++;
                if (processed === files.length) {
                    resolve(images);
                }
            };
            reader.readAsDataURL(file);
        }
    });
}

// 发送API请求
function sendApiRequest(requestData, apiKey) {
    const apiUrl = window.config && window.config.api ? window.config.api.url : 'https://ark.cn-beijing.volces.com/api/v3/images/generations';
    
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestData)
    };

    return fetch(apiUrl, requestOptions)
        .then(response => response.json());
}

// 处理API响应
function handleApiResponse(data) {
    const result = document.getElementById('result');
    
    if (data && data.data && data.data.length > 0) {
        result.innerHTML = '';
        
        // 如实显示所有生成的图片
        data.data.forEach((item, index) => {
            if (item.url) {
                // 创建卡片容器
                const card = document.createElement('div');
                card.className = 'image-card';
                
                // 创建图片元素
                const img = document.createElement('img');
                img.src = item.url;
                img.alt = `生成结果 ${index + 1}`;
                
                // 创建下载按钮
                const downloadBtn = document.createElement('button');
                downloadBtn.className = 'download-btn';
                downloadBtn.textContent = '下载';
                downloadBtn.addEventListener('click', () => {
                    downloadImage(item.url, `generated-image-${index + 1}.png`);
                });
                
                // 组装卡片
                card.appendChild(img);
                card.appendChild(downloadBtn);
                result.appendChild(card);
            }
        });
    } else {
        // 显示失败信息和请求参数
        const errorInfo = `
            <p>生成失败，请检查API Key和参数设置</p>
            <div class="error-details">
                <h3>响应信息：</h3>
                <pre>${JSON.stringify(data, null, 2)}</pre>
            </div>
        `;
        result.innerHTML = errorInfo;
    }
}

// 下载图片函数
function downloadImage(url, filename) {
    console.log('开始下载图片:', url);
    
    // 直接创建a标签下载，避免CORS问题
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.target = '_blank';
    
    // 添加到页面
    document.body.appendChild(a);
    
    // 触发点击
    try {
        a.click();
        console.log('下载触发成功');
    } catch (error) {
        console.error('点击触发失败:', error);
        alert('下载触发失败，请重试');
    } finally {
        // 移除a标签
        setTimeout(() => {
            document.body.removeChild(a);
        }, 100);
    }
}

// 处理API错误
function handleApiError(error) {
    console.error('Error:', error);
    const result = document.getElementById('result');
    
    // 显示失败信息
    const errorInfo = `
        <p>生成失败，请检查网络连接或API Key</p>
        <div class="error-details">
            <h3>错误信息：</h3>
            <pre>${error.message}</pre>
        </div>
    `;
    result.innerHTML = errorInfo;
}

// 显示错误信息
function showError(message) {
    alert(message);
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', init);