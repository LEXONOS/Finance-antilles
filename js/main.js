(function(){
  /* ===== Chargement + intro ===== */
  var loader = document.getElementById("loader");
  var rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var start = Date.now();
  var h1 = document.querySelector(".split");
  if(h1){
    var words = h1.textContent.trim().split(/\s+/);
    h1.setAttribute("aria-label", h1.textContent.trim());
    h1.textContent = "";
    words.forEach(function(w, i){
      var o = document.createElement("span"); o.className = "w"; o.setAttribute("aria-hidden","true");
      var n = document.createElement("span"); n.textContent = w;
      n.style.transitionDelay = (0.25 + i * 0.07) + "s";
      o.appendChild(n); h1.appendChild(o);
      if(i < words.length - 1) h1.appendChild(document.createTextNode(" "));
    });
  }
  function go(){ document.body.classList.add("ready"); }

  if(!loader || rm || getComputedStyle(loader).display === "none"){
    if(loader) loader.remove();
    go();
  } else {
    var bar = document.getElementById("ldBar"), pct = document.getElementById("ldPct");
    var video = document.getElementById("heroVideo");
    var MIN = 1100, MAX = 3200, shown = 0, ready = false, done = false;
    var setP = function(p){
      p = Math.max(shown, Math.min(100, p));
      shown = p;
      bar.style.transform = "scaleX(" + (p / 100) + ")";
      pct.textContent = Math.round(p);
    };
    var mediaReady = function(){ ready = true; };
    if(video && video.getAttribute("src")){
      if(video.readyState >= 3) mediaReady();
      video.addEventListener("canplay", mediaReady, {once:true});
      video.addEventListener("error", mediaReady, {once:true});
    } else {
      var img = new Image(); img.onload = img.onerror = mediaReady; img.src = "assets/img/hero.jpg";
    }
    var tick = function(){
      if(done) return;
      var t = Date.now() - start;
      /* progression : suit le temps, bloque à 90 % tant que le média n'est pas prêt */
      var target = Math.min(ready ? 100 : 90, t / MIN * 100);
      setP(shown + (target - shown) * .25);
      if((ready && t >= MIN && shown > 99) || t >= MAX){
        done = true; setP(100);
        setTimeout(function(){
          loader.classList.add("out");
          setTimeout(go, 280);
          setTimeout(function(){ loader.remove(); }, 1300);
        }, 150);
        return;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
})();

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
  /* ===== Interactions ===== */
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* Boutons aimantés */
  if(fine && !reduce){
    document.querySelectorAll(".hero-cta .btn, .c-main .btn").forEach(function(b){
      b.classList.add("magnet");
      b.addEventListener("mousemove", function(e){
        var r = b.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * .18, y = (e.clientY - r.top - r.height / 2) * .3;
        b.style.transform = "translate(" + x + "px," + y + "px)";
      });
      b.addEventListener("mouseleave", function(){ b.style.transform = ""; });
    });
    /* Halo des cartes */
    document.querySelectorAll(".sol").forEach(function(c){
      c.addEventListener("mousemove", function(e){
        var r = c.getBoundingClientRect();
        c.style.setProperty("--mx", (e.clientX - r.left) + "px");
        c.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
  }

  /* Onde au clic sur les choix */
  document.querySelectorAll(".opt").forEach(function(b){
    b.addEventListener("pointerdown", function(e){
      if(reduce) return;
      var r = b.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2;
      var s = document.createElement("span"); s.className = "ripple";
      s.style.width = s.style.height = d + "px";
      s.style.left = (e.clientX - r.left - d / 2) + "px";
      s.style.top = (e.clientY - r.top - d / 2) + "px";
      b.appendChild(s);
      setTimeout(function(){ s.remove(); }, 600);
    });
  });

  /* Icônes secteurs : longueur normalisée pour le tracé */
  document.querySelectorAll(".sect .sec svg *").forEach(function(el){ el.setAttribute("pathLength","1"); });

  /* Compteurs */
  var counters = document.querySelectorAll("[data-count]");
  function countUp(el){
    var end = +el.dataset.count, t0 = null, dur = 1200;
    if(reduce){ el.textContent = end; return; }
    function step(t){
      if(!t0) t0 = t;
      var p = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 4)));
      if(p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if("IntersectionObserver" in window){
    var co = new IntersectionObserver(function(en){
      en.forEach(function(e){ if(e.isIntersecting){ countUp(e.target); co.unobserve(e.target); } });
    }, {threshold:.6});
    counters.forEach(function(c){ co.observe(c); });
  } else counters.forEach(function(c){ c.textContent = c.dataset.count; });

  /* Parallaxe photo Girardin */
  var par = document.querySelector("[data-parallax] img");
  if(par && !reduce){
    var pf = function(){
      var r = par.parentNode.getBoundingClientRect(), vh = window.innerHeight;
      if(r.bottom < 0 || r.top > vh) return;
      var p = (r.top + r.height / 2 - vh / 2) / vh;
      par.style.translate = "0 " + (p * -40).toFixed(1) + "px";
    };
    window.addEventListener("scroll", function(){ requestAnimationFrame(pf); }, {passive:true});
    pf();
  }
})();
