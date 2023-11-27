let image = document.querySelector("img");
let totalDuration = document.querySelector(".totalDuration");
const speaker = document.querySelector(".speaker");
const seekBar = document.querySelector(".seekBar");
const sidebar = document.querySelector(".sidebar");
const crossbar = document.querySelector(".fa-xmark");
const hamburger = document.querySelector(".fa-bars");
const audioDurationTracker = document.querySelector(".audioDurationTracker");
const volumeRange = document.querySelector(".volumeRange");
const cardTitle = document.querySelector(".card-title");
const cardSubtitle = document.querySelector(".card-subtitle");
const songsContainer = document.querySelector(".song-list");
let audioEL = new Audio();

let index = 0;
function updatePlayer() {
  image.src = songs[index].thumbnail;
  cardTitle.innerText = songs[index].songUrl;
  cardSubtitle.innerText = songs[index].artist;
  audioEL.src = `./Audious/${songs[index].songUrl}.mp3`;
}
updatePlayer();
function playPauseSong(e) {
  if (e.target.classList.contains("fa-play")) {
    e.target.classList.replace("fa-play", "fa-pause");
    audioEL.play();
  } else {
    e.target.classList.replace("fa-pause", "fa-play");
    audioEL.pause();
  }
}

function playNextSong() {
  index++;
  if (index > songs.length - 1) index = 0;
  updateAudioPlayer();
}
function playPreviousSong() {
  index--;
  if (index < 0) index = songs.length - 1;
  updateAudioPlayer();
}
function updateAudioPlayer() {
  updatePlayer();
  audioEL.play();
  document.querySelector(".fa-play")?.classList.replace("fa-play", "fa-pause");
}

function adjustVolume(vol) {
  audioEL.volume = vol / 100;
  if (vol == 0) speaker.classList.replace("fa-volume-high", "fa-volume-xmark");
  else speaker.classList.replace("fa-volume-xmark", "fa-volume-high");
}

function toggleSpeaker(e) {
  if (e.target.classList.contains("fa-volume-high")) {
    speaker.classList.replace("fa-volume-high", "fa-volume-xmark");
    audioEL.muted = true;
  } else {
    speaker.classList.replace("fa-volume-xmark", "fa-volume-high");
    audioEL.muted = !true;
  }
}

audioEL.addEventListener("loadedmetadata", function () {
  const totalDurationInSeconds = audioEL.duration;
  const minutes = Math.floor(totalDurationInSeconds / 60);
  const seconds = Math.round(totalDurationInSeconds % 60);
  totalDuration.innerHTML = `${minutes}:${
    seconds < 10 ? "0" + seconds : seconds
  }`;
  seekBar.max = audioEL.duration;
});
audioEL.addEventListener("timeupdate", function () {
  const currentTimeInSeconds = audioEL.currentTime;
  const minutes = Math.floor(currentTimeInSeconds / 60);
  const seconds = Math.round(currentTimeInSeconds % 60);
  audioDurationTracker.innerHTML = `${minutes < 10 ? "0" + minutes : minutes}:${
    seconds < 10 ? "0" + seconds : seconds
  }`;
  seekBar.value = currentTimeInSeconds;
});

seekBar.addEventListener("input", function () {
  audioEL.currentTime = seekBar.value;
});

audioEL.addEventListener("ended", () => {
  index++;
  if (index > songs.length - 1) index = 0;
  updateAudioPlayer();
});

function setLoopToOne(event) {
  if (!event.target.classList.contains("loop-one")) {
    if (event.target.classList.contains("active")) {
      event.target.classList.remove("active");
      audioEL.removeAttribute("loop");
    } else {
      event.target.classList.add("active");
      audioEL.setAttribute("loop", "loop");
    }
  }
}

function toggleSidebar() {
  sidebar.classList.toggle("sidebar-collapse");
  hamburger.classList.toggle("collapse");
  crossbar.classList.toggle("collapse");
}

document.onload = updateList(songs);

function updateList(songs) {
  songsContainer.innerHTML = ``;
  songs.map((song, index) => {
    songsContainer.innerHTML += `
    <div class="song ms-3 mb-4 d-flex justify-content-between" onclick="updateSongsFromList(${song.id})">
            <div>
              <h6>${song.songUrl}</h6>
              <span class="artist">${song.artist}</span>
            </div>
            <a href="./Audious/${song.songUrl}.mp3" download="${song.songUrl}.mp3">
            <i
            class="fa-solid mt-3 fa-download ms-5 pointer"
            style="color: #fe7d48"
          ></i>
          </a>
          </div>`;
  });
}
function updateSongsFromList(i) {
  toggleSidebar();
  index = i;
  updateAudioPlayer();
}

function filterSongs(e) {
  const searchedSongs = songs.filter((song) =>
    song.songUrl.toLowerCase().startsWith(e.target.value.toLowerCase())
  );
  if(searchedSongs.length>0)
  updateList(searchedSongs);
else songsContainer.innerHTML=`<h5 style="color:#fe7d48">No Song Found</h5>`
  console.log(searchedSongs);
}
