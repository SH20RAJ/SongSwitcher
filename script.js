const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const playButton = document.getElementById('playButton');
const audioPlayer = document.getElementById('audioPlayer');
const songImage = document.getElementById('songImage');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const songSelector = document.getElementById('songSelector');
const posterContainer = document.querySelector('.poster-container');

let songs = [];
let currentSongIndex = 0;

function fetchSongs(query, page) {
    fetch(`https://saavn.me/search/songs?query=${query}&page=${page}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'SUCCESS' && data.data && data.data.results) {
                songs = data.data.results;
                populateSongSelector();
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
}

function loadNextPage() {
    currentSongIndex = 0;
    const query = searchInput.value.trim() || 'darshan'; // Use search input or default query
    const currentPage = Math.floor(songs.length / 10) + 1; // Calculate the next page
    fetchSongs(query, currentPage);
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
    } else {
        loadNextPage();
    }
});

// Swipe gestures setup
posterContainer.addEventListener('swipeleft', () => {
    if (currentSongIndex < songs.length - 1) {
        currentSongIndex++;
        updateUI();
    } else {
        loadNextPage();
    }
});
posterContainer.addEventListener('swiperight', () => {
    if (currentSongIndex > 0) {
        currentSongIndex--;
        updateUI();
    }
});

// Search button event listener
searchButton.addEventListener('click', () => {
    loadNextPage();
});

// Auto-change song after completion
audioPlayer.addEventListener('ended', () => {
    if (currentSongIndex < songs.length - 1) {
        currentSongIndex++;
        updateUI();
    } else {
        loadNextPage();
    }
});

// Initial fetch
fetchSongs('darshan', 1);