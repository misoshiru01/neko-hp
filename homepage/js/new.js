const parent = document.querySelector(".parent");
const GAS_URL =
  "https://script.google.com/macros/s/AKfycbyj8U2m5bCQEJIY_EPpWZ3aF6iETxkXNY-UnPBXgLob6k0dJkdcL94hu_1Qe_691bJOFw/exec";
let photoList = [];

// GASからデータを取得JSONデータを取得
fetch(GAS_URL)
  .then((response) => response.json())
  .then((data) => {
    photoList = data
      .filter((photo) => photo.fileName !== "")
      .sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
    let generateHTML = "";
    for (let i = 1; i <= 13; i++) {
      const photo = photoList[i];
      generateHTML += `
        <div class="child grid-div-${i}">
          <img src="./https://misoshiru01.github.io/neko-hp/homepage/amazonphots2/${photo.fileName}" />
        </div>`;
    }
    console.log(generateHTML);
    parent.innerHTML = generateHTML;
  })
  .catch((error) => {
    console.log(error);
  });
