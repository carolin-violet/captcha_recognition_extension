(function () {
  console.log("这是 simple-chrome-plugin-demo 的content-script！");
})();

function getImg() {
  const canvasContainer = document.querySelector(".identityCode");
  const canvas = canvasContainer.querySelector("canvas");
  console.log("canvas", canvas);
}

setTimeout(() => {
  getImg();
}, 5000);
