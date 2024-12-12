(function () {
  console.log("这是 simple-chrome-plugin-demo 的content-script！");
})();

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

function getCaptchaCode(imgBlob) {
  const url = "http://127.0.0.1:5000/img_recognition"; // 替换为你的 API 地址

  const xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      const data = JSON.parse(xhr.responseText);
      // 处理接收到的数据
      console.log("数据:", data);
    } else {
      console.error("请求失败:", xhr.status);
    }
  };
  xhr.onerror = function () {
    console.error("请求错误");
    document.getElementById("response").textContent = "请求错误";
  };
  xhr.send(imgBlob);
}

function main() {
  getImg().then((img) => {
    getCaptchaCode(img);
  });
}

setTimeout(() => {
  main();
}, 5000);
