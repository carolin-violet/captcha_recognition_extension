源码地址：[https://github.com/carolin-violet/captcha\_recognition\_extension](https://github.com/carolin-violet/captcha_recognition_extension)

**此项目仅供学习参考**

## 背景

鉴于平常开发过程中频繁地登录公司的tap系统，一直要输入验证码， 所以想着制作一个插件去自动识别验证码并填充到登录表单上。

## 技术选型

前端：javascript、css、chrome插件开发

后端：python、flask、[DdddOcr](https://github.com/sml2h3/ddddocr)

## 实现思路

1\. 前端编写一个chrome插件，登录页加载后可以点击插件提供的按钮获取到验证码图片然后调用接口将图片传到后端去识别获取验证码。

2.后端通过flask搭建一个简单的web服务器，编写图片验证码识别接口，拿到前端传过来的图片后通过调用开源库[DdddOcr](https://github.com/sml2h3/ddddocr)的验证码识别api获取验证码并返回给前端。

3\. 前端拿到验证码后将验证码写入到页面上。

## 存在缺陷

-   验证码识别功能是用的开源的库，识别成功率较低，验证码不复杂的情况识别率尚可。
    
-   单独打包成exe文件运行会出错报错路径为开发时所用电脑的c盘目录，打包成目录形式的情况下没有将模型打包进去。
    

## 需要优化点

-   监听只有登录页才展示这个填充按钮，其他页面隐藏
    
-   允许前端扩展设置不通的识别api
    
-   前端插件样式美化与使用方便性增强