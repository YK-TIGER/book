// ==========================
// Apps Script URL
// ==========================
const API = "https://script.google.com/macros/s/AKfycbxvC2jWo2P0CoYKh4vN-IiZQxVcja8E6epswGMUxZuS1bOXfS_k-wmfqqqRngyfTrQ0QQ/exec";

// 페이지 시작
loadSummary();

// 30초마다 자동 갱신
setInterval(loadSummary, 30000);

// ==========================
// 예약 현황 불러오기
// ==========================
async function loadSummary() {

    try {

        const response = await fetch(API + "?t=" + Date.now());

        const data = await response.json();

        let totalPeople = 0;

        data.forEach(row => {
            totalPeople += Number(row[3]);
        });

        document.getElementById("teamCount").textContent =
            `${data.length}팀`;

        document.getElementById("peopleCount").textContent =
            `${totalPeople}명`;

    } catch (err) {

        console.error(err);

    }

}