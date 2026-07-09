// ==========================
// Apps Script URL
// ==========================
const API = "여기에_AppsScript_URL";

// 시작
loadList();

// 30초마다 자동 갱신
setInterval(loadList, 30000);

// ==========================
// 예약자 명단 불러오기
// ==========================
async function loadList() {

    try {

        const response = await fetch(API + "?t=" + Date.now());

        const data = await response.json();

        // 시간순 정렬
        data.sort((a, b) => {

            const t1 = a[0].split(":").map(Number);
            const t2 = b[0].split(":").map(Number);

            return (t1[0] * 60 + t1[1]) - (t2[0] * 60 + t2[1]);

        });

        const tbody = document.getElementById("tableBody");

        tbody.innerHTML = "";

        let totalPeople = 0;

        if (data.length === 0) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="4">
                        현재 예약이 없습니다.
                    </td>
                </tr>
            `;

        } else {

            data.forEach(row => {

                totalPeople += Number(row[3]);

                tbody.innerHTML += `
                    <tr>
                        <td>${row[0]}</td>
                        <td>${row[1]}</td>
                        <td>${row[2]}</td>
                        <td>${row[3]}명</td>
                    </tr>
                `;

            });

        }

        document.getElementById("teamCount").textContent =
            `${data.length}팀`;

        document.getElementById("peopleCount").textContent =
            `${totalPeople}명`;

    }

    catch (err) {

        console.error(err);

        alert("예약자 명단을 불러오지 못했습니다.");

    }

}
