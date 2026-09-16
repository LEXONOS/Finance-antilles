(function(){
  var WA = "590690674028";
  var MAIL = "alexandre@financia-antilles.fr";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function waLink(msg){ return "https://wa.me/" + WA + "?text=" + encodeURIComponent(msg); }

  document.querySelectorAll("[data-wa]").forEach(function(a){
    a.href = waLink(a.getAttribute("data-wa"));
    a.target = "_blank"; a.rel = "noopener";
  });
  document.querySelectorAll(".yr").forEach(function(el){ el.textContent = new Date().getFullYear(); });

  /* Menu mobile */
  var burger = document.querySelector(".burger");
  var links = document.querySelector(".nav-links");
  if(burger && links){
    burger.addEventListener("click", function(){
      var open = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", String(!open));
      links.classList.toggle("open", !open);
    });
    links.querySelectorAll("a").forEach(function(a){
      a.addEventListener("click", function(){
        burger.setAttribute("aria-expanded","false");
        links.classList.remove("open");
      });
    });
  }

  /* Orienteur */
  var guide = document.getElementById("guide");
  if(guide){
    var steps = guide.querySelectorAll(".step");
    var bar = document.getElementById("gBar");
    var count = document.getElementById("gCount");
    var data = {}, cur = 1;
    var show = function(n){
      cur = n;
      steps.forEach(function(s){ s.classList.toggle("on", +s.dataset.step === n); });
      bar.style.width = (Math.min(n,3) / 3 * 100) + "%";
      count.textContent = n < 4 ? "Étape " + n + " sur 3" : "Votre demande est prête";
      if(n === 4) build();
    };
    var build = function(){
      var recap = document.getElementById("gRecap");
      recap.textContent = "";
      var b = document.createElement("b"); b.textContent = data.besoin;
      recap.appendChild(b);
      recap.appendChild(document.createElement("br"));
      recap.appendChild(document.createTextNode(data.secteur + ", montant " + data.montant));
      var msg = "Bonjour, je souhaite une étude de financement.\n" +
        "Besoin : " + data.besoin + "\nSecteur : " + data.secteur + "\nMontant : " + data.montant;
      document.getElementById("gSend").href = waLink(msg);
      document.getElementById("gMail").href = "mailto:" + MAIL +
        "?subject=" + encodeURIComponent("Demande d'étude de financement") +
        "&body=" + encodeURIComponent(msg);
    };
    guide.querySelectorAll(".opts").forEach(function(group){
      var key = group.dataset.key;
      group.querySelectorAll(".opt").forEach(function(btn){
        btn.type = "button";
        btn.setAttribute("aria-pressed","false");
        btn.addEventListener("click", function(){
          group.querySelectorAll(".opt").forEach(function(x){ x.setAttribute("aria-pressed","false"); });
          btn.setAttribute("aria-pressed","true");
          data[key] = btn.dataset.v;
          setTimeout(function(){ show(cur + 1); }, reduce ? 0 : 180);
        });
      });
    });
    guide.querySelectorAll("[data-back]").forEach(function(b){
      b.addEventListener("click", function(){ show(cur - 1); });
    });
    var reset = guide.querySelector("[data-reset]");
    if(reset) reset.addEventListener("click", function(){
      data = {};
      guide.querySelectorAll(".opt").forEach(function(x){ x.setAttribute("aria-pressed","false"); });
      show(1);
    });
  }

  /* Apparitions */
  var els = document.querySelectorAll(".reveal, .g-photo");
  if("IntersectionObserver" in window && !reduce){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(!e.isIntersecting) return;
        var sibs = Array.prototype.filter.call(e.target.parentNode.children, function(c){ return c.classList.contains("reveal"); });
        var i = Math.max(0, sibs.indexOf(e.target));
        e.target.style.transitionDelay = Math.min(i * 70, 350) + "ms";
        e.target.classList.add("in");
        io.unobserve(e.target);
      });
    }, {threshold:.12, rootMargin:"0px 0px -40px 0px"});
    els.forEach(function(el){ io.observe(el); });
  } else {
    els.forEach(function(el){ el.classList.add("in"); });
  }

  /* Scroll : header, progression, frise Girardin, barre mobile, lien actif */
  var header = document.querySelector("header");
  var prog = document.querySelector(".progress");
  var mbar = document.getElementById("mbar");
  var contact = document.getElementById("contact");
  var steps2 = document.querySelector(".steps");
  var track = steps2 && steps2.querySelector(".track i");
  var lis = steps2 ? steps2.querySelectorAll("li") : [];
  var sections = Array.prototype.map.call(document.querySelectorAll(".nav-links a[href^='#']"), function(a){
    return {a:a, el:document.querySelector(a.getAttribute("href"))};
  }).filter(function(s){ return s.el; });
  var ticking = false;

  function update(){
    ticking = false;
    var y = window.scrollY, vh = window.innerHeight;
    var max = document.documentElement.scrollHeight - vh;
    if(header) header.classList.toggle("scrolled", y > 10);
    if(prog) prog.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
    if(track){
      var r = steps2.getBoundingClientRect();
      var p = Math.min(1, Math.max(0, (vh * .65 - r.top) / r.height));
      track.style.transform = "scaleY(" + p + ")";
      lis.forEach(function(li){
        li.classList.toggle("lit", li.getBoundingClientRect().top < vh * .65);
      });
    }
    if(mbar){
      var show = y > 500 && (!contact || contact.getBoundingClientRect().top > vh * .6);
      mbar.classList.toggle("show", show);
    }
    var active = null;
    sections.forEach(function(s){ if(s.el.getBoundingClientRect().top < vh * .4) active = s; });
    sections.forEach(function(s){ s.a.classList.toggle("active", s === active); });
  }
  window.addEventListener("scroll", function(){
    if(!ticking){ ticking = true; requestAnimationFrame(update); }
  }, {passive:true});
  window.addEventListener("resize", update);
  update();
})();
