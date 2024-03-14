// Get the modal
let modal = document.querySelector(".modal");
let btn = document.querySelectorAll(".submit");
let close = document.querySelector(".close");
let closeButton = document.querySelector(".modal-button");


btn.forEach((el) => {
  el.addEventListener('click', (e) => {
    modal.style.display = "flex";
    document.body.style.overflowY = "hidden";
  });
});

close.onclick = function() {
  modal.style.display = "none";
  document.body.style.overflowY = "scroll";
}

closeButton.onclick = function() {
  modal.style.display = "none";
  document.body.style.overflowY = "scroll";
}
