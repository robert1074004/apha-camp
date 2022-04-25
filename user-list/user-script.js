const url = "https://lighthouse-user-api.herokuapp.com";
const index = url + "/api/v1/users";
const users = [];
const user_list = document.querySelector("#user-panel");
let favorite = []
const card = document.querySelector(".modal-body");
axios
  .get(index)
  .then(function (response) {
    users.push(...response.data.results);
    let htmlcontent = ``;
    users.forEach(
      (item) =>
        (htmlcontent += `<div class='mx-3 my-3'>
      <div class="card text-center border-dark mb-3" style="width: 12rem;"><img src=${item.avatar} class="card-img-top" alt="..." data-bs-toggle="modal" data-bs-target="#UserModal" data-id=${item.id}>
        <p class="card-text px-3 py-3 mb-0">${item.name}</p>
        <a href="#" class="btn btn-primary" data-id=${item.id}>Add Favorite</a>
      </div>
    </div>`)
    );
    user_list.innerHTML = htmlcontent;
  })
  .catch(function (error) {
    console.log(error);
  });

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

function AddFavorite(id) {
  axios
    .get(index + "/" + id)
    .then(function (response) {
      console.log(localStorage.getItem('favorite'))
      if (!localStorage.getItem('favorite')) {
        localStorage.setItem('favorite',JSON.stringify(favorite))
      }
      let users = JSON.parse(localStorage.getItem('favorite'))
      if (users.some(user => user.id === response.data.id)) {
        return alert('此人已加入收藏')
      }
      users.push(response.data)
      localStorage.setItem('favorite',JSON.stringify(users))
    })
    .catch(function (error) {
      console.log(error);
    });
}

user_list.addEventListener("click", function getId(event) {
  if (event.target.matches(".card-img-top")) {
    console.log(event.target.dataset.id);
    show(event.target.dataset.id);
  } else if (event.target.matches(".btn-primary")) {
    console.log(event.target.dataset.id)
    AddFavorite(event.target.dataset.id)
  }
});
