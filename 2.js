const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const playButton = document.getElementById('playButton');
const audioPlayer = document.getElementById('audioPlayer');
const songImage = document.getElementById('songImage');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const songSelector = document.getElementById('songSelector');
const bodyTag = document.getElementsByTagName('body')[0];
const progressBar = document.getElementById('progress-bar');
const currentTimeElement = document.getElementById('current-time');
const progressContainer = document.getElementById('progress-area');

let clicked = '' ;
let $ = document.querySelector;
let songs = [];
let currentSongIndex = 0;

const queries = [
    'darshan', 'arijit', 'lofi', 'sad', 'love', 'tseries',
    'b praak', 'sony music', 'zee music', 'jubin', 'vishal mishra'
];

function fetchSongs(query) {
    fetch(`https://saavn.me/search/songs?query=${query}&page=1&limit=500`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'SUCCESS' && data.data && data.data.results) {
                songs = [...songs, ...data.data.results];
                updateUI();
            }
        })
        .catch(error => {
            console.error('Error fetching songs:', error);
        });
}

function populateSongSelector() {
    songSelector.innerHTML = '';

    songs.forEach((song, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.text = `${song.name} - ${song.primaryArtists}`;
        songSelector.appendChild(option);
    });
}
function secondsToMinSec(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const formattedTime = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  return formattedTime;
}
function loadSongDetails(index) {
    const selectedSong = songs[index];
    if (selectedSong) {
        audioPlayer.src = selectedSong.downloadUrl[4].link; // Using 320kbps quality
        audioPlayer.play();
        songImage.src = selectedSong.image[2].link; // Using 500x500 image
      console.log(selectedSong);
      document.querySelector('#name').innerHTML = selectedSong.name;
      document.querySelector('#artist').innerHTML = selectedSong.primaryArtists;
      document.querySelector('#max-duration').innerHTML = secondsToMinSec(selectedSong.duration);
    }
}

function updateUI() {
    loadSongDetails(currentSongIndex);
    songSelector.value = currentSongIndex;

    populateSongList(); // Call the function to populate the song list
}

function populateSongList() {
    const songListContainer = document.getElementById('songList');
    songListContainer.innerHTML = ''; // Clear the container

    songs.forEach((song, index) => {
        const listItem = document.createElement('div');
        listItem.classList.add('song-item');
        listItem.innerHTML = `
        
      <li li-index="1" onclick="clicked(this)">
                <div class="row">
                  <span>${song.name}</span>
                  <p>${song.primaryArtists}</p>
                </div>
                <span id="music-1" class="audio-duration" t-duration="3:36">3:36</span>

              </li>`;
        listItem.addEventListener('click', () => {
            currentSongIndex = index;
            updateUI();
        });
        songListContainer.appendChild(listItem);
    });
}

// Automatically change song when the user selects a song from the selector
songSelector.addEventListener('change', () => {
    currentSongIndex = parseInt(songSelector.value);
    updateUI();
});

prevButton.addEventListener('click', () => {
    if (currentSongIndex > 0) {
        currentSongIndex--;
        updateUI();
    }
});

playButton.addEventListener('click', () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
      playButton.innerHTML = 'pause';
    } else {
      audioPlayer.pause()
      playButton.innerHTML = 'play_arrow';
    }
});

nextButton.addEventListener('click', () => {
    if (currentSongIndex < songs.length - 1) {
        currentSongIndex++;
        updateUI();
    }
});


// Search button event listener
searchButton.addEventListener('click', () => {
    songs = [];
    fetchSongs(searchInput.value.trim());
});

// Update progress bar and time
function updateProgressBarAndTime() {
  const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  progressBar.style.width = `${progress}%`;

  const minutes = Math.floor(audioPlayer.currentTime / 60);
  const seconds = Math.floor(audioPlayer.currentTime % 60);
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  currentTimeElement.textContent = formattedTime;
}


// Update audio playback when clicking the progress bar
progressContainer.addEventListener('click', (event) => {
  const clickX = event.clientX - progressContainer.getBoundingClientRect().left;
  const percent = (clickX / progressContainer.offsetWidth) * 100;
  const newTime = (percent * audioPlayer.duration) / 100;
  audioPlayer.currentTime = newTime;
});

// Dragging functionality for the progress bar
let isDragging = false;

progressContainer.addEventListener('mousedown', (event) => {
  isDragging = true;
  updateProgress(event);
});

document.addEventListener('mousemove', (event) => {
  if (isDragging) {
    updateProgress(event);
  }
});

document.addEventListener('mouseup', () => {
  if (isDragging) {
    isDragging = false;
  }
});

function updateProgress(event) {
  const clickX = event.clientX - progressContainer.getBoundingClientRect().left;
  const percent = (clickX / progressContainer.offsetWidth) * 100;
  const newTime = (percent * audioPlayer.duration) / 100;
  audioPlayer.currentTime = newTime;
}

// Update progress and time as audio plays
audioPlayer.addEventListener('timeupdate', updateProgressBarAndTime);

// Auto-change song after completion
audioPlayer.addEventListener('ended', () => {
    if (currentSongIndex < songs.length - 1) {
        currentSongIndex++;
        updateUI();
    }
});

// Initial fetch
fetchSongs(queries[Math.floor(Math.random() * queries.length)]);

// Log the complete JSON data
console.log(JSON.stringify(songs, null, 2));

// Store songs in local storage
localStorage.setItem('songs', JSON.stringify(songs));
