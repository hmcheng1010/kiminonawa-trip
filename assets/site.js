// Shared header/footer, theme toggle, and photo credits.
(function () {
  var pages = [
    ["index.html", "總覽"],
    ["itinerary.html", "每日行程"],
    ["photo.html", "📸 拍攝攻略"],
    ["spots.html", "景點重點"],
    ["hotels.html", "住宿與航班"],
    ["costs.html", "交通與門票"],
    ["safety.html", "安全與延誤"],
  ];
  var here = location.pathname.split("/").pop() || "index.html";

  try {
    var saved = localStorage.getItem("theme");
    if (saved) document.documentElement.setAttribute("data-theme", saved);
  } catch (e) {}

  var header = document.createElement("header");
  header.className = "site-header";
  var links = pages.map(function (p) {
    return '<a href="' + p[0] + '"' + (p[0] === here ? ' class="active"' : "") + ">" + p[1] + "</a>";
  }).join("");
  header.innerHTML = '<div class="inner"><a class="brand" href="index.html">🌠 你的名字・日本家族旅行</a>' +
    '<nav class="nav">' + links + '<button class="theme-btn" type="button" aria-label="切換深淺色">🌓</button></nav></div>';
  document.body.insertBefore(header, document.body.firstChild);
  header.querySelector(".theme-btn").addEventListener("click", function () {
    var cur = document.documentElement.getAttribute("data-theme");
    var dark = cur ? cur === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    var next = dark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  var footer = document.createElement("footer");
  footer.innerHTML = '價格、時刻與營業資訊皆為估計值，出發前請以各官方網站為準。<br>' +
    '景點照片來自 Wikimedia Commons 的自由授權作品，非電影畫面，作者與授權見 <a href="credits.html">照片出處</a>。';
  document.body.appendChild(footer);

  // Fill photo captions from credits.json
  var figs = document.querySelectorAll("figure[data-img]");
  var creditsTable = document.getElementById("credits-table");
  if (!figs.length && !creditsTable) return;
  fetch("images/credits.json").then(function (r) { return r.json(); }).then(function (c) {
    figs.forEach(function (f) {
      var k = f.getAttribute("data-img"), info = c[k];
      if (!info) return;
      var cap = document.createElement("figcaption");
      cap.innerHTML = '照片：' + esc(info.artist) + '／<a href="' + info.page + '" target="_blank" rel="noopener">' + esc(info.license) + '</a>';
      f.appendChild(cap);
    });
    if (creditsTable) {
      creditsTable.innerHTML = Object.keys(c).sort().map(function (k) {
        var i = c[k];
        return "<tr><td><img src=\"images/" + i.file + "\" alt=\"\" style=\"width:96px;aspect-ratio:4/3;object-fit:cover;border-radius:6px\" loading=\"lazy\"></td>" +
          '<td><a href="' + i.page + '" target="_blank" rel="noopener">' + esc(i.title.replace(/^File:/, "")) + "</a></td>" +
          "<td>" + esc(i.artist) + "</td><td>" +
          (i.licenseUrl ? '<a href="' + i.licenseUrl + '" target="_blank" rel="noopener">' + esc(i.license) + "</a>" : esc(i.license)) + "</td></tr>";
      }).join("");
    }
  }).catch(function () {});
  function esc(s) { return String(s).replace(/[&<>"]/g, function (ch) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]; }); }
})();
