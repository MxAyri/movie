let i = 1;
for (let li of carousel.querySelectorAll('.li')) {
  li.style.position = 'relative';
  li.insertAdjacentHTML('beforeend', `<span style="position:absolute;left:0;top:0">${i}</span>`);
  i++;
}

let test = document.querySelector('.test');
let width = test.offsetWidth + 13;
let count = 1;

let list = carousel.querySelector('.ul');
let listElems = carousel.querySelectorAll('.li');

let position = 0;

carousel.querySelector('.prev').onclick = function () {
  if (Math.abs(position) === 0 && window.innerWidth > 1440) {
    position = -((listElems.length * width) - width * count - (width * 5));
  } else if (Math.abs(position) === 0 && window.innerWidth <= 1440 && window.innerWidth > 1215) {
    position = -((listElems.length * width) - width * count - (width * 4));
  } else if (Math.abs(position) === 0 && window.innerWidth <= 1215 && window.innerWidth > 990) {
    position = -((listElems.length * width) - width * count - (width * 3));
  } else if (Math.abs(position) === 0 && window.innerWidth <= 990) {
    position = -((listElems.length * width) - width * count - (width * 2));
  } else {
    position += width * count;
  }

  position = Math.min(position, 0)
  list.style.marginLeft = position + 'px';
};

carousel.querySelector('.next').onclick = function () {

  position -= width * count;
  if (Math.abs(position) === listElems.length * width - (width * 5) && window.innerWidth > 1440) {
    position = 0;
  } else if (Math.abs(position) === listElems.length * width - (width * 4) && window.innerWidth <= 1440 && window.innerWidth > 1215) {
    position = 0;
  } else if (Math.abs(position) === listElems.length * width - (width * 3) && window.innerWidth <= 1215 && window.innerWidth > 990) {
    position = 0;
  } else if (Math.abs(position) === listElems.length * width - (width * 2) && window.innerWidth <= 990) {
    position = 0;
  }
  position = Math.max(position, -width * (listElems.length - count));
  list.style.marginLeft = position + 'px';
};

let i1 = 1;
for (let li1 of carousel1.querySelectorAll('.slide1')) {
  li1.style.position = 'relative';
  li1.insertAdjacentHTML('beforeend', `<span style="position:absolute;left:0;top:0">${i1}</span>`);
  i1++;
}
let i2 = 1;
for (let li2 of carousel1.querySelectorAll('.slide2')) {
  li2.style.position = 'relative';
  li2.insertAdjacentHTML('beforeend', `<span style="position:absolute;left:0;top:0">${i2}</span>`);
  i2++;
}
let i3 = 1;
for (let li3 of carousel1.querySelectorAll('.slide3')) {
  li3.style.position = 'relative';
  li3.insertAdjacentHTML('beforeend', `<span style="position:absolute;left:0;top:0">${i3}</span>`);
  i3++;
}

let test1 = document.querySelector(".test1");
let width1 = test1.offsetWidth + 13;
let count1 = 1;

let list1 = carousel1.querySelector('.ul1');
let listElems1 = carousel1.querySelectorAll('.li1');
let position1 = 0;

let list2 = carousel1.querySelector('.ul2');
let listElems2 = carousel1.querySelectorAll('.li2');
let position2 = 0;

let list3 = carousel1.querySelector('.ul3');
let listElems3 = carousel1.querySelectorAll('.li3');
let position3 = 0;

carousel1.querySelector('.prev1').onclick = function () {
  if (Math.abs(position1) === 0 && Math.abs(position2) === 0 && Math.abs(position3) === 0) {
    position1 = -((listElems1.length * width1) - width1 * count1 - width1);
    position2 = -((listElems2.length * width1) - width1 * count1 - width1);
    position3 = -((listElems3.length * width1) - width1 * count1 - width1);

  } else {
    position1 += width1 * count1;
    position2 += width1 * count1;
    position3 += width1 * count1;
  }
  position1 = Math.min(position1, 0);
  position2 = Math.min(position2, 0);
  position3 = Math.min(position3, 0);
  list1.style.marginLeft = position1 + 'px';
  list2.style.marginLeft = position2 + 'px';
  list3.style.marginLeft = position3 + 'px';
};

carousel1.querySelector('.next1').onclick = function () {
  position1 -= width1 * count1;
  position2 -= width1 * count1;
  position3 -= width1 * count1;

  if (Math.abs(position1) === listElems1.length * width1 - width1 && Math.abs(position2) === listElems2.length * width1 - width1 && Math.abs(position3) === listElems3.length * width1 - width1) {
    position1 = 0;
    position2 = 0;
    position3 = 0;
  }
  position1 = Math.max(position1, -width1 * (listElems1.length - count1));
  position2 = Math.max(position2, -width1 * (listElems2.length - count1));
  position3 = Math.max(position3, -width1 * (listElems3.length - count1));
  list1.style.marginLeft = position1 + 'px';
  list2.style.marginLeft = position2 + 'px';
  list3.style.marginLeft = position3 + 'px';
};

document.addEventListener('DOMContentLoaded', function(e){
  function autoNext(){
    document.querySelector('.next').click();
    document.querySelector('.next1').click();
    setTimeout(autoNext, 5000);
  }
  setTimeout(autoNext, 5000)
})
