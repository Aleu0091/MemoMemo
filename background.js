chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "add_note",
        title: "메모 추가",
        contexts: ["selection"],
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "add_note") {
        chrome.storage.local.get({ notes: [] }, (data) => {
            const newNotes = [...data.notes, info.selectionText];
            chrome.storage.local.set({ notes: newNotes });
        });
    }
});
