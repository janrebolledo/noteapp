
export default function SearchModal() {
  // Close/Open modal function
  const open = document.querySelector(".search-icon");
  const close = document.querySelector(".search-modal__close");
  const modal = document.querySelector("#searchModal");
  const settingsModal = document.querySelector(".notes__settings-modal-container");

  open.addEventListener("click", () => {
    modal.classList.add("modal-open");
  });

  close.addEventListener("click", () => {
    modal.classList.remove("modal-open");
  });

  document.onkeyup = function (e) {
    if (e.ctrlKey && e.altKey && e.which == 80) {
      if (modal.classList.contains("modal-open")) {
        modal.classList.remove("modal-open");
      }
      else {
        if (settingsModal.classList.contains("modal-open")) {
          settingsModal.classList.remove("modal-open");
        };
        modal.classList.add("modal-open");
      }
    }
  };
  // Search function

  const searchBar = document.getElementById("searchBar");
  const notes = JSON.parse(localStorage.getItem("notes") || "[]");

  searchBar.addEventListener("keyup", (e) => {
    const searchString = e.target.value.toLowerCase();
    const fitleredNotes = notes.filter((note) => {
      return (
        note.title.toLowerCase().includes(searchString) ||
        note.body.toLowerCase().includes(searchString)
      );
    });
    searchResults(fitleredNotes);
});

  const searchedNotesList = document.querySelector(".search-modal__results");

  const MAX_BODY_LENGTH = 60;

  const searchResults = (notes) => {
    const htmlString = notes
      .map((notes) => {
        return `
          <div class="search-modal__note" noteId="${notes.id}">
              <h3>${notes.title}</h3>
              <p>${notes.body.substring(0, MAX_BODY_LENGTH)}${
          notes.body.length > MAX_BODY_LENGTH ? "..." : ""
        }</p>
          </div>
          `;
      })
      .join("");
    searchedNotesList.innerHTML = htmlString;

    searchedNotesList.querySelectorAll(".search-modal__note").forEach(searchListItem => {
      searchListItem.addEventListener("click", () => {
        let noteId = searchListItem.getAttribute("noteId");
        console.log("note has been selected in search " + noteId);
        modal.classList.remove("modal-open")
      })
    })
  };
}

document.addEventListener("DOMContentLoaded", () => {
  SearchModal();
});
