// ---------- Yıldızlı arka plan ----------
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
let stars = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  stars = Array.from({ length: Math.floor((canvas.width * canvas.height) / 3500) }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.3 + 0.2,
    speed: Math.random() * 0.02 + 0.005,
    phase: Math.random() * Math.PI * 2,
  }));
}

function drawStars(t) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const s of stars) {
    const alpha = 0.5 + 0.5 * Math.sin(s.phase + t * s.speed * 0.1);
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }
  requestAnimationFrame(drawStars);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
requestAnimationFrame(drawStars);

// ---------- Menü (mobil) ----------
const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");
menuBtn.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
navLinks.addEventListener("click", (e) => {
  if (e.target.tagName === "A") navLinks.classList.remove("open");
});

// ---------- Açılış yazısı ----------
const hero = document.querySelector(".hero");
const skipBtn = document.createElement("button");
skipBtn.className = "btn btn-ghost skip-btn";
skipBtn.textContent = "Geç »";
hero.appendChild(skipBtn);

skipBtn.addEventListener("click", () => {
  hero.classList.add("skip");
  skipBtn.remove();
});
setTimeout(() => skipBtn.remove(), 30000);

document.getElementById("replay").addEventListener("click", () => {
  hero.classList.remove("skip");
  for (const el of hero.querySelectorAll(".intro-line, .crawl, .hero-content")) {
    el.style.animation = "none";
    void el.offsetWidth; // animasyonu sıfırlamak için reflow
    el.style.animation = "";
  }
  hero.appendChild(skipBtn);
  window.scrollTo({ top: 0 });
});

// ---------- Bölümlerin kayarak görünmesi ----------
const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.1 }
);
document.querySelectorAll(".section").forEach((s) => observer.observe(s));

// ---------- Güç: aydınlık / karanlık ----------
const forceContent = {
  light: {
    color: "var(--blue)",
    html: `
      <h3 style="color:var(--blue)">Aydınlık Taraf — Jedi'ların yolu</h3>
      <p>Sakinlik, bilgi ve başkalarına yardım etme üzerine kuruludur. Jedi'lar Gücü yalnızca savunma ve barış için kullanır.</p>
      <ul>
        <li>Duygular kontrol altında tutulur; öfke ve korku tehlikelidir.</li>
        <li>Işın kılıçları genelde <b style="color:var(--blue)">mavi</b> veya <b style="color:var(--green)">yeşil</b> renktedir.</li>
        <li>Örnek: Yoda, Obi-Wan Kenobi, Luke Skywalker.</li>
      </ul>`,
  },
  dark: {
    color: "var(--red)",
    html: `
      <h3 style="color:var(--red)">Karanlık Taraf — Sith'lerin yolu</h3>
      <p>Öfke, nefret ve tutkudan güç alır. Daha hızlı ve “kolay” güç verir ama kullananı yavaş yavaş yozlaştırır.</p>
      <ul>
        <li>Amaç kontrol ve hâkimiyettir; başkaları araçtır.</li>
        <li>Işın kılıçları <b style="color:var(--red)">kırmızı</b> renktedir.</li>
        <li>Örnek: İmparator Palpatine, Darth Vader, Kylo Ren.</li>
      </ul>`,
  },
};

const blade = document.getElementById("blade");
const forceText = document.getElementById("force-text");

function setSide(side) {
  document.querySelectorAll(".side-btn").forEach((b) => b.classList.toggle("active", b.dataset.side === side));
  blade.style.setProperty("--glow", forceContent[side].color);
  forceText.innerHTML = forceContent[side].html;
}
document.querySelectorAll(".side-btn").forEach((b) => b.addEventListener("click", () => setSide(b.dataset.side)));
document.querySelector(".hilt").addEventListener("click", () => blade.classList.toggle("off"));
setSide("light");

// ---------- Karakterler ----------
const characters = [
  { icon: "🧑‍🚀", name: "Luke Skywalker", tag: ["Aydınlık", "light"],
    text: "Çöl gezegeni Tatooine'de sıradan bir çiftçi çocuğu. Bir mesajla maceraya atılır, Jedi olmayı öğrenir ve ilk üçlemenin kahramanı olur." },
  { icon: "👸", name: "Prenses Leia", tag: ["Aydınlık", "light"],
    text: "Asi İttifakı'nın cesur ve keskin dilli lideri. “Kurtarılmayı bekleyen prenses” değil, çoğu zaman kurtaran taraftır." },
  { icon: "🔫", name: "Han Solo", tag: ["Tarafsız → İyi", "neutral"],
    text: "Kendi çıkarını düşünen bir kaçakçı ve pilot. Gemisi Millennium Falcon'dur. Para için katıldığı savaşta gerçek bir kahramana dönüşür." },
  { icon: "🦍", name: "Chewbacca", tag: ["Aydınlık", "light"],
    text: "Han Solo'nun iki metrelik, tüylü Wookiee yardımcısı ve en yakın dostu. Konuşmaz, kükrer; ama herkes ne dediğini anlar." },
  { icon: "🖤", name: "Darth Vader", tag: ["Karanlık", "dark"],
    text: "Siyah zırhı ve makineli nefesiyle sinemanın en ünlü kötüsü. İmparator'un sağ kolu. Aslında eski bir Jedi olan Anakin Skywalker'dır." },
  { icon: "⚡", name: "İmparator Palpatine", tag: ["Karanlık", "dark"],
    text: "Bir senatör gibi görünüp gizlice Sith Lordu olan, Cumhuriyet'i içeriden çökertip kendini İmparator ilan eden asıl kötü." },
  { icon: "🟢", name: "Yoda", tag: ["Aydınlık", "light"],
    text: "900 yaşındaki küçük, yeşil Jedi Ustası. Cümleleri ters kurar: “Güçlü sen olacaksın.” Görünüşü küçük, gücü devasa." },
  { icon: "🧔", name: "Obi-Wan Kenobi", tag: ["Aydınlık", "light"],
    text: "Bilge Jedi. Hem Anakin'in hem de Luke'un ustasıdır. İki kuşağı birbirine bağlayan karakterdir." },
  { icon: "👦", name: "Anakin Skywalker", tag: ["Aydınlık → Karanlık", "grey"],
    text: "Bir kehanetin “seçilmiş kişi”si olarak görülen yetenekli Jedi. Sevdiklerini kaybetme korkusu onu karanlık tarafa iter ve Darth Vader olur." },
  { icon: "🤖", name: "R2-D2 & C-3PO", tag: ["Droidler", "neutral"],
    text: "Serinin komik ikilisi: R2-D2 bip sesleriyle konuşan cesur tamir robotu, C-3PO ise her şeyden korkan, 6 milyon dil bilen altın renkli robot." },
  { icon: "🌾", name: "Rey", tag: ["Aydınlık", "light"],
    text: "Son üçlemenin (VII-IX) kahramanı. Hurdacılık yapan yalnız bir genç kızken Güç'ünü keşfeder." },
  { icon: "🎭", name: "Kylo Ren", tag: ["Karanlık → ?", "grey"],
    text: "Han Solo ile Leia'nın oğlu. Darth Vader'a özenip karanlık tarafa geçmiştir ama içinde hâlâ bir çatışma vardır." },
];

const charsEl = document.getElementById("chars");
charsEl.innerHTML = characters
  .map(
    (c) => `
    <div class="char" tabindex="0" role="button" aria-label="${c.name} kartını çevir">
      <div class="char-inner">
        <div class="char-face char-front">
          <div class="char-icon">${c.icon}</div>
          <h3>${c.name}</h3>
          <span class="char-tag tag-${c.tag[1]}">${c.tag[0]}</span>
        </div>
        <div class="char-face char-back">
          <h3>${c.name}</h3>
          <p>${c.text}</p>
        </div>
      </div>
    </div>`
  )
  .join("");

charsEl.querySelectorAll(".char").forEach((card) => {
  const flip = () => card.classList.toggle("flipped");
  card.addEventListener("click", flip);
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      flip();
    }
  });
});

// ---------- Gezegenler ----------
const planets = [
  { name: "Tatooine", bg: "radial-gradient(circle at 30% 30%, #f3d08a, #c08a3e)",
    type: "Çöl gezegeni",
    text: "İki güneşli kum dünyası. Hem Anakin'in hem de Luke'un büyüdüğü yer. Kanunsuz, kaçakçılarla dolu, “galaksinin uzak bir köşesi”." },
  { name: "Coruscant", bg: "radial-gradient(circle at 30% 30%, #ffd27a, #4a3a6b)",
    type: "Şehir gezegeni",
    text: "Gezegenin tamamı tek bir dev şehirdir. Cumhuriyet'in, sonra İmparatorluğun başkenti. Jedi Tapınağı da buradadır." },
  { name: "Hoth", bg: "radial-gradient(circle at 30% 30%, #ffffff, #9bc4e2)",
    type: "Buz gezegeni",
    text: "Asi İttifakı'nın gizli üssünün bulunduğu donmuş dünya. Bölüm V'in unutulmaz açılış savaşı burada geçer." },
  { name: "Dagobah", bg: "radial-gradient(circle at 30% 30%, #8fb36a, #2f4a2a)",
    type: "Bataklık gezegeni",
    text: "Sisli, bataklık bir dünya. Yoda burada saklanarak yaşar ve Luke'u Jedi olarak eğitir." },
  { name: "Endor", bg: "radial-gradient(circle at 30% 30%, #6fcf6f, #1d5a2f)",
    type: "Orman uydusu",
    text: "Dev ağaçlarla kaplı bir uydu. Küçük ayıcıklara benzeyen Ewok'lar burada yaşar. Bölüm VI'nın final savaşı burada geçer." },
  { name: "Mustafar", bg: "radial-gradient(circle at 30% 30%, #ff8a3d, #5a0d0d)",
    type: "Lav gezegeni",
    text: "Volkanlar ve lav nehirleriyle kaplı. Anakin ile Obi-Wan'ın trajik düellosu burada yaşanır; Darth Vader'ın doğduğu yerdir." },
  { name: "Ölüm Yıldızı", bg: "radial-gradient(circle at 35% 35%, #c9ccd3, #4c5058)",
    type: "Gezegen değil!",
    text: "Bir ay büyüklüğünde, gezegenleri tek atışta yok edebilen İmparatorluk uzay istasyonu. Asilerin en büyük hedefidir." },
];

const planetsEl = document.getElementById("planets");
const planetInfo = document.getElementById("planet-info");
planetsEl.innerHTML = planets
  .map(
    (p, i) => `
    <button class="planet" data-i="${i}">
      <span class="planet-ball" style="background:${p.bg}"></span>
      ${p.name}
    </button>`
  )
  .join("");

planetsEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".planet");
  if (!btn) return;
  const p = planets[btn.dataset.i];
  planetsEl.querySelectorAll(".planet").forEach((b) => b.classList.toggle("active", b === btn));
  planetInfo.innerHTML = `<h3>${p.name} <small style="color:var(--muted);font-weight:400">— ${p.type}</small></h3><p>${p.text}</p>`;
});

// ---------- Zaman çizelgesi ----------
const films = [
  { ep: "I", title: "Gizli Tehlike", year: 1999, era: "Önceki Üçleme",
    text: "Jedi'lar köle bir çocuk olan Anakin Skywalker'ı keşfeder. Gölgelerde bir Sith'in döndüğü anlaşılır." },
  { ep: "II", title: "Klonların Saldırısı", year: 2002, era: "Önceki Üçleme",
    text: "Genç Anakin, Padmé'ye âşık olur. Galakside büyük bir iç savaş, Klon Savaşları başlar." },
  { ep: "III", title: "Sith'in İntikamı", year: 2005, era: "Önceki Üçleme",
    text: "Cumhuriyet çöker, İmparatorluk doğar. Anakin karanlık tarafa geçer ve Darth Vader olur." },
  { ep: "IV", title: "Yeni Bir Umut", year: 1977, era: "Orijinal Üçleme",
    text: "Luke Skywalker; Leia, Han Solo ve Obi-Wan ile tanışır. Asiler Ölüm Yıldızı'nı yok etmeye çalışır." },
  { ep: "V", title: "İmparator'un Saldırısı", year: 1980, era: "Orijinal Üçleme",
    text: "Asiler kaçmaktadır, Luke Yoda'dan eğitim alır. Sinema tarihinin en ünlü sürprizlerinden biri bu filmdedir." },
  { ep: "VI", title: "Jedi'ın Dönüşü", year: 1983, era: "Orijinal Üçleme",
    text: "Asilerin İmparatorluğa karşı son büyük savaşı ve Luke ile Vader'ın son hesaplaşması." },
  { ep: "VII", title: "Güç Uyanıyor", year: 2015, era: "Devam Üçlemesi",
    text: "30 yıl sonra: Birinci Düzen yükselir. Rey, Finn ve Poe yeni kahramanlar olarak sahneye çıkar." },
  { ep: "VIII", title: "Son Jedi", year: 2017, era: "Devam Üçlemesi",
    text: "Rey, sürgünde yaşayan Luke Skywalker'ı bulur. Direniş yok olmanın eşiğine gelir." },
  { ep: "IX", title: "Skywalker'ın Yükselişi", year: 2019, era: "Devam Üçlemesi",
    text: "Skywalker destanının finali: Direniş ile Birinci Düzen arasındaki son savaş." },
];

const timelineEl = document.getElementById("timeline");
function renderTimeline(order) {
  const list = order === "release" ? [...films].sort((a, b) => a.year - b.year) : films;
  timelineEl.innerHTML = list
    .map(
      (f, i) => `
      <li style="animation-delay:${i * 0.07}s">
        <h3>Bölüm ${f.ep}: ${f.title} <span class="era">${f.era}</span></h3>
        <div class="year">${f.year}</div>
        <p>${f.text}</p>
      </li>`
    )
    .join("");
}
document.querySelectorAll(".ord-btn").forEach((b) =>
  b.addEventListener("click", () => {
    document.querySelectorAll(".ord-btn").forEach((x) => x.classList.toggle("active", x === b));
    renderTimeline(b.dataset.order);
  })
);
renderTimeline("story");

// ---------- Sözlük ----------
const glossary = [
  ["Jedi", "Gücün aydınlık tarafını kullanan, barışı koruyan şövalye-keşiş tarikatı üyesi."],
  ["Sith", "Gücün karanlık tarafını kullananlar. İsimlerinin başında “Darth” unvanı olur."],
  ["Padawan", "Jedi çırağı. Bir ustanın yanında eğitim alan genç öğrenci."],
  ["Işın kılıcı (Lightsaber)", "Jedi ve Sith'lerin enerji bıçaklı kılıcı. Rengi genelde tarafını gösterir."],
  ["Droid", "Star Wars evreninde robotlara verilen ad. Örn: R2-D2, C-3PO, BB-8."],
  ["Stormtrooper", "İmparatorluğun beyaz zırhlı askerleri. Hedefi tutturamamalarıyla meşhurdur."],
  ["Ölüm Yıldızı (Death Star)", "Gezegen yok edebilen dev İmparatorluk uzay istasyonu."],
  ["Millennium Falcon", "Han Solo'nun eski görünümlü ama galaksinin en hızlı gemilerinden biri."],
  ["X-Wing / TIE Fighter", "Asilerin (X-Wing) ve İmparatorluğun (TIE) küçük savaş uçakları."],
  ["Wookiee", "Uzun boylu, tüylü, çok güçlü bir tür. Chewbacca bir Wookiee'dir."],
  ["Hiperuzay (Hyperspace)", "Işık hızını aşarak yıldızlar arası yolculuk yapma yöntemi."],
  ["Seçilmiş Kişi", "Gücü dengeye getireceği kehanet edilen kişi. Anakin olduğu düşünülür."],
  ["Mandalorian", "Zırhlı, miğferini çıkarmayan savaşçı kültürü. Aynı adlı dizi de oldukça popülerdir."],
  ["Holocron / Hologram", "Mavi ışıklı üç boyutlu mesajlar. Leia'nın ünlü yardım mesajı bir hologramdır."],
  ["“Güç seninle olsun”", "Serinin en ünlü vedalaşma / iyi dilek cümlesi (May the Force be with you)."],
];

const glossaryEl = document.getElementById("glossary");
function renderGlossary(filter = "") {
  const q = filter.toLocaleLowerCase("tr");
  const items = glossary.filter(([t, d]) => (t + " " + d).toLocaleLowerCase("tr").includes(q));
  glossaryEl.innerHTML = items.length
    ? items.map(([t, d]) => `<div class="term"><dt>${t}</dt><dd>${d}</dd></div>`).join("")
    : `<p class="no-result">Bu terim galakside bulunamadı. Başka bir şey dene.</p>`;
}
document.getElementById("search").addEventListener("input", (e) => renderGlossary(e.target.value));
renderGlossary();

// ---------- Test ----------
const questions = [
  { q: "Jedi'lar Gücün hangi tarafını kullanır?", opts: ["Karanlık taraf", "Aydınlık taraf", "Her ikisini de"], a: 1,
    exp: "Jedi'lar aydınlık tarafı, Sith'ler karanlık tarafı kullanır." },
  { q: "Darth Vader aslında kimdir?", opts: ["Han Solo", "Obi-Wan Kenobi", "Anakin Skywalker"], a: 2,
    exp: "Anakin Skywalker karanlık tarafa geçtikten sonra Darth Vader adını alır." },
  { q: "İlk kez izleyecek biri için önerilen başlangıç filmi hangisi?", opts: ["Bölüm I", "Bölüm IV", "Bölüm VII"], a: 1,
    exp: "Bölüm IV (1977) çıkan ilk filmdir ve serinin sürprizlerini korur." },
  { q: "Kırmızı ışın kılıcı genelde kimi gösterir?", opts: ["Bir Sith'i", "Bir Jedi'ı", "Bir droidi"], a: 0,
    exp: "Kırmızı kılıçlar karanlık tarafın, yani Sith'lerin işaretidir." },
  { q: "Ölüm Yıldızı nedir?", opts: ["Bir Jedi tapınağı", "Gezegen yok eden uzay istasyonu", "Bir gezegen"], a: 1,
    exp: "Ölüm Yıldızı, İmparatorluğun gezegenleri yok edebilen silahıdır." },
  { q: "“Padawan” ne demektir?", opts: ["Jedi çırağı", "Uzay korsanı", "Bir gezegen"], a: 0,
    exp: "Padawan, bir Jedi Ustası'nın yanında eğitim gören öğrencidir." },
];

const quizEl = document.getElementById("quiz");
let qi = 0;
let score = 0;

function renderQuestion() {
  const item = questions[qi];
  quizEl.innerHTML = `
    <div class="quiz-progress">Soru ${qi + 1} / ${questions.length}</div>
    <div class="quiz-q">${item.q}</div>
    <div class="quiz-opts">
      ${item.opts.map((o, i) => `<button class="quiz-opt" data-i="${i}">${o}</button>`).join("")}
    </div>
    <div class="quiz-explain" id="quiz-explain"></div>`;

  quizEl.querySelectorAll(".quiz-opt").forEach((btn) =>
    btn.addEventListener("click", () => {
      const chosen = Number(btn.dataset.i);
      const buttons = quizEl.querySelectorAll(".quiz-opt");
      buttons.forEach((b) => (b.disabled = true));
      buttons[item.a].classList.add("correct");
      if (chosen === item.a) score++;
      else btn.classList.add("wrong");

      const explain = document.getElementById("quiz-explain");
      explain.innerHTML = `${chosen === item.a ? "✅ Doğru!" : "❌ Yanlış."} ${item.exp}<br><br>`;
      const next = document.createElement("button");
      next.className = "btn";
      next.textContent = qi < questions.length - 1 ? "Sonraki soru" : "Sonucu gör";
      next.addEventListener("click", () => {
        qi++;
        qi < questions.length ? renderQuestion() : renderResult();
      });
      explain.appendChild(next);
    })
  );
}

function renderResult() {
  const ratio = score / questions.length;
  let rank, msg;
  if (ratio === 1) {
    rank = "Jedi Ustası";
    msg = "Kusursuz! Artık filmleri izlemeye hazırsın. Güç seninle.";
  } else if (ratio >= 0.6) {
    rank = "Jedi Şövalyesi";
    msg = "Çok iyi! Birkaç detay kaldı ama galakside kaybolmazsın.";
  } else {
    rank = "Padawan";
    msg = "Eğitimin daha yeni başlıyor. Rehbere bir göz daha at!";
  }
  quizEl.innerHTML = `
    <div class="quiz-result">
      <p>${questions.length} sorudan <b>${score}</b> doğru</p>
      <div class="rank">${rank}</div>
      <p>${msg}</p>
      <button class="btn" id="quiz-restart">Tekrar dene</button>
    </div>`;
  document.getElementById("quiz-restart").addEventListener("click", () => {
    qi = 0;
    score = 0;
    renderQuestion();
  });
}

renderQuestion();
