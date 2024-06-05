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
        this.windowElement.querySelector('.close')?.addEventListener('click', () => this.closeWindow());
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
let started = false;
let intro = false;
let chapterProgress = [
    false, // user login
    true, // chapter 1 - booting up
    true, // chapter 2 - connection
    true, // chapter 3 - analysing geo location
    true, // chapter 4 - analysing files
    true, // chapter 5 - analysing browser history
    true, // chapter 6 - analysing messages
    false, // chapter 7 - get first name
    false, // chapter 8 - get last name
    false,  // chapter 9 - get date of birth
    false, // chapter 10 - user data
    false, // chapter 11 - analysing user data
];
let cpuUsage = 50;
let memoryUsage = 25;
let geoLocationApi = false;

// variables - elements
let terminalEmptyHtml;
let bgCanvasGrid;
let bgCanvasGridCtx;
let bgCanvas;
let bgCanvasCtx;
let cd = [];
let cdMouse;
let cdTime
let cdIp;
let cdSystemInfo;
let cdUptime;
let cdCpu;
let cdMemory;
let cdStorage;
let windowIcon;

// user inputs
let inputFirstName;
let inputLastName;
let inputDateOfBirth;





// on load
document.addEventListener('DOMContentLoaded', function () {
    // get elements
    terminalEmptyHtml = document.getElementById('terminal').innerHTML;
    cd = document.querySelectorAll('.cornerdata');
    cdMouse = document.getElementById('cd-mouse');
    cdTime = document.getElementById('cd-time');
    cdIp = document.getElementById('cd-ip');
    bgCanvasGrid = document.getElementById('bgGrid');
    bgCanvasGridCtx = bgCanvasGrid.getContext('2d');
    bgCanvas = document.getElementById('bgNoise');
    bgCanvasCtx = bgCanvas.getContext('2d');
    cdSystemInfo = document.querySelector('#systemInfo');
    cdUptime = cdSystemInfo.querySelector('#systemInfoUptime');
    cdCpu = cdSystemInfo.querySelector('#systemInfoCpu');
    cdMemory = cdSystemInfo.querySelector('#systemInfoMemory');
    cdStorage = cdSystemInfo.querySelector('#systemInfoStorage');
    windowIcon = document.querySelectorAll('.windowIcon');





    // on resize
    window.addEventListener("resize", function() {
        // update screen width and height
        screenWidth = document.documentElement.clientWidth || window.innerWidth;
        screenHeight = document.documentElement.clientHeight || window.innerHeight;

        // function calls
        resizeCanvas(bgCanvas);
        resizeCanvas(bgCanvasGrid);
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
    



    
    // on mouse click for start
    window.addEventListener("click", function() {
        if (!started) {
            started = true;
            main();
            this.window.removeEventListener('click', this);
        }
    });
        



    
    // functions
    // functions - bg grid
    function resizeCanvas(canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        bgCanvasDrawGrid();
    }
    function bgCanvasDrawGrid() {
        bgCanvasGrid.width = screenWidth;
        bgCanvasGrid.height = screenHeight;

        const gridSize = 30;
        const gridSizeX = bgCanvasGrid.width / Math.ceil(bgCanvasGrid.width / gridSize);
        const gridSizeY = bgCanvasGrid.height / Math.ceil(bgCanvasGrid.height / gridSize);

        for (let x = 0; x < screenWidth; x += gridSizeX) {
            bgCanvasGridCtx.moveTo(x, 0);
            bgCanvasGridCtx.lineTo(x, screenHeight);
        }
        for (let y = 0; y < screenHeight; y += gridSizeY) {
            bgCanvasGridCtx.moveTo(0, y);
            bgCanvasGridCtx.lineTo(screenWidth, y);
        }
        bgCanvasGridCtx.strokeStyle = "#f6f6f6";
        bgCanvasGridCtx.lineWidth = 0.5;
        bgCanvasGridCtx.stroke();
    }
    bgCanvasDrawGrid();



    // functions - bg noise
    resizeCanvas(bgCanvas);
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



    // functions - intro
    function handleIntro() {
        const video = document.getElementById('introContainer');
        video.autoplay = true;
        video.muted = true;
        video.playsInline = true;
        //video.currentTime = 119;
        video.play();

        video.addEventListener('ended', function() {
            video.removeEventListener('ended', this);
            bgCanvasGrid.style.opacity = '0.1';
            video.style.opacity = '0';
            intro = true;
            cd.forEach(cdElement => cdElement.style.display = 'block');
            setTimeout(() => {
                main();
            }, 1000);
        });
    }



    // functions - geo location
    function getGeolocationDetails() {
        return getGeolocation()
            .then(position => {
                const { latitude, longitude } = position.coords;
                let accuracy = position.coords.accuracy;
                let heading = position.coords.heading;
                let speed = position.coords.speed;
                return getLocationDetails(latitude, longitude, accuracy, heading, speed);
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
    function getLocationDetails(latitude, longitude, accuracy, heading, speed) {
        return new Promise((resolve, reject) => {
            if (!geoLocationApi) {
                let country = 'Schweiz';
                let city = 'Risch-Rotkreuz';
                resolve({ latitude, longitude, accuracy, heading, speed, country, city });
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
    
                        resolve({ latitude, longitude, accuracy, heading, speed, country, city });
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
    /*
    getGeolocationDetails().then(data => {
        const createParagraph = text => {
            const p = document.createElement('p');
            p.innerHTML = text;
            return p;
        };
        
        const content = document.querySelector('#window-geolocation .content');
        const dataText = [
            'Geolocation Permission Granted<br>Reading data...<br>Analysing data...<br><br>',
            `Coordinates: ${data.latitude} | ${data.longitude}`,
            `Country: ${data.country}`,
            `City: ${data.city}`,
            `Accuracy: ${data.accuracy}`,
            `Moving: ${data.moving ? 'Yes' : 'No'}`,
            `Speed: ${data.speed || 0} m/s`,
            `Direction: ${data.heading || '-'}`            
        ];
        
        dataText.forEach(text => content.appendChild(createParagraph(text)));

        windows['window-geolocation'].openWindow();
    }).catch(handleError);*/



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
                    let valide = checkInput(chapter, inputText);
                    console.log(valide);
                    if (inputText && valide) {
                        spanInputText.removeAttribute('contenteditable');
                        spanInputText.removeEventListener('keydown', handler);
                        resolve(inputText);
                    }
                }
            });
        });
    }



    // check terminal input
    function checkInput(chapter, inputText) {
        let valide = true;
        switch (chapter) {
            case 'chapter11_3':
                if (inputText != "453905202367") {
                    valide = false;
                }
                break;
        }
        return valide;
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
            speed: 20
        })
        .type('GTCA OS').break().exec(() => scrollOneLineDown()).pause(200)
        .type('Bioinformatics GeneAccess BIOS <span class="color-yellow">v24.5.17</span>').break().exec(() => scrollOneLineDown()).pause(200)
        .type('<span class="color-green">Initializing system...</span>').break().exec(() => scrollOneLineDown()).pause(1000)
        .break().exec(() => scrollOneLineDown())
        .break().exec(() => scrollOneLineDown())
        .type('Startup Time: <span class="color-yellow">' + getTimeDifference() + '</span>').break().exec(() => scrollOneLineDown()).pause(200)
        .type('Language: en-GB').break().exec(() => scrollOneLineDown()).pause(200)
        .type('Memory: <span class="color-yellow">256</span>GB DDR<span class="color-yellow">4</span>').break().exec(() => scrollOneLineDown()).pause(200)
        .type('Storage: <span class="color-yellow">5</span>TB NVMe SSD').break().exec(() => scrollOneLineDown()).pause(200)
        .type('Viewport Size: <span class="color-yellow">' + window.innerWidth + '</span> x <span class="color-yellow">' + window.innerHeight + '</span>').break().exec(() => scrollOneLineDown()).pause(200)
        .type('Pixel Ratio: <span class="color-yellow">' + window.devicePixelRatio + '</span>').break().exec(() => scrollOneLineDown()).pause(200)
        .type('Color Depth: <span class="color-yellow">' + window.screen.colorDepth + '</span>').break().exec(() => scrollOneLineDown()).pause(200)
        .type('Cookies Available: ' + navigator.cookieEnabled).break().exec(() => scrollOneLineDown()).pause(200)
        .type('Local Storage Available: ' + (typeof(Storage) !== "undefined")).break().exec(() => scrollOneLineDown()).pause(500)
        .go();
        /*

        Later:
        - connection type: 
        - downlink speed:
        */
    }
    // chapter 2 - connection
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
                speed: 20
            })
            .break().exec(() => scrollOneLineDown())
            .break().exec(() => scrollOneLineDown())
            .type('Network: <span class="color-green">connected</span>').break().exec(() => scrollOneLineDown()).pause(200)
            .type('Connection Type: <span class="color-yellow">' + navigator.connection.effectiveType + '</span>').break().exec(() => scrollOneLineDown()).pause(200)
            .type('Downlink Speed: <span class="color-yellow">' + navigator.connection.downlink + '</span>').break().exec(() => scrollOneLineDown()).pause(200)
            .type('IP: <span class="color-yellow">' + publicIp + '</span>').break().exec(() => scrollOneLineDown()).pause(500)
            .go();
        });
    }
    // chapter 3 - analysing geo location
    let chapter3;
    function handleChapter3_1() {
        hideCursor('chapter2');
        chapter3 = new TypeIt(createTextElement('chapter3'), {
            afterComplete: () => {
                handleChapter3_2();
            },
            cursorChar: "_",
            waitUntilVisible: true,
            speed: 20
        })
        .break().exec(() => scrollOneLineDown())
        .break().exec(() => scrollOneLineDown())
        .type('<span class="color-green">Analysing</span> location...').break().exec(() => scrollOneLineDown()).pause(200)
        .go();
    }
    function handleChapter3_2() {
        getGeolocationDetails().then(data => {
            const createParagraph = text => {
                const p = document.createElement('p');
                p.innerHTML = text;
                return p;
            };
            
            const content = document.querySelector('#window-geolocation .content');
            const dataText = [
                'Geolocation Permission Granted<br>Reading data...<br>Analysing data...<br><br>',
                `Coordinates: ${data.latitude} | ${data.longitude}`,
                `Country: ${data.country}`,
                `City: ${data.city}`,
                `Accuracy: ${data.accuracy}`,
                `Moving: ${data.moving ? 'Yes' : 'No'}`,
                `Speed: ${data.speed || 0} m/s`,
                `Direction: ${data.heading || '-'}`            
            ];
            
            dataText.forEach(text => content.appendChild(createParagraph(text)));

            windows['window-geolocation'].openWindow();
            chapterProgress[3] = true;
            main();
        }).catch(handleError);
    }
    // chapter 4 - analysing files
    let chapter4;
    function handleChapter4_1() {
        hideCursor('chapter3');
        chapter4 = new TypeIt(createTextElement('chapter4'), {
            afterComplete: () => {
                handleChapter4_2();
            },
            cursorChar: "_",
            waitUntilVisible: true,
            speed: 20
        })
        .type('<span class="color-green">Analysing</span> local files...').break().exec(() => scrollOneLineDown()).pause(200)
        .go();
    }
    function handleChapter4_2() {
        windows['window-analysingFiles'].openWindow();
        setTimeout(() => {
            windows['window-analysingFiles'].closeWindow();
        }, 10000);

        chapterProgress[4] = true;
        main();
    }
    // chapter 5 - analysing browser history
    let chapter5;
    function handleChapter5_1() {
        hideCursor('chapter4');
        chapter5 = new TypeIt(createTextElement('chapter5'), {
            afterComplete: () => {
                handleChapter5_2();
            },
            cursorChar: "_",
            waitUntilVisible: true,
            speed: 20
        })
        .type('<span class="color-green">Analysing</span> web browsing history...').break().exec(() => scrollOneLineDown()).pause(200)
        .go();
    }
    function handleChapter5_2() {
        windows['window-analysingBrowserHistory'].openWindow();
        setTimeout(() => {
            windows['window-analysingBrowserHistory'].closeWindow();
        }, 6000);

        chapterProgress[5] = true;
        main();
    }
    // chapter 6 - analysing messages
    let chapter6;
    function handleChapter6_1() {
        hideCursor('chapter5');
        chapter6 = new TypeIt(createTextElement('chapter6'), {
            afterComplete: () => {
                handleChapter6_2();
            },
            cursorChar: "_",
            waitUntilVisible: true,
            speed: 20
        })
        .type('<span class="color-green">Analysing</span> messages...').break().exec(() => scrollOneLineDown()).pause(200)
        .go();
    }
    function handleChapter6_2() {
        windows['window-analysingMessages'].openWindow();
        setTimeout(() => {
            windows['window-analysingMessages'].closeWindow();
        }, 8000);

        chapterProgress[6] = true;
        main();
    }
    // chapter 7 - get first name
    let chapter7;
    function handleChapter7() {
        hideCursor('chapter6');
        chapter7 = new TypeIt(createTextElement('chapter7'), {
            afterComplete: () => {
                hideCursor('chapter7');
                createInputElement("chapter7_2").then(input => {
                    inputName = input;
                    chapterProgress[7] = true;
                    main();
                });
            },
            cursorChar: "_",
            waitUntilVisible: true,
            speed: 20
        }).pause(4000)
        .break().exec(() => scrollOneLineDown())
        .break().exec(() => scrollOneLineDown())
        .type('<span class="color-blue">PLEASE ENTER YOUR INFORMATION:</span>').break().exec(() => scrollOneLineDown()).pause(200)
        .break().exec(() => scrollOneLineDown())
        .type('First Name:').break().exec(() => scrollOneLineDown()).pause(200)
        .go();
    }
    // chapter 8 - get last name
    let chapter8;
    function handleChapter8() {
        chapter8 = new TypeIt(createTextElement('chapter8'), {
            afterComplete: () => {
                hideCursor('chapter8');
                createInputElement("chapter8_2").then(input => {
                    inputLastName = input;
                    chapterProgress[8] = true;
                    main();
                });
            },
            cursorChar: "_",
            waitUntilVisible: true,
            speed: 20
        })
        .break().exec(() => scrollOneLineDown())
        .type('Last Name:').break().exec(() => scrollOneLineDown()).pause(200)
        .go();
    }
    // chapter 9 - get date of birth
    let chapter9;
    function handleChapter9() {
        chapter9 = new TypeIt(createTextElement('chapter9'), {
            afterComplete: () => {
                hideCursor('chapter9');
                createInputElement("chapter9_2").then(input => {
                    inputDateOfBirth = input;
                    chapterProgress[9] = true;
                    main();
                });
            },
            cursorChar: "_",
            waitUntilVisible: true,
            speed: 20
        })
        .break().exec(() => scrollOneLineDown())
        .type('Date of Birth:').break().exec(() => scrollOneLineDown()).pause(200)
        .go();
    }
    // chapter 10 - user data
    let chapter10;
    function handleChapter10_1() {
        chapter10 = new TypeIt(createTextElement('chapter10'), {
            afterComplete: () => {
                handleChapter10_2();
            },
            cursorChar: "_",
            waitUntilVisible: true,
            speed: 20
        })
        .break().exec(() => scrollOneLineDown())
        .break().exec(() => scrollOneLineDown())
        .type('<span class="color-green">Searching</span> data on user...').break().exec(() => scrollOneLineDown()).pause(2000)
        //.type('<span class="color-green">Analysing</span> data...').break().exec(() => scrollOneLineDown()).pause(200)
        //.type('<span class="color-green">Generating</span> report...').break().exec(() => scrollOneLineDown()).pause(200)
        .go();
    }
    function handleChapter10_2() {
        windows['window-userVerify'].openWindow();
        chapterProgress[10] = true;
    }
    document.getElementById("button-user-verify").onclick = function() {
        windows['window-userVerify'].closeWindow();
        main();
    };
    document.getElementById("button-user-decline").onclick = function() {
        windows['window-userVerify'].closeWindow();
        hideCursor('chapter10');

        const classesToChange = ['chapter7', 'chapter7_2', 'chapter8', 'chapter8_2', 'chapter9', 'chapter9_2', 'chapter10'];
        classesToChange.forEach(function(className) {
            const elements = document.querySelectorAll(`#terminal-content .${className}`);
            elements.forEach(function(element) {
                element.classList.replace(className, `${className}_old`);
            });
        });
        
        chapterProgress[7] = false;
        chapterProgress[8] = false;
        chapterProgress[9] = false;
        chapterProgress[10] = false;
        
        main();
    };
    // chapter 11 - analysing user data
    let chapter11;
    function handleChapter11() {
        hideCursor('chapter10');
        chapter11 = new TypeIt(createTextElement('chapter11'), {
            afterComplete: () => {
                handleChapter11_2();
            },
            cursorChar: "_",
            waitUntilVisible: true,
            speed: 20
        })
        .type('<span class="color-green">Analysing</span> user data...').break().exec(() => scrollOneLineDown()).pause(200)
        .type('<span class="color-green">Generating</span> report...').break().exec(() => scrollOneLineDown()).pause(200)
        .go();
    }
    function handleChapter11_2() {
        windows['window-userData'].openWindow();
        hideCursor('chapter11');

        createInputElement("chapter11_3").then(input => {
            chapterProgress[11] = true;
            main();
        });
    }

    // chapter 3 - user information
    /*
    let chapter3;
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
    }*/
    // chapter 4 - example
    /*
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
            speed: 20
        })
        .break().exec(() => scrollOneLineDown())
        .type('Network: <span class="color-green">connected</span>').break().exec(() => scrollOneLineDown()).pause(200)
    }*/
    // functions - transition to system
    function handleTransitionToDashboard() {
        windows['window-transitionToSystem'].openWindow();
        document.getElementById('terminal').style.display = 'none';
        setTimeout(() => {
            windows['window-transitionToSystem'].closeWindow();
            chapterProgress[0] = true;
            main();
        }, 5000);
    }
    // functions - dashboard startup
    function handleDashboardStartup() {
        cdSystemInfo.style.display = 'block';
        windowIcon.forEach(icon => icon.style.display = 'flex');
        windows['window-dashboard'].openWindow();
    }



    // functions - main
    function main() {
        // intro
        if (!intro) {
            handleIntro();
            return;
        }

        // terminal
        if (!chapterProgress[0]) {

            // chapter 1
            if (!chapterProgress[1]) {
                handleChapter1();
                return;
            }
            
            // chapter 2
            if (!chapterProgress[2]) {
                handleChapter2();
                return;
            }

            // chapter 3
            if (!chapterProgress[3]) {
                handleChapter3_1();
                return;
            }

            // chapter 4
            if (!chapterProgress[4]) {
                handleChapter4_1();
                return;
            }

            // chapter 5
            if (!chapterProgress[5]) {
                handleChapter5_1();
                return;
            }

            // chapter 6
            if (!chapterProgress[6]) {
                handleChapter6_1();
                return;
            }

            // chapter 7
            if (!chapterProgress[7]) {
                handleChapter7();
                return;
            }

            // chapter 8
            if (!chapterProgress[8]) {
                handleChapter8();
                return;
            }

            // chapter 9
            if (!chapterProgress[9]) {
                handleChapter9();
                return;
            }

            // chapter 10
            if (!chapterProgress[10]) {
                handleChapter10_1();
                return;
            }

            // chapter 11
            if (!chapterProgress[11]) {
                handleChapter11();
                return;
            }

            // transition to dashboard
            handleTransitionToDashboard();
            return;

            // reset
            //resetContent(chapters = [chapter1, chapter2, chapter3, chapter4, chapter5, chapter6, chapter7, chapter8, chapter9, chapter10]);
            
        }

        // dashboard
        handleDashboardStartup();
    }
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
                window.querySelector('.footer p.windowSize').textContent = `${Math.floor(entry.contentRect.width)} x ${Math.floor(entry.contentRect.height)}`;
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