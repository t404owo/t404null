console.log(document);
let next = document.querySelector(".next");
let prev = document.querySelector(".prev");
let pgctrl = document.querySelectorAll(".pgctrl li");
let slider = document.querySelector(".slider");
let carousel = document.querySelector(".carousel");

if (!document) console.log("press f");
if (!next) console.log("Class next missing.");
if (!prev) console.log("Class prev missing.");
if (!pgctrl) console.log("Page Control missing.");
if (!slider) console.log("Class slider missing.");
if (!carousel) console.log("Class carousel missing.");
let slider_index = 0;
let touchstartX = 0;
let touchendX = 0;

function reset() {
  for (var i = 0; i < slider.children.length; i++) {
    slider.children[i].style.opacity = 0;
    slider.children[i].style.zIndex = 0;
    pgctrl[i].style.opacity = 0.4;
  }
}
reset();
set();
function set() {
  slider.children[slider_index].style.opacity = 1;
  slider.children[slider_index].style.zIndex = 1;
  pgctrl[slider_index].style.opacity = 1;
}

function dropdown_toggle() {
  //
}
function nxt() {
  reset();
  //console.log("next");
  if (slider_index < slider.children.length - 1) slider_index += 1;
  else {
    slider_index = 0;
    //console.log("set to 1.");
  }
  set();
}
function prv() {
  reset();

  //console.log("prev");
  if (slider_index > 0) slider_index -= 1;
  else {
    slider_index = slider.children.length - 1;
    //console.log(`set to ${slider_index}.`);
  }
  set();
}

//next
if (next) {
  next.addEventListener("click", nxt);
  setInterval(nxt, 30000);
}

//previous
if (prev) prev.addEventListener("click", prv);

//page control
pgctrl.forEach(function (n, m) {
  n.addEventListener("click", function () {
    reset();
    slider_index = m;
    set();
  });
});

function checkX() {
  if (touchendX < touchstartX && touchstartX - touchendX > 50) nxt();
  if (touchendX > touchstartX && touchendX - touchstartX > 50) prv();
}
//slider.children.forEach((carousel, num) => {
carousel.addEventListener("touchstart", (e) => {
  touchstartX = e.changedTouches[0].screenX;
});
carousel.addEventListener("touchend", (e) => {
  touchendX = e.changedTouches[0].screenX;
  checkX();
});
//});

//location.reload(true);
