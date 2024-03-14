const btnAll = document.getElementsByClassName("btnAll")

let j = 0;

fetch('./data.json')
  .then((response) => response.json())
  .then((json) => {
    if (window.innerWidth > 577) {
      let item = document.querySelector(".card-img");

      for (let i = 0; i < 16; i++) {
        let index = j;
        j++;
        const card = document.createElement("div");
        card.classList.add("card-img");
        card.setAttribute("data-modal", json[index].id);

        const img = document.createElement("img");
        img.src = json[index].img;
        card.append(img);
        item.append(card);
      }
    } else if (window.innerWidth <= 577) {
      let item = document.querySelector(".card-img");

      for (let i = 0; i < 8; i++) {
        let index = j;
        j++;
        const card = document.createElement("div");
        card.classList.add("card-img");
        card.setAttribute("data-modal", json[index].id);

        const img = document.createElement("img");
        img.src = json[index].img;
        card.append(img);
        item.append(card);
      }
    }
  })



function btnadd() {
  fetch('./data.json')
    .then((response) => response.json())
    .then((json) => {
      if (window.innerWidth > 577) {
        let item = document.querySelector(".card-img");
        for (let i = 0; i < 12; i++) {

          if (j < json.length) {
            index = j;
            j++;
          } else {
            document.querySelector(".btnAll").style.display = "none";
            break;
          }

          const card = document.createElement("div");
          card.classList.add("card-img");
          card.setAttribute("data-modal", json[index].id);

          const img = document.createElement("img");
          img.src = json[index].img;
          card.append(img);
          item.append(card);
        }
      } else if (window.innerWidth <= 577) {
        let item = document.querySelector(".card-img");
        for (let i = 0; i < 8; i++) {

          if (j < json.length) {
            index = j;
            j++;
          } else {
            document.querySelector(".btnAll").style.display = "none";
            break;
          }

          const card = document.createElement("div");
          card.classList.add("card-img");
          card.setAttribute("data-modal", json[index].id);

          const img = document.createElement("img");
          img.src = json[index].img;
          card.append(img);
          item.append(card);
        }
      }
    })
}