const form = document.querySelector('#form');
const searchInput = document.querySelector('#search');
const songsContainer = document.querySelector('#songs-container');
const prevAndNextContainer = document.querySelector('#prev-and-next-container');
var lastPageSongs;

const apiURL = `https://api.lyrics.ovh`;

const loader = container => {
  container.innerHTML = '';
  container.innerHTML = `
    <li id="preloader">
      <div class="balls">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </li>
  `;
}

const fetchData = async url => {
  loader(songsContainer);
  const response = await fetch(url);
  return await response.json();
}

const getMoreSongs = async url => {
  const data = await fetchData(`https://cors-anywhere.herokuapp.com/${url}`);
  lastPageSongs = data;
  
  insertSongsIntoPage(data);
}

const insertNextAndPrevButtons = ({ prev, next }) => {
  prevAndNextContainer.innerHTML = `
  ${ prev ? `<button class="btn" onClick="getMoreSongs('${prev}')">Anteriores</button>` : '' }
  ${ next ? `<button class="btn" onClick="getMoreSongs('${next}')">Próximas</button>` : '' }
`;
}

const insertSongsIntoPage = ({ data, prev, next }) => {
  songsContainer.innerHTML = data.map(({ artist: { name }, title }) => `
    <li class="song">
      <span class="song-artist"><strong>${name}</strong> - ${title}</span>
      <button class="btn" data-artist="${name}" data-song-title="${title}">Ver letra</button>
    </li>
  `).join('');

  if (prev || next) {
    insertNextAndPrevButtons({ prev, next });
    return;
  }

  prevAndNextContainer.innerHTML = '';
}

const fetchSongs = async term => {
  const data = await fetchData(`${apiURL}/suggest/${term}`);
  lastPageSongs = data;

  // fetch(`${apiURL}/suggest/${term}`)
  //   .then(response => response.json())
  //   .then(data => {
  //     console.log(data);
  //   })

  insertSongsIntoPage(data);
}

const handleFormSubmit = event => {
  event.preventDefault();

  const searchTerm = searchInput.value.trim(); // trim() remove os espaços em branco do inicio e fim da string.
  searchInput.value = '';
  searchInput.focus();

  if (!searchTerm) {
    songsContainer.innerHTML = `<li class="warning-message">Por favor, digite um termo válido</li>`;
    return;
  }

  fetchSongs(searchTerm)
}

form.addEventListener('submit', handleFormSubmit)

const insertLyricsIntoPage = ({ lyrics, artist, songTitle }) => {
  songsContainer.innerHTML = `
  <li class="lyrics-container">
    <a class='btn-back'><i class="fas fa-long-arrow-alt-left"></i></a>
    <h2><strong>${songTitle}</strong> - ${artist}</h2>
    <p class="lyrics">${lyrics}</p>
  </li>
  `;
}

const fetchLyrics = async (artist, songTitle) => {
  const data = await fetchData(`${apiURL}/v1/${artist}/${songTitle}`);
  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');
  insertLyricsIntoPage({lyrics, artist, songTitle });
}

const handleSongContainerClick = event => {
  const clickedElement = event.target;

  if (clickedElement.tagName === 'BUTTON') {
    const artist = clickedElement.getAttribute('data-artist');
    const songTitle = clickedElement.getAttribute('data-song-title');

    prevAndNextContainer.innerHTML = '';
    fetchLyrics(artist, songTitle);
  }else if (clickedElement.tagName === 'I') {
    insertSongsIntoPage(lastPageSongs);
  }
}

songsContainer.addEventListener('click', handleSongContainerClick)

function parallax() {
  var ball = document.querySelector('.disco_ball');
  var ball_2 = document.querySelector('.disco_ball_2');

  ball.style.top = -(window.pageYOffset / 5) + 'px';
  ball_2.style.top = -(window.pageYOffset / 1) + 'px';
}

window.addEventListener('scroll', parallax, false);