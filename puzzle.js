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

let isDragging = false;
let draggedImage = null; // To handle which image is being dragged

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function populateImages() {
    shuffle(imagesData);
    const displayedImages = imagesData.slice(0, 10);

    // Clear existing images
    leftContainer.innerHTML = '';
    rightContainer.innerHTML = '';

    // Add images to left and right containers
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

// Initial population of images
populateImages();

// Add drag listeners to all dynamically created images
document.querySelectorAll('.draggable-image').forEach(image => {
    image.addEventListener('mousedown', function (event) {
        isDragging = true;
        draggedImage = this;
        draggedImage.style.position = 'absolute';
        draggedImage.style.cursor = 'grabbing';
    });
});

document.addEventListener('mousemove', function (event) {
    if (isDragging) {
        draggedImage.style.left = event.pageX - (draggedImage.offsetWidth / 2) + 'px';
        draggedImage.style.top = event.pageY - (draggedImage.offsetHeight / 2) + 'px';
    }
});

document.addEventListener('mouseup', function () {
    if (isDragging) {
        isDragging = false;
        draggedImage.style.cursor = 'grab';

        const imageRect = draggedImage.getBoundingClientRect();
        let droppedCorrectly = false;

        gridItems.forEach(box => {
            const boxRect = box.getBoundingClientRect();

            // Check if the image's center is within the box
            const imageCenterX = imageRect.left + (imageRect.width / 2);
            const imageCenterY = imageRect.top + (imageRect.height / 2);

            if (
                imageCenterX >= boxRect.left &&
                imageCenterX <= boxRect.right &&
                imageCenterY >= boxRect.top &&
                imageCenterY <= boxRect.bottom
            ) {
                // Get the names for matching
                const imageName = draggedImage.dataset.name;
                const boxName = box.dataset.name;

                if (imageName === boxName) {
                    // Correct match: lock the image in place
                    draggedImage.style.left = boxRect.left + (boxRect.width - imageRect.width) / 2 + 'px';
                    draggedImage.style.top = boxRect.top + (boxRect.height - imageRect.height) / 2 + 'px';
                    draggedImage.style.cursor = 'default';
                    draggedImage.draggable = false;
                    box.classList.add('correct');
                    box.appendChild(draggedImage);
                    droppedCorrectly = true;
                } else {
                    alert('Incorrect!');
                }

            }

        });

        // If not dropped in any box or dropped incorrectly, return to original position
        if (!droppedCorrectly) {
            // A simple reset by moving it off-screen
            draggedImage.style.left = '-1000px';
            draggedImage.style.top = '-1000px';
        }
    }

});

function shuffleDivs() {
    const container = document.getElementById("grid-container");
    console.log(container);
    const divs = Array.from(container.children);
    divs.sort(() => Math.random() - 0.5); // shuffle
    divs.forEach(div => container.appendChild(div)); // re-add in new order
}

// Restart the game when Again button is clicked
document.querySelector(".Again").addEventListener("click", () => {
    shuffleDivs();
    populateImages();
    gridItems.forEach(box => {
        box.classList.remove("correct");
        box.innerHTML = box.dataset.name;
    });
    // Re-add drag listeners to the new images
    document.querySelectorAll('.draggable-image').forEach(image => {
        image.addEventListener('mousedown', function (event) {
            isDragging = true;
            draggedImage = this;
            draggedImage.style.position = 'absolute';
            draggedImage.style.cursor = 'grabbing';
        });
    });
});