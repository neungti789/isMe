let sectors = [
  { color: "#FFBC03", text: "#333333", label: "จับรางวัล" },
  /*{ color: "#FF5A10", text: "#333333", label: "Prize draw" },
  { color: "#FFBC03", text: "#333333", label: "Sweets" },
  { color: "#FF5A10", text: "#333333", label: "Prize draw" },
  { color: "#FFBC03", text: "#333333", label: "Sweets + Prize draw" },
  { color: "#FF5A10", text: "#333333", label: "You lose" },
  { color: "#FFBC03", text: "#333333", label: "Prize draw" },
  { color: "#FF5A10", text: "#333333", label: "Sweets" },*/
];
let groups = [];

const events = {
  listeners: {},
  addListener(eventName, fn) {
    this.listeners[eventName] = this.listeners[eventName] || [];
    this.listeners[eventName].push(fn);
  },
  fire(eventName, ...args) {
    this.listeners[eventName]?.forEach(fn => fn(...args));
  },
};

const rand = (min, max) => Math.random() * (max - min) + min;

let tot = sectors.length;
const inputFile = document.querySelector("#input-user");
const spinEl = document.querySelector("#spin");
const ctx = document.querySelector("#wheel").getContext("2d");
const dia = ctx.canvas.width;
const rad = dia / 2;
const PI = Math.PI;
const TAU = 2 * PI;
let arc = TAU / tot;

const friction = 0.991; // 0.995=soft, 0.99=mid, 0.98=hard
let angVel = 0; // Angular velocity
let ang = 0; // Angle in radians
let spinButtonClicked = true;

const getIndex = () => Math.floor(tot - (ang / TAU) * tot) % tot;

const drawSector = (sector, i) => {
  const ang = arc * i;
  ctx.save();

  // Draw sector
  ctx.beginPath();
  ctx.fillStyle = sector.color;
  ctx.moveTo(rad, rad);
  ctx.arc(rad, rad, rad, ang, ang + arc);
  ctx.lineTo(rad, rad);
  ctx.fill();

  // Draw text
  ctx.translate(rad, rad);
  ctx.rotate(ang + arc / 2);
  ctx.textAlign = "right";
  ctx.fillStyle = sector.text;
  ctx.font = "bold 25px 'Lato', sans-serif";
  ctx.fillText(sector.label, rad - 10, 10);

  ctx.restore();
};
function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

let lastlabel = "";
const rotate = () => {
  const sector = sectors[getIndex()];
  ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;

  if (angVel) {
    spinEl.textContent = sector.label
    if (lastlabel != sector.label) {
      console.log(sector.label);
      // Create an audio element dynamically
      const audio = new Audio(`src/sound/audio.mp3`);
      // Play the audio
      audio.play().catch(error => console.error("Auto-play failed:", error));
      // Play Audio here
      lastlabel = sector.label;
    }
  } else {
    spinEl.textContent = "SPIN"
  }
  spinEl.style.background = sector.color;
  spinEl.style.color = sector.text;
};

const frame = () => {
  if (!angVel && spinButtonClicked) {
    events.fire("spinEnd", sectors[getIndex()]);
    spinButtonClicked = false;
    return;
  }

  angVel *= friction;
  if (angVel < 0.002) angVel = 0;
  ang = (ang + angVel) % TAU;
  rotate();
};

const engine = () => {
  frame();
  requestAnimationFrame(engine);
};

const getParticipantNames = (value) => {
  // const getresult = document.getElementById("result").value;
  return { users: value?.split("\n").map(name => name.trim()).filter(name => name !== ""), getresult: 0 }
};

const rederUser = async (value) => {
  const data = getParticipantNames(value);
  try {
    sectors = data.users.map((group, index) => ({
      color: index % 2 === 0 ? "#FFBC03" : "#FF5A10", // Alternate colors
      text: "#333333",
      label: `${group}` // Label updated to "Group X"
    }));
    //console.log(sectors);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    tot = sectors.length;
    arc = TAU / tot;
    sectors.forEach(drawSector);

    // Reset spin button
    spinEl.textContent = "SPIN";
    spinEl.style.background = "#FFF";
    spinEl.style.color = "#000";
  } catch (error) {
    console.error("Error creating groups:", error);
    alert(error);
  }
}



const init = () => {
  sectors.forEach(drawSector);
  rotate();
  engine();
  if (inputFile.value) {
    rederUser(inputFile.value)
  }
  spinEl.addEventListener("click", async () => {
    if (!angVel) angVel = rand(0.25, 0.45);
    spinButtonClicked = true;
  });
};

init();
const winners = []
events.addListener("spinEnd", sector => {
  console.log(`Woop! You won ${sector.label}`);
  if (sector.label) {
    winners.push(sector.label)
    toRanderWinner()
    var count = 200;
    var defaults = {
      origin: { y: 0.7 }
    };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }
});



document.getElementById("input-user").addEventListener("input", async (event) => rederUser(event.target.value))

const toRanderWinner = () => {
  const container = document.getElementById("spinner-container-prize");
  // Clear existing content
  container.innerHTML = "";
  // Loop through data and create elements
  winners.forEach((name, index) => {
    const prizeCard = document.createElement("div");
    prizeCard.classList.add("prize-card");

    const prizeNumber = document.createElement("div");
    prizeNumber.classList.add("prize-number");
    prizeNumber.textContent = index + 1; // Numbering starts from 1

    const prizeName = document.createElement("div");
    prizeName.textContent = name;

    // Append elements
    prizeCard.appendChild(prizeNumber);
    prizeCard.appendChild(prizeName);
    container.appendChild(prizeCard);
  });
}

function calculateGroups(totalPeople, winners = 3) {
  if (totalPeople < winners) {
    console.log("Not enough people to form groups.");
    return 0;
  }

  let groupCount = Math.ceil(totalPeople / winners);
  return groupCount;
}

