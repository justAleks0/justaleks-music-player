document.addEventListener('DOMContentLoaded', () => {
  const trackList = document.getElementById('trackList');
  const audioPlayer = document.getElementById('audioPlayer');
  const audioSource = document.getElementById('audioSource');
  const cover = document.getElementById('cover');
  const titleEl = document.getElementById('title');
  const artistEl = document.getElementById('artist');
  const albumEl = document.getElementById('album');

  // Fetch list of music files from GitHub API
  fetch('https://api.github.com/repos/justAleks0/justaleks-music-player/contents/music')
    .then(response => response.json())
    .then(files => {
      files.forEach(file => {
        if (file.name.toLowerCase().endsWith('.mp3')) {
          const option = document.createElement('option');
          option.value = 'music/' + encodeURIComponent(file.name);
          option.textContent = file.name.replace(/\.mp3$/i, '').replace(/_/g, ' ');
          trackList.appendChild(option);
        }
      });
    })
    .catch(err => console.error('Error fetching music list:', err));

  // Play and load selected track with metadata
  trackList.addEventListener('change', () => {
    const selectedUrl = trackList.value;
    audioSource.src = selectedUrl;
    audioPlayer.load();
    audioPlayer.play();

    // Reset metadata display
    titleEl.textContent = '';
    artistEl.textContent = '';
    albumEl.textContent = '';
    cover.style.display = 'none';
    cover.src = '';
    // Read ID3 tags using jsmediatags
    jsmediatags.read(selectedUrl, {
      onSuccess: ({ tags }) => {
        const title = tags.title;
        const artist = tags.artist;
        const album = tags.album;
        const picture = tags.picture;
        if (title) titleEl.textContent = title;
        if (artist) artistEl.textContent = artist;
        if (album) albumEl.textContent = album;

        if (picture) {
          const data = picture.data;
          const format = picture.format;
          const byteArray = new Uint8Array(data);
          let binary = '';
          for (let i = 0; i < byteArray.length; i++) {
            binary += String.fromCharCode(byteArray[i]);
          }
          const base64 = window.btoa(binary);
          cover.src = 'data:' + format + ';base64,' + base64;
          cover.style.display = 'block';
        }
      },
      onError: function(error) {
        console.warn('Error reading tags:', error);
      }
    });
  });
});
