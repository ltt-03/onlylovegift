
var bbiTL = new TimelineMax(),
  // logo
  frame = document.getElementById("frame"),
  happy = document.getElementById("happy"),
  merry = document.getElementById("merry"),
  christmas = document.getElementById("christmas"),
  trees = document.getElementById("trees"),
  middle_tree = document.getElementById("middle_tree"),
  left_tree = document.getElementById("left_tree"),
  right_tree = document.getElementById("right_tree");

// animations

// item drop
var totalItems = 18;
for (var i = 1; i <= totalItems; ++i) {
  var lenght = Math.random() * (4.5 - 3) + 3;
  var start = Math.random();

  // hanging
  hanging(totalItems, i, lenght, start);

  bbiTL.fromTo(
    "#item" + i,
    lenght,
    { y: -($("#item" + i).height() / 3) },
    { ease: Bounce.easeOut, y: 0 },
    start
  );
}

// item hanging

function hanging(totalItems, i, lenght, start) {
  var hangOffset = 0.3;
  var hangStart = start + lenght - 0.2;
  var delay = Math.random() * 3 + 1;
  var rotation = -((1 / lenght) * 3);
  bbiTL.to(
    "#item" + i,
    hangOffset,
    {
      rotation: rotation,
      transformOrigin: "0% 0%",
      repeatDelay: 0,
      ease: Back.easeOut.config(2),
      repeat: -1,
    },
    hangStart / 3
  );
  bbiTL.to(
    "#item" + i,
    10,
    {
      rotation: 0,
      transformOrigin: "0% 0%",
      ease: Elastic.easeOut.config(2.5, 0.1),
      repeatDelay: hangOffset,
      repeat: -1,
    },
    (hangStart + hangOffset) / 3
  );
  console.log(rotation);
}

function happyNewYear() {
  for (var h = 1; h <= 16; ++h) {
    var leters = h * 0.1;
    bbiTL.fromTo(
      ".happy_" + h,
      0.2,
      { scale: -1, opacity: 0 },
      { scale: 1, ease: Back.easeOut.config(1.4), opacity: 1 },
      leters + 4
    );
  }
}

// snow
var canvas = document.getElementById("snow"),
  ctx = canvas.getContext("2d"),
  width = (ctx.canvas.width = canvas.offsetWidth),
  height = (ctx.canvas.height = canvas.offsetHeight),
  animFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame,
  snowflakes = [];

window.onresize = function () {
  width = ctx.canvas.width = canvas.offsetWidth;
  height = ctx.canvas.height = canvas.offsetHeight;

  for (var i = 0; i < snowflakes.length; i++) {
    snowflakes[i].resized();
  }
};

function update() {
  for (var i = 0; i < snowflakes.length; i++) {
    snowflakes[i].update();
  }
}

function Snow() {
  this.x = random(0, width);
  this.y = random(-height, 0);
  this.radius = random(0.5, 3.0);
  this.speed = random(0.5, 2.0);
  this.wind = random(-0.1, 1.0);
  this.isResized = false;

  this.updateData = function () {
    this.x = random(0, width);
    this.y = random(-height, 0);
  };

  this.resized = function () {
    this.isResized = true;
  };
}

Snow.prototype.draw = function () {
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.closePath();
};

Snow.prototype.update = function () {
  this.y += this.speed;
  this.x += this.wind;

  if (this.y > ctx.canvas.height) {
    if (this.isResized) {
      this.updateData();
      this.isResized = false;
    } else {
      this.y = 0;
      this.x = random(0, width);
    }
  }
};

function createSnow(count) {
  for (var i = 0; i < count; i++) {
    snowflakes[i] = new Snow();
  }
}

function draw() {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  for (var i = 0; i < snowflakes.length; i++) {
    snowflakes[i].draw();
  }
}

function loop() {
  draw();
  update();
  animFrame(loop);
}

function random(min, max) {
  var rand = (min + Math.random() * (max - min)).toFixed(1);
  rand = Math.round(rand);
  return rand;
}

createSnow(200);
loop();

//----------tree----------
// MorphSVGPlugin.convertToPath("polygon"); // Đã bỏ - dùng stub nếu có
if (typeof MorphSVGPlugin !== 'undefined' && MorphSVGPlugin.convertToPath) {
  MorphSVGPlugin.convertToPath("polygon");
}

var xmlns = "http://www.w3.org/2000/svg",
  xlinkns = "http://www.w3.org/1999/xlink",
  select = function (s) {
    return document.querySelector(s);
  },
  selectAll = function (s) {
    return document.querySelectorAll(s);
  },
  pContainer = select(".pContainer"),
  mainSVG = select(".mainSVG"),
  star = select("#star"),
  sparkle = select(".sparkle"),
  tree = select("#tree"),
  showParticle = true,
  particleColorArray = [
    "#E8F6F8",
    "#ACE8F8",
    "#F6FBFE",
    "#A2CBDC",
    "#B74551",
    "#5DBA72",
    "#910B28",
    "#910B28",
    "#446D39",
  ],
  particleTypeArray = ["#star", "#circ", "#cross", "#heart"],
  particlePool = [],
  particleCount = 0,
  numParticles = 201;

gsap.set("svg", {
  visibility: "visible",
});

gsap.set(sparkle, {
  transformOrigin: "50% 50%",
  y: -100,
});

// MotionPathPlugin.getRawPath - dùng fallback nếu plugin không có
var hasMPPlugin = typeof MotionPathPlugin !== 'undefined' && typeof MotionPathPlugin.getRawPath === 'function';

let getSVGPoints = (path) => {
  if (!hasMPPlugin) {
    // Fallback: trả về mảng điểm cố định cho treePath
    return [
      {x: 100, y: 0}, {x: 150, y: 50}, {x: 200, y: 100},
      {x: 150, y: 80}, {x: 100, y: 120}
    ];
  }
  let arr = [];
  var rawPath = MotionPathPlugin.getRawPath(path)[0];
  if (!rawPath || rawPath.length === 0) return [{x:100,y:0},{x:100,y:120}];
  rawPath.forEach((el, value) => {
    let obj = {};
    obj.x = rawPath[value * 2];
    obj.y = rawPath[value * 2 + 1];
    if (value % 2) {
      arr.push(obj);
    }
  });
  return arr;
};

let treePath, treeBottomPath;
try {
  treePath = getSVGPoints(".treePath");
  treeBottomPath = getSVGPoints(".treeBottomPath");
} catch(e) {
  treePath = [{x:100,y:0},{x:100,y:120}];
  treeBottomPath = [{x:100,y:120},{x:100,y:140}];
}

let mainTl = gsap.timeline({ delay: 0, repeat: 0 }),
  starTl;

function flicker(p) {
  gsap.killTweensOf(p, { opacity: true });
  gsap.fromTo(
    p,
    {
      opacity: 1,
    },
    {
      duration: 0.07,
      opacity: Math.random(),
      repeat: -1,
    }
  );
}

function createParticles() {
  var i = numParticles,
    p,
    particleTl,
    step = numParticles / (treePath.length || 1),
    pos;
  while (--i > -1) {
    p = select(particleTypeArray[i % particleTypeArray.length]).cloneNode(true);
    mainSVG.appendChild(p);
    p.setAttribute("fill", particleColorArray[i % particleColorArray.length]);
    p.setAttribute("class", "particle");
    particlePool.push(p);
    //hide them initially
    gsap.set(p, {
      x: -100,
      y: -100,
      transformOrigin: "50% 50%",
    });
  }
}

var getScale = gsap.utils.random(0.5, 3, 0.001, true);

function playParticle(p) {
  if (!showParticle) {
    return;
  }
  var p = particlePool[particleCount];
  var cx = gsap.getProperty(".pContainer", "x") || 100;
  var cy = gsap.getProperty(".pContainer", "y") || 100;
  gsap.set(p, {
    x: cx,
    y: cy,
    scale: getScale(),
  });
  
  // Thay physics2D bằng animation đơn giản (không dùng paid plugin)
  var angle = Math.random() * Math.PI * 2;
  var vel = 30 + Math.random() * 60;
  var dur = 1 + Math.random() * 3;
  var tl = gsap.timeline();
  tl.to(p, {
    duration: dur,
    x: '+=' + (Math.cos(angle) * vel),
    y: '+=' + (Math.sin(angle) * vel + 30),
    scale: 0,
    rotation: Math.random() * 360 - 180,
    ease: "power2.out",
    onStart: flicker,
    onStartParams: [p],
  });

  particleCount++;
  particleCount = particleCount >= numParticles ? 0 : particleCount;
}

function drawStar() {
  starTl = gsap.timeline({ onUpdate: playParticle });
  
  if (hasMPPlugin) {
    // Dùng MotionPathPlugin nếu có (free plugin, đã download về local)
    starTl
      .to(".pContainer, .sparkle", {
        duration: 6,
        motionPath: {
          path: ".treePath",
          autoRotate: false,
        },
        ease: "linear",
      })
      .to(".pContainer, .sparkle", {
        duration: 1,
        onStart: function () {
          showParticle = false;
        },
        x: (treeBottomPath[0] || {x:100}).x,
        y: (treeBottomPath[0] || {y:120}).y,
      })
      .to(
        ".pContainer, .sparkle",
        {
          duration: 2,
          onStart: function () {
            showParticle = true;
          },
          motionPath: {
            path: ".treeBottomPath",
            autoRotate: false,
          },
          ease: "linear",
        },
        "-=0"
      )
      .from(
        ".treeBottomMask",
        {
          duration: 2,
          // drawSVG: "0% 0%", -- thay bằng opacity fallback
          opacity: 0,
          ease: "linear",
        },
        "-=2"
      );
  } else {
    // Fallback khi không có MotionPathPlugin: di chuyển từ trên xuống
    starTl
      .fromTo(".pContainer, .sparkle", {
        y: -100,
        x: mainSVG ? mainSVG.getBoundingClientRect().width / 2 : 200,
        opacity: 1
      }, {
        duration: 8,
        y: 400,
        ease: "power1.inOut",
      })
      .to(".treeBottomMask", { duration: 2, opacity: 1, ease: "linear" }, "-=2");
  }
}

createParticles();
drawStar();

mainTl
  .from([".treePathMask", ".treePotMask"], {
    // drawSVG: "0% 0%", -- thay bằng opacity/clipPath fallback
    opacity: 0,
    duration: 6,
    stagger: {
      each: 2,
    },
    ease: "linear",
  })
  .from(
    ".treeStar",
    {
      duration: 3,
      scaleY: 0,
      scaleX: 0.15,
      transformOrigin: "50% 50%",
      ease: "elastic(1,0.5)",
    },
    "-=4"
  )

  .to(
    ".sparkle",
    {
      duration: 3,
      opacity: 0,
      ease: "power1.inOut", // thay "rough" ease (paid) bằng power1
    },
    "-=0"
  )
  .to(
    ".treeStarOutline",
    {
      duration: 1,
      opacity: 1,
      ease: "power2.out", // thay "rough" ease (paid) bằng power2
    },
    "+=1"
  );

mainTl.add(starTl, 0);
gsap.globalTimeline.timeScale(1.5);

$(document).ready(function () {
  var $card = $(".card"),
    $bgCard = $(".bgCard"),
    $icon = $(".icon"),
    cartPageBottomP = document.querySelector(".cart-page-bottom p"),
    cartPageBottomH4 = document.querySelector(".cart-page-bottom h4");
    var textTitle = window.DYNAMIC_DATA && window.DYNAMIC_DATA.recipientName ? `Này ${window.DYNAMIC_DATA.recipientName}!` : "Này Cậu!";
    var charArrTitle = textTitle.split('');
    var text = window.DYNAMIC_DATA && window.DYNAMIC_DATA.messages && window.DYNAMIC_DATA.messages.length > 0 
        ? window.DYNAMIC_DATA.messages.join("\n") 
        : "Cậu đẹp theo cách của riêng cậu, mình yêu tất cả những điều đó !!";
    var charArrContent = text.split('');
var currentIndexTitle = 0;
var currentIndexContent = 0;
var textIntervalTitle;
var textIntervalContent;
function resetText(){
    clearInterval(textIntervalTitle)
    clearInterval(textIntervalContent)
    cartPageBottomH4.textContent = "";
    cartPageBottomP.textContent = "";
    currentIndexTitle = 0;
    currentIndexContent = 0;
}
  $card.on("click", function () {
    $(this).toggleClass("is-opened");
    if($card.hasClass("is-opened")){
        textIntervalTitle = setInterval(function(){
            if(currentIndexTitle < charArrTitle.length){
                cartPageBottomH4.textContent += charArrTitle[currentIndexTitle];
                currentIndexTitle++;
                console.log(currentIndexTitle)
            }
            else{
                clearInterval(textIntervalTitle)
                textIntervalContent = setInterval(function(){
                    if(currentIndexContent < charArrContent.length){
                        cartPageBottomP.textContent += charArrContent[currentIndexContent];
                        currentIndexContent++;
                console.log(currentIndexContent)
                    }
                    else{
                        clearInterval(textIntervalContent)
                    }
                },100)
            }
        },100)
    }
    else{
        resetText()
    }
  });

  $(".centerer").on("click", function () {
    $card.fadeIn();
    $bgCard.fadeIn();
    $icon.fadeIn();
  });
  $(".fa-xmark").on("click", function () {
    $card.fadeOut();
    $bgCard.fadeOut();
    $icon.fadeOut();
    $card.removeClass("is-opened");
    resetText()
  });

});

