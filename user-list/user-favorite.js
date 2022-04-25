const url = "https://lighthouse-user-api.herokuapp.com";
const index = url + "/api/v1/users";
let users = JSON.parse(localStorage.getItem('favorite'));
const user_list = document.querySelector("#user-panel");
const card = document.querySelector(".modal-body");

function RenderUserlist(data) {
  let htmlcontent = ``;
  data.forEach(
  item => htmlcontent += `<div class='mx-3 my-3'>
  <div class="card text-center border-dark mb-3" style="width: 12rem;"><img src=${item.avatar} class="card-img-top" alt="..." data-bs-toggle="modal" data-bs-target="#UserModal" data-id=${item.id}>
    <p class="card-text px-3 py-3 mb-0">${item.name}</p>
    <button class="btn btn-danger btn-remove-favorite" data-id=${item.id}>x</button>
  </div>
  </div>`
    );
  user_list.innerHTML = htmlcontent;
}

RenderUserlist(users)
  

function show(id) {
  axios
    .get(index + "/" + id)
    .then(function (response) {
      console.log(response.data);
      let cardcontent = ``;
      for (let i in response.data) {
        if (i === "created_at") {
          break;
        }
        cardcontent += `${i} : ${response.data[i]} <hr>`;
      }
      card.innerHTML = cardcontent;
    })
    .catch(function (error) {
      console.log(error);
    });
}

function RemoveFavorite(id) {
  let index = users.findIndex(user => user.id === id)
  console.log(index)
  console.log(users.splice(index,1))
  console.log(users)
  localStorage.setItem('favorite',JSON.stringify(users))
  RenderUserlist(users)
}

user_list.addEventListener("click", function getId(event) {
  if (event.target.matches(".card-img-top")) {
    console.log(event.target.dataset.id);
    show(event.target.dataset.id);
  } else if (event.target.matches(".btn-danger")) {
    console.log(event.target.dataset.id)
    RemoveFavorite(Number(event.target.dataset.id))
  }
});
