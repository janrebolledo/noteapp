function countWord() {
  const textArea = document.getElementById("notes__body");
  const wordsCount = document.getElementById("wordCountSpan");

  textArea.oninput = () => {
    let words = textArea.value.split(" ").filter((item) => {
      return item != "";
    });

    wordsCount.textContent = words.length;
  };
}

document.addEventListener("DOMContentLoaded", () => {
    countWord();
});

export default countWord;
