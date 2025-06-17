let next = document.querySelector(".next");
let prev = document.querySelector(".prev");

let pages = document.getElementById("pages");
let pgctrl = [document.querySelector(".pgctrl")];
let slider = document.querySelector(".slider");
let carousel = document.querySelector(".carousel");

let bg = document.querySelector(".slider-bg");

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://owbamcqdmqetrgcznxva.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93YmFtY3FkbXFldHJnY3pueHZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI5NDU5NjIsImV4cCI6MjAzODUyMTk2Mn0.xNen7b513ZGwJ-Qu5iZ6K8qrmvy4QVjS10wiYbEEwKc";
//anon key, you cant access private stuffs or add hilarious stuffs w/ this...
//(unless sending me some malicious links but I delete your msg)
//the moment you notice you need an API endpoint.
const supabase = createClient(supabaseUrl, supabaseKey);

//prototype
let img = [
    "https://cdn.glitch.com/f6cb427c-2cdb-4693-bc00-9d3e2991008c%2FScreenshot%20(36).png?v=1633031087464",
    "https://cdn.glitch.global/f594d6b7-e72e-477c-b5cb-d71abbd39f44/oblitus-requiem.png?v=1717353087051",
    "https://cdn.glitch.global/2d9e31c1-a947-46cd-9fd2-8c92be70abe2/A_Lake_With_Endless_Stars.png",
  ],
  pg = ["/", "release/Oblitus_Requiem", "release/A_Lake_With_Endless_Stars"],
  title = [
    "This page is still under construction.",
    "Oblitus Requiem \\\\Against the Forsaken Legacy//",
    "A Lake With Endless Stars",
  ],
  desc = [
    "The page is still under development. In cases, this page will change after reload or after a few days and a reload.",
    '"Even if you don\'t remember me now, I will bring the you I once knew back from them."',
    '"Under the coruscating night sky, gaze into the kaleidoscopic waters..."',
  ];

if (!document) console.log("press f");
if (!next) console.log("Class next missing.");
if (!prev) console.log("Class prev missing.");
if (!pgctrl) console.log("Page Control missing.");
if (!slider) console.log("Class slider missing.");
if (!carousel) console.log("Class carousel missing.");
let slider_index = 0;
let touchstartX = 0;
let touchendX = 0;

//create pages and add buttons
init_page();
pg_ctrl();

pgctrl.push(document.querySelectorAll(".pgctrl li"));
if (pgctrl[1])
  pgctrl[1].forEach((m, n) =>
    m.addEventListener("click", function () {
      reset();
      slider_index = n;
      set();
    })
  );

//refresh
reset();
set();


let highlights, releases, activities;

async function fetch_highlights() {
  let { data, error } = await supabase
    .from("events")
    .select("url, title, subtitle, context, img_src")
    .eq("event_type", "highlight"); //note it only shows u public stuffs
  if (error) {
    console.error("Error fetching data:", error);
  } else {
    return (highlights = data);
  }
}
async function fetch_releases() {
  let { data, error } = await supabase
    .from("events")
    .select("url, title, subtitle, context, img_src")
    .eq("event_type", "release"); //note it only shows u public stuffs
  if (error) {
    console.error("Error fetching data:", error);
  } else {
    return (releases = data);
  }
}
async function fetch_activities() {
  let { data, error } = await supabase
    .from("events")
    .select("url, title, subtitle, context, img_src")
    .eq("event_type", "activity"); //note it only shows u public stuffs
  if (error) {
    console.error("Error fetching data:", error);
  } else {
    return (activities = data);
  }
}


fetch_releases();

console.log(releases);


function init_page() {
  for (var i = 0; i < 3; i++) {
    let _pg = document.createElement("section"),
      _div = document.createElement("div"),
      _desc = desc[i],
      _title = title[i];
    let _h1 = document.createElement("h1"),
      _p = document.createElement("p");

    _h1.classList.add("title");
    _h1.textContent = _title;

    _p.classList.add("desc");
    _p.textContent = _desc;

    _div.appendChild(_h1);
    _div.appendChild(_p);
    _pg.appendChild(_div);
    pages.appendChild(_pg);
  }
}
function pg_ctrl() {
  for (var i = 0; i < slider.children.length; i++) {
    let button = document.createElement("li");
    let n = i;
    button.textContent = "•"; //&bull; not &middot;
    pgctrl[0].append(button);
  }
}

function set() {
  slider.children[slider_index].style.opacity = 1;
  slider.children[slider_index].style.zIndex = 1;
  pgctrl[0].children[slider_index].style.opacity = 1;
  if (bg) bg.style.backgroundImage = `url('${img[slider_index]}')`;
}

// setInterval(getinfo, 60000);
// async function getinfo() {
//   let res = await fetch("");
//   const info = await res.json();
//   if (bg) bg.style.backgroundImage = `url('${info.slider[1].img}')`;
// }

function reset() {
  for (var i = 0; i < slider.children.length; i++) {
    slider.children[i].style.opacity = 0;
    slider.children[i].style.zIndex = 0;
    pgctrl[0].children[i].style.opacity = 0.4;
    if (bg) bg.style.backgroundImage = null;
  }
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

slider.onclick = function () {
  location.assign(pg[slider_index]);
};

//touchswipe control
function checkX() {
  if (touchendX < touchstartX && touchstartX - touchendX > 60) nxt();
  if (touchendX > touchstartX && touchendX - touchstartX > 60) prv();
}
//slider.children.forEach((carousel, num) => {
carousel.addEventListener("touchstart", (e) => {
  touchstartX = e.changedTouches[0].screenX;
});
carousel.addEventListener("touchend", (e) => {
  touchendX = e.changedTouches[0].screenX;
  checkX();
});

//location.reload(true);
