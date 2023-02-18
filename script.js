let paths = document.querySelectorAll("path");
let svg = document.querySelector("svg");

let time = 0;
let duration = 1000;
let drawing = 0;

const intervalId = setInterval(fillSvgPaths, 50);

let drawPercent = 0;
function fillSvgPaths() {
  drawPercent += 0.01;
  for (let path of paths) {
    let pathLength = path.getTotalLength();

    path.style.strokeDasharray = pathLength;
    path.style.strokeDashoffset = pathLength;
    let drawLength = pathLength * drawPercent;
    path.style.strokeDashoffset = pathLength - drawLength;
    console.log(path.style.strokeDashoffset);
    if (path.style.strokeDashoffset < 0) {
      clearInterval(intervalId);
      svg.style.fill = "black";
    }
  }
}
