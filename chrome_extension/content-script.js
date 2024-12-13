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

// 向input输入框中写入验证码
function writeCode(code) {
  const inputList = document.querySelectorAll(".el-input__inner");
  const captchaInput = inputList[2];
  captchaInput.value = code;
}

// 向input输入框中写入用户名密码
function writeUserInfo() {
  const inputList = document.querySelectorAll(".el-input__inner");
  const accountInput = inputList[0];
  const inputInput = inputList[1];
  accountInput.value = "violet";
  inputInput.value = "Trendy@123";
}

// api调用
function getCaptchaCode(formData) {
  const url = "http://127.0.0.1:5000/img_recognition"; // 替换为你的 API 地址

  const xhr = new XMLHttpRequest();
  xhr.open("POST", url);
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      // 处理接收到的数据
      console.log("数据:", xhr.responseText);
      writeCode(xhr.responseText);
    } else {
      console.error("请求失败:", xhr.status);
    }
  };
  xhr.onerror = function () {
    console.error("请求错误");
    document.getElementById("response").textContent = "请求错误";
  };
  xhr.send(formData);
}

function recognition() {
  getImg().then((imgBlob) => {
    const file = new File([imgBlob], "image.png", { type: imgBlob.type });
    const formData = new FormData();
    formData.append("file", file);
    getCaptchaCode(formData);
  });
}

// 监听html文档加载完成
document.addEventListener("DOMContentLoaded", function () {
  const recognition_button = document.createElement("div");
  recognition_button.innerText = "填充";
  recognition_button.className = "recognition_button";
  document.body.appendChild(recognition_button);
  recognition_button.onclick = function () {
    // 填写用户名密码
    writeUserInfo();
    // 识别填写验证码
    recognition();
  };
});
