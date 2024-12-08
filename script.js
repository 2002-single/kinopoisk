document.addEventListener("DOMContentLoaded", function () { 


// Элементы DOM
const main = document.getElementsByClassName("main")[0];
const movieTitle = document.getElementsByClassName("movieTitle")[0];
//const movie = document.getElementsByClassName("movie")[0];
const simularMovieTitle = document.getElementsByClassName("movieTitle")[1];
const movie = document.getElementsByClassName("movie")[0];

//knopki
const searchBtn = document.getElementById("searchBtn");
const themeBtn = document.getElementById("themeChange");




if(themeBtn){
themeBtn.addEventListener("click", changeTheme);
}
function changeTheme() {
    document.body.classList.toggle("dark");
}



document.addEventListener("domcontentload", function(event){
if (event.key ===" Enter"){
    findMovie()
}
});


if(searchBtn){
   searchBtn.addEventListener("click", findMovie); 
}

async function findMovie() {
    let search = document.getElementsByName("search")[0].value;
    let loader = document.getElementsByClassName("loader")[0];
    loader.style.display = "block";
   
       let data = {apikey: "d6346514", t: search};
    let result = await sendRequest("http://www.omdbapi.com/", "GET",data);
    loader.style.display = "none";
    

    if (result.Response === "False") {
        movie.style.display = "none";
        main.style.display = "block";
        movieTitle.style.display = "block";
        movieTitle.innerHTML = `${result.Error}`;
    } else {
        showMovie(result);
        findSimularMovies();
        console.log(result);
    }
}




function showMovie(movie) {
    main.style.display = "block";
    movieTitle.style.display = "block";
    document.getElementsByClassName("movie")[0].style.display = "flex";
    
    document.getElementById("movieImg").style.backgroundImage = `url(${movie.Poster})`;
    movieTitle.innerHTML = `${movie.Title}`;

    const movieDesc = document.getElementsByClassName("movieDescription")[0];
    movieDesc.innerHTML = ""

    const params = ["imdbRating", "Year", "Released", "Genre", "Country", "Language", "Director", "Writer", "Actors"];
    params.forEach((key) => {
        movieDesc.innerHTML += `
            <div class="desc">
                <span class="title">${key}</span>
                <span class="subtitle">${movie[key]}</span>
            </div>
        `;
    });
}



async function findSimularMovies() {
    let search = document.getElementsByName("search")[0].value;
    let simularMovieTitle= document.getElementsByClassName("movieTitle")[1];
    let data = {apikey: "d6346514", s: search};
    let result = await sendRequest("http://www.omdbapi.com/", "GET",data);
    console.log(result);
    if(result.Result =="False") {
    } else {
        simularMovieTitle.style.display = "block";
        simularMovieTitle.innerHTML = `Найдено похожих фильмов: ${result.totalResults}`;
        showSimularMovies(result.Search);
    }
    }


    function showSimularMovies(movies) {
        const simularMovies = document.getElementsByClassName("simularMovie")[0];
        simularMovies.innerHTML = "";
        simularMovies.style.display = "grid";
    
        for (let i = 0; i < movies.length; i++) {
            const movie = movies[i];
    
            // Проверяем, что постер существует и не равен "N/A"
            if (movie.Poster && movie.Poster !== "N/A") {
                let simularMovie = `
                <div class="simularMovieCard" style="background-image:url('${movie.Poster}');">
                    <div class="saved" onclick="addSaved(event)"
                         data-imdbID="${movie.imdbID}" 
                         data-title="${movie.Title}" 
                         data-poster="${movie.Poster}">
                    </div>
                    <div class="simularMovieTitle">
                        ${movie.Title}
                    </div>
                </div>`;
                
                simularMovies.innerHTML += simularMovie;
            }
        }
    }
    



async function sendRequest(url, method, data) {
    if (method == "POST") {
        let response = await fetch(url, {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        response = await response.json();
        return response;
    } else if (method == "GET") {
        url = url + "?" + new URLSearchParams(data);
        let response = await fetch(url, {
            method: "GET",
        });
        response = await response.json();
        return response;
    }
}
});

function addSaved(event) {
    const target = event.currentTarget;
    const movieData ={
        title: target.getAttribute("data-title"),
        poster: target.getAttribute("data-poster"),
        imdbID: target.getAttribute("data-imdbID"),
    };

    // Получение сохраненных фильмов из localStorage или создание пустого массива
    const favs = JSON.parse(localStorage.getItem("favs")) || [];
    const movieIndex = favs.findIndex(
        (movie) => movie.imdbID === movieData.imdbID
    )

    if (movieIndex > -1) {
        // Если фильм уже в избранном, удаляем его
        target.classList.remove("active")
        favs.splice(movieIndex, 1);
        console.log(`Удалено из избранного: ${movieData.title}`);
    } else {
        // Если фильма нет в избранном, добавляем 
        target.classList.add("active")
        favs.push(movieData); // Добавляем объект фильма
        console.log(`Добавлено в избранное: ${movieData.title}`);
    }

    // Сохраняем обновленный список избранного в localStorage
    localStorage.setItem("favs", JSON.stringify(favs));
   
}

const favorites = JSON.parse(localStorage.getItem("favs"));
const favCards = document.getElementsByClassName("favoritsCards")[0];
console.log(favorites); 
favorites.forEach((elem)=>{
    const card = document.createElement("div");
    const cardTitle = document.createElement("div");
    const zvezda = document.createElement("div")
    cardTitle.classList.add("favoritTitle")
    cardTitle.innerHTML=elem.title
    card.classList.add("favoritsCard");
    card.style.backgroundImage = `url(${elem.poster})`
    card.appendChild(cardTitle)
    favCards.appendChild(card)
card.appendChild(zvezda)
zvezda.innerHTML=elem.saved
zvezda.classList.add("zvezda");
});






