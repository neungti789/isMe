const buttonSpin = document.getElementById("button-spin")
let resultValue = document.getElementById("result").value;

const resultInput = document.getElementById("result");

resultInput.addEventListener("change", () => {
    resultValue = resultInput.value;
    console.log("Updated resultValue:", resultValue);
});

buttonSpin.onclick = () => {
    const textArea = document.getElementById("input-user");
    const users = textArea.value.split("\n").map(user => user.trim()).filter(user => user !== ""); // Remove empty lines
    const spinImage = document.getElementById("spin-image");
    const spinGif = document.getElementById("spin-gif");

    const filterSameUser = [];

    users.forEach(user => {
        if (!filterSameUser.includes(user)) {
            filterSameUser.push(user);
        }
    });

    const lengthArray = filterSameUser.length;

    if (lengthArray < parseInt(resultValue)) {
        alert(`จำนวนผู้ใช้ที่ป้อนเข้ามาต้องมากกว่า ${resultValue}`);
        return;
    }

    buttonSpin.style.pointerEvents = "none";

    spinGif.style.display = "block";
    spinImage.style.display = "none";

    // Get 'resultValue' number of unique users
    const userGetPrize = [];
    let i = 0;
    while (i < parseInt(resultValue)) {
        const randomUser = Math.floor(Math.random() * lengthArray);
        const thisUser = filterSameUser[randomUser];
        if (!userGetPrize.includes(thisUser)) {
            userGetPrize.push(thisUser);
            i++;
        }
    }

    const prizeBox = document.getElementById("spinner-container-prize");
    prizeBox.innerHTML = "";
    const audio = document.getElementById("spinner-sound");
    const audioAppear = document.getElementById("appear-sound");
    audio.play();

    setTimeout(() => {
        userGetPrize.forEach((item, index) => {
            const elementPrize = `<div class="prize-card">
                <div class="prize-number">${index + 1}</div>
                ${item}
            </div>`;
            audio.pause();
            audioAppear.play();
            prizeBox.innerHTML += elementPrize;
        });
        buttonSpin.style.pointerEvents = "all";
        spinGif.style.display = "none";
        spinImage.style.display = "block";
    }, 7000);
};
