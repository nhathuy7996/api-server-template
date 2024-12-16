document.getElementById("create-card").addEventListener("click", () => {
    const cardContainer = document.getElementById("card-container");

    const card = document.createElement("div");
    card.classList.add("card");
    card.draggable = true;

    card.innerHTML = `
       <img class="card-image" src="https://via.placeholder.com/150" alt="Hình ảnh" draggable="false">
      <div class="info">
        <p>Hoạt động:</p>
        <p>Địa điểm:</p>
        <p>Thời gian: 0 giờ</p>
        <p>Chi phí: 0 ₫</p>
        <div id="note">Ghi chú:</div>
        <button id="readMoreBtn" class="read-more-btn" style="display: none;" onclick="toggleReadMore(this)">Read More</button>
      </div>
      <button class="edit-card">Chỉnh Sửa</button>
      <button class="delete-card">Xoá</button>
    `;


    // Add drag-and-drop functionality
    card.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", e.target.id);
    });

    cardContainer.appendChild(card);
    updateTimeline();
    UpdateCost();
});


const editModal = document.getElementById("edit-modal");
const editForm = document.getElementById("edit-form");
const closeModal = document.querySelector(".close");

let currentCard = null;

// Thêm tính năng mở ảnh khi nhấp vào
document.addEventListener("click", (e) => {
    if (e.target.tagName === "IMG" && e.target.classList.contains("card-image")) {
        e.target.classList.toggle("fullscreen");
    }

    if (e.target.classList.contains("delete-card")) {
        e.target.parentNode.remove();
        updateTimeline();
        UpdateCost();
    }
});

// Đóng modal
closeModal.addEventListener("click", () => {
    editModal.style.display = "none";
});

// Lưu thông tin chỉnh sửa
editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const time = document.getElementById("edit-time").value;
    const timeUnit = document.getElementById("edit-time-unit").value;
    const location = document.getElementById("edit-location").value;
    const action = document.getElementById("edit-action").value;
    const cost = parseFloat(document.getElementById("edit-cost").value).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    const editorNote = document.getElementById("editor");
    const note = editorNote.innerHTML;


    const readMoreBtn = currentCard.querySelector("#readMoreBtn");
    console.log(readMoreBtn);
    if (editorNote.scrollHeight > 100) {
        readMoreBtn.style.display = "inline-block"; // Show "Read More" button
    } else {
        readMoreBtn.style.display = "none"; // Hide button if not needed
    }

    let timeText;

    // Tạo chuỗi mô tả thời gian theo đơn vị đã chọn
    if (timeUnit === 'seconds') {
        timeText = `${time} giây`;
    } else if (timeUnit === 'minutes') {
        timeText = `${time} phút`;
    } else if (timeUnit === 'hours') {
        timeText = `${time} giờ`;
    }

    // Cập nhật thông tin
    currentCard.querySelector(".info p:nth-child(1)").textContent = `Hoạt động: ${action}`;
    currentCard.querySelector(".info p:nth-child(2)").textContent = `Địa điểm: ${location}`;
    currentCard.querySelector(".info p:nth-child(3)").textContent = `Thời gian: ${timeText}`;
    currentCard.querySelector(".info p:nth-child(4)").textContent = `Chi phí: ${cost}`;
    currentCard.querySelector(".info div:nth-child(5)").innerHTML = `Ghi chú:<br>${note}`;

    // Nếu có ảnh mới, cập nhật
    const newImge = editorNote.querySelector("img");
    if (note && newImge) {

        currentCard.querySelector("img").src = newImge.src;
    }

    editModal.style.display = "none";
    updateTimeline();
    UpdateCost();
});


// Khởi tạo tính năng kéo thả sử dụng Sortable.js
const cardContainer = document.getElementById("card-container");
new Sortable(cardContainer, {
    animation: 150, // Thêm hiệu ứng chuyển động khi kéo
    ghostClass: 'sortable-ghost', // Lớp CSS khi kéo
    dragClass: 'sortable-drag', // Lớp CSS khi kéo thẻ

    onEnd: function () {
        updateTimeline(); // Cập nhật lại timeline khi thẻ được kéo và thả
    }

});


// Khi người dùng nhấp vào chỉnh sửa
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-card")) {
        currentCard = e.target.closest(".card");

        // Lấy thông tin thời gian từ thẻ (định dạng Thời gian: X giây, X phút, X giờ)
        const timeText = currentCard.querySelector(".info p:nth-child(3)").textContent.split(": ")[1];

        // Tách giá trị thời gian và đơn vị
        const timeParts = timeText.split(" ");
        const timeValue = timeParts[0];
        const timeUnit = timeParts[1];

        // Cập nhật giá trị vào modal
        document.getElementById("edit-time").value = timeValue;
        // Chọn đơn vị thời gian tương ứng trong dropdown
        const timeUnitSelect = document.getElementById("edit-time-unit");
        if (timeUnit === "giây") {
            timeUnitSelect.value = "seconds";
        } else if (timeUnit === "phút") {
            timeUnitSelect.value = "minutes";
        } else if (timeUnit === "giờ") {
            timeUnitSelect.value = "hours";
        }

        // Lấy các thông tin khác (địa điểm, chi phí, ảnh)
        const action = currentCard.querySelector(".info p:nth-child(1)").textContent.split(": ")[1];
        const location = currentCard.querySelector(".info p:nth-child(2)").textContent.split(": ")[1];
        const cost = currentCard.querySelector(".info p:nth-child(4)").textContent.split(": ")[1].replace(" ₫", "").replace(".","");
        const note = currentCard.querySelector("#note").innerHTML.split(":<br>")[1];

        // Cập nhật vào các trường tương ứng
        document.getElementById("edit-action").value = action == undefined ? "" : action;
        document.getElementById("edit-location").value = location == undefined ? "" : location;
        document.getElementById("edit-cost").value = parseFloat(cost) == NaN ? 0 : parseFloat(cost);
        document.getElementById("editor").innerHTML = note == undefined ? "" : note;

        // Mở modal
        editModal.style.display = "flex";
    }
});

function UpdateCost() {
    const cards = document.querySelectorAll(".card");
    let totalCost = 0;
    for (let card of cards) {
         let costText = card.querySelector(".info p:nth-child(4)").textContent.split(": ")[1].replace(" ₫", "").replace(".","");
         let cost = parseFloat(costText);
        
         totalCost += cost == NaN? 0: cost;
    }

    document.querySelector("#totalCost").innerHTML = totalCost.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}


// Lấy thời gian khởi hành từ input
const startTimeInput = document.getElementById("start-time");
const timelineContainer = document.getElementById("timeline");

// Lắng nghe sự kiện thay đổi thời gian khởi hành
startTimeInput.addEventListener("change", updateTimeline);


// Cập nhật đường timeline khi thời gian khởi hành thay đổi
function updateTimeline() {
    timelineContainer.innerHTML = "";
    const startTime = startTimeInput.value;

    if (!startTime) {
        // Nếu không có thời gian khởi hành, ẩn đường timeline
        timelineContainer.innerHTML = "";
        return;
    }

    const startStone = document.createElement("div");
    startStone.classList.add("milestone");

    // Đặt vị trí của mốc thời gian trên đường timeline
    startStone.style.left = `0%`;

    // Tạo phần văn bản cho mốc thời gian
    const milestoneStartText = document.createElement("div");
    milestoneStartText.classList.add("milestone-text");
    milestoneStartText.textContent = startTime;

    // Đặt mốc thời gian vào timeline và thêm văn bản
    timelineContainer.appendChild(startStone);
    startStone.appendChild(milestoneStartText);

    // Lấy tất cả các thẻ để tính toán mốc thời gian
    const cards = document.querySelectorAll(".card");

    // Chuyển thời gian khởi hành sang phút kể từ 00:00
    const startTimeParts = startTime.split(":");
    const startTimeInMinutes = parseInt(startTimeParts[0]) * 60 + parseInt(startTimeParts[1]);

    // Biến để theo dõi thời gian cộng dồn
    let cumulativeTimeInMinutes = 0;
    let totalTimeInMinutes = 0;
    for (let card of cards) {
        const timeText = card.querySelector(".info p:nth-child(3)").textContent.split(": ")[1];
        const timeParts = timeText.split(" ");
        const timeValue = parseFloat(timeParts[0]); // giá trị thời gian (có thể là số thập phân)
        const timeUnit = timeParts[1]; // đơn vị thời gian

        // Chuyển thời gian của thẻ sang phút
        if (timeUnit === "giây") {
            timeInMinutes = timeValue / 60; // Chuyển giây sang phút
        } else if (timeUnit === "phút") {
            timeInMinutes = timeValue;
        } else if (timeUnit === "giờ") {
            timeInMinutes = timeValue * 60; // Chuyển giờ sang phút
        }

        card.timeInMinutes = timeInMinutes;
        totalTimeInMinutes += timeInMinutes;
    }

    let lastMilestone = 0;
    // Tạo mốc thời gian cho mỗi thẻ
    for (let card of cards) {
        const action = card.querySelector(".info p:nth-child(1)").textContent.split(": ")[1];
        const location = card.querySelector(".info p:nth-child(2)").textContent.split(": ")[1];

        // Tính thời gian của thẻ cộng với thời gian khởi hành
        cumulativeTimeInMinutes += card.timeInMinutes;

        // Tạo mốc thời gian trên đường timeline
        const milestone = document.createElement("div");
        milestone.classList.add("milestone");

        // Đặt vị trí của mốc thời gian trên đường timeline
        const milestoneLeft = (cumulativeTimeInMinutes / totalTimeInMinutes) * 100;
        milestone.style.left = `${milestoneLeft}%`;

        // Tạo khoảng thời gian trên đường timeline
        const mileRange = document.createElement("div");
        mileRange.classList.add("milesRange");
        mileRange.style.left = `${lastMilestone + 0.3}%`;
        mileRange.style.width = `${milestoneLeft - lastMilestone - 0.3}%`;
        lastMilestone = milestoneLeft;


        // Tính toán giờ và phút thực tế
        let hours = Math.floor((cumulativeTimeInMinutes + startTimeInMinutes) / 60);
        hours = hours > 24 ? hours - 24 : hours;
        const minutes = Math.round((cumulativeTimeInMinutes + startTimeInMinutes) % 60);
        const timeString = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

        // Tạo phần văn bản cho mốc thời gian
        const milestoneText = document.createElement("div");
        milestoneText.classList.add("milestone-text");
        milestoneText.textContent = timeString;

        // Tạo phần văn bản cho khoảng thời gian
        const mileRangeText = document.createElement("div");
        mileRangeText.style.textAlign = "center";
        mileRangeText.style.fontSize = "12px";
        mileRangeText.innerHTML = `${action}<br>${location}`;

        // Đặt mốc thời gian vào timeline và thêm văn bản
        timelineContainer.appendChild(milestone);
        timelineContainer.appendChild(mileRange);

        milestone.appendChild(milestoneText);
        mileRange.appendChild(mileRangeText);
    };
}

//Text Editor
const editor = document.getElementById('editor');
let currentImageWrapper = null;
let isResizing = false;
let startX, startWidth, aspectRatio;
editor.addEventListener('paste', (event) => {
    event.preventDefault();
    const clipboardItems = event.clipboardData.items;

    for (const item of clipboardItems) {
        if (item.type.startsWith('image/')) {
            const file = item.getAsFile();
            const reader = new FileReader();

            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;

                img.onload = () => {
                    const resizedImage = resizeImage(img, 800, 800); // Resize before inserting
                    insertImage(resizedImage);
                };
            };

            reader.readAsDataURL(file);
        } else if (item.type === 'text/plain') {
            const text = event.clipboardData.getData('text/plain');
            document.execCommand('insertText', false, text);
        }
    }
});

function resizeImage(img, maxWidth, maxHeight) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    let width = img.width;
    let height = img.height;

    // Maintain aspect ratio
    if (width > maxWidth || height > maxHeight) {
        if (width > height) {
            height = height * (maxWidth / width);
            width = maxWidth;
        } else {
            width = width * (maxHeight / height);
            height = maxHeight;
        }
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);

    return canvas.toDataURL('image/png');
}

function insertImage(base64Image) {
    const wrapper = document.createElement('div');
    wrapper.className = 'image-wrapper';
    wrapper.contentEditable = false;

    const img = document.createElement('img');
    img.src = base64Image;

    // Add a resize anchor
    const anchor = document.createElement('div');
    anchor.className = 'resize-anchor bottom-right';
    anchor.addEventListener('mousedown', startResize);

    wrapper.appendChild(img);
    wrapper.appendChild(anchor);
    editor.appendChild(wrapper);
}

function startResize(e) {
    e.preventDefault();
    isResizing = true;
    currentImageWrapper = e.target.parentNode;

    const img = currentImageWrapper.querySelector('img');
    startX = e.clientX;
    startWidth = img.offsetWidth;
    aspectRatio = img.offsetWidth / img.offsetHeight;

    document.addEventListener('mousemove', resizeImageHandler);
    document.addEventListener('mouseup', stopResize);
}

function resizeImageHandler(e) {
    if (!isResizing || !currentImageWrapper) return;

    const img = currentImageWrapper.querySelector('img');
    const deltaX = e.clientX - startX;

    // Adjust width and height proportionally
    const newWidth = startWidth + deltaX;
    img.style.width = `${newWidth}px`;
    img.style.height = `${newWidth / aspectRatio}px`;
}

function stopResize() {
    isResizing = false;
    currentImageWrapper = null;

    document.removeEventListener('mousemove', resizeImageHandler);
    document.removeEventListener('mouseup', stopResize);
}

function saveContent() {
    const content = editor.innerHTML;
    output.textContent = content;
}

isExpanded = false;
function toggleReadMore(node) {
    isExpanded = !isExpanded;

    const output = node.parentNode.querySelector("#note");
    const readMoreBtn = node.parentNode.querySelector("#readMoreBtn");
    if (isExpanded) {
        output.classList.add('expanded'); // Remove truncation
        readMoreBtn.textContent = "Read Less"; // Update button text
    } else {
        output.classList.remove('expanded'); // Apply truncation
        readMoreBtn.textContent = "Read More"; // Revert button text
    }
}

