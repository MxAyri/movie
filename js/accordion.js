let open = document.querySelectorAll(".open");

for (let i = 0; i < open.length; i++) {
  open[i].addEventListener("click", function () {
    this.classList.toggle("active");
    let panel = this.nextElementSibling;
    let arrow = document.querySelectorAll(".open-arrow");
    let form = document.querySelectorAll(".form");
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
      panel.style.paddingTop = null;
      arrow[i].style.transform = null;
      form[i].style.backgroundColor = null;
      form[i].style.border = null;
      form[i].style.paddingBottom = null;
    } else if (window.innerWidth <= 700) {
      panel.style.maxHeight = panel.scrollHeight + "1px";
      panel.style.paddingTop = "40px";
      arrow[i].style.transform = "rotate(90deg)";
      form[i].style.backgroundColor = "#FCFCFC";
      form[i].style.border = "1px solid #D9D6D6";
      form[i].style.paddingBottom = "40px";
    } else {
      panel.style.maxHeight = panel.scrollHeight + "1px";
      panel.style.paddingTop = "64px";
      arrow[i].style.transform = "rotate(90deg)";
      form[i].style.backgroundColor = "#FCFCFC";
      form[i].style.border = "1px solid #D9D6D6";
      form[i].style.paddingBottom = "62px";
    }
  });
}

const mask = (selector) => {
  function setMask() {
    let matrix = '+###############';

    maskList.forEach(item => {
      let code = item.code.replace(/[\s#]/g, ''),
        phone = this.value.replace(/[\s#-)(]/g, '');

      if (phone.includes(code)) {
        matrix = item.code;
      }
    });

    let i = 0,
      val = this.value.replace(/\D/g, '');

    this.value = matrix.replace(/(?!\+)./g, function (a) {
      return /[#\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? '' : a;
    });
  }

  let inputs = document.querySelectorAll(selector);

  inputs.forEach(input => {
    if (!input.value) input.value = '+';
    input.addEventListener('input', setMask);
    input.addEventListener('focus', setMask);
    input.addEventListener('blur', setMask);
  });
};