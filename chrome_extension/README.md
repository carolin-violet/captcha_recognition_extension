参考资料：[https://github.com/sxei/chrome-plugin-demo?tab=readme-ov-file](https://github.com/sxei/chrome-plugin-demo?tab=readme-ov-file)

## 代码目录

    |-manifest.json
    |-content-script.js
    |-recognition_styles.css
    |-popup.html
    |-popup.js
    |-icon.png

## 主要代码实现

manifest.json

    {
      "manifest_version": 3,
      "name": "图片验证码识别插件",
      "version": "1.0",
      "description": "用于识别tap项目登录页的canvas字符验证码",
      "author": "carolin-violet",
      "icons": {
        "48": "icon.png",
        "128": "icon.png"
      },
      "browser_action": {
        "default_icon": "icon.png",
        "default_popup": "popup.html"
      },
      "content_scripts": [
        {
          "matches": ["<all_urls>"],
          "js": ["content-script.js"],
          "css": ["recognition_styles.css"],
          "run_at": "document_start"
        }
      ],
      "permissions": ["webRequest", "webRequestBlocking", "storage", "scripting"],
      "homepage_url": "https://github.com/carolin-violet"
    }
    

content-script.js

    const userInfoObj = {
      account: "violet",
      password: "Trendy@123",
      code: "",
    };
    
    // 获取canvas图片内容
    function getImg() {
      const canvasContainer = document.querySelector(".identityCode");
      const canvas = canvasContainer.querySelector("canvas");
      return new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to create Blob"));
            }
          },
          "image/png",
          1
        );
      });
    }
    
    // api调用
    function getCaptchaCode(formData) {
      const url = "http://127.0.0.1:5000/img_recognition"; // 替换为你的 API 地址
    
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.onload = function () {
          if (xhr.status >= 200 && xhr.status < 300) {
            // 处理接收到的数据
            console.log("数据:", xhr.responseText);
            resolve(xhr.responseText);
          } else {
            console.error("请求失败:", xhr.status);
            reject(xhr.status);
          }
        };
        xhr.onerror = function () {
          console.error("请求错误");
          document.getElementById("response").textContent = "请求错误";
        };
        xhr.send(formData);
      });
    }
    
    function recognition() {
      getImg().then((imgBlob) => {
        const file = new File([imgBlob], "image.png", { type: imgBlob.type });
        const formData = new FormData();
        formData.append("file", file);
        getCaptchaCode(formData).then((code) => {
          userInfoObj.code = code;
          // 自动填入用户信息
          writeUserInfo();
        });
      });
    }
    
    // 监听html文档加载完成
    document.addEventListener("DOMContentLoaded", function () {
      const violet_recognition_button = document.createElement("div");
      violet_recognition_button.innerText = "填充";
      violet_recognition_button.className = "violet_recognition_button";
      document.body.appendChild(violet_recognition_button);
      violet_recognition_button.onclick = recognition;
    });
    
    // 自动向input输入框中写入用户名密码验证码
    function writeUserInfo() {
      const inputList = document.querySelectorAll(".el-input__inner");
      const accountInput = inputList[0];
      const passwordInput = inputList[1];
      const captchaInput = inputList[2];
      simulateInput(accountInput, userInfoObj.account);
      simulateInput(passwordInput, userInfoObj.password);
      simulateInput(captchaInput, userInfoObj.code);
    }
    
    // 模拟输入
    function simulateInput(element, value) {
      const inputEvent = new Event("input", { bubbles: true });
      element.value = value;
      element.dispatchEvent(inputEvent);
    }
    
    

recognition\_styles.css

    /* 
      点击按钮
    */
    .violet_recognition_button {
      position: fixed;
      right: 10px;
      bottom: 40px;
      height: 40px;
      width: 40px;
      border-radius: 100%;
      text-align: center;
      line-height: 40px;
      cursor: pointer;
    
      background: #ecd300;
      background: radial-gradient(hsl(54, 100%, 50%), hsl(54, 100%, 40%));
      font-size: 14px;
      text-shadow: 0 -1px 0 #c3af07;
      color: white;
      border: 1px solid hsl(54, 100%, 20%);
      z-index: 4;
      outline: none;
      box-shadow: inset 0 1px 0 hsl(54, 100%, 50%), 0 2px 0 hsl(54, 100%, 20%),
        0 3px 0 hsl(54, 100%, 18%), 0 4px 0 hsl(54, 100%, 16%),
        0 5px 0 hsl(54, 100%, 14%), 0 6px 0 hsl(54, 100%, 12%),
        0 7px 0 hsl(54, 100%, 10%), 0 8px 0 hsl(54, 100%, 8%),
        0 9px 0 hsl(54, 100%, 6%);
    }
    
    .violet_recognition_button:active {
      box-shadow: inset 0 1px 0 hsl(54, 100%, 50%), 0 2px 0 hsl(54, 100%, 16%),
        0 3px 0 hsl(54, 100%, 14%), 0 4px 0 hsl(54, 100%, 12%),
        0 5px 0 hsl(54, 100%, 10%), 0 6px 0 hsl(54, 100%, 8%),
        0 7px 0 hsl(54, 100%, 6%);
    }
    
    .violet_recognition_copy_board {
      position: fixed;
      top: 100px;
      left: 100px;
      width: 100px;
      height: 80px;
      display: none;
      background: #fff;
    }
    
    .violet_recognition_copy_board > div {
      background-color: #666;
      color: #fff;
      text-align: center;
    }
    

## 问题

1.表单校验触发提示用户名和密码不能为空是因为chrome插件只改变了input输入框标签的值，并没有改变vue代码中存储的用户名密码，所以用户名密码还是为空，表单校验是基于vue中存储的用户名和密码来校验的，所以校验不通过。

解决方法 使用 JavaScript 原生事件的输入方式模拟用户输入，使用方法如下:

    // bubbles设置true表示允许冒泡
    function simulateInput(element, value) {
      const inputEvent = new Event('input', { bubbles: true });
      element.value = value;
      element.dispatchEvent(inputEvent);
    }
    
    // 使用方法
    simulateInput(document.querySelector('input[name="username"]'), 'your_username');
    simulateInput(document.querySelector('input[name="password"]'), 'your_password');