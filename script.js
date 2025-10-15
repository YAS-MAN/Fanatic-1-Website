document.addEventListener("DOMContentLoaded", () => {
  const carList = document.getElementById("car-list");
  const filterContainer = document.querySelector(".filter-buttons");
  const car1 = document.getElementById("car1");
  const car2 = document.getElementById("car2");
  const comparison = document.getElementById("comparison-result");
  const quizQuestion = document.getElementById("quiz-question");
  const quizOptions = document.getElementById("quiz-options");
  const nextBtn = document.getElementById("next-btn");
  const scoreText = document.getElementById("quiz-score");
  const progressText = document.getElementById("quiz-progress");
  const detailContainer = document.getElementById("car-detail");
  
  // Fungsi untuk menghitung perbandingan statistik antara dua mobil
  function compareCarStats(car1, car2) {
    // Ekstrak nilai numerik dari string (misalnya "350 km/h" menjadi 350)
    const getNumericValue = (str) => {
      const match = str.match(/\d+/);
      return match ? parseInt(match[0]) : 0;
    };
    
    // Hitung perbedaan top speed
    const topSpeed1 = getNumericValue(car1.topSpeed);
    const topSpeed2 = getNumericValue(car2.topSpeed);
    const topSpeedDiff = `${Math.abs(topSpeed1 - topSpeed2)} km/h ${topSpeed1 > topSpeed2 ? 'lebih cepat' : 'lebih lambat'}`;
    
    // Hitung perbedaan berat
    const weight1 = getNumericValue(car1.weight);
    const weight2 = getNumericValue(car2.weight);
    const weightDiff = `${Math.abs(weight1 - weight2)} kg ${weight1 < weight2 ? 'lebih ringan' : weight1 > weight2 ? 'lebih berat' : 'sama'}`;
    
    // Hitung perbedaan kemenangan balapan
    const raceWins1 = car1.raceWins || 0;
    const raceWins2 = car2.raceWins || 0;
    const raceWinsDiff = `${Math.abs(raceWins1 - raceWins2)} kemenangan ${raceWins1 > raceWins2 ? 'lebih banyak' : 'lebih sedikit'}`;
    
    // Hitung perbedaan podium
    const podiums1 = car1.podiums || 0;
    const podiums2 = car2.podiums || 0;
    const podiumsDiff = `${Math.abs(podiums1 - podiums2)} podium ${podiums1 > podiums2 ? 'lebih banyak' : 'lebih sedikit'}`;
    
    // Hitung perbedaan poin
    const points1 = car1.points || 0;
    const points2 = car2.points || 0;
    const pointsDiff = `${Math.abs(points1 - points2)} poin ${points1 > points2 ? 'lebih banyak' : 'lebih sedikit'}`;
    
    // Nilai perbandingan untuk visualisasi (-10 sampai 10)
    // Nilai positif berarti car1 lebih unggul, negatif berarti car2 lebih unggul
    const topSpeed = topSpeed1 === topSpeed2 ? 0 : (topSpeed1 > topSpeed2 ? 5 : -5);
    const weight = weight1 === weight2 ? 0 : (weight1 < weight2 ? 5 : -5); // Lebih ringan lebih baik
    const raceWins = raceWins1 === raceWins2 ? 0 : (raceWins1 > raceWins2 ? 5 : -5);
    const podiums = podiums1 === podiums2 ? 0 : (podiums1 > podiums2 ? 5 : -5);
    const points = points1 === points2 ? 0 : (points1 > points2 ? 5 : -5);
    
    return {
      topSpeed,
      topSpeedDiff,
      weight,
      weightDiff,
      raceWins,
      raceWinsDiff,
      podiums,
      podiumsDiff,
      points,
      pointsDiff
    };
  }

  // ====== CLASSIFICATION ======
  if (carList) {
    // generate filter buttons based on unique teams
    if (filterContainer) {
      const teams = Array.from(new Set(cars.map((c) => c.team)));
      teams.forEach((team) => {
        const btn = document.createElement("button");
        btn.className = "filter-btn";
        btn.dataset.team = team;
        btn.textContent = team;
        btn.addEventListener("click", () => applyFilter(team));
        filterContainer.appendChild(btn);
      });
      // also wire "all" button
      const allBtn = filterContainer.querySelector('[data-team="all"]');
      if (allBtn) allBtn.addEventListener("click", () => applyFilter("all"));
    }

    function renderCards(list) {
      carList.innerHTML = "";
      list.forEach((car) => {
        const card = document.createElement("div");
        card.className = "card clickable";
        card.innerHTML = `
          <img src="${car.imageList || car.image || ''}" alt="${car.name}">
          <div class="card-content">
            <h3>${car.name}</h3>
            <p class="team-name" style="color: #ff0000; font-weight: 500;">${car.team}</p>
            <div class="card-description">
              ${car.description ? car.description.substring(0, 80) + '...' : 'Tidak ada deskripsi'}
            </div>
            <hr class="card-divider">
            <p><b>Engine:</b> ${car.engine}</p>
            <p><b>Top Speed:</b> ${car.topSpeed}</p>
            <p><b>Power:</b> ${car.power}</p>
            <p><b>Pembalap:</b> ${car.mainDrivers}</p>
          </div>`;
        card.addEventListener("click", () => {
          const url = new URL("detail.html", window.location.href);
          url.searchParams.set("name", car.name);
          window.location.href = url.toString();
        });
        carList.appendChild(card);
      });
    }

    function applyFilter(team) {
      const buttons = filterContainer?.querySelectorAll(".filter-btn");
      buttons?.forEach((b) => b.classList.remove("active"));
      const activeBtn = filterContainer?.querySelector(`[data-team="${team}"]`);
      activeBtn?.classList.add("active");
      if (team === "all") return renderCards(cars);
      renderCards(cars.filter((c) => c.team === team));
    }

    renderCards(cars);
  }

  // ====== COMPARISON ======
  if (car1 && car2) {
    cars.forEach((car) => {
      const opt1 = document.createElement("option");
      const opt2 = document.createElement("option");
      opt1.value = car.name;
      opt1.textContent = car.name;
      opt2.value = car.name;
      opt2.textContent = car.name;
      car1.appendChild(opt1);
      car2.appendChild(opt2);
    });

    function showComparison() {
      const c1 = cars.find((c) => c.name === car1.value);
      const c2 = cars.find((c) => c.name === car2.value);
      if (c1 && c2) {
        // Menghitung statistik perbandingan
        const stats = compareCarStats(c1, c2);
        
        comparison.innerHTML = `
          <div class="compare-gallery">
            <div class="compare-card">
              <img src="${c1.imageDetail}" alt="${c1.name}">
              <div class="compare-overlay">
                <h3>${c1.name}</h3>
                <span>${c1.team}</span>
              </div>
            </div>
            <div class="compare-card">
              <img src="${c2.imageDetail}" alt="${c2.name}">
              <div class="compare-overlay">
                <h3>${c2.name}</h3>
                <span>${c2.team}</span>
              </div>
            </div>
          </div>
          <div class="swap-wrap"><button class="swap-btn" aria-label="Tukar">
            ↔
          </button></div>
          <table class="compare-table">
            <tr><td>${c1.year}</td><th>Tahun</th><td>${c2.year}</td></tr>
            <tr><td>${c1.engine}</td><th>Engine</th><td>${c2.engine}</td></tr>
            <tr><td>${c1.power}</td><th>Power</th><td>${c2.power}</td></tr>
            <tr><td>${c1.topSpeed}</td><th>Top Speed</th><td>${c2.topSpeed}</td></tr>
            <tr><td>${c1.weight}</td><th>Weight</th><td>${c2.weight}</td></tr>
            <tr><td>${c1.chassis}</td><th>Chassis</th><td>${c2.chassis}</td></tr>
            <tr><td>${c1.wheelbase}</td><th>Wheelbase</th><td>${c2.wheelbase}</td></tr>
            <tr><td>${c1.acceleration}</td><th>Acceleration</th><td>${c2.acceleration}</td></tr>
            <tr><td>${c1.mainDrivers}</td><th>Pembalap Utama</th><td>${c2.mainDrivers}</td></tr>
            <tr><td>${c1.championships}</td><th>Jumlah Kejuaraan</th><td>${c2.championships}</td></tr>
            <tr><td>${c1.aerodynamics}</td><th>Aerodinamika</th><td>${c2.aerodynamics}</td></tr>
            <tr><td>${c1.suspension}</td><th>Suspensi</th><td>${c2.suspension}</td></tr>
            <tr><td>${c1.brakes}</td><th>Sistem Rem</th><td>${c2.brakes}</td></tr>
            <tr><td>${c1.transmission}</td><th>Transmisi</th><td>${c2.transmission}</td></tr>
            <tr><td>${c1.raceWins || 'N/A'}</td><th>Kemenangan Balapan</th><td>${c2.raceWins || 'N/A'}</td></tr>
            <tr><td>${c1.podiums || 'N/A'}</td><th>Podium</th><td>${c2.podiums || 'N/A'}</td></tr>
            <tr><td>${c1.points || 'N/A'}</td><th>Poin</th><td>${c2.points || 'N/A'}</td></tr>
            <tr><td>${c1.capacity || 'N/A'}</td><th>Kapasitas Mesin</th><td>${c2.capacity || 'N/A'}</td></tr>
            <tr><td>${c1.rpm || 'N/A'}</td><th>RPM</th><td>${c2.rpm || 'N/A'}</td></tr>
            <tr><td>${c1.valves || 'N/A'}</td><th>Katup</th><td>${c2.valves || 'N/A'}</td></tr>
          </table>
          
          <div class="stats-comparison">
            <h2>Statistik Perbandingan</h2>
            <div class="stats-grid">
              <div class="stats-card ${stats.topSpeed > 0 ? 'advantage-left' : stats.topSpeed < 0 ? 'advantage-right' : ''}">
                <h3>Top Speed</h3>
                <div class="stats-bar">
                  <div class="stats-indicator" style="left: ${50 + stats.topSpeed * 5}%"></div>
                </div>
                <div class="stats-labels">
                  <span>${c1.name}</span>
                  <span>${c2.name}</span>
                </div>
                <p class="stats-diff">${stats.topSpeedDiff}</p>
              </div>
              
              <div class="stats-card ${stats.weight > 0 ? 'advantage-right' : stats.weight < 0 ? 'advantage-left' : ''}">
                <h3>Weight</h3>
                <div class="stats-bar">
                  <div class="stats-indicator" style="left: ${50 + stats.weight * 5}%"></div>
                </div>
                <div class="stats-labels">
                  <span>${c1.name}</span>
                  <span>${c2.name}</span>
                </div>
                <p class="stats-diff">${stats.weightDiff}</p>
              </div>
              
              <div class="stats-card ${stats.raceWins > 0 ? 'advantage-left' : stats.raceWins < 0 ? 'advantage-right' : ''}">
                <h3>Race Wins</h3>
                <div class="stats-bar">
                  <div class="stats-indicator" style="left: ${50 + stats.raceWins * 5}%"></div>
                </div>
                <div class="stats-labels">
                  <span>${c1.name}</span>
                  <span>${c2.name}</span>
                </div>
                <p class="stats-diff">${stats.raceWinsDiff}</p>
              </div>
              
              <div class="stats-card ${stats.podiums > 0 ? 'advantage-left' : stats.podiums < 0 ? 'advantage-right' : ''}">
                <h3>Podiums</h3>
                <div class="stats-bar">
                  <div class="stats-indicator" style="left: ${50 + stats.podiums * 5}%"></div>
                </div>
                <div class="stats-labels">
                  <span>${c1.name}</span>
                  <span>${c2.name}</span>
                </div>
                <p class="stats-diff">${stats.podiumsDiff}</p>
              </div>
              
              <div class="stats-card ${stats.points > 0 ? 'advantage-left' : stats.points < 0 ? 'advantage-right' : ''}">
                <h3>Points</h3>
                <div class="stats-bar">
                  <div class="stats-indicator" style="left: ${50 + stats.points * 5}%"></div>
                </div>
                <div class="stats-labels">
                  <span>${c1.name}</span>
                  <span>${c2.name}</span>
                </div>
                <p class="stats-diff">${stats.pointsDiff}</p>
              </div>
            </div>
          </div>
        `;
        const swapBtn = comparison.querySelector(".swap-btn");
        swapBtn?.addEventListener("click", () => {
          const temp = car1.value;
          car1.value = car2.value;
          car2.value = temp;
          showComparison();
        });
      }
    }
    car1.addEventListener("change", showComparison);
    car2.addEventListener("change", showComparison);
    // set default selections and render initially
    if (cars.length > 1) {
      car1.value = cars[0].name;
      car2.value = cars[1].name;
      showComparison();
    }
  }

  // ====== QUIZ ======
  let index = 0,
    score = 0;
  let shuffledQuestions = [];
  const MAX_QUESTIONS = 8; // Jumlah maksimal pertanyaan yang ditampilkan
  
  // Fungsi untuk mengacak array pertanyaan
  function shuffleQuestions(questions) {
    // Buat salinan array untuk diacak
    const shuffled = [...questions];
    // Algoritma Fisher-Yates untuk mengacak array
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    // Ambil hanya 8 pertanyaan pertama
    return shuffled.slice(0, MAX_QUESTIONS);
  }
  
  // Fungsi untuk memulai ulang quiz
  function restartQuiz() {
    index = 0;
    score = 0;
    shuffledQuestions = shuffleQuestions(quizQuestions);
    if (scoreText) scoreText.textContent = "Skor: 0";
    loadQuiz();
  }
  
  if (quizQuestion && quizOptions && nextBtn) {
    // Inisialisasi quiz dengan pertanyaan yang diacak
    shuffledQuestions = shuffleQuestions(quizQuestions);
    loadQuiz();
    
    nextBtn.addEventListener("click", () => {
      index++;
      if (index < shuffledQuestions.length) {
        loadQuiz();
      } else {
        // Tampilkan hasil dan tombol retry
        quizQuestion.innerHTML = `<h2>Quiz selesai! Skor kamu: ${score}/${shuffledQuestions.length}</h2>`;
        quizOptions.innerHTML = "";
        
        // Buat tombol retry
        const retryBtn = document.createElement("button");
        retryBtn.textContent = "Coba Lagi";
        retryBtn.className = "btn red retry-btn";
        retryBtn.onclick = restartQuiz;
        
        // Hapus tombol next dan tambahkan tombol retry
        const quizFooter = document.querySelector(".quiz-footer");
        quizFooter.innerHTML = "";
        quizFooter.appendChild(retryBtn);
      }
    });
  }

  function loadQuiz() {
    const q = shuffledQuestions[index];
    quizQuestion.textContent = q.question;
    quizOptions.innerHTML = "";
    nextBtn.disabled = true;
    
    // Reset tampilan footer untuk menampilkan tombol next
    const quizFooter = document.querySelector(".quiz-footer");
    if (quizFooter && !quizFooter.querySelector("#next-btn")) {
      quizFooter.innerHTML = "";
      const nextButton = document.createElement("button");
      nextButton.id = "next-btn";
      nextButton.className = "btn red";
      nextButton.disabled = true;
      nextButton.textContent = "Berikutnya";
      nextButton.addEventListener("click", () => {
        index++;
        if (index < shuffledQuestions.length) {
          loadQuiz();
        } else {
          showQuizResults();
        }
      });
      quizFooter.appendChild(nextButton);
      nextBtn = nextButton;
    }
    
    // Fungsi untuk menampilkan hasil quiz
    function showQuizResults() {
      // Tampilkan hasil dan tombol retry
      quizQuestion.innerHTML = `<h2>Quiz selesai! Skor kamu: ${score}/${shuffledQuestions.length}</h2>`;
      quizOptions.innerHTML = "";
      
      // Buat tombol retry
      const retryBtn = document.createElement("button");
      retryBtn.textContent = "Coba Lagi";
      retryBtn.className = "btn red retry-btn";
      retryBtn.onclick = restartQuiz;
      
      // Hapus tombol next dan tambahkan tombol retry
      quizFooter.innerHTML = "";
      quizFooter.appendChild(retryBtn);
    }
    
    if (progressText)
      progressText.textContent = `Pertanyaan ${index + 1} dari ${
        shuffledQuestions.length
      }`;
    
    // Acak juga pilihan jawaban
    const shuffledOptions = [...q.options];
    for (let i = shuffledOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
    }
    
    shuffledOptions.forEach((opt) => {
      const btn = document.createElement("button");
      btn.textContent = opt;
      btn.className = "quiz-option";
      btn.onclick = () => {
        const isCorrect = opt === q.answer;
        if (isCorrect) score++;

        // Show feedback
        const feedback = document.createElement("div");
        feedback.className = `quiz-feedback ${
          isCorrect ? "correct" : "incorrect"
        }`;
        feedback.textContent = isCorrect ? "✓ Benar!" : "✗ Salah!";
        quizOptions.appendChild(feedback);

        // Mark all options
        Array.from(quizOptions.children).forEach((option) => {
          if (option.tagName === "BUTTON") {
            option.disabled = true;
            if (option.textContent === q.answer) {
              option.classList.add("correct");
            } else if (option.textContent === opt && !isCorrect) {
              option.classList.add("incorrect");
            }
          }
        });

        scoreText.textContent = `Skor: ${score}`;
        nextBtn.disabled = false;
      };
      quizOptions.appendChild(btn);
    });
  }

  // ====== DETAIL PAGE ======
  if (detailContainer) {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");
    const car = cars.find((c) => c.name === name) || cars[0];
    if (car) {
      detailContainer.innerHTML = `
        <div class="detail-hero">
          <img src="${car.imageDetail || car.image || ''}" alt="${car.name}">
          <div class="detail-hero-content">
            <h1>${car.name}</h1>
            <p class="team-name" style="color: #ff0000; font-weight: 500;">${car.team}</p>
            <div class="car-description">
              <p>${car.description}</p>
            </div>
          </div>
        </div>
        <div class="detail-specs">
          <h2>Spesifikasi Teknis</h2>
          <ul>
            <li><b>Tahun</b><span>${car.year}</span></li>
            <li><b>Engine</b><span>${car.engine}</span></li>
            <li><b>Power</b><span>${car.power}</span></li>
            <li><b>Top Speed</b><span>${car.topSpeed}</span></li>
            <li><b>Weight</b><span>${car.weight}</span></li>
            <li><b>Chassis</b><span>${car.chassis}</span></li>
            <li><b>Wheelbase</b><span>${car.wheelbase}</span></li>
            <li><b>Acceleration</b><span>${car.acceleration}</span></li>
            <li><b>Transmission</b><span>${car.transmission}</span></li>
            <li><b>Kapasitas Bahan Bakar</b><span>${car.fuelCapacity}</span></li>
            <li><b>Kapasitas Mesin</b><span>${car.capacity || 'N/A'}</span></li>
            <li><b>RPM</b><span>${car.rpm || 'N/A'}</span></li>
            <li><b>Katup</b><span>${car.valves || 'N/A'}</span></li>
          </ul>
          
          <h2>Statistik</h2>
          <ul>
            <li><b>Kemenangan Balapan</b><span>${car.raceWins || 'N/A'}</span></li>
            <li><b>Podium</b><span>${car.podiums || 'N/A'}</span></li>
            <li><b>Poin</b><span>${car.points || 'N/A'}</span></li>
            <li><b>Pembalap Utama</b><span>${car.mainDrivers}</span></li>
            <li><b>Jumlah Kejuaraan</b><span>${car.championships}</span></li>
            <li><b>Pemasok Ban</b><span>${car.tireSupplier}</span></li>
          </ul>
          
          <h2>Teknologi</h2>
          <ul>
            <li><b>Aerodinamika</b><span>${car.aerodynamics}</span></li>
            <li><b>Suspensi</b><span>${car.suspension}</span></li>
            <li><b>Sistem Rem</b><span>${car.brakes}</span></li>
          </ul>
          
          <a class="btn red" href="classification.html">← Kembali</a>
        </div>
      `;
    }
  }
});
