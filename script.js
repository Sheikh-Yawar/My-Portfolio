//For svg animation
let paths = document.querySelectorAll("path");
let svg = document.querySelector("svg");
let drawAudio = new Audio("audio/draw.mp3");
let didUserClick = false;
drawAudio.volume = 0.5;

const rect = svg.getBoundingClientRect();
const animateSvg = () => {
  let scrollTop =
    window.pageYOffset ||
    (document.documentElement || document.body.parentNode || document.body)
      .scrollTop;

  //Knowing when svg is scrolled into view
  if (scrollTop >= (rect.bottom - rect.top) / 2 - 50) {
    if (didUserClick) {
      drawAudio.play();
    }
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
        // console.log(path.style.strokeDashoffset);
        if (path.style.strokeDashoffset < 0) {
          clearInterval(intervalId);
          svg.style.fill = "black";
        }
      }
    }
    window.removeEventListener("scroll", animateSvg);
  }
};
window.addEventListener("scroll", animateSvg);

// For Matter js
const {
  Engine,
  Render,
  Runner,
  World,
  Bodies,
  MouseConstraint,
  Mouse,
  Composite,
  Constraint,
  Events,
} = Matter;

//Getting canvas element
const canvas = document.querySelector(".canvas");
width = canvas.offsetWidth;
height = canvas.offsetHeight;

//Create a new instance of engine
const engine = Engine.create();

//Get the world object that gets created with engine.
const { world } = engine;

//configuration regarding where to render
const render = Render.create({
  //appends the canvas to body
  element: canvas,
  engine,
  options: {
    width: width,
    height: height,
    pixelRatio: window.devicePixelRatio,
  },
});

//Awaken the render element, and tell it to draw
Render.run(render);
//Transfer the state of world from A to B
Runner.run(Runner.create(), engine);
engine.gravity.y = 0.01;
//Making Walls
const wallWidth = 1;
const walls = [
  Bodies.rectangle(Math.floor(width / 2), 0, width, wallWidth, {
    isStatic: true,
  }),
  Bodies.rectangle(Math.floor(width / 2), height, width, wallWidth, {
    isStatic: true,
  }),
  Bodies.rectangle(0, Math.floor(height / 2), wallWidth, height, {
    isStatic: true,
  }),
  Bodies.rectangle(width, Math.floor(height / 2), wallWidth, height, {
    isStatic: true,
  }),
];

// //add the new changes to World object
let mouseConstraint;
World.add(world, walls);

// Mouse constraint
const creatingMouseConstraint = () => {
  const mOptions = {
    mouse: Mouse.create(render.canvas),
    constraint: {
      stiffness: 1,
    },
  };

  mouseConstraint = MouseConstraint.create(engine, mOptions);
  World.add(world, mouseConstraint);

  mouseConstraint.mouse.element.removeEventListener(
    "mousewheel",
    mouseConstraint.mouse.mousewheel
  );
  mouseConstraint.mouse.element.removeEventListener(
    "DOMMouseScroll",
    mouseConstraint.mouse.mousewheel
  );
};

// Checking whether website is opened on phone or desktop
let endSystem = navigator.userAgent;
let regexp = /android|iphone|kindle|ipad/i;
let isMobileDevice = regexp.test(endSystem);
let numParticles;
if (isMobileDevice) {
  numParticles = 50;
} else {
  creatingMouseConstraint();
  numParticles = 220;
}

const bodyOptions = {
  frictionAir: 0,
  friction: 0,
  restitution: 0,
};

//Random Shapes
const boxes = [];
for (let i = 0; i < numParticles; i++) {
  if (i % 2 == 0) {
    box = Bodies.rectangle(
      Math.random() * width,
      Math.random() * height,
      Math.random() * 50,
      Math.random() * 60,
      bodyOptions
    );
  } else {
    box = Bodies.circle(
      Math.random() * width,
      Math.random() * height,
      Math.random() * 40,
      bodyOptions
    );
  }
  boxes.push(box);
  World.add(world, box);
}

window.addEventListener("click", (e) => {
  didUserClick = true;
  let box = Bodies.polygon(
    e.clientX,
    e.clientY,
    Math.floor(Math.random() * 8),
    30
  );
  boxes.push(box);
  World.add(world, box);
});

// Add Gravity
let t = 0;
const changeGravity = function () {
  t = t + Math.random();

  engine.gravity.x = Math.sin(t);
  engine.gravity.y = Math.cos(t);

  requestAnimationFrame(changeGravity);
};

changeGravity();
