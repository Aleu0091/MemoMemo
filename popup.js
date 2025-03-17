document.addEventListener("DOMContentLoaded", () => {
    const noteList = document.getElementById("noteList");
    const copyMessage = document.createElement("div");

    copyMessage.textContent = "복사됨";
    copyMessage.style.position = "fixed";
    copyMessage.style.bottom = "20px";
    copyMessage.style.left = "50%";
    copyMessage.style.transform = "translateX(-50%)";
    copyMessage.style.background = "#333";
    copyMessage.style.color = "#fff";
    copyMessage.style.padding = "10px 20px";
    copyMessage.style.borderRadius = "5px";
    copyMessage.style.display = "none";

    document.body.appendChild(copyMessage);

    function showCopyMessage() {
        copyMessage.style.display = "block";
        setTimeout(() => {
            copyMessage.style.display = "none";
        }, 2000);
    }

    function loadNotes() {
        chrome.storage.local.get({ notes: [] }, (data) => {
            noteList.innerHTML = "";

            if (data.notes.length === 0) {
                const noNotesMessage = document.createElement("p");
                noNotesMessage.style.textAlign = "center";
                noNotesMessage.textContent = "저장된 메모가 없습니다.";
                noteList.appendChild(noNotesMessage);
            } else {
                data.notes.forEach((note, index) => {
                    const li = document.createElement("li");
                    li.textContent = note;
                    li.classList.add("note-item");

                    li.onclick = () => {
                        navigator.clipboard
                            .writeText(note)
                            .then(() => {
                                showCopyMessage();
                            })
                            .catch((err) => {
                                console.error("Failed to copy text:", err);
                            });
                    };

                    const deleteBtn = document.createElement("button");
                    deleteBtn.textContent = "X";
                    deleteBtn.classList.add("delete-btn");
                    deleteBtn.onclick = (e) => {
                        e.stopPropagation();
                        data.notes.splice(index, 1);
                        chrome.storage.local.set(
                            { notes: data.notes },
                            loadNotes
                        );
                    };

                    li.appendChild(deleteBtn);
                    noteList.appendChild(li);
                });
            }
        });
    }

    const overallDeleteBtn = document.createElement("button");
    overallDeleteBtn.textContent = "전체 삭제";
    overallDeleteBtn.classList.add("overall-delete-btn");
    overallDeleteBtn.onclick = () => {
        chrome.storage.local.set({ notes: [] }, loadNotes);
    };
    document.body.insertBefore(overallDeleteBtn, noteList);

    loadNotes();
});
