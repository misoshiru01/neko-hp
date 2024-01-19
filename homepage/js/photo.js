const photoArea = document.querySelector(".photo-list");
const GAS_URL =
  "https://script.google.com/macros/s/AKfycbyj8U2m5bCQEJIY_EPpWZ3aF6iETxkXNY-UnPBXgLob6k0dJkdcL94hu_1Qe_691bJOFw/exec";
let photoList = [];

// GASからデータを取得JSONデータを取得
fetch(GAS_URL)
  .then((response) => response.json())
  .then((data) => {
    photoList = data.filter((photo) => photo.fileName !== "");
    displayPhoto();
    // フィルターが変更されたら再計算する
    document.querySelectorAll("#sort, .filter input").forEach((el) => {
      el.addEventListener("change", () => {
        displayPhoto();
      });
    });
  })
  .catch((error) => {
    console.log(error);
    photoArea.innerHTML = "<h2>エラーが発生しました😿</h2>";
  });

document.querySelector(".modal").addEventListener("click", () => {
  document.querySelector("#modal").style.display = "none";
});

document.querySelector(".modal-content").addEventListener("click", (e) => {
  e.stopPropagation();
});

const iineButton = document.querySelector(".modal-content .iine-button");
iineButton.addEventListener("click", (e) => {
  e.stopPropagation();
  const photoName = decodeURIComponent(
    document.querySelector(".modal-content img").src.split("/").pop()
  );
  console.log(photoName);
  if (iineButton.getAttribute("iine") !== "true") {
    fetch(GAS_URL, {
      method: "POST",
      body: JSON.stringify({
        fileName: photoName,
      }),
    });
    photoList.find((photo) => photo.fileName === photoName).fav++;
    document.querySelector(".modal-content .photo-info p.fav").innerHTML = `${
      photoList.find((photo) => photo.fileName === photoName).fav
    }いいね`;
  }
  iineButton.setAttribute("iine", "true");
  iineButton.innerHTML = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="60px" width="60px" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z" stroke="#000000" stroke-width="0px"></path><path d="m12 21.35-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="#000000" stroke-width="0px"></path></svg>`;
});

function displayPhoto() {
  console.log(photoList);
  // フィルターの値を取得
  const sort = document.querySelector("#sort").value;
  const isChacha = document.querySelector("#label-chacha").checked;
  const isMame = document.querySelector("#label-mame").checked;

  // データにフィルターを適用
  const filteredPhoto = photoList.filter((photo) => {
    if (isChacha && isMame) {
      return true;
    } else if (isChacha) {
      return photo.kind.includes("chacha");
    } else if (isMame) {
      return photo.kind.includes("mame");
    }
  });

  // データをソート
  filteredPhoto.sort((a, b) => {
    if (sort === "new") {
      return new Date(b.date) - new Date(a.date);
    } else if (sort === "old") {
      return new Date(a.date) - new Date(b.date);
    } else if (sort === "fav") {
      return b.fav - a.fav;
    } else if (sort === "recommend") {
      return b.recommended - a.recommended;
    } else {
      return Math.random() - 0.5;
    }
  });

  // HTMLを生成
  let result = "";
  filteredPhoto.forEach((photo) => {
    result += `
      <div class="photo">
        <img src="https://misoshiru01.github.io/neko-hp/homepage/amazonphots2/${photo.fileName}">
        </div>
    `;
  });
  photoArea.innerHTML = result;
  photoArea.querySelectorAll(".photo").forEach((photo, index) => {
    photo.addEventListener("click", () => {
      displayModal(filteredPhoto[index]);
    });
  });
}

function displayModal(photo) {
  document.querySelector(
    ".modal-content img"
  ).src = `https://misoshiru01.github.io/neko-hp/homepage/amazonphots2/${photo.fileName}`;
  const date = new Date(photo.date);
  const dateStr = `${date.getFullYear()}年${
    date.getMonth() + 1
  }月${date.getDate()}日`;
  document.querySelector(".modal-content .photo-info").innerHTML = `
    <p>${dateStr}</p>
    <p>${photo.kind.join("・")}</p>
    <p class="fav">${photo.fav}いいね</p>
    <p>${photo.recommended}オススメ</p>
    <p>${photo.tags.join(" / ")}</p>
  `;
  iineButton.setAttribute("iine", "false");
  iineButton.innerHTML = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="60px" width="60px" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"></path></svg>`;
  document.querySelector("#modal").style.display = "flex";
}
