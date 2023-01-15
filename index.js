const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playlist = $('.playlist')
const audio = $('#audio')
const title = $('header h2')
const cdThumb = $('.cd-thumb')
const toglePlayBtn = $('.btn-toggle-play')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const timeLeft = $('.time.left')
const timeRight = $('.time.right')
const cd = $('.cd')

const app = {
    curIndex: 0,
    isPlaying: false,
    isRepeat: false,
    isRandom: false,
    curL: [],
    songs: [
        {
            name: "Golden Hour",
            singer: "JVKE",
            img: "./asset/img/4.webp",
            src: "./asset/mp3/4.mp3"
        },
        {
            name: "STAY",
            singer: "The Kid LAROI, Justin Bieber",
            img: "./asset/img/2.webp",
            src: "./asset/mp3/2.mp3"
        },
        {
            name: "Double Take",
            singer: "dhruv",
            img: "./asset/img/3.webp",
            src: "./asset/mp3/3.mp3"
        },
        {
            name: "Made You Look",
            singer: "Meghan Trainor",
            img: "./asset/img/1.webp",
            src: "./asset/mp3/1.mp3"
        },
        {
            name: "Radio",
            singer: "Sigala, MNEK",
            img: "./asset/img/5.webp",
            src: "./asset/mp3/5.mp3"
        },
        {
            name: "death bed (coffee for your head)",
            singer: "Powfu, beabadoobee",
            img: "./asset/img/6.webp",
            src: "./asset/mp3/6.mp3"
        },
        {
            name: "Kiss Me More",
            singer: "Doja Cat, SZA",
            img: "./asset/img/7.webp",
            src: "./asset/mp3/7.mp3"
        },
        {
            name: "Sunroof",
            singer: "Nicky Youre, Dazy",
            img: "./asset/img/8.webp",
            src: "./asset/mp3/8.mp3"
        },
        {
            name: "Mood",
            singer: "24KGoldn, Iann Dior",
            img: "./asset/img/9.webp",
            src: "./asset/mp3/9.mp3"
        },
        {
            name: "Set Fire to the Rain",
            singer: "Adele",
            img: "./asset/img/10.webp",
            src: "./asset/mp3/10.mp3"
        }

    ],
    scrollEventFunc: () => {
        let curCdWidth = 200 - window.scrollY
        cd.style.width = (curCdWidth > 0 ? curCdWidth : 0) + 'px'
        cd.style.opacity = curCdWidth / 200
        playlist.style.marginTop = $('.dashboard').offsetHeight + 'px'
    },

    isInViewport: (el) => {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= $('.dashboard').offsetHeight &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)

        );
    },

    render: function () {
        htmls = this.songs.map((song, index) => `
            <div class="song index-${index}" onclick = 'app.clickOnSong(${index})'>
                <div class="thumb"
                    style="background-image: url('${song.img}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <a class="option" href="${song.src}" download = "${song.name}">
                    <i class="fas fa-download"></i>
                </a>
            </div>
        `).join('')
        playlist.innerHTML = htmls
    },

    loadSong: (index) => {
        window.onscroll = () => { }
        app.isPlaying = true
        $('.player').classList.add('playing')
        app.curIndex = index
        app.curL[app.curIndex] = true;
        audio['src'] = app.songs[index]['src']
        title.innerHTML = app.songs[index]['name']
        cdThumb.style.backgroundImage = `url('${app.songs[index]['img']}')`
        if (!app.isInViewport($(`.song.index-${index}`))) {
            $(`.song.index-${index}`).scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
        }
        playlist.style.marginTop = $('.dashboard').offsetHeight + 'px'

        audio.play()
        setTimeout(function () {
            window.onscroll = app.scrollEventFunc
        }, 500)
    },
    clickOnSong: (index) => {
        if (window.event.target.closest('.option')){

        }
        else {
            if (!window.event.target.closest('.active') || !app.isPlaying)
                app.loadSong(index)
        }
    },

    randomSongIndex: () => {
        let rand
        if (!app.curL.includes(false)) app.curL.fill(false)
        do {
            rand = Math.round(Math.random() * (app.songs.length - 1))
        } while (rand === app.curIndex || app.curL[rand])
        return rand
    },

    handleEvent: () => {
        toglePlayBtn.onclick = () => {
            app.isPlaying = !app.isPlaying
            if (app.isPlaying) {
                $('.player').classList.add('playing')
                audio.play()
                app.curL[app.curIndex] = true;
            } else {
                $('.player.playing').classList.remove('playing')
                audio.pause()
            }
        }

        function audioEventUpdate() {
            let timeDrutionText
                if (!audio.duration) {
                    progress.value = 0
                    timeDrutionText = 0
                }
                else {
                    progress.value = audio.currentTime / audio.duration * 100
                    timeDrutionText = audio.duration * 1000
                }
                const barFill = $('.bar .fill')
                barFill.style.width = progress.value + '%'
                timeLeft.innerText = new Date(audio.currentTime*1000).toISOString().substring(14, 19)
                if (timeDrutionText)
                    timeRight.innerText = new Date(timeDrutionText).toISOString().substring(14, 19)
        }

        audio.ontimeupdate = audioEventUpdate

        progress.onchange = () => {
            if (!app.isPlaying) {
                toglePlayBtn.click()
            }
            audio.currentTime = progress.value * audio.duration / 100
        }

        progress.onmousedown = () => {
            audio.ontimeupdate = () => { }
        }
        progress.ontouchstart = () => {
            audio.ontimeupdate = () => { }
        }

        progress.onmouseup = () => {
            audio.ontimeupdate = audioEventUpdate
        }
        progress.ontouchend = () => {
            audio.ontimeupdate = audioEventUpdate
        }


        audio.onended = () => {
            if (app.isRepeat) {
                audio.play()
            } else if (app.isRandom) {
                app.curIndex = app.randomSongIndex()
                app.loadSong(app.curIndex)
            } else {
                nextBtn.click()
            }

        }


        repeatBtn.onclick = () => {
            app.isRepeat = !app.isRepeat
            repeatBtn.classList.toggle('active', app.isRepeat)
            if (app.isRandom && app.isRepeat) randomBtn.click()
        }

        randomBtn.onclick = () => {
            app.isRandom = !app.isRandom
            randomBtn.classList.toggle('active', app.isRandom)
            if (app.isRandom && app.isRepeat) repeatBtn.click()
        }

        nextBtn.onclick = () => {
            if (app.isRandom) {
                app.curIndex = app.randomSongIndex()
            } else {
                app.curIndex++;
            }
            if (app.curIndex >= app.songs.length) app.curIndex = 0;
            app.loadSong(app.curIndex)
        }

        prevBtn.onclick = () => {
            if (app.isRandom) {
                app.curIndex = app.randomSongIndex()
            } else {
                app.curIndex--;
            }
            if (app.curIndex < 0) app.curIndex = app.songs.length - 1;
            app.loadSong(app.curIndex)
        }

        window.addEventListener('keydown', function (e) {
            if (e.code === 'Space') {
                e.preventDefault();
                toglePlayBtn.click()
            }
        })

        window.onscroll = app.scrollEventFunc

        const cdAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 15000,
            iterations: Infinity
        })
        cdAnimate.pause()

        audio.onplay = () => {
            cdAnimate.play()
            if ($('.song.active')) $('.song.active').classList.remove('active')
            $(`.song.index-${app.curIndex}`).classList.add('active')
        }

        audio.onpause = () => {
            cdAnimate.pause()
        }

    },

    firstLoad: () => {
        audio['src'] = app.songs[0]['src']
        title.innerHTML = app.songs[0]['name']
        cdThumb.style.backgroundImage = `url('${app.songs[0]['img']}')`
        $('.song.index-0').classList.add('active')
        app.curL.length = app.songs.length
        app.curL.fill(false)
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    },

    start: function () {

        this.handleEvent()

        this.render()

        this.firstLoad()
    }
}
app.start()