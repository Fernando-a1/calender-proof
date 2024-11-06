const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

const calendar = document.getElementById("calendar");
const monthName = document.getElementById("month-name");
const noteModal = document.getElementById("note-modal");
const selectedDateElement = document.getElementById("selected-date");
const noteInput = document.getElementById("note-input");
let selectedDay;

function getNotes() {
    const notes = localStorage.getItem("calendarNotes");
    return notes ? JSON.parse(notes) : {};
}

function saveNotes(notes) {
    localStorage.setItem("calendarNotes", JSON.stringify(notes));
}

function renderCalendar() {
    calendar.innerHTML = "";
    monthName.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const notes = getNotes();

    for (let i = 1; i < (firstDay === 0 ? 7 : firstDay); i++) {
        const emptyCell = document.createElement("div");
        emptyCell.classList.add("day-cell");
        calendar.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement("div");
        dayCell.classList.add("day-cell");
        dayCell.innerHTML = `<p>${day}</p>`;

        const noteKey = `${currentYear}-${currentMonth}-${day}`;
        if (notes[noteKey]) {
            const noteElement = document.createElement("div");
            noteElement.classList.add("note");
            noteElement.textContent = notes[noteKey];
            dayCell.appendChild(noteElement);
        }

        dayCell.addEventListener("click", () => openNoteModal(day));
        calendar.appendChild(dayCell);
    }
}

function openNoteModal(day) {
    selectedDay = day;
    const noteKey = `${currentYear}-${currentMonth}-${selectedDay}`;
    const notes = getNotes();
    
    selectedDateElement.textContent = `Nota para: ${selectedDay} ${monthNames[currentMonth]} ${currentYear}`;
    noteInput.value = notes[noteKey] || ""; 
    noteModal.style.display = "flex";
}

function closeNoteModal() {
    noteModal.style.display = "none";
    noteInput.value = "";
}

document.getElementById("prev-month").addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
});

document.getElementById("next-month").addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
});

document.querySelector(".close").addEventListener("click", closeNoteModal);
document.getElementById("save-note").addEventListener("click", () => {
    const note = noteInput.value;
    const noteKey = `${currentYear}-${currentMonth}-${selectedDay}`;
    const notes = getNotes();

    if (note) {
        notes[noteKey] = note; 
    } else {
        delete notes[noteKey];
    }

    saveNotes(notes); 
    renderCalendar(); 
    closeNoteModal();
});

renderCalendar();
