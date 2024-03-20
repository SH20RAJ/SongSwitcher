const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const playButton = document.getElementById('playButton');
const audioPlayer = document.getElementById('audioPlayer');
const songImage = document.getElementById('songImage');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const songSelector = document.getElementById('songSelector');
const bodyTag = document.getElementsByTagName('body')[0];

let songs = [];
let currentSongIndex = 0;

const queries = [
    'darshan', 'arijit', 'lofi', 'sad', 'love', 'tseries',
    'b praak', 'sony music', 'zee music', 'jubin', 'vishal mishra'
];

function fetchSongs(query) {
    fetch(`https://saavn.dev/search/songs?query=${query}&page=1&limit=500`)
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

function loadSongDetails(index) {
    const selectedSong = songs[index];
    if (selectedSong) {
        audioPlayer.src = selectedSong.downloadUrl[4].link; // Using 320kbps quality
        audioPlayer.play();
        songImage.src = selectedSong.image[2].link; // Using 500x500 image
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
        listItem.innerHTML = `<p>${song.name} - ${song.primaryArtists}</p>`;
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

nextButton.addEventListener('click', () => {
    if (currentSongIndex < songs.length - 1) {
        currentSongIndex++;
        updateUI();
    }
});

// Swipe gestures setup for the whole body
const swipe = new Hammer(bodyTag);
swipe.on('swipeleft', () => {
    if (currentSongIndex < songs.length - 1) {
        currentSongIndex++;
        updateUI();
    }
});
swipe.on('swiperight', () => {
    if (currentSongIndex > 0) {
        currentSongIndex--;
        updateUI();
    }
});

// Search button event listener
searchButton.addEventListener('click', () => {
    songs = [];
    fetchSongs(searchInput.value.trim());
});

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
