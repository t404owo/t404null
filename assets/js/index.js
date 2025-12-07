//Carousel
let next = document.querySelector(".next");
let prev = document.querySelector(".prev");

let pages = document.getElementById("pages");
let pgctrl = document.querySelector(".pgctrl");
let slider = document.querySelector(".slider");
let carousel = document.querySelector(".carousel");

let bg = document.querySelector(".slider-bg");

//Album-cards
let album_cards = document.querySelector(".album-cards"),
half_img_cards = document.querySelector(".half-image-cards");

//The Database call.
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js";

const supabaseUrl = "https://owbamcqdmqetrgcznxva.supabase.co";
const supabaseKey =
  "sb_publishable_b0fMYw5I1X97gQXJLVBnrA_-0L4qHGv";
//anon key, you cant access private stuffs or add hilarious stuffs w/ this...
//(unless sending me some malicious links but I delete your msg)
//the moment you notice you need an API endpoint.
const supabase = createClient(supabaseUrl, supabaseKey);

//the elements for the carousel
if (!document) console.log("press f");
if (!next) console.log("Class next missing.");
if (!prev) console.log("Class prev missing.");
if (!pgctrl) console.log("Page Control missing.");
if (!slider) console.log("Class slider missing.");
if (!carousel) console.log("Class carousel missing.");
let slider_index = 0;
let touchstartX = 0;
let touchendX = 0;
let highlights = [],
  releases = [],
  activities = [],
  default_highlights = [
    {
      img_url:
        "https://cdn.glitch.com/f6cb427c-2cdb-4693-bc00-9d3e2991008c%2FScreenshot%20(36).png?v=1633031087464",
      url: "/",
      title: "This page is still under construction.",
      preview:
        "The page is still under development. In cases, this page will change after reload or after a few days and a reload.",
    },
  ];

let path_name = window.location.pathname;
//Start building the page by calling data
let params = new URLSearchParams(location.search);
if (!params.get("release")) {
  if (path_name === "/") {
    document.title = "t404:null | Home";
    build_event(0);
  }
  if (path_name === "/" || path_name === "/release" || path_name === "/release/") build_event(1);
  if (path_name === "/" || path_name === "/activity" || path_name === "/activity/") build_event(2);
} else {
  let main = document.querySelector("main");
  main.innerHTML = "";
  /*
  <div class="release-track" style="
          background-image: url(https://cdn.glitch.global/f594d6b7-e72e-477c-b5cb-d71abbd39f44/oblitus-requiem.png);
          background-size: cover;
          background-position: center;
        ">
        <div class="text-box">
          <h1 class="title">
            <strong>Insert Title here</strong>
          </h1>
          (Raw Context here)
        </div>
      </div>
  */
  let id = params.get("release").replace(/^\//g, "");
  console.log(id);
  supabase
    .from("events")
    .select("title, context, bg_src")
    .or("event_type.eq.release,event_type.eq.highlight_release")//
    .eq("event_id", id)
    .then((d) => {
      let res = d.data;
      if (res !== null && res.length > 0) {
        let _pg = document.createElement("div"),
          _box = document.createElement("div"),
          _longbr = document.createElement("div"),
          _h1 = document.createElement("h1"),
          title = document.createElement("strong"),
          data = res[0];
        
        _longbr.classList.add("long-break");

        _pg.classList.add("release-track");
        _pg.style =
          "background-image: url(" +
          data.bg_src +
          ");" +
          "background-size: cover;" +
          "background-position: center;";

        _box.classList.add("text-box");
        title.textContent = data.title;
        
        
        main.appendChild(_pg);
        _box.appendChild(_longbr);
        _pg.appendChild(_box);
        _box.appendChild(_h1);
        _h1.appendChild(title);
        _box.innerHTML+=data.context;

        document.title = "t404:null | " + data.title;
      } else {
        main.innerHTML = "404";
        document.title = "t404:null | Not Found";
      }
    });
}

// #region Slider section

function build_event(i) {
  let conditions = [
      "event_type.eq.highlight,event_type.eq.highlight_activity,event_type.eq.highlight_release",
      "event_type.eq.release,event_type.eq.highlight_release",
      "event_type.eq.activity,event_type.eq.highlight_activity",
    ],
    inits = [init_highlights, init_releases, init_activities];
  supabase
    .from("events")
    .select("url, title, subtitle, preview, img_src")
    .order("id", i < 1 ? { ascending: true } : { descending: true })
    .limit(10)
    .or(conditions[i])
    .then(inits[i]);
}

function init_highlights(d) {
  if (d.error) {
    console.error("Error fetching data:", d.error);
  } else {
    highlights = d.data;
    if (d.data.length === 0) highlights = default_highlights;

    highlights.forEach((a) => {
      let _pg = document.createElement("section"),
        _div = document.createElement("div");
      let _h1 = document.createElement("h1"),
        _p = document.createElement("p");

      _h1.classList.add("title");
      _h1.textContent = a.title;

      _p.classList.add("desc");
      _p.textContent = a.preview;

      _div.appendChild(_h1);
      _div.appendChild(_p);
      _pg.appendChild(_div);
      pages.appendChild(_pg);
    });
    pg_ctrl();

    //refresh
    reset();
    set();

    //next
    if (next) {
      next.addEventListener("click", nxt);
      setInterval(nxt, 30000);
    }

    //previous
    if (prev) prev.addEventListener("click", prv);

    slider.onclick = function () {
      location.assign(highlights[slider_index].url);
    };
    //slider.children.forEach((carousel, num) => {
    carousel.addEventListener("touchstart", (e) => {
      touchstartX = e.changedTouches[0].screenX;
    });
    carousel.addEventListener("touchend", (e) => {
      touchendX = e.changedTouches[0].screenX;
      checkX();
    });
  }
}

function pg_ctrl() {
  for (var i = 0; i < slider.children.length; i++) {
    let button = document.createElement("li");
    let n = i;
    button.textContent = "•"; //&bull; not &middot;
    pgctrl.appendChild(button);

    if (pgctrl)
      button.addEventListener("click", function () {
        reset();
        slider_index = n;
        set();
      });
  }
}

function set() {
  slider.children[slider_index].style.opacity = 1;
  slider.children[slider_index].style.zIndex = 1;
  [].slice.call(pgctrl.children)[slider_index].style.opacity = 1;
  if (bg)
    bg.style.backgroundImage = `url('${highlights[slider_index].img_src}')`;
}
function reset() {
  for (var i = 0; i < slider.children.length; i++) {
    slider.children[i].style.opacity = 0;
    slider.children[i].style.zIndex = 0;
    [].slice.call(pgctrl.children)[i].style.opacity = 0.4;
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

//touchswipe control
function checkX() {
  if (touchendX < touchstartX && touchstartX - touchendX > 60) nxt();
  if (touchendX > touchstartX && touchendX - touchstartX > 60) prv();
}

// #endregion

async function init_releases(d) {
  if (d.error) {
    console.error("Error fetching data:", d.error);
  } else {
    releases = d.data;
    /*
        <a class="card" href="/release">
          <div class="bg-img" style="
              background-image: url(https://cdn.glitch.me/f6cb427c-2cdb-4693-bc00-9d3e2991008c%2FC9B955D3-3A2A-4B83-92EB-EBCBDEB2B458.jpeg);
            "></div>
          <h2>PoΣΣεssion (Possession)</h2>
          <p>Formerly "Mayonaka Dancehall!!!" (:DACHiTRAX) Release.</p>
          <p>Ghost and monsters are gathering you...</p>
        </a>
        <a class="card" href="/release">
          <div class="bg-img" style="
              background-image: url(https://cdn.glitch.global/2d9e31c1-a947-46cd-9fd2-8c92be70abe2/Hyper_Limimality.png);
            "></div>
          <h2>Hyper Liminality</h2>
          <p>t404:null &amp; trung-nova &amp; AXiS</p>
          <p>"until you reach it... the two hyper sides."</p>
        </a>
        <a class="card" href="/release/A_Lake_With_Endless_Stars">
          <div class="bg-img" style="
              background-image: url(https://cdn.glitch.global/2d9e31c1-a947-46cd-9fd2-8c92be70abe2/A_Lake_With_Endless_Stars.png);
            "></div>
          <h2>A Lake With Endless Stars</h2>
          <p> "Under the coruscating night sky, gaze into the kaleidoscopic waters..." </p>
        </a>
        <a class="card" href="/release/Oblitus_Requiem">
          <div class="bg-img" style="
              background-image: url(https://cdn.glitch.global/f594d6b7-e72e-477c-b5cb-d71abbd39f44/oblitus-requiem.png);
            "></div>
          <h2>Oblitus Requiem \\Against the Forsaken Legacy//</h2>
          <p>VNMC2023 Grand Finals Tiebreaker.</p>
          <p> "Even if you don't remember me now, I will bring the you I once knew back from them." </p>
        </a>
*/
    if(releases.length>0)album_cards.innerHTML="";
    releases.forEach((a) => {
      let _card = document.createElement("a"),
        _bg_img = document.createElement("div"),
        _h2 = document.createElement("h2"),
        _p_subtitle = document.createElement("p"),
        _p_preview = document.createElement("p");
      _card.href = a.url;

      _card.classList.add("card");

      _bg_img.classList.add("bg-img");
      _bg_img.style = "background-image: url(" + a.img_src + ");";

      _h2.textContent = a.title;

      _p_subtitle.textContent = a.subtitle;
      _p_preview.textContent = a.preview;

      _card.appendChild(_bg_img);
      _card.appendChild(_h2);
      _card.appendChild(_p_subtitle);
      _card.appendChild(_p_preview);
      album_cards.appendChild(_card);
    });
  }
}
async function init_activities(d) {
  if (d.error) {
    console.error("Error fetching data:", d.error);
  } else {
    activities = d.data;
    /*<a class="card" href="/activity">
          <div class="bg-img" style="
              background-image: url(https://cdn.glitch.global/f594d6b7-e72e-477c-b5cb-d71abbd39f44/fof-genesis.png);
            "></div>
          <h2>Fanmade of Fighters I: Genesis</h2>
          <p>BOF-like Contest Releases.</p>
          <p> Our team (Sine Fine Stellae) Achieved #2 :D <br />
            <br />
            <strong>A Lake With Endless Stars</strong> is one of the soundtracks from Sine Fine Stellae produced by me, thanks to the help of Riprider500 and more people :D
          </p>
        </a>
        <a class="card" href="/activity">
          <div class="bg-img" style="
              background-image: url(https://cdn.glitch.global/f594d6b7-e72e-477c-b5cb-d71abbd39f44/vnmc2023.png?v=1717348650235);
            "></div>
          <h2>VNMC 2023</h2>
          <p> (Vietnamese National Mania Championship 2023) Grand Finals Tiebreaker by me (t404:null) </p>
          <p>
            <strong>Oblitus Requiem &bsol;&bsol;Against the Forsaken Legacy//</strong>
            <br />
            <br /> "Even if you don't remember me now, I will bring the you I once knew back from them." <br />
            <br />Sivelia (the host of VNMC) has asked me making a custom soundtrack round for the tourney. The soundtrack get much likes and subscribers on Youtube within 2 weeks as the tournament got a big impact gained. Big thank you to all VNMC staffs for that!
          </p>
        </a>
        <a class="card" href="/activity">
          <div class="bg-img" style="
              background-image: url(https://cdn.glitch.global/f594d6b7-e72e-477c-b5cb-d71abbd39f44/glitch1.jpg);
            "></div>
          <h2>VNMC 2024 (???)</h2>
          <p>???</p>
          <p> Li4tLiAuLS0gLS4uIC0tLi4u <br />&bsol;-...-4buoe2v1qZuiULSrOPuzXZBn <br />YZt0ULSr9PuzvfuiaZwo5ZBseZB39 <br />fuzpLxn9PurYZtz4PtzpVSlC3u3UrviaZO </p>
        </a>
        <a class="card" href="/activity">
          <div class="bg-img" style="
              background-image: url(https://cdn.glitch.global/f594d6b7-e72e-477c-b5cb-d71abbd39f44/glitch2.jpg);
            "></div>
          <h2>VNMC 2024 (???) (w/ ??? as ???)</h2>
          <p>???</p>
        </a>
        <a class="card" href="/activity">
          <div class="bg-img" style="
              background-image: url(https://cdn.glitch.global/f594d6b7-e72e-477c-b5cb-d71abbd39f44/glich3.jpg);
            "></div>
          <h2>???? 5 (????2024) (w/ ??? as ???)</h2>
          <p>???</p>
          <p>???</p>
        </a>*/
    if(activities.length>0)album_cards.innerHTML="";
    activities.forEach((a) => {
      let _card = document.createElement("a"),
        _bg_img = document.createElement("div"),
        _h2 = document.createElement("h2"),
        _p_subtitle = document.createElement("p"),
        _p_preview = document.createElement("p");
      _card.href = a.url;
      _card.classList.add("card");

      _bg_img.classList.add("bg-img");
      _bg_img.style = "background-image: url(" + a.img_src + ");";

      _h2.textContent = a.title;

      _p_subtitle.textContent = a.subtitle;
      _p_preview.textContent = a.preview;

      _card.appendChild(_bg_img);
      _card.appendChild(_h2);
      _card.appendChild(_p_subtitle);
      _card.appendChild(_p_preview);
      half_img_cards.appendChild(_card);
    });
  }
}
