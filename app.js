
let questions = [
  {
    subject: "생화학",
    chapter: ["Ch19", "Ch22"],
    source: "야마",
    year: "2022",
    question: "인슐린의 기능은?",
    choices: ["혈당 증가", "혈당 감소", "글루카곤 분비 촉진", "에피네프린 작용 억제"],
    answer: [1],
    explanation: "인슐린은 혈당을 낮추는 호르몬입니다."
  },
  {
    subject: "생화학",
    chapter: ["Ch22"],
    source: "교과서",
    year: "2022",
    question: "해당과정의 최종 생성물은?",
    choices: ["ATP", "NADH", "Pyruvate", "CO2"],
    answer: [2],
    explanation: "해당과정(glycolysis)의 마지막 산물은 Pyruvate입니다."
  }
];

let currentSet = [];
let markedQuestions = [];
let notes = {};

function startSetup() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <h2>필터 선택</h2>
    <p>챕터 선택: <input id="chapters" placeholder="예: Ch19,Ch22" /></p>
    <p>출처 선택: <input id="sources" placeholder="예: 교과서,야마" /></p>
    <p>야마 연도 선택: <input id="years" placeholder="예: 2022,2023" /></p>
    <button onclick="startQuiz()">시작</button>
  `;
}

function startQuiz() {
  const ch = document.getElementById("chapters").value.split(',').map(s => s.trim());
  const so = document.getElementById("sources").value.split(',').map(s => s.trim());
  const yr = document.getElementById("years").value.split(',').map(s => s.trim());

  currentSet = questions.filter(q => {
    const chapterMatch = ch.length === 0 || ch.some(c => q.chapter.includes(c));
    const sourceMatch = so.length === 0 || so.includes(q.source);
    const yearMatch = q.source !== "야마" || yr.includes(q.year);
    return chapterMatch && sourceMatch && yearMatch;
  });

  if (currentSet.length === 0) {
    alert("조건에 맞는 문제가 없습니다.");
    return;
  }

  showQuestion(0);
}

function showQuestion(i) {
  const app = document.getElementById("app");
  const q = currentSet[i];
  app.innerHTML = `
    <h3>문제 ${i + 1}/${currentSet.length}</h3>
    <p>${q.question}</p>
    ${q.choices.map((c, idx) => `<button onclick="checkAnswer(${i}, ${idx})">${idx + 1}. ${c}</button>`).join('<br>')}
    <br><br>
    <button onclick="markQuestion(${i})">다시 볼 문제로 저장</button>
    <button onclick="noteQuestion(${i})">필기</button>
  `;
}

function checkAnswer(i, selected) {
  const q = currentSet[i];
  const correct = q.answer.includes(selected);
  alert((correct ? "정답입니다!" : "오답입니다!") + "\n\n해설: " + q.explanation);
  if (i + 1 < currentSet.length) showQuestion(i + 1);
  else alert("문제풀이 끝!");
}

function markQuestion(i) {
  const q = currentSet[i];
  if (!markedQuestions.includes(q)) {
    markedQuestions.push(q);
    alert("다시 볼 문제에 저장했어요.");
  }
}

function noteQuestion(i) {
  const q = currentSet[i];
  const key = q.question;
  const existing = notes[key] || "";
  const input = prompt("필기 내용을 입력하세요:", existing);
  if (input !== null) {
    notes[key] = input;
    alert("메모 저장 완료!");
  }
}

function reviewMarked() {
  if (markedQuestions.length === 0) {
    alert("저장된 문제가 없습니다.");
    return;
  }
  currentSet = markedQuestions;
  showQuestion(0);
}

function showNotes() {
  const app = document.getElementById("app");
  const entries = Object.entries(notes);
  if (entries.length === 0) {
    app.innerHTML = "<p>작성된 메모가 없습니다.</p>";
    return;
  }
  app.innerHTML = "<h3>내 메모</h3>" + entries.map(([q, n]) => `<p><b>${q}</b><br>${n}</p>`).join("<hr>");
}
