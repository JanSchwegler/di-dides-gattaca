// class - popup window
class PopupWindow {
    constructor(windowElement, iconElement) {
        this.windowElement = windowElement;
        this.iconElement = iconElement;
        this.isDragging = false;
        this.isResizing = false;
        this.startX = 0;
        this.startY = 0;
        this.initialX = 0;
        this.initialY = 0;
        this.initialWidth = 0;
        this.initialHeight = 0;
        
        this.init();
        this.onMouseUp();
    }

    init() {
        this.windowElement.querySelector('.close').addEventListener('click', () => this.closeWindow());
        this.windowElement.querySelector('.header').addEventListener('mousedown', (e) => this.startDrag(e));
        this.windowElement.addEventListener('mousedown', () => this.focusWindow());
        if (this.iconElement) {
            this.iconElement.addEventListener('click', () => this.openWindow());
        }
    }

    startDrag(e) {
        if (e.target === this.windowElement.querySelector('.close')) return;
        if (e.target !== this.windowElement.querySelector('.header')) return;

        this.isDragging = true;
        this.startX = e.clientX - this.windowElement.offsetLeft;
        this.startY = e.clientY - this.windowElement.offsetTop;

        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);
    }

    onMouseMove = (e) => {
        if (!this.isDragging) return;

        let x = e.clientX - this.startX;
        let y = e.clientY - this.startY;

        const maxX = document.body.clientWidth - this.windowElement.offsetWidth;
        const maxY = document.body.clientHeight - this.windowElement.offsetHeight;

        if (x < 0) x = 0;
        if (x > maxX) x = maxX;
        if (y < 0) y = 0;
        if (y > maxY) y = maxY;

        this.windowElement.style.left = `${x}px`;
        this.windowElement.style.top = `${y}px`;
    }

    onMouseUp = () => {
        this.isDragging = false;
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);
        // set max height and width
        const maxWidth = document.body.clientWidth - this.windowElement.offsetLeft;
        const maxHeight = document.body.clientHeight - this.windowElement.offsetTop;
        this.windowElement.style.maxWidth = `${maxWidth}px`;
        this.windowElement.style.maxHeight = `${maxHeight}px`;
    }

    closeWindow() {
        this.windowElement.classList.remove('show');
        setTimeout(() => {
            this.windowElement.style.display = 'none';
        }, 200);
    }

    openWindow() {
        if (this.windowElement.style.display === 'block') {
            this.focusWindow();
            return;
        }
        
        this.windowElement.style.display = 'block';
        this.windowElement.style.pointerEvents = 'inherit';
        setTimeout(() => {
            this.windowElement.classList.add('show');
        }, 10);
        this.focusWindow();
    }

    focusWindow() {
        document.querySelectorAll('.window').forEach(window => window.classList.remove('active'));
        this.windowElement.classList.add('active');
    }
}

// variables
// variables - sizing / positioning
let screenWidth = document.documentElement.clientWidth || window.innerWidth;
let screenHeight = document.documentElement.clientHeight || window.innerHeight;
let scrollPos = window.scrollY || window.pageYOffset;
let mouseX;
let mouseY;

// variables - global
let publicIp;
let startTime = new Date();
let chapterProgress = [
    { user: false }, // user login
    false, // chapter 1
    true, // chapter 2
    false, // chapter 3
];
let cpuUsage = 50;
let memoryUsage = 25;
let geoLocationApi = false;

// variables - elements
let terminalEmptyHtml;
let bgCanvas;
let bgCanvasCtx;
let cdMouse;
let cdTime
let cdIp;
let cdSystemInfo;
let cdUptime;
let cdCpu;
let cdMemory;
let cdStorage;





// on load
document.addEventListener('DOMContentLoaded', function () {
    // get elements
    terminalEmptyHtml = document.getElementById('terminal').innerHTML;
    cdMouse = document.getElementById('cd-mouse');
    cdTime = document.getElementById('cd-time');
    cdIp = document.getElementById('cd-ip');
    bgCanvas = document.getElementById('bgNoise');
    bgCanvasCtx = bgCanvas.getContext('2d');
    cdSystemInfo = document.querySelector('#systemInfo');
    cdUptime = cdSystemInfo.querySelector('#systemInfoUptime');
    cdCpu = cdSystemInfo.querySelector('#systemInfoCpu');
    cdMemory = cdSystemInfo.querySelector('#systemInfoMemory');
    cdStorage = cdSystemInfo.querySelector('#systemInfoStorage');





    // on resize
    window.addEventListener("resize", function() {
        // update screen width and height
        screenWidth = document.documentElement.clientWidth || window.innerWidth;
        screenHeight = document.documentElement.clientHeight || window.innerHeight;

        // function calls
        resizeCanvas();
        movePopupWindows();
    });





    // on scroll
    window.addEventListener("scroll", function() {
        // update scroll position
        scrollPos = window.scrollY || window.pageYOffset;

        // function calls

    });





    // on mouse move
    window.addEventListener("mousemove", function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // update corderdata
        cdMouse.innerHTML = "x: " + mouseX + " | y: " + mouseY;
    });
    



    
    // functions
    // functions - bg noise
    function resizeCanvas() {
        bgCanvas.width = window.innerWidth;
        bgCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    function generateNoise() {
        let width = bgCanvas.width;
        let height = bgCanvas.height;
        let imageData = bgCanvasCtx.createImageData(width, height);
        let buffer = new Uint32Array(imageData.data.buffer);
      
        for (let i = 0; i < buffer.length; i++) {
          let value = Math.random() * 255;
          let color = value > 127 ? 255 : 0; // Threshold to convert to black or white
          buffer[i] = (255 << 24) | // alpha
                      (color << 16) | // red
                      (color << 8) |  // green
                      (color);        // blue
        }
      
        bgCanvasCtx.putImageData(imageData, 0, 0);
    }
    function updateNoise() {
        generateNoise();
        setTimeout(updateNoise, 30);
    }
    updateNoise();



    // functions - current time
    function getCurrentTime() {
        let currentTime = new Date();
        let formattedTime = currentTime.toLocaleTimeString('en-US', {hour12: false});
        return formattedTime;
    }



    // functions - time difference
    function getTimeDifference() {
        let currentTime = new Date();
        let difference = currentTime.getTime() - startTime.getTime(); // Calculate the time difference in milliseconds
        let seconds = Math.floor(difference / 1000) % 60; // Get remaining seconds after dividing by 60
        let minutes = Math.floor(difference / (1000 * 60)) % 60; // Get remaining minutes after dividing by 60
        let hours = Math.floor(difference / (1000 * 60 * 60)); // Get remaining hours
        let time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        return time;
    }



    // functions - CPU usage
    function getCpuUsage() {
        cpuUsage = Math.max(4.1657, Math.min(98.2916, (cpuUsage + Math.random() * 15 - 7).toFixed(4)));
        return cpuUsage;
    }



    // functions - memory usage
    function getMemoryUsage() {
        memoryUsage = Math.max(8.1654, Math.min(83.9513, (memoryUsage + Math.random() * 6 - 3).toFixed(4)));
        return memoryUsage;
    }

    

    // functions - cd time
    async function updateTime() {
        cdTime.textContent = getCurrentTime();
    }
    updateTime();
    setInterval(updateTime, 1000);



    // functions - geo location
    function getGeolocationDetails() {
        return getGeolocation()
            .then(position => {
                const { latitude, longitude } = position.coords;
                return getLocationDetails(latitude, longitude);
            })
            .catch(handleError);
    }
    function getGeolocation() {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            } else {
                reject();
            }
        });
    }
    function getLocationDetails(latitude, longitude) {
        return new Promise((resolve, reject) => {
            if (!geoLocationApi) {
                let country = 'Schweiz';
                let city = 'Risch-Rotkreuz';
                resolve({ latitude, longitude, country, city });
            }

            // OpenCage Data API
            const apiKey = 'c0ffd54e3851460797b4653b24917346';
            const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;
    
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.results && data.results.length > 0) {
                        const location = data.results[0];
                        const country = location.components.country;
                        const city = location.components.city || location.components.town || location.components.village;
    
                        resolve({ latitude, longitude, country, city });
                    } else {
                        reject();
                    }
                })
                .catch(() => reject());
        });
    }
    function handleError() {
        console.error('An error occurred');
    }
    // get geolocation and display in window
    getGeolocationDetails().then(data => {
        let coordinates = document.createElement('p');
        let country = document.createElement('p');
        let city = document.createElement('p');

        coordinates.textContent = `Coordinates: ${data.latitude} | ${data.longitude}`;
        country.textContent = `Country: ${data.country}`;
        city.textContent = `City: ${data.city}`;

        document.querySelector('#window-geolocation .content').appendChild(coordinates);
        document.querySelector('#window-geolocation .content').appendChild(country);
        document.querySelector('#window-geolocation .content').appendChild(city);

        windows['window-geolocation'].openWindow();
    }).catch(handleError);



    // functions - public ip
    async function fetchPublicIp() {
        if (!publicIp) {
            try {
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                publicIp = data.ip;
                cdIp.innerHTML = publicIp;
            } catch (error) {
                publicIp = "147.88.201.117";
            }
        }
    }
    fetchPublicIp();



    // functions - terminal new line
    let lineHeight = 0;
    function scrollOneLineDown() {
        if (lineHeight === 0) {
            let cursorElement = document.querySelector('#terminal .ti-cursor');
            if (cursorElement) {
                lineHeight = cursorElement.offsetHeight;
            }
        }
        document.getElementById('terminal').scrollTop += lineHeight;
    }



    // functions - terminal text element
    function createTextElement(chapter) {
        let textElement = document.createElement('p');
        textElement.className = chapter;
        document.querySelector('#terminal-content').appendChild(textElement);

        return textElement;
    }



    // functions - terminal input
    function createInputElement(chapter) {
        return new Promise((resolve) => {
            // create input element
            let inputElement = document.createElement('p');
            inputElement.className = 'input';
    
            let spanBlue = document.createElement('span');
            spanBlue.className = 'color-blue';
            spanBlue.innerHTML = '>&nbsp;';
    
            let spanInputText = document.createElement('span');
            spanInputText.className = 'input-text';
            spanInputText.setAttribute('contenteditable', 'true');
    
            inputElement.append(spanBlue, spanInputText);
            scrollOneLineDown();
    
            // append to chapter div
            let inputChapter = document.querySelector('#terminal-content div.' + chapter);
            if (inputChapter) {
                inputChapter.appendChild(inputElement);
            } else {
                inputChapter = document.createElement('div');
                inputChapter.className = chapter;
                document.querySelector('#terminal-content').appendChild(inputChapter);
                inputChapter.appendChild(inputElement);
            }
    
            // set focus
            spanInputText.focus();
    
            // event listener
            spanInputText.addEventListener('keydown', function handler(event) {
                if (event.key === "Enter") {
                    event.preventDefault();
                    let inputText = spanInputText.textContent;
                    if (inputText) {
                        spanInputText.removeAttribute('contenteditable');
                        spanInputText.removeEventListener('keydown', handler);
                        resolve(inputText);
                    }
                }
            });
        });
    }



    // functions - terminal cursor
    function hideCursor(chapter) {
        if (chapter) {
            let cursor = document.querySelector('#terminal-content p.' + chapter + ' .ti-cursor');
            if (cursor) {
                cursor.style.display = 'none';
            }
        }
    }
    
    

    // terminal storyline
    /*
    details:
    - Library: TypeIt (https://typeitjs.com/)
    - Characters per line: 46

    - Text chapter building:
        - chapter var
        - hide curser?
        - new TypeIt instance

    - chapers:
        - chapter 1: booting up
        - chapter 2: user information
        - chapter 3: user input
        - chapter 4: example
    */
    // chapter 1 - booting up
    let chapter1;
    function handleChapter1() {
        chapter1 = new TypeIt(createTextElement('chapter1'), {
            afterComplete: () => {
                chapterProgress[1] = true;
                main();
            },
            cursorChar: "_",
            waitUntilVisible: true,
            speed: 80
        })
        .type('GTCA OS').break().exec(() => scrollOneLineDown()).pause(500)
        .type('Bioinformatics GeneAccess BIOS <span class="color-yellow">v24.5.17</span>').break().exec(() => scrollOneLineDown()).pause(200)
        .type('<span class="color-green">Initializing system...</span>').break().exec(() => scrollOneLineDown()).pause(2000)
        .break().exec(() => scrollOneLineDown())
        .break().exec(() => scrollOneLineDown()).options({ speed: 40 })
        .type('Memory: <span class="color-yellow">256</span>GB DDR<span class="color-yellow">4</span>').break().exec(() => scrollOneLineDown()).pause(500)
        .type('Storage: <span class="color-yellow">5</span>TB NVMe SSD').break().exec(() => scrollOneLineDown()).pause(2000)
        .go();
    }
    // chapter 2 - user information
    let chapter2;
    function handleChapter2() {
        fetchPublicIp().then(() => {
            hideCursor('chapter1');

            chapter2 = new TypeIt(createTextElement('chapter2'), {
                afterComplete: () => {
                    chapterProgress[2] = true;
                    main();
                },
                cursorChar: "_",
                waitUntilVisible: true,
                speed: 80
            })
            .break().exec(() => scrollOneLineDown())
            .type('Startup Time: <span class="color-yellow">' + getTimeDifference() + '</span>').break().exec(() => scrollOneLineDown()).pause(200)
            .type('Network: <span class="color-green">connected</span>').break().exec(() => scrollOneLineDown()).pause(200)
            .type('IP: <span class="color-yellow">' + publicIp + '</span>').break().exec(() => scrollOneLineDown()).pause(1000)
            .break().exec(() => scrollOneLineDown())
            .type('<span class="color-green">Checking </span>hardware integrity...').break().exec(() => scrollOneLineDown()).pause(3000)
            .type('<span class="color-green">Loading </span>kernal modules...').break().exec(() => scrollOneLineDown()).pause(5000)
            .type('<span class="color-green">Verifying </span>network connection...').break().exec(() => scrollOneLineDown()).pause(500)
            .type('<span class="color-green">Starting </span>user interface...').break().exec(() => scrollOneLineDown()).pause(2000)
            .break().exec(() => scrollOneLineDown())
            .type('<span class="color-green">Loaded </span>mouseUp ........................... <span class="color-yellow">53%</span>').break().exec(() => scrollOneLineDown()).pause(200)
            .type('<span class="color-green">Loaded </span>keyboardKeydown1 .................. <span class="color-yellow">58%</span>').break().exec(() => scrollOneLineDown()).pause(200)
            .type('<span class="color-green">Loaded </span>keyboardKeydown2 .................. <span class="color-yellow">63%</span>').break().exec(() => scrollOneLineDown()).pause(200)
            .type('<span class="color-green">Loaded </span>keyboardKeydown3 .................. <span class="color-yellow">68%</span>').break().exec(() => scrollOneLineDown()).pause(200)
            .type('<span class="color-green">Loaded </span>keyboardKeydown4 .................. <span class="color-yellow">74%</span>').break().exec(() => scrollOneLineDown()).pause(200)
            .type('<span class="color-green">Loaded </span>keyboardKeydown5 .................. <span class="color-yellow">79%</span>').break().exec(() => scrollOneLineDown()).pause(200)
            .type('<span class="color-green">Loaded </span>keyboardKeydown ................... <span class="color-yellow">84%</span>').break().exec(() => scrollOneLineDown()).pause(200)
            .type('<span class="color-green">Loaded </span>startup ........................... <span class="color-yellow">89%</span>').break().exec(() => scrollOneLineDown()).pause(1000)
            .break().exec(() => scrollOneLineDown())
            .break().exec(() => scrollOneLineDown())
            .type('<span class="color-blue">PLEASE ENTER YOUR INFORMATION:</span>').break().exec(() => scrollOneLineDown()).pause(100)
            .break().exec(() => scrollOneLineDown())
            .type('First Name:<span class="color-blue">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;>&nbsp;</span>').pause(1000).options({ speed: 200 }).type('Vincent Anton').break().exec(() => scrollOneLineDown()).pause(100).options({ speed: 50 }) //17 characters in fist string
            .type('Last Name:<span class="color-blue">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;>&nbsp;</span>').pause(1000).options({ speed: 200 }).type('Freeman').break().exec(() => scrollOneLineDown()).pause(100).options({ speed: 50 }) //17 characters in fist string
            .type('Date of Birth:<span class="color-blue">&nbsp;&nbsp;>&nbsp;</span>').pause(1000).options({ speed: 200 }).type('2\\14\\1967').break().exec(() => scrollOneLineDown()).pause(100).options({ speed: 50 }) //17 characters in fist string
            .break().exec(() => scrollOneLineDown())
            .break().exec(() => scrollOneLineDown())
            .type('<span class="color-blue">PLEASE NAME A NUMBER FROM 0 TO 1024:</span>').break().exec(() => scrollOneLineDown()).pause(100)
            .break().exec(() => scrollOneLineDown())
            .type('<span class="color-blue">>&nbsp;</span>').pause(1000).options({ speed: 200 }).type('<span class="color-yellow">121</span>').break().exec(() => scrollOneLineDown()).pause(1000).options({ speed: 50 })
            .break().exec(() => scrollOneLineDown() + hideCursor("chapter2"))
            .go();
        });
    }
    // chapter 4 - example
    let chapter4;
    function handleChapter4() {
        hideCursor('chapter3');

        chapter4 = new TypeIt(createTextElement('chapter4'), {
            afterComplete: () => {
                chapter4Done = true;
                main();
            },
            cursorChar: "_",
            waitUntilVisible: true,
            speed: 80
        })
        .break().exec(() => scrollOneLineDown())
        .type('Network: <span class="color-green">connected</span>').break().exec(() => scrollOneLineDown()).pause(200)
    }



    // functions - main
    function main() {
        if (!chapterProgress['user']) {

            if (!chapterProgress[1]) { // chapter 1

                handleChapter1();

            } else if (!chapterProgress[2]) { // chapter 2

                handleChapter2();

            } else if (!chapterProgress[3]) { // chapter 3

                createInputElement("chapter3").then(input => {
                    let inputName = input;
                    chapterProgress[3] = true;
                    main();
                });

            } else { // reset

                resetContent(chapters = [chapter1, chapter2]);

            }
        } else {
            // show icons
            // show systeminfo
            // hide console
        }
    }
    main();
    function resetContent(chapters) {
        // reset progress
        for (let i = 0; i < chapterProgress.length; i++) {
            chapterProgress[i] = false;
        }

        // reset typeIt instances
        chapters.forEach(chapter => {
            if (chapter) {
                chapter.reset();
            }
        });

        // reset terminal content
        document.getElementById('terminal').innerHTML = terminalEmptyHtml;

        setTimeout(() => {
            main();
        }, 1000);
    }



    // functions - popup windows
    let windows = [];

    document.querySelectorAll('.window').forEach((window, index) => {
        // create window instances
        const windowElement = window;
        const iconElement = document.querySelector(`.windowIcon[data-window="${window.id}"]`);
        const instance = new PopupWindow(windowElement, iconElement);
        windows[window.id] = instance;

        // create resize observer
        const resizeObserver = new ResizeObserver(entries => {
            entries.forEach(entry => {
                window.querySelector('.footer p.windowSize').textContent = `${entry.contentRect.width} x ${entry.contentRect.height}`;
            });
        });
        resizeObserver.observe(window);
    });
    /* example open and close windows
    console.log(windows);
    windows['window-image'].openWindow();
    setTimeout(() => {
        windows['window-image'].closeWindow();
    }, 5000);
    */

      



    function movePopupWindows() {
        document.querySelectorAll('.window').forEach(window => {
            let left = window.offsetLeft;
            let top = window.offsetTop;
            const maxWidth = document.body.clientWidth - window.offsetWidth;
            const maxHeight = document.body.clientHeight - window.offsetHeight;

            if (maxWidth < 0) {
                window.style.width = `${document.body.clientWidth}px`;
                left = 0;
            }
            if (maxHeight < 0) {
                window.style.height = `${document.body.clientHeight}px`;
                top = 0;
            }

            if (left > maxWidth) {
                if (maxWidth < 0) {
                    left = 0;
                } else {
                    left = maxWidth;
                }
            }
            if (top > maxHeight) {
                if (maxHeight < 0) {
                    top = 0;
                } else {
                    top = maxHeight;
                }
            }

            window.style.left = `${left}px`;
            window.style.top = `${top}px`;
        });
    }
    movePopupWindows();



    // functions - dashboard system info
    function initSystemInfo() {
        // user
        cdSystemInfo.querySelector('#systemInfoUser').textContent = "User: " + "Vincent Anton Freeman";
        // startup time
        cdSystemInfo.querySelector('#systemInfoStartup').textContent = "Startup: " + startTime.toLocaleTimeString('en-US', {hour12: false});
        // storage
        let storagePercentage = (Math.random() * (36.6481 - 27.9426) + 27.9426).toFixed(1);
        let storageTb = (5 / 100 * storagePercentage).toFixed(1);
        cdStorage.textContent = "Storage: " + storagePercentage + " % | " + storageTb + " TB";
    }
    initSystemInfo();



    // functions - dashboard system info background
    async function updateSystemInfo() {
        // uptime
        let uptime = getTimeDifference();
        // cpu
        let cpu = getCpuUsage();
        // memory
        let memory = getMemoryUsage();

        cdUptime.textContent = `Uptime: ${uptime}`;
        cdCpu.textContent = `CPU: ${cpu}%`;
        cdMemory.textContent = `Memory: ${memory}%`;
    }
    updateSystemInfo();
    setInterval(updateSystemInfo, 1000);
});