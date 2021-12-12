export default class NotesView {
    constructor(root, { onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete } = {}) {
        this.root = root;
        this.onNoteSelect = onNoteSelect;
        this.onNoteAdd = onNoteAdd;
        this.onNoteEdit = onNoteEdit;
        this.onNoteDelete = onNoteDelete;
        this.root.innerHTML = `
            <div class="notes__settings-modal-container">
                <div class="notes__settings-modal">
                    <div class="notes__settings-modal-sidebar">
                        <span class="notes__settings-modal-sidebar-item active-tab" data-for-tab="1">Settings</span>
                        <span class="notes__settings-modal-sidebar-item" data-for-tab="2">About</span>
                    </div>
                    <div class="notes__settings-modal-primary">
                        <div id="settings" class="notes__settings-modal-tab active-tab" data-tab="1">
                            <h2>Settings</h2>
                            <p>Theme</p>
                            <button id="notes__settings-theme-changer" class="notes__settings-theme-changer">
                                <div class="notes__settings-theme-label"><img class="theme-thumbnail" src="../assets/images/Light Theme.png"><p>Light</p></div>
                                <div class="notes__settings-theme-label"><img class="theme-thumbnail" src="../assets/images/dark Theme.png"><p>Dark</p></div>
                            </button>
                        </div>
                        <div id="about" class="notes__settings-modal-tab" data-tab="2">
                            <h2>About</h2>
                            <p>Copyright © 2021 <a href="https://janrebolledo.com">Jan Rebolledo</a>. Digital Experience by <a href="https://janrebolledo.com">Jan Rebolledo</a>.</p>
                        </div>
                    </div>
                    <button class="notes__settings-close"><span class="material-icons">close</span></button>
                </div>
            </div>
            <div class="notes__sidebar">
                <div class="notes__sidebar-header">
                    <a class="notes__sidebar-logo--link" href="/">
                        <img class="notes__sidebar-logo--image" alt="logo" src="./assets/images/Jan Logo.png">
                    </a>
                    <button class="notes__add" type="button"><span class="material-icons">add</button>
                </div>
                <div class="notes__list"></div>
                <div class="notes__sidebar-footer">
                <button class="notes__settings" type="button"><span class="material-icons">settings</button>
                </div>
            </div>
            <div class="notes__preview">
                <input class="notes__title" type="text" placeholder="New Note...">
                <textarea class="notes__body" placeholder="Start typing..."></textarea>
            </div>
        `;

        const btnAddNote = this.root.querySelector(".notes__add");
        const inpTitle = this.root.querySelector(".notes__title");
        const inpBody = this.root.querySelector(".notes__body");

        btnAddNote.addEventListener("click", () => {
            this.onNoteAdd();
        });

        [inpTitle, inpBody].forEach(inputField => {
            inputField.addEventListener("blur", () => {
                const updatedTitle = inpTitle.value.trim();
                const updatedBody = inpBody.value.trim();

                this.onNoteEdit(updatedTitle, updatedBody);
            });
        });

        this.updateNotePreviewVisibility(false);
    }

    _createListItemHTML(id, title, body, updated) {
        const MAX_BODY_LENGTH = 60;

        return `
            <div class="notes__list-item" data-note-id="${id}">
                <div class="notes__small-title">${title}</div>
                <div class="notes__small-body">
                    ${body.substring(0, MAX_BODY_LENGTH)}
                    ${body.length > MAX_BODY_LENGTH ? "..." : ""}
                </div>
                <div class="notes__small-updated">
                    ${updated.toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" })}
                </div>
            </div>
        `;
    }

    updateNoteList(notes) {
        const notesListContainer = this.root.querySelector(".notes__list");

        // Empty list
        notesListContainer.innerHTML = "";

        for (const note of notes) {
            const html = this._createListItemHTML(note.id, note.title, note.body, new Date(note.updated));

            notesListContainer.insertAdjacentHTML("beforeend", html);
        }

        // Add select/delete events for each list item
        notesListContainer.querySelectorAll(".notes__list-item").forEach(noteListItem => {
            noteListItem.addEventListener("click", () => {
                this.onNoteSelect(noteListItem.dataset.noteId);
            });

            noteListItem.addEventListener("dblclick", () => {
                const doDelete = confirm("Are you sure you want to delete this note?");

                if (doDelete) {
                    this.onNoteDelete(noteListItem.dataset.noteId);
                }
            });
        });
    }

    updateActiveNote(note) {
        this.root.querySelector(".notes__title").value = note.title;
        this.root.querySelector(".notes__body").value = note.body;

        this.root.querySelectorAll(".notes__list-item").forEach(noteListItem => {
            noteListItem.classList.remove("notes__list-item--selected");
        });

        this.root.querySelector(`.notes__list-item[data-note-id="${note.id}"]`).classList.add("notes__list-item--selected");
    }

    updateNotePreviewVisibility(visible) {
        this.root.querySelector(".notes__preview").style.visibility = visible ? "visible" : "hidden";
    }
}