// ==========================
// Apps Script URL
// ==========================
const API = "https://script.google.com/macros/s/AKfycbzIvtkWLKGoAssdwUotKNiWUNzQ9vo3OUTrnK77lE47xrdL5nCw-4565r_9aHUOuHxjGw/exec";

// ==========================
// 예약 시간 설정
// ==========================
const START_HOUR = 10;
const END_HOUR = 17;
const INTERVAL = 10;

// ==========================
// 예약 시간 생성
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
// 시간 목록 출력
// ==========================
const select = document.getElementById("time");

times.forEach(time => {

    const option = document.createElement("option");

    option.value = time;
    option.textContent = time;

    select.appendChild(option);

});

// ==========================
// 시작 시 예약 현황 조회
// ==========================
loadReserved();

// 30초마다 자동 갱신
setInterval(loadReserved, 30000);

// ==========================
// 예약 현황 조회
// ==========================
async function loadReserved() {

    try {

        // 옵션 초기화
        [...select.options].forEach(option => {
            option.disabled = false;
            option.textContent = option.value;
        });

        const response = await fetch(API + "?t=" + Date.now());

        const reserved = await response.json();

        reserved.forEach(row => {

            const option =
                [...select.options].find(o => o.value === row[0]);

            if (option) {

                option.disabled = true;
                option.textContent =
                    `${row[0]} (예약완료)`;

            }

        });

    } catch (error) {

        console.error(error);

    }

}

// ==========================
// 예약하기
// ==========================
async function reserve() {

    const time = document.getElementById("time").value;
    const name = document.getElementById("name").value.trim();
    const student = document.getElementById("student").value.trim();
    const people = document.getElementById("people").value;

    if (!name || !student) {

        alert("이름과 학번을 입력해주세요.");
        return;

    }

    const button = document.querySelector("button");

    button.disabled = true;
    button.textContent = "예약 중...";

    try {

        const response = await fetch(API, {

            method: "POST",

            body: JSON.stringify({

                time,
                name,
                student,
                people

            })

        });

        const result = await response.text();

        switch (result) {

            case "success":

                document.getElementById("result").innerHTML = `
                    <h3>예약 완료</h3>
                    <p>예약 시간 : ${time}</p>
                    <p>이름 : ${name}</p>
                    <p>학번 : ${student}</p>
                    <p>인원 : ${people}명</p>
                `;

                document.getElementById("name").value = "";
                document.getElementById("student").value = "";
                document.getElementById("people").value = "1";

                await loadReserved();

                break;

            case "duplicate_time":

                alert("이미 예약된 시간입니다.");

                await loadReserved();

                break;

            case "duplicate_student":

                alert("이미 예약한 학번입니다.");

                break;

            default:

                alert("예약에 실패했습니다.");

        }

    } catch (error) {

        console.error(error);

        alert("서버 오류가 발생했습니다.");

    }

    button.disabled = false;
    button.textContent = "예약하기";

}
