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
      // writeUserInfo();

      // 生成复制面板
      generateDialog();
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
  const inputInput = inputList[1];
  const captchaInput = inputList[2];
  accountInput.value = userInfoObj.account;
  inputInput.value = userInfoObj.password;
  captchaInput.value = userInfoObj.code;
}

// 手动弹出复制粘贴弹窗
function generateDialog() {
  const copyBoard = document.createElement("div");
  copyBoard.className = "violet_recognition_copy_board";
  copyBoard.style.display = "block";

  const accountContainer = document.createElement("div");
  accountContainer.className = "copy-account";
  accountContainer.innerText = userInfoObj.account;
  copyBoard.appendChild(accountContainer);

  const passwordContainer = document.createElement("div");
  passwordContainer.className = "copy-password";
  passwordContainer.innerText = userInfoObj.password;
  copyBoard.appendChild(passwordContainer);

  const codeContainer = document.createElement("div");
  codeContainer.className = "copy-code";
  codeContainer.innerText = userInfoObj.code;
  copyBoard.appendChild(codeContainer);

  const closeContainer = document.createElement("div");
  closeContainer.className = "close";
  closeContainer.innerText = "关闭";
  copyBoard.appendChild(closeContainer);
  closeContainer.onclick = function () {
    copyBoard.style.display = "none";
  };

  document.body.appendChild(copyBoard);
}
