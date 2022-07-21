var header = document.getElementById('header');
var mobileMenu = document.getElementById('mobile-menu');
var headerHeight = header.clientHeight;

//  mobile menu
mobileMenu.onclick = function () {
    var isClose = header.clientHeight === headerHeight;
    if (isClose) {
        header.style.height = 'auto';
    } else {
        header.style.height = null;
    }
}

// Tữ đóng khi chọn menu
var menuItems = document.querySelectorAll('#nav li a[href*="#"]');
console.log(menuItems); 

for (var i = 0; i < menuItems.length; i++) {
    var menuItem = menuItems[i];

    menuItem.onclick = function (event) {
        var isMenuParent = this.nextElementSibling && this.nextElementSibling.classList.contains('subnav');
        if (isMenuParent) {
            event.preventDefault();
        } else {
            header.style.height = null;
        }
    }
}

// slider
let slideIndex = 1;
showSlides(slideIndex);



// Thumbnail image controls
function currentSlide(n) {
    let slider = document.getElementById('slider');
    slider.className=`slider${n}`
    showSlides(slideIndex = n);
}

 
function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active";
  };


//  Album player

    const $ = document.querySelector.bind(document)
    const $$ = document.querySelectorAll.bind(document) 


    const PLAYER_STORAGE_KEY = 'PLAYER'
    const player = $('.player')
    const cd = $('.cd')
    const heading = $('header h2')
    const cdThumb = $('.cd-thumb')
    const audio = $('#audio')
    const playBtn = $('.btn-toggle-play')
    const progress = $('#progress')
    const prevBtn = $('.btn-prev')
    const nextBtn = $('.btn-next')
    const randomBtn = $('.btn-random')
    const repeatBtn = $('.btn-repeat')
    const playlist =$('.playlist')

    const app = {
        currentIndex: 0,
        isPlaying: false,
        isRandom: false,
        isRepeat: false,
        config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
        songs: [
            {
                name: "free",
                singer: "mama",
                path: "./assets/CD/Audio1.mp3",
                image: "./assets/img/image1.png",
            },
            {
                name: "susus",
                singer: "lette",
                path: "./assets/CD/Audio1.mp3",
                image: "./assets/img/image1.png",
            },
            {
                name: "max",
                singer: "lalaa",
                path: "./assets/CD/Audio1.mp3",
                image: "./assets/img/image1.png",
            },
            {
                name: "foot",
                singer: "mamami",
                path: "./assets/CD/Audio1.mp3",
                image: "./assets/img/image1.png",
            },
            {
                name: "freezy",
                singer: "lyly",
                path: "./assets/CD/Audio1.mp3",
                image: "./assets/img/image1.png",
            },
        ],
        setConfig: function (key, value) {
            this.config[key] = value;
            localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
        },
        render: function() {
            const htmls = app.songs.map((song,index) => 
                `<div class="song ${index === this.currentIndex ? 'active' : ''}" data-index= "${index}">
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                 </div>
                `
            ) 
            $('.playlist').innerHTML = htmls.join('')
        },
        defineProperties: function() {
            Object.defineProperty(this,'currentSong', {
                get: function(){
                    return this.songs[this.currentIndex]
                }
            })
        },
        handleEvents: function () {
            const _this = this
            const cdWidth = cd.offsetWidth

            //  Xử lý CD quay 
            const cdThumbAnimate = cdThumb.animate([
                {transform: 'rotate(360deg)'}
            ], {
                duration: 10000, // 10s
                iterations: Infinity
            })

            cdThumbAnimate.pause()

            // Xử lý phóng to thu nhỏ CD
            // document.onscroll = function () {
            //     const scrollTop = window.scrollY || document.documentElement.scrollTop
            //     const newCdWidth = cdWidth - scrollTop
            //     cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            //     cd.style.opacity = newCdWidth/cdWidth
            // }

            // Xử lý khi Click play
            playBtn.onclick = function () {
                if (_this.isPlaying) {
                    audio.pause()
                } else {
                    audio.play()
                }
                
            }

            // Khi song được play
            audio.onplay = function () {
                _this.isPlaying = true
                player.classList.add('playing')
                cdThumbAnimate.play()
            }

            //  Khi song bị pause
            audio.onpause = function () {
                _this.isPlaying = false
                player.classList.remove('playing')
                cdThumbAnimate.pause()
            }

            //  Khi tiến độ bài hát thay đổi
            audio.ontimeupdate = function () {
                if(audio.duration) {
                    const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                    progress.value = progressPercent

                }
            }

            //  Xử lý khi tua song
            progress.onchange = function (e) {
                const seekTime = audio.duration / 100 * e.target.value
                audio.currentTime = seekTime
            }

            //  Khi next song
            nextBtn.onclick = function () {
              if (_this.isRandom) {
                _this.playRandomSong()
              } else {
                _this.nextSong()
              }
                audio.play()
                _this.render()
                _this.scrollToActiveSong()
            }

            //  khi prev song
            prevBtn.onclick = function () {
              if (_this.isRandom) {
                _this.playRandomSong()
              } else {
                _this.prevSong()
              }
                audio.play()
                _this.render()
                _this.scrollToActiveSong()
            }

            //  khi random
            randomBtn.onclick = function (e) {
                _this.isRandom = !_this.isRandom
                _this.setConfig('isRandom',_this.isRandom)
                randomBtn.classList.toggle('active',_this.isRandom)

            }

            //  Xử lý next song khi audio ended
            audio.onended = function () {
                if (_this.isRepeat) {
                  audio.play()
                } else {
                nextBtn.click()
                }
                _this.render()
                _this.scrollToActiveSong()
            }     

            //  xử lý khi repeat song
            repeatBtn.onclick = function (e) {
                _this.isRepeat = !_this.isRepeat
                _this.setConfig('isRepeat',_this.isRepeat)
                repeatBtn.classList.toggle('active',_this.isRepeat)
            }

            //  Lắng nghe click playlist
            playlist.onclick = function (e) {
               const songNode = e.target.closest('.song:not(.active)')
                if (songNode || e.target.closest('.option')) {
                  // xử lý khi click vào song
                  if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                  }

                  // xử lý khi click vào song option
                  if (e.target.closest('.option')) {

                  }
                    
                } 
            }
        },

        scrollToActiveSong: function () {
            setTimeout(() => {
              $(".song.active").scrollIntoView({
                behavior:"smooth",
                block:'nearest'
              })
            }, 300)
        },

        loadCurrentSong: function() {
            heading.textContent = this.currentSong.name
            cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
            audio.src = this.currentSong.path
        },

        nextSong: function () {
            this.currentIndex++
            if (this.currentIndex >= this.songs.length) {
                 this.currentIndex = 0
             }
             console.log(this.currentIndex, this.songs.length)
            this.loadCurrentSong()
        },

        prevSong: function () {
            if (this.currentIndex == 0) {
                this.currentIndex = this.songs.length
            } 
            this.currentIndex--
            this.loadCurrentSong()
        },

        playRandomSong: function () {
            let newIndex
            do {
                  newIndex = Math.floor(Math.random() * this.songs.length)
            } while (newIndex === this.currentIndex) 
            this.currentIndex = newIndex
            this.loadCurrentSong()
        },
       
        start: function() {
            //định nghĩa các thuộc tính cho object
            this.defineProperties()

            //Lắng nghe và xử lý các sự kiện
            this.handleEvents()

            // tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
            this.loadCurrentSong()

            // render playlist
            this.render()

        }    
    }

    app.start()
