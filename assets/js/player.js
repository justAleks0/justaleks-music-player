document.addEventListener('DOMContentLoaded', () => {
  const trackList = document.getElementById('trackList');
  const audioPlayer = document.getElementById('audioPlayer');
  const audioSource = document.getElementById('audioSource');

  // Fetch list of music files from GitHub API
  fetch('https://api.github.com/repos/justAleks0/justaleks-music-player/contents/music')
    .then(response => response.json())
    .then(files => {
      files.forEach(file => {
        if (file.name.toLowerCase().endsWith('.mp3')) {
          const option = document.createElement('option');
          // Set value to the raw file URL
          option.value = 'https://raw.githubusercontent.com/justAleks0/justaleks-music-player/main/music/' + encodeURIComponent(file.name);
          // Display the name without extension and replace underscores with spaces
          option.textContent = file.name.replace(/\.mp3$/i, '').replace(/_/g, ' ');
          trackList.appendChild(option);
        }
      });
    })
    .catch(err => console.error('Error fetching music list:', err));

  // Play selected track
  trackList.addEventListener('change', () => {
    const selectedUrl = trackList.value;
    audioSource.src = selectedUrl;
    audioPlayer.load();
    audioPlayer.play();
  });
});
