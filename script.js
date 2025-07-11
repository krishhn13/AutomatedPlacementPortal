// Song data
const songs = [
    {
        id: 1,
        title: "Midnight Dreams",
        artist: "Luna Eclipse",
        duration: "3:24",
        cover: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
        src: "#"
    },
    {
        id: 2,
        title: "Neon Nights",
        artist: "Synthwave Collective",
        duration: "4:12",
        cover: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
        src: "#"
    },
    {
        id: 3,
        title: "Ocean Breeze",
        artist: "Coastal Vibes",
        duration: "2:58",
        cover: "https://images.pexels.com/photos/1738986/pexels-photo-1738986.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
        src: "#"
    },
    {
        id: 4,
        title: "Golden Hour",
        artist: "Sunset Boulevard",
        duration: "3:45",
        cover: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
        src: "#"
    },
    {
        id: 5,
        title: "Starlight Serenade",
        artist: "Cosmic Harmony",
        duration: "4:33",
        cover: "https://images.pexels.com/photos/1694000/pexels-photo-1694000.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
        src: "#"
    },
    {
        id: 6,
        title: "Electric Dreams",
        artist: "Digital Pulse",
        duration: "3:18",
        cover: "https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
        src: "#"
    }
];

// State management
let currentSongIndex = 0;
let isPlaying = false;
let isDarkMode = true;
let currentProgress = 0;
let currentVolume = 80;
let isMuted = false;

// DOM elements
const landingScreen = document.getElementById('landingScreen');
const mainApp = document.getElementById('mainApp');
const enterAppBtn = document.getElementById('enterApp');
const themeToggle = document.getElementById('themeToggle');
const sunIcon = document.getElementById('sunIcon');
const moonIcon = document.getElementById('moonIcon');
const albumArt = document.getElementById('albumArt');
const songTitle = document.getElementById('songTitle');
const artistName = document.getElementById('artistName');
const waveform = document.getElementById('waveform');
const currentTimeDisplay = document.getElementById('currentTime');
const totalTimeDisplay = document.getElementById('totalTime');
const progressBar = document.getElementById('progressBar');
const progressSlider = document.getElementById('progressSlider');
const prevBtn = document.getElementById('prevBtn');
const playPauseBtn = document.getElementById('playPauseBtn');
const nextBtn = document.getElementById('nextBtn');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const volumeBtn = document.getElementById('volumeBtn');
const volumeIcon = document.getElementById('volumeIcon');
const muteIcon = document.getElementById('muteIcon');
const volumeBar = document.getElementById('volumeBar');
const volumeSlider = document.getElementById('volumeSlider');
const playlist = document.getElementById('playlist');

// Initialize the app
function init() {
    renderPlaylist();
    updateCurrentSong();
    setupEventListeners();
    startProgressSimulation();
}

// Render playlist
function renderPlaylist() {
    playlist.innerHTML = '';
    songs.forEach((song, index) => {
        const songElement = document.createElement('div');
        songElement.className = `song-item flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300 hover:bg-white/10 ${index === currentSongIndex ? 'bg-amber-500/20 border border-amber-500/30' : ''}`;
        songElement.innerHTML = `
            <img src="${song.cover}" alt="${song.title}" class="w-12 h-12 rounded-lg mr-3">
            <div class="flex-1">
                <h4 class="font-medium ${index === currentSongIndex ? 'text-amber-400' : ''}">${song.title}</h4>
                <p class="text-sm text-gray-400">${song.artist}</p>
            </div>
            <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-400">${song.duration}</span>
                <button class="play-btn p-1 rounded-full hover:bg-amber-500/20 transition-all duration-300">
                    <svg class="w-4 h-4 ${index === currentSongIndex && isPlaying ? 'text-amber-400' : ''}" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                </button>
            </div>
        `;
        
        songElement.addEventListener('click', () => {
            currentSongIndex = index;
            updateCurrentSong();
            if (isPlaying) {
                // If already playing, continue playing the new song
                playPause();
                setTimeout(() => playPause(), 100);
            }
        });
        
        playlist.appendChild(songElement);
    });
}

// Update current song display
function updateCurrentSong() {
    const song = songs[currentSongIndex];
    albumArt.src = song.cover;
    songTitle.textContent = song.title;
    artistName.textContent = song.artist;
    totalTimeDisplay.textContent = song.duration;
    renderPlaylist(); // Re-render to update highlighting
}

// Play/Pause functionality
function playPause() {
    isPlaying = !isPlaying;
    
    if (isPlaying) {
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
        waveform.classList.remove('hidden');
    } else {
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
        waveform.classList.add('hidden');
    }
    
    renderPlaylist(); // Update playlist highlighting
}

// Previous song
function previousSong() {
    currentSongIndex = currentSongIndex > 0 ? currentSongIndex - 1 : songs.length - 1;
    updateCurrentSong();
    currentProgress = 0;
    updateProgressBar();
}

// Next song
function nextSong() {
    currentSongIndex = currentSongIndex < songs.length - 1 ? currentSongIndex + 1 : 0;
    updateCurrentSong();
    currentProgress = 0;
    updateProgressBar();
}

// Update progress bar
function updateProgressBar() {
    progressBar.style.width = `${currentProgress}%`;
    progressSlider.value = currentProgress;
    
    // Update time display
    const totalMinutes = parseInt(songs[currentSongIndex].duration.split(':')[0]);
    const totalSeconds = parseInt(songs[currentSongIndex].duration.split(':')[1]);
    const totalTimeInSeconds = totalMinutes * 60 + totalSeconds;
    const currentTimeInSeconds = Math.floor((currentProgress / 100) * totalTimeInSeconds);
    
    const minutes = Math.floor(currentTimeInSeconds / 60);
    const seconds = currentTimeInSeconds % 60;
    currentTimeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Simulate progress (since we don't have actual audio)
function startProgressSimulation() {
    setInterval(() => {
        if (isPlaying) {
            currentProgress += 0.5;
            if (currentProgress >= 100) {
                currentProgress = 0;
                nextSong();
            }
            updateProgressBar();
        }
    }, 500);
}

// Volume control
function toggleMute() {
    isMuted = !isMuted;
    
    if (isMuted) {
        volumeIcon.classList.add('hidden');
        muteIcon.classList.remove('hidden');
        volumeBar.style.width = '0%';
    } else {
        volumeIcon.classList.remove('hidden');
        muteIcon.classList.add('hidden');
        volumeBar.style.width = `${currentVolume}%`;
    }
}

// Update volume
function updateVolume(value) {
    currentVolume = value;
    volumeBar.style.width = `${value}%`;
    volumeSlider.value = value;
    
    if (value === 0) {
        volumeIcon.classList.add('hidden');
        muteIcon.classList.remove('hidden');
        isMuted = true;
    } else {
        volumeIcon.classList.remove('hidden');
        muteIcon.classList.add('hidden');
        isMuted = false;
    }
}

// Theme toggle
function toggleTheme() {
    isDarkMode = !isDarkMode;
    
    if (isDarkMode) {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    } else {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Landing screen
    enterAppBtn.addEventListener('click', () => {
        landingScreen.classList.add('hidden');
        mainApp.classList.remove('hidden');
    });
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Playback controls
    playPauseBtn.addEventListener('click', playPause);
    prevBtn.addEventListener('click', previousSong);
    nextBtn.addEventListener('click', nextSong);
    
    // Progress control
    progressSlider.addEventListener('input', (e) => {
        currentProgress = e.target.value;
        updateProgressBar();
    });
    
    // Volume control
    volumeBtn.addEventListener('click', toggleMute);
    volumeSlider.addEventListener('input', (e) => {
        updateVolume(e.target.value);
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                playPause();
                break;
            case 'ArrowLeft':
                previousSong();
                break;
            case 'ArrowRight':
                nextSong();
                break;
        }
    });
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', init);

// Add some interactive effects
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.glass-effect');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        } else {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        }
    });
});

// Add smooth scrolling and performance optimizations
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.parallax');
    if (parallax) {
        parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add touch support for mobile
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
            previousSong();
        } else {
            nextSong();
        }
    }
});