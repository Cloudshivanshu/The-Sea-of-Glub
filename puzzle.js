const imagesData = [
    { name: 'Kafka', src: 'Images/Kafka-logo.png' },
    { name: 'Docker', src: 'Images/Docker-logo.png' },
    { name: 'Git', src: 'Images/Git-logo.png' },
    { name: 'Kubernetes', src: 'Images/Kubernetes-logo.png' },
    { name: 'Rust', src: 'Images/Rust-logo.png' },
    { name: 'Jira', src: 'Images/Jira-logo.png' },
    { name: 'Tableau', src: 'Images/Tableau-logo.png' },
    { name: 'Terraform', src: 'Images/Terraform-logo.png' },
    { name: 'Spring', src: 'Images/Spring-logo.png' },
];

const leftContainer = document.querySelector('.left-container');
const rightContainer = document.querySelector('.right-container');
const gridItems = document.querySelectorAll('.grid-item');
const water = document.getElementById('water');
let isDragging = false;
let draggedImage = null;
let originalParent = null;

//audios
const flash = document.getElementById("flashFlood");
const anounce = document.getElementById("anounce");
const correctAudio = document.getElementById("correctSound");
const wrongAudio = document.getElementById("wrongSound");
const levelup = document.getElementById("levelup");
const shipHorn = document.getElementById("ship-horn");
const shipBell = document.getElementById("ship-bell");
const drowned = document.getElementById("drowned");

flash.volume = 0.3;
anounce.volume = 0.5;

let waterHeight = 0;
const riseStep = 200;
const maxHeight = 1000;


playRandomly1();
playRandomly2();

function playRandomly2() {
    // pick a random delay between 5s (5000ms) and 30s (30000ms)
    const delay = Math.floor(Math.random() * (30000 - 5000 + 1)) + 5000;

    setTimeout(() => {
        shipBell.currentTime = 0;
        shipBell.volume = 1.0;
        shipBell.play();

        // after it plays, schedule the next random one
        playRandomly2();
    }, delay);
}

function playRandomly1() {
    const delay = Math.floor(Math.random() * (30000 - 5000 + 1)) + 5000;

    setTimeout(() => {
        shipHorn.currentTime = 0;
        shipHorn.volume = 1.0;
        shipHorn.play();

        playRandomly1();
    }, delay);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function checkWin() {
    const allCorrect = [...gridItems].every(box => box.classList.contains("correct"));
    if (allCorrect) {
        const mainContainer = document.getElementById('grid-container');

        levelup.currentTime = 0;//reset to zero
        levelup.volume = 1.0;
        levelup.play();

        mainContainer.classList.add('solved-state');
        mainContainer.style.position = "relative"; // ensure text can center inside

        gridItems.forEach(box => {
            box.style.opacity = '0';
        });

        const againbtn = document.querySelector(".Again");
        if (againbtn) {
            againbtn.disabled = true;
            againbtn.style.cursor = 'default';
            againbtn.style.backgroundColor = 'grey';
        }

        // build the overlay text container
        const completionText = document.createElement('div');
        completionText.className = 'completion-text';
        completionText.style.zIndex = "10";
        completionText.style.opacity = '1';

        const headline = document.createElement('div');
        headline.className = 'headline';
        headline.textContent = "Fantastic!";
        completionText.appendChild(headline);

        const line2 = document.createElement('div');
        line2.className = 'subline';
        line2.textContent = "You escaped The Sea of Glub 🌊";
        completionText.appendChild(line2);

        const line3 = document.createElement('div');
        line3.className = 'subline';
        line3.textContent = "But beware… there’s still The River Glub 🌊Give it a try";
        completionText.appendChild(line3);

        const line4 = document.createElement('div');
        line4.className = 'subline';
        line4.textContent = "And if you are done with seas or rivers wanna see a Imaginary SandCastel? Go Ahead";
        completionText.appendChild(line4);

        const linkRow = document.createElement('div');
        linkRow.className = 'link-row';

        const link1 = document.createElement('a');
        link1.href = "https://summer.hackclub.com/s?scene=72";
        link1.textContent = "The River Glub";
        link1.className = "reward-link";

        const link2 = document.createElement('a');
        link2.href = "https://summer.hackclub.com/s?scene=53";
        link2.textContent = "Imaginary Sandcastel";
        link2.className = "reward-link";

        linkRow.appendChild(link1);
        linkRow.appendChild(link2);

        completionText.appendChild(linkRow);

        // Finally add to grid-container
        mainContainer.appendChild(completionText);
    }
}

function populateImages() {
    shuffle(imagesData);
    const displayedImages = imagesData.slice(0, 9);

    leftContainer.innerHTML = '';
    rightContainer.innerHTML = '';

    displayedImages.forEach((image, index) => {
        const img = document.createElement('img');
        img.src = image.src;
        img.classList.add('draggable-image');
        img.dataset.name = image.name;

        if (index < 5) {
            leftContainer.appendChild(img);
        } else {
            rightContainer.appendChild(img);
        }
    });
}
populateImages();

let offsetX = 0;
let offsetY = 0;

document.addEventListener('mousedown', function (event) {
    if (event.target.classList.contains('draggable-image')) {
        isDragging = true;
        draggedImage = event.target;
        originalParent = draggedImage.parentElement;

        const rect = draggedImage.getBoundingClientRect();
        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;

        document.body.appendChild(draggedImage);
        draggedImage.style.position = 'absolute';
        draggedImage.style.cursor = 'grabbing';
        draggedImage.style.zIndex = '9999';

        // place correctly under cursor
        draggedImage.style.left = event.pageX - offsetX + 'px';
        draggedImage.style.top = event.pageY - offsetY + 'px';
        event.preventDefault();
    }
});

document.addEventListener('mousemove', function (event) {
    if (isDragging && draggedImage) {
        draggedImage.style.left = (event.pageX - offsetX) + 'px';
        draggedImage.style.top = (event.pageY - offsetY) + 'px';
    }
});

document.addEventListener('mouseup', function () {
    if (isDragging && draggedImage) {
        isDragging = false;
        draggedImage.style.cursor = 'grab';

        const imageRect = draggedImage.getBoundingClientRect();
        let droppedCorrectly = false;

        gridItems.forEach(box => {
            const boxRect = box.getBoundingClientRect();

            const imageCenterX = imageRect.left + imageRect.width / 2;
            const imageCenterY = imageRect.top + imageRect.height / 2;

            if (
                imageCenterX >= boxRect.left &&
                imageCenterX <= boxRect.right &&
                imageCenterY >= boxRect.top &&
                imageCenterY <= boxRect.bottom
            ) {
                const imageName = draggedImage.dataset.name;
                const boxName = box.dataset.name;

                if (imageName === boxName) {

                    correctAudio.currentTime = 0;
                    correctAudio.play();

                    box.innerHTML = '';
                    box.appendChild(draggedImage);
                    draggedImage.style.position = 'relative';
                    draggedImage.style.left = '0';
                    draggedImage.style.top = '0';
                    draggedImage.style.cursor = 'default';
                    box.classList.add('correct');
                    droppedCorrectly = true;
                    checkWin();
                }
            }
        });

        if (!droppedCorrectly) {
            // ❌ Wrong → return to original container
            originalParent.appendChild(draggedImage);
            draggedImage.style.position = 'relative';
            draggedImage.style.left = '0';
            draggedImage.style.top = '0';
            draggedImage.style.zIndex = 'auto';

            wrongAudio.currentTime = 0;
            wrongAudio.play();

            flashScreen();
            waterHeight += riseStep;
            if (waterHeight > maxHeight) waterHeight = maxHeight;
            water.style.height = waterHeight + 'px';
            if (waterHeight === maxHeight) {
                drowned.currentTime = 0;
                drowned.volume = 1.0;
                drowned.play();

                setTimeout(() => alert('💀 You drowned! Glub-Glub-Glub🫧'), 300);
            }
        }

        draggedImage = null;
    }
});

function shuffleDivs() {
    const container = document.getElementById("grid-container");
    const divs = Array.from(container.children);
    divs.sort(() => Math.random() - 0.5);
    divs.forEach(div => container.appendChild(div));
}

function flashScreen() {
    const overlay = document.createElement("div");
    overlay.className = "flash-overlay";
    document.body.appendChild(overlay);

    // remove after animation ends
    setTimeout(() => overlay.remove(), 900);
}

document.querySelector(".Again").addEventListener("click", () => {
    shuffleDivs();
    populateImages();
    drowned.pause();
    drowned.currentTime = 0;
    gridItems.forEach(box => {
        box.classList.remove("correct");
        box.innerHTML = box.dataset.name;
    });
    waterHeight = 0;
    water.style.height = '0';
});
