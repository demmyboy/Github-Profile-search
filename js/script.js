const API_URL = 'https://api.github.com/users/'
const form = document.getElementById('form')
const search = document.getElementById('search')
const main = document.getElementById('main')

//getUser('demmyboy')

async function getUser(username) {
    try {
        const res = await axios.get(API_URL + username)
        createUserCard(res.data)
        getRepos(username)
        console.log(res.data)
    } catch (err) {
        if (err.response.status == 404) {
            createErrorCard('No profile with this user name')
            console.log(err)
        }
    }
}

async function getRepos(username) {
    try {
        const res = await axios.get(API_URL + username + '/repos?sort=created')
        addReposToCard(res.data)
        console.log(res.data)
    } catch (err) {
        createErrorCard('Cant fetch from repos')
        console.log(err)
    }
}

function createUserCard(user) {
    const cardHTML = `
    <div class="cards">
        <div>
            <img src="${user.avatar_url}" alt="" class="avatar">
        </div>
        <div class="user-info">
            <h2>${user.name}</h2>
            <p>${user.bio == null ? "Bio is not available for this user" : user.bio }</p> 
            <ul>
                <li>${user.followers} <strong>Followers</strong></li>
                <li>${user.following} <strong>Following</strong></li>
                <li>${user.public_repos} <strong>Repos</strong></li>
            </ul>
            <div id="repos"></div> 
        </div>
    </div> 
    
    `
    main.innerHTML = cardHTML
}

function addReposToCard(repos) {
    const reposEl = document.getElementById('repos')
    repos
        .slice(0, 10)
        .forEach(repo => {
            const repoElement = document.createElement('a')
            repoElement.classList.add('repo')
            repoElement.href = repo.html_url // from github 
            repoElement.target = '_blank'
            repoElement.innerText = repo.name
            reposEl.appendChild(repoElement)
        });

}

function createErrorCard(message) {
    const cardHTML = `
    <div class="cards">
        <h2>${message}</h2>
    </div>`

    main.innerHTML = cardHTML
}

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const user = search.value
    if (user) {
        getUser(user)
        search.value = '' // to clear the search box
    }
})