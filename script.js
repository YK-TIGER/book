// ==========================
// Apps Script URL
// ==========================
const API = "여기에_AppsScript_URL_붙여넣기";

// ==========================
// 예약 시간 설정
// ==========================
const START_HOUR = 10;
const END_HOUR = 17;
const INTERVAL = 10;

// ==========================
// 시간 생성
// ==========================
const times = [];

for (let h = START_HOUR; h < END_HOUR; h++) {
    for (let m = 0; m < 60; m += INTERVAL) {
        times.push(
            `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
        );
    }
}

// ==========================
// 시간 목록 생성
// ==========================
const select = document.getElementById("time");

times.forEach(time => {
    const option = document.createElement("option");
    option.value = time;
    option.textContent = time;
    select.appendChild(option);
});

// 시작 시 예약 현황
loadReserved();

// 30초마다 새로고침
setInterval(loadReserved, 30000);

// ==========================
// 예약 현황 불러오기
// ==========================
async function loadReserved() {

    try {

        [...select.options].forEach(option => {
            option.disabled = false;
            option.textContent = option.value;
        });

        const res = await fetch(API + "?t=" + Date.now());
        const reserved = await res.json();

        reserved.forEach(row => {

            const option = [...select.options]
                .find(o => o.value === row[0]);

            if(option){
                option.disabled = true;
                option.textContent = `${row[0]} (예약완료)`;
            }

        });

    } catch(err){

        console.error(err);

    }

}

// ==========================
// 예약하기
// ==========================
async function reserve() {

    const time = document.getElementById("time").value;
    const name = document.getElementById("name").value.trim();
    const student = document.getElementById("student").value.trim();

    if (!name || !student) {
        alert("이름과 학번을 입력해주세요.");
        return;
    }

    try {

        const res = await fetch(API, {
            method: "POST",
            body: JSON.stringify({
                time,
                name,
                student
            })
        });

        const result = await res.text();

        switch(result){

            case "success":

                document.getElementById("result").innerHTML = `
                    <h3>예약 완료</h3>
                    <p>예약시간 : ${time}</p>
                    <p>이름 : ${name}</p>
                    <p>학번 : ${student}</p>
                `;

                document.getElementById("name").value = "";
                document.getElementById("student").value = "";

                loadReserved();

                break;

            case "duplicate_time":

                alert("이미 예약된 시간입니다.");
                loadReserved();
                break;

            case "duplicate_student":

                alert("이미 예약한 학번입니다.");
                break;

            default:

                alert("예약에 실패했습니다.");

        }

    } catch(err){

        console.error(err);
        alert("서버 오류가 발생했습니다.");

    }

}
