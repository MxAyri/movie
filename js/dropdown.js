let flag = 0;
let l1 = document.querySelector('.l1');
let l2 = document.querySelector('.l2');
let l3 = document.querySelector('.l3');

function openNav() {
  if (flag === 0) {
    document.getElementById("dpd").style.width = "100%";
    document.getElementById("dropdown").style.width = "375px";
    document.body.style.overflowY = "hidden";
    l1.style.transform = 'rotate(-45deg)';
    l2.style.display = 'none';
    l3.style.transform = 'translateY(-7px) rotate(45deg)';
    flag = 1;
  } else {
    document.getElementById("dpd").style.width = "0%";
    document.getElementById("dropdown").style.width = "0px";
    document.body.style.overflowY = "scroll";
    l1.style.transform = null;
    l2.style.display = 'block';
    l3.style.transform = null;
    flag = 0;
  }
}

let dpdClose = document.getElementById("dpd");

window.onclick = function (event) {
  if (event.target == dpdClose) {
    document.getElementById("dpd").style.width = "0%";
    document.getElementById("dropdown").style.width = "0px";
    document.body.style.overflowY = "scroll";
    l1.style.transform = null;
    l2.style.display = 'block';
    l3.style.transform = null;
    flag = 0;
  }
};

let navOpen = document.querySelectorAll(".nav-open");


for (let i = 0; i < navOpen.length; i++) {
  navOpen[i].addEventListener("click", function () {
    this.classList.toggle("active");
    let panel = this.nextElementSibling;
    let arrow = document.querySelectorAll(".nav-arrow");
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
      arrow[i].style.transform = null;
    } else {
      panel.style.maxHeight = "100px";
      arrow[i].style.transform = "rotate(180deg)";
    }
  });
}