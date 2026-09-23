"use strict";

(() => {
  const settings = {
    // لما فيديو النهاية يجهز، اكتب مساره هنا.
    // مثال: "assets/final.mp4"
    finalVideo: "",

    wrongPhoto: "assets/wrong-answer.webp",

    photos: [
      "assets/png.01.webp",
      "assets/boudy-2.webp",
      "assets/monmon-birthday.webp",
      "assets/png.4.webp",
      "assets/png.5.webp",
      "assets/png.6.webp",
      "assets/png.7.webp",
      "assets/png.8.webp",
      "assets/png.9.webp",
      "assets/png.10.webp",
      "assets/png.11.webp",
      "assets/png.12.webp",
      "assets/png.13.webp",
      "assets/png.14.webp",
      "assets/png.15.webp",
      "assets/png.16.webp",
      "assets/png.17.webp",
      "assets/png.18.webp",
      "assets/png.19.webp"
    ]
  };

  function init() {
    const stage = document.getElementById("stage");
    const progressBar = document.getElementById("progressBar");

    if (!stage || !progressBar) return;

    const magic = createMagic();
    let pendingTimer = null;

    function show(html, progress) {
      clearTimeout(pendingTimer);
      pendingTimer = null;

      const oldVideo = stage.querySelector("video");
      if (oldVideo) oldVideo.pause();

      stage.innerHTML = html;
      progressBar.style.width = `${progress}%`;

      stage.classList.remove("enter");
      void stage.offsetWidth;
      stage.classList.add("enter");

      const title = document.getElementById("pageTitle");

      if (title) {
        title.tabIndex = -1;
        title.focus({ preventScroll: true });
      }

      const top =
        stage.getBoundingClientRect().top + window.scrollY - 24;

      window.scrollTo({
        top: Math.max(0, top),
        behavior: "auto"
      });
    }

    function nextButton(text) {
      return `<button class="primary" id="next">${text}</button>`;
    }

    function connectNext(action) {
      document.getElementById("next").onclick = action;
    }

    function makePhoto(src, alt, className = "") {
      const img = document.createElement("img");
      img.alt = alt;
      img.className = className;
      img.decoding = "async";
      img.loading = "lazy";
      img.fetchPriority = "low";

      img.addEventListener("error", () => {
        const note = document.createElement("p");
        note.className = "photo-error";
        note.textContent =
          "مش قادر أفتح الصورة: " + src.split("/").pop();
        img.replaceWith(note);
      }, { once: true });

      img.src = src;
      return img;
    }

    function shuffle(items) {
      const result = [...items];

      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }

      return result;
    }

    function normalizeDigits(value) {
      return value
        .replace(/[٠-٩]/g, digit =>
          String("٠١٢٣٤٥٦٧٨٩".indexOf(digit))
        )
        .replace(/[۰-۹]/g, digit =>
          String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit))
        )
        .replace(/\s/g, "");
    }

    function intro() {
      show(`
        <div class="symbol" aria-hidden="true">♡</div>
        <div class="label">٣٠ سبتمبر · الليلة بتاعت منمن</div>

        <h1 id="pageTitle">كل سنة وإنتِ منورة حياتي.</h1>

        <p>
          جاهزة للحكاية  .<br>
          فيها ضحكة، وصور، وذكريات…<br>
          وفي مفاتيح هتوصلك لمفاجأتك.
        </p>

        <p class="signature">من بودي، الى معشوقتي  ♡</p>

        ${nextButton(" يلا")}
      `, 0);

      connectNext(() => choicePuzzle(0));
      magic.celebrate(1800);
    }

    const questions = [
      {
        label: "المفتاح الأول · أول صدفة",
        title: "أنا كنت داخل اكلمك فاكرك مين؟ 😂",
        text: "أول مرة دخلت أكلمك، كنت فاكر إني بكلم بنت تانية…",
        options: ["سارة", "نشوى", "نور"],
        correct: 1,
        hint: "اسمها بيبدأ بالنون… بس مش نور 👀",
        revealTitle: "أحلى صدفة.",
        revealText:
          "كنت داخل أكلم نشوى، ولقيت منمتي. " +
          "بداية بالغلط… بس من أحلى الحاجات اللي حصلتلي. ♡"
      },
      {
        label: "المفتاح التاني · اليوم اللي رجعنا فيه",
        title: "فاكرة رجعنا يوم كام؟",
        text:
          "بعد سنين من الغياب، كلمتك ورجعنا نتكلم عادي. " +
          "فاكرة تاريخ اليوم ده؟",
        options: ["28/7/2025", "30/8/2025", "28/8/2025"],
        correct: 2,
        hint: "٢٨ من شهر ٨، سنة ٢٠٢٥… بودي غششك المرة دي ♡",
        revealTitle: "28 / 8 / 2025",
        revealText:
          "اليوم اللي الكلام رجع فيه بيننا. " +
          "كلمتك بعد غيباب، ورجعنا نتكلم عادي… " +
          "وتاريخ اليوم ده ليه مكانه في حكايتنا."
      }
    ];

    function choicePuzzle(index) {
      const question = questions[index];

      show(`
        <div class="label">${question.label}</div>
        <h2 id="pageTitle">${question.title}</h2>
        <p>${question.text}</p>

        <div class="options" id="options"></div>

        <p class="feedback" id="feedback" role="status"></p>
        <button class="quiet" id="hint">تلميح صغير؟</button>
      `, index === 0 ? 7 : 22);

      question.options.forEach((text, optionIndex) => {
        const button = document.createElement("button");
        button.className = "option";
        button.textContent = text;

        if (index === 1) button.dir = "ltr";

        button.onclick = () => {
          if (optionIndex !== question.correct) {
            button.classList.add("wrong");

            document.getElementById("feedback").textContent =
              "فكّري تاني يا منمن… لسه عندك محاولة ♡";

            return;
          }

          album(
            index,
            question.revealTitle,
            question.revealText,
            index === 0 ? () => choicePuzzle(1) : yearsPuzzle
          );
        };

        document.getElementById("options").appendChild(button);
      });

      document.getElementById("hint").onclick = () => {
        document.getElementById("feedback").textContent =
          question.hint;
      };
    }

    function album(group, title, text, next) {
      const startIndex = group * 4;
      const photos = settings.photos.slice(startIndex, startIndex + 4);

      show(`
        <div class="label">مفتاح اتفتح… ومعاه شوية من حكايتنا</div>

        <h2 id="pageTitle">${title}</h2>
        <p>${text}</p>

        <div class="album" id="album"></div>

        <div class="album-count">
          الجزء ${group + 1} من ٥ من ألبومنا
        </div>

        ${nextButton("نكمّل الحكاية؟")}
      `, 16 + group * 14);

      const captions = {
        0: "من يوم عيد ميلادي ♡",
        1: "ذكرى تانية من نفس اليوم",
        2: "عيد ميلادك السنة اللي فاتت ♡"
      };

      photos.forEach((src, localIndex) => {
        const absoluteIndex = startIndex + localIndex;
        const figure = document.createElement("figure");

        figure.appendChild(
          makePhoto(
            src,
            `صورة ${absoluteIndex + 1} من حكاية بودي ومنمن`
          )
        );

        if (captions[absoluteIndex]) {
          const caption = document.createElement("figcaption");
          caption.textContent = captions[absoluteIndex];
          figure.appendChild(caption);
        }

        document.getElementById("album").appendChild(figure);
      });

      connectNext(next);
      magic.celebrate(2200);
    }

    function yearsPuzzle() {
      show(`
        <div class="label">المفتاح التالت · خزنة السنين</div>

        <h2 id="pageTitle">إحنا مع بعض بقالنا كام سنة؟</h2>
        <p>ركّزي يا منمن… الإجابة الغلط ليها مفاجأة </p>

        <div class="options" id="yearOptions"></div>

        <div id="wrongSurprise" hidden>
          <p class="feedback" id="yearFeedback" role="status"></p>
          <div id="wrongPhotoArea"></div>

          <button class="quiet" id="hidePhoto">
           😒 يلعنك
          </button>
        </div>
      `, 36);

      const surprise = document.getElementById("wrongSurprise");
      let photoAdded = false;

      document.getElementById("hidePhoto").onclick = () => {
        surprise.hidden = true;
      };

      [
        { label: "٤ سنين", value: 4 },
        { label: "٦ سنين", value: 6 },
        { label: "٥ سنين", value: 5 },
        { label: "٧ سنين", value: 7 }
      ].forEach(choice => {
        const button = document.createElement("button");
        button.className = "option";
        button.textContent = choice.label;

        button.onclick = () => {
          if (choice.value !== 4) {
            button.classList.add("wrong");
            surprise.hidden = false;

            document.getElementById("yearFeedback").textContent =
              "نسيتي؟ طب احلى صورة ليكي 😂 جربي تاني   !";

            if (!photoAdded) {
              document.getElementById("wrongPhotoArea").appendChild(
                makePhoto(
                  settings.wrongPhoto,
                  "مفاجأة صغيرة من بودي",
                  "wrong-photo"
                )
              );

              photoAdded = true;
            }

            surprise.scrollIntoView({
              behavior: "auto",
              block: "nearest"
            });

            return;
          }

          album(
            2,
            "٦ سنين…صح",
            "أيوه كده يا منمن ♡ ست سنين من حكايتنا، ولسه دي البداية.",
            matchingPuzzle
          );
        };

        document.getElementById("yearOptions").appendChild(button);
      });
    }

    function matchingPuzzle() {
      const cards = shuffle([
        "♡", "✿", "★", "♫",
        "♡", "✿", "★", "♫"
      ]);

      let opened = [];
      let pairs = 0;
      let locked = false;

      show(`
        <div class="label">المفتاح الرابع · كل قلب يلاقي شبهه</div>

        <h2 id="pageTitle">تلاقي كل اتنين شبه بعض؟</h2>
        <p>اقلبي كارتين في كل مرة، وافتكري مكان الرموز.</p>

        <div class="match-grid" id="matchGrid"></div>

        <p class="feedback" id="feedback" role="status">
          لسه ٤ أزواج مستنيينك ♡
        </p>

        <div id="matchNext" hidden>
          ${nextButton("فتحناهم كلهم ♡")}
        </div>
      `, 50);

      cards.forEach((symbol, index) => {
        const button = document.createElement("button");

        button.className = "match-card";
        button.textContent = "؟";
        button.setAttribute("aria-label", `اقلبي الكارت ${index + 1}`);

        button.onclick = () => {
          if (
            locked ||
            button.disabled ||
            opened.some(card => card.button === button)
          ) return;

          button.textContent = symbol;
          button.classList.add("open");

          button.setAttribute(
            "aria-label",
            `الكارت ${index + 1}: ${symbol}`
          );

          opened.push({ button, symbol, index });

          if (opened.length < 2) return;

          if (opened[0].symbol === opened[1].symbol) {
            opened.forEach(card => {
              card.button.disabled = true;
              card.button.classList.add("matched");
            });

            opened = [];
            pairs++;

            document.getElementById("feedback").textContent =
              `لقيتي ${pairs} من ٤ أزواج ♡`;

            if (pairs === 4) {
              document.getElementById("matchNext").hidden = false;
              magic.celebrate(1800);
            }

            return;
          }

          locked = true;

          pendingTimer = setTimeout(() => {
            opened.forEach(card => {
              card.button.textContent = "؟";
              card.button.classList.remove("open");

              card.button.setAttribute(
                "aria-label",
                `اقلبي الكارت ${card.index + 1}`
              );
            });

            opened = [];
            locked = false;
            pendingTimer = null;
          }, 1000);
        };

        document.getElementById("matchGrid").appendChild(button);
      });

      connectNext(() => album(
        3,
        "كل اتنين لقوا بعض.",
        "وإحنا كمان لقينا بعض وسط صدفة…ا. ♡",
        birthdayPuzzle
      ));
    }

    function birthdayPuzzle() {
      show(`
        <div class="label">المفتاح الخامس · شفرة اليوم</div>

        <h2 id="pageTitle">أربع أرقام يفتحوا الصفحة…</h2>

        <p id="dateHelp">
          يوم ميلادك، وبعده الشهر.<br>
          كل واحد رقمين، من غير فواصل أو سنة.
        </p>

        <form id="dateForm">
          <label class="label" for="dateAnswer">
            اليوم ثم الشهر: DDMM
          </label>

          <input
            class="number-input"
            id="dateAnswer"
            type="text"
            inputmode="numeric"
            maxlength="4"
            autocomplete="off"
            aria-describedby="dateHelp feedback"
            required
          >

          <button class="primary" type="submit">
            افتحي القفل ♡
          </button>
        </form>

        <p class="feedback" id="feedback" role="status"></p>
        <button class="quiet" id="hint">محتاجة تلميح</button>
      `, 64);

      document.getElementById("hint").onclick = () => {
        document.getElementById("feedback").textContent =
          "٣٠ وبعدها ٠٩… اكتبيهم جنب بعض.";
      };

      document.getElementById("dateForm").onsubmit = event => {
        event.preventDefault();

        const answer = normalizeDigits(
          document.getElementById("dateAnswer").value
        );

        if (answer !== "3009") {
          document.getElementById("feedback").textContent =
            "القفل لسه مقفول… جرّبي تاني يا منه ♡";
          return;
        }

        album(
          4,
          "٣٠ سبتمبر… احلى يوم في العالم.",
          "آخر صور في الألبوم، بس لسه فيه كلام ومفاجأة ليكي. ♡",
          wordPuzzle
        );
      };
    }

    function wordPuzzle() {
      const correct = ["إنتِ", "جوهرتي", "ومكانك", "جوّه", "قلبي"];
      const mixed = ["قلبي", "إنتِ", "جوّه", "جوهرتي", "ومكانك"];

      let selected = [];

      show(`
        <div class="label">المفتاح السادس · كلمة من بودي</div>

        <h2 id="pageTitle">عارفة مكانك فين؟</h2>
        <p>دوسي على الكلمات بالترتيب، عشان تكمّلي جملتي ليكي.</p>

        <div class="sentence" id="sentence" aria-live="polite">
          جملتنا هتظهر هنا…
        </div>

        <div class="words" id="words"></div>

        <button class="quiet" id="resetWords">أرتّبها من الأول</button>

        <p class="feedback" id="feedback" role="status"></p>

        <button class="primary" id="check" disabled>
          افتحي آخر مفتاح ♡
        </button>
      `, 79);

      const sentence = document.getElementById("sentence");
      const check = document.getElementById("check");
      const feedback = document.getElementById("feedback");
      const words = document.getElementById("words");

      mixed.forEach(word => {
        const button = document.createElement("button");
        button.className = "word";
        button.textContent = word;

        button.onclick = () => {
          selected.push(word);
          button.disabled = true;
          sentence.textContent = selected.join(" ");
          feedback.textContent = "";
          check.disabled = selected.length !== correct.length;
        };

        words.appendChild(button);
      });

      document.getElementById("resetWords").onclick = () => {
        selected = [];
        sentence.textContent = "جملتنا هتظهر هنا…";
        feedback.textContent = "";
        check.disabled = true;

        words.querySelectorAll("button").forEach(button => {
          button.disabled = false;
        });
      };

      check.onclick = () => {
        const solved =
          selected.length === correct.length &&
          selected.every((word, index) => word === correct[index]);

        if (!solved) {
          feedback.textContent =
            "قريبة يا منه.. ابدئي بـ«إنتِ» وجرّبي تاني ♡";
          return;
        }

        show(`
          <div class="symbol" aria-hidden="true">♥</div>
          <div class="label">فتحتي الست مفاتيح</div>

          <h2 id="pageTitle">
            إنتِ جوهرتي،<br>ومكانك جوّه قلبي.
          </h2>

          <p>
            وهتفضلي جوا لاخر يوم في عمري..<br>
            زي ما بقولك دايمًا.
          </p>

          <p class="signature">بس فيه حاجة كمان عايز أقولها لك ♡</p>

          ${nextButton("إيه يا بودي؟")}
        `, 86);

        magic.celebrate(2500);
        connectNext(nextChapter);
      };
    }

    function nextChapter() {
      show(`
        <div class="symbol" aria-hidden="true">♡</div>
        <div class="label">صفحة لسه مستنينها</div>

        <h2 id="pageTitle">بتمنى نكمّلها سوا.</h2>

        <p>
          حكايتنا بدأت بصدفة… وكانت احلى صدفة<br>
          وفيه خطوة جاية احنا مستنينها .
        </p>

        <p>
          يوم لما أقابل باباكي وأتعرف عليه.<br>
          وأقدر أطلب إيدك منه
        </p>

        <p class="signature">
          ان شاء الله  اللي جاي يبقى أجمل لينا إحنا الاتنين. ♡
        </p>

        ${nextButton("وفيه رسالة اخيرة ليكي")}
      `, 91);

      connectNext(videoPage);
    }

    function videoPage() {
      show(`
        <div class="label">رسالة ليكي انت</div>
        <h2 id="pageTitle">كل سنة وانت منورة حياتي .</h2>

        <div id="videoArea"></div>

        <div id="giftLink" hidden>
          ${nextButton("افتحي آخر مفاجأة ♡")}
        </div>
      `, 96);

      const area = document.getElementById("videoArea");
      const giftLink = document.getElementById("giftLink");

      if (!settings.finalVideo) {
        area.innerHTML = `
          <p class="media-note">
            مكان فيديو النهاية جاهز.<br>
            دي معاينة لحد ما بودي يضيف الفيديو ♡
          </p>
        `;

        giftLink.hidden = false;
      } else {
        const video = document.createElement("video");

        video.controls = true;
        video.playsInline = true;
        video.preload = "metadata";

        video.addEventListener("ended", () => {
          giftLink.hidden = false;
        });

        video.addEventListener("error", () => {
          const note = document.createElement("p");
          note.className = "media-note";
          note.textContent =
            "الفيديو مش راضي يفتح… قولي لبودي، هو جنبك ♡";

          video.replaceWith(note);
          giftLink.hidden = false;
        }, { once: true });

        video.src = settings.finalVideo;
        area.appendChild(video);
      }

      connectNext(giftPage);
    }

    function giftPage() {
      show(`
        <div class="symbol" aria-hidden="true">♥</div>
        <div class="label">المفاجأة مش دي هنا</div>

        <h2 id="pageTitle">بصّي لبودي…</h2>

        <p>
          هديتك معاه. ♡<br>
          سيبي الموبايل لحظة… وخديها منه بنفسك.
        </p>

        <p class="signature">
          كل سنة وإنتِ جوهرتي.<br>
          بحبك يا منمن — بودي
        </p>

        <button class="quiet" id="restart">
          نعيش الحكاية تاني؟
        </button>
      `, 100);

      magic.celebrate(5500);
      document.getElementById("restart").onclick = intro;
    }

    intro();
  }

  // السماء والألعاب النارية.
  function createMagic() {
    const canvas = document.createElement("canvas");
    canvas.id = "magicSky";
    canvas.setAttribute("aria-hidden", "true");
    document.body.prepend(canvas);

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      canvas.remove();
      return { celebrate() {} };
    }

    const toggle = document.createElement("button");
    toggle.id = "magicToggle";
    toggle.type = "button";
    document.body.appendChild(toggle);

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    let enabled = !reducedMotion.matches;
    let width = 0;
    let height = 0;
    let stars = [];
    let particles = [];
    let frame = null;
    let lastTime = 0;
    let lastLaunch = 0;
    let celebrationUntil = 0;

    const colors = [
      "#ffc4e3",
      "#b6caff",
      "#d8bbff",
      "#a7e4ff",
      "#ffffff"
    ];

    function updateToggle() {
      toggle.textContent = enabled
        ? "إيقاف الحركة ✦"
        : "تشغيل السحر ✦";

      toggle.setAttribute("aria-pressed", String(enabled));
      canvas.hidden = !enabled;
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;

      const ratio = Math.min(window.devicePixelRatio || 1, width < 600 ? 1.35 : 1.75);

      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      stars = Array.from(
        { length: width < 600 ? 24 : 52 },
        () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 0.5 + Math.random(),
          phase: Math.random() * Math.PI * 2,
          speed: 0.5 + Math.random()
        })
      );
    }

    function burst(x, y) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const count = width < 600 ? 30 : 58;

      for (let i = 0; i < count; i++) {
        const angle =
          (Math.PI * 2 * i) / count + Math.random() * 0.08;

        const speed = 50 + Math.random() * 130;
        const life = 1.3 + Math.random() * 0.8;

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life,
          maxLife: life,
          color,
          radius: 1.2 + Math.random() * 0.6
        });
      }

      const particleLimit = width < 600 ? 260 : 420;
      if (particles.length > particleLimit) {
        particles.splice(0, particles.length - particleLimit);
      }
    }

    function launchFirework() {
      const x = width > 900
        ? width * (0.61 + Math.random() * 0.33)
        : width * (0.1 + Math.random() * 0.8);

      const y = width > 900
        ? height * (0.08 + Math.random() * 0.35)
        : Math.min(230, height * 0.35) *
          (0.2 + Math.random() * 0.8);

      burst(x, y);
    }

    function draw(time) {
      frame = null;

      if (!enabled || document.hidden) return;

      const dt = lastTime
        ? Math.min((time - lastTime) / 1000, 0.04)
        : 0.016;

      lastTime = time;
      ctx.clearRect(0, 0, width, height);

      for (const star of stars) {
        ctx.globalAlpha =
          0.15 +
          (Math.sin(time * 0.001 * star.speed + star.phase) + 1) *
          0.22;

        ctx.fillStyle = "#e0eaff";
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;

      const interval = time < celebrationUntil ? 450 : 3400;

      if (time - lastLaunch > interval) {
        launchFirework();
        lastLaunch = time;
      }

      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.life -= dt;

        if (particle.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const previousX = particle.x;
        const previousY = particle.y;
        const drag = Math.exp(-0.8 * dt);

        particle.vx *= drag;
        particle.vy = particle.vy * drag + 32 * dt;
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;

        ctx.globalAlpha = particle.life / particle.maxLife;
        ctx.strokeStyle = particle.color;
        ctx.lineWidth = particle.radius;

        ctx.beginPath();
        ctx.moveTo(previousX, previousY);
        ctx.lineTo(particle.x, particle.y);
        ctx.stroke();

        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(
          particle.x,
          particle.y,
          particle.radius,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      ctx.restore();
      frame = requestAnimationFrame(draw);
    }

    function startLoop() {
      if (!enabled || document.hidden || frame !== null) return;
      lastTime = 0;
      frame = requestAnimationFrame(draw);
    }

    function stopLoop() {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      lastTime = 0;
    }

    function celebrate(duration = 2200) {
      if (!enabled || document.hidden) return;
      celebrationUntil = performance.now() + duration;
      launchFirework();
      startLoop();
    }

    function setEnabled(value) {
      enabled = value;
      updateToggle();

      if (enabled) {
        celebrate(1500);
      } else {
        stopLoop();
        particles = [];
        ctx.clearRect(0, 0, width, height);
      }
    }

    toggle.onclick = () => setEnabled(!enabled);

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopLoop();
      else startLoop();
    });

    reducedMotion.addEventListener("change", event => {
      setEnabled(!event.matches);
    });

    window.addEventListener("resize", resize);

    resize();
    updateToggle();
    startLoop();

    return { celebrate };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();