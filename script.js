const API = "여기에 Apps Script URL";

const times = [
    "10:00",
    "10:20",
    "10:40",
    "11:00",
    "11:20",
    "11:40",
    "13:00",
    "13:20",
    "13:40",
    "14:00"
];

const select = document.getElementById("time");

times.forEach(time => {
    const option = document.createElement("option");
    option.value = time;
    option.textContent = time;
    select.appendChild(option);
});

loadReserved();

async function loadReserved(){

    const res = await fetch(API);
    const reserved = await res.json();

    reserved.forEach(row=>{

        const option=[...select.options].find(o=>o.value===row[0]);

        if(option){
            option.disabled=true;
            option.text += " (예약완료)";
        }

    });

}

async function reserve(){

    const time=document.getElementById("time").value;
    const name=document.getElementById("name").value.trim();
    const student=document.getElementById("student").value.trim();

    if(!name || !student){
        alert("이름과 학번을 입력하세요.");
        return;
    }

    const res = await fetch(API,{
        method:"POST",
        body:JSON.stringify({
            time,
            name,
            student
        })
    });

    const result = await res.text();

    if(result==="success"){

        document.getElementById("result").innerHTML=`
            예약 완료!<br><br>
            예약시간 : ${time}<br>
            이름 : ${name}<br>
            학번 : ${student}
        `;

    }else{

        alert("이미 예약된 시간입니다.");

    }

}
