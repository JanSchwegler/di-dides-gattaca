window.addEventListener("DOMContentLoaded", () => {
  function createBlocks() {
    const blockContainer = document.getElementById("blocks");
    const blockSize = 25;
    const screenWidth = 1000;
    const screenHeight = 600;
    const numCols = Math.ceil(screenWidth / blockSize);
    const numRows = Math.ceil(screenHeight / blockSize);
    const numBlocks = numCols * numRows;

    for (let i = 0; i < numBlocks; i++) {
      const block = document.createElement("div");
      block.classList.add("block");
      block.dataset.index = i;
      block.addEventListener("mousemove", setHighlight);
      blockContainer.appendChild(block);
    }
  }
  function setHighlight() {
    this.classList.add("highlight");
    this.addEventListener("mouseleave", removeHighlight);
  }
  function removeHighlight() {
    this.removeEventListener("mouseleave", removeHighlight);
    setTimeout(() => {
      this.classList.remove("highlight");
    }, 200);
  }
  createBlocks();
});
