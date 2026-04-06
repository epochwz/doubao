// 配置文件
const config = {
    // API配置
    api: {
        url: 'https://ark.cn-beijing.volces.com/api/v3/images/generations',
        timeout: 30000, // 30秒超时
        key: '' // API Key将从localConfig中读取
    },
    
    // 默认值配置
    defaults: {
        apiKey: '', // API Key将从localConfig中读取
        prompt: '参考提供的图片风格，生成一组小狗图片，注意只是参考风格，生成的图片不要有参考图片的痕迹，若没有参考图片，则随机生成', // 默认提示词
        model: 'doubao-seedream-4-5-251128', // 默认模型
        generationMode: 'disabled', // 默认生成模式
        size: '2048x2048', // 默认尺寸
        maxImages: 2 // 生成图片的最大数量
    },
    
    // 模型配置
    models: {
        'doubao-seedream-5-0-lite-260128': {
            name: 'doubao-seedream-5.0-lite',
            id: 'doubao-seedream-5-0-lite-260128',
            description: 'doubao-seedream-5.0的轻量版本'
        },
        'doubao-seedream-4-5-251128': {
            name: 'doubao-seedream-4.5',
            id: 'doubao-seedream-4-5-251128',
            description: '豆包图片生成模型4.5版本'
        },
        'doubao-seedream-4-0-250828': {
            name: 'doubao-seedream-4.0',
            id: 'doubao-seedream-4-0-250828',
            description: '豆包图片生成模型4.0版本'
        },
        'doubao-seedream-3-0-t2i-250415': {
            name: 'doubao-seedream-3.0-t2i',
            id: 'doubao-seedream-3-0-t2i-250415',
            description: '豆包图片生成模型3.0版本，仅支持文生图'
        }
    },
    
    // 生成模式
    generationModes: {
        disabled: '单图',
        auto: '组图'
    },
    
    // 尺寸选项
    sizes: {
        '2048x2048': '2048x2048',
        '2304x1728': '2304x1728 (4:3)',
        '1728x2304': '1728x2304 (3:4)',
        '2848x1600': '2848x1600 (16:9)',
        '1600x2848': '1600x2848 (9:16)',
        '2K': '2K',
        '4K': '4K'
    }
};

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
} else if (typeof window !== 'undefined') {
    window.config = config;
}