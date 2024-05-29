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
let user = false;
let startTime = new Date().getTime();

// variables - storyline
let chapter1Done = false;
let chapter2Done = false;

// variables - elements
let terminalEmptyHtml;
let bgCanvas;
let bgCanvasCtx;
let cdMouse;
let cdTime
let cdIp;





// on load
document.addEventListener('DOMContentLoaded', function () {
    // get elements
    terminalEmptyHtml = document.getElementById('terminal').innerHTML;
    cdMouse = document.getElementById('cd-mouse');
    cdTime = document.getElementById('cd-time');
    cdIp = document.getElementById('cd-ip');
    bgCanvas = document.getElementById('bgNoise');
    bgCanvasCtx = bgCanvas.getContext('2d');





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



    // functions - cd time
    async function updateTime() {
        let currentTime = new Date();
        let formattedTime = currentTime.toLocaleTimeString('en-US', {hour12: false});
        cdTime.textContent = formattedTime;
    }
    updateTime();
    setInterval(updateTime, 1000);



    // functions - time difference
    function getTimeDifference() {
        let currentTime = new Date().getTime();
        let difference = currentTime - startTime;
        let seconds = Math.floor(difference / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);
        let time = `${String(hours % 24).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
        return time;
    }


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



    // new terminal line
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
    function getLineHeight() {
        let firstPElement = document.querySelector('#terminal .terminal-line');
        if (firstPElement && lineHeight === 0) {
            lineHeight = firstPElement.offsetHeight;
        }
    }
    getLineHeight();
    function typeText(element, text, delay) {
        let index = 0;
        let typing = setInterval(() => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
            } else {
                clearInterval(typing);
            }
        }, delay);
    }
    function addTerminalLine(content) {
        let terminal = document.getElementById('terminal-content');
        let newLine = document.createElement('div');
        newLine.classList.add('terminal-line');
        
        let pElement1 = document.createElement('p');
        let pElement2 = document.createElement('p');
        
        newLine.appendChild(pElement1);
        newLine.appendChild(pElement2);
        
        terminal.appendChild(newLine);
        
        typeText(pElement1, content, 50); // Adjust the delay as needed
        
        // Add a delay before starting typing the second line
        setTimeout(() => {
            //typeText(pElement2, content, 50); // Adjust the delay as needed
        }, 500); // Adjust the delay as needed

        // scroll one line down
        if (lineHeight === 0) {
            getLineHeight();
        }
        document.getElementById('terminal').scrollTop += lineHeight;
    }
    function startAddingLines() {
        let intervalId = setInterval(() => {
            let terminal = document.getElementById('terminal');
            let lines = terminal.querySelectorAll('.terminal-line');
            
            addTerminalLine('New line ' + (lines.length + 1));
            
            if (lines.length >= 49) {
                clearInterval(intervalId);
            }
        }, 500);
    }
    //startAddingLines();


    // terminal storyline
    /*
    details:
    - Library: TypeIt (https://typeitjs.com/)
    - Characters per line: 46
    */

    function hideCursor(chapter) {
        if (chapter) {
            document.querySelector('#terminal-content p.' + chapter + ' .ti-cursor').style.display = 'none';
        }
    }
    // chapter 1 - booting up
    let chapter1 = new TypeIt('#terminal-content p.chapter1', {
        afterComplete: () => {
            chapter1Done = true;
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
    .type('Storage: <span class="color-yellow">5</span>TB NVMe SSD').break().exec(() => scrollOneLineDown()).pause(2000);
    // chapter 2 - user information
    let chapter2;
    function handleChapter2() {
        fetchPublicIp().then(() => {
            hideCursor('chapter1');
            chapter2 = new TypeIt('#terminal-content p.chapter2', {
                afterComplete: () => {
                    chapter2Done = true;
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
            .go();
        });
    }
    // functions - main
    function main() {
        if (!user) {
            if (!chapter1Done) {
                chapter1.go();
            } else if (!chapter2Done) {
                handleChapter2();
            } else { // reset
                resetContent();
            }
        }
    }
    main();
    function resetContent() {
        chapter1Done = false;
        chapter2Done = false;
        chapter1.reset();
        chapter2.reset();
        //document.getElementById('terminal').innerHTML = terminalEmptyHtml;
        setTimeout(() => {
            main();
        }, 1000);
    }

    document.querySelector('#terminal .input-text').addEventListener('keydown', (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            console.log("enter");
        }
    });


    // functions - popup windows
    let windows = [];

    document.querySelectorAll('.window').forEach((window, index) => {
        const windowElement = window;
        const iconElement = document.querySelector(`.windowIcon[data-window="${window.id}"]`);
        const instance = new PopupWindow(windowElement, iconElement);
        windows[window.id] = instance;
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
});