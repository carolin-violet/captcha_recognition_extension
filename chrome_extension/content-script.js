// 用户信息
const userInfoObj = {
  account: "violet",
  password: "Trendy@123",
  code: "",
};

// 填充按钮
let violet_recognition_button;

// 需要展示的站点
const whiteList = [
  "61.160.201.225:31085",
  "localhost:9000",
  "172.21.6.123:30647",
  "172.21.6.123:32599",
  "172.21.6.123:31397",
];

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

// 判断是否为登录页(暂时根据href判断可能会出现问题)
function handleDisplayButton() {
  if (window.location.href.includes("/login")) {
    violet_recognition_button.style.display = "block";
  } else {
    violet_recognition_button.style.display = "none";
  }
}

// 监听html文档加载完成
document.addEventListener("DOMContentLoaded", function () {
  if (!whiteList.includes(this.location.host)) return;

  violet_recognition_button = document.createElement("div");
  for (let i = 0; i < 4; i++) {
    const div = document.createElement("div");
    violet_recognition_button.appendChild(div);
  }
  violet_recognition_button.appendChild(document.createTextNode("填充信息"));
  violet_recognition_button.className = "violet_recognition_button";
  document.body.appendChild(violet_recognition_button);
  violet_recognition_button.onclick = recognition;
  if (window.location.href.includes("/login")) {
    violet_recognition_button.style.display = "block";
  } else {
    violet_recognition_button.style.display = "none";
  }
  setInterval(() => {
    handleDisplayButton();
  }, 1000);
});
