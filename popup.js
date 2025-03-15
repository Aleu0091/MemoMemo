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
            data.notes.forEach((note, index) => {
                const li = document.createElement("li");
                li.textContent = note;

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
                deleteBtn.onclick = () => {
                    data.notes.splice(index, 1);
                    chrome.storage.local.set({ notes: data.notes }, loadNotes);
                };

                li.appendChild(deleteBtn);
                noteList.appendChild(li);
            });
        });
    }

    loadNotes();
});
