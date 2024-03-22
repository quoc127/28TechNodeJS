// const fetchAPI = async (api) => {
//     const response = await fetch(api);
//     const data = await response.json();
//     return data;
// }

// fetchAPI("http://localhost:3000/products")
// .then(data => {
//   const newArray = data.map((item) => {
//     return `
//         <div class="product-item">
//         <img src= "${item.thumbnail}" />
//         <h2>
//         ${item.title}
//         </h2>
//         <h3>
//         ${item.price}
//         </h3>
//         </div>
//     `;
//   });
//   const htmls = newArray.join("");
//   const productList = document.querySelector("#product-list");

//   productList.innerHTML = htmls;
// })

localStorage.setItem("fullName", "Nguyễn Quốc");

const fullName = localStorage.getItem("fullName");

const text = document.querySelector("#text");
text.innerHTML = fullName;

//Change mode
const currentMode = localStorage.getItem("mode");
if (currentMode) {
  const body = document.querySelector("body");
  body.classList.toggle(currentMode);
}

const changeMode = document.querySelector("#change-mode");
changeMode.addEventListener("click", () => {
  const body = document.querySelector("body");
  body.classList.toggle("dark");

  const currentMode = localStorage.getItem("mode");

  if (currentMode) {
    localStorage.setItem("mode", "");
  } else {
    localStorage.setItem("mode", "dark");
  }
});
//End change mod
