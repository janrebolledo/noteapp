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
                        <h1>Settings</h1>
                        <span class="notes__settings-modal-sidebar-item active-tab" data-for-tab="1">Settings</span>
                        <span class="notes__settings-modal-sidebar-item" data-for-tab="2">About</span>
                    </div>
                    <div class="notes__settings-modal-primary">
                        <div id="settings" class="notes__settings-modal-tab active-tab" data-tab="1">
                            <h2>Settings</h2>
                            <p>Theme</p>
                            <button id="notes__settings-theme-changer" class="notes__settings-theme-changer">
                                <div class="notes__settings-theme-label"><img class="theme-thumbnail" src="../assets/images/Light Theme.png"><p>Light</p></div>
                                <div class="notes__settings-theme-label"><img class="theme-thumbnail" src="../assets/images/Dark Theme.png"><p>Dark</p></div>
                            </button>
                            <p>Export Notes</p>
                            <button id="exportNotes" class="button">Copy to Clipboard</button>
                            <p>Display Word Count</p>
                            <label class="toggle-control">
                                <input type="checkbox" id="wordCount">
                                <span class="control"></span>
                            </label>
                        </div>
                        <div id="about" class="notes__settings-modal-tab" data-tab="2">
                            <h2>About</h2>
                            <p>This project is built with vanilla javascript and hosted locally. This app is entirely local, no data will ever be sent to a server.</p>
                            <p>Source code available <a href="https://github.com/janrebolledo/notes-app">here</a>.</p>
                            <p>Copyright © 2021 <a href="https://janrebolledo.com">Jan Rebolledo</a>. Digital Experience by <a href="https://janrebolledo.com">Jan Rebolledo</a>.</p>
                        </div>
                    </div>
                    <button class="notes__settings-close"><span class="material-icons">close</span></button>
                </div>
            </div>
            <div id="searchModal" class="search-modal">
                <div class="search-modal__container">
                    <div class="search-modal__header">
                        <h2>Search</h2>
                        <button class="search-modal__close"><span class="material-icons">close</span></button>
                    </div>
                    <input placeholder="Search notes..." type="text" id="searchBar" class="search-bar">
                    <div class="search-modal__results"></div>
                </div>
            </div>
            <div class="notes__sidebar">
                <div class="notes__sidebar-header">
                    <a class="notes__sidebar-logo--link" href="/">
                        <img class="notes__sidebar-logo--image" alt="logo" src="./assets/images/Jan Logo.png">
                    </a>
                    <input type="checkbox" name="mobile-menu-input" id="mobile-menu-input" class="mobile-menu-button"><label class="mobile-menu-label" for="mobile-menu-input"><span class="material-icons mobile-menu-arrow"> arrow_drop_up </span></label>
                    <button class="notes__add" type="button"><span class="material-icons">add</button>
                </div>
                <div class="notes__list"></div>
                <div class="notes__sidebar-footer">
                <button class="notes__settings" type="button"><span class="material-icons">settings</span></button>
                <div class="notes__sidebar-search">
                    <span class="material-icons search-icon">search</span>
                </div>
                </div>
            </div>
            <div class="notes__preview">
                <input class="notes__title" type="text" placeholder="New Note...">
                <textarea class="notes__body" id="notes__body" placeholder="Start typing..."></textarea>
                <p class="notes__word-count">Word Count: <span id="wordCountSpan"></span></p>
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