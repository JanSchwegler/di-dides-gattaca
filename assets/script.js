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
        this.iconElement.addEventListener('click', () => this.openWindow());
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
// variables - sizing and positioning
let screenWidth = document.documentElement.clientWidth || window.innerWidth;
let screenHeight = document.documentElement.clientHeight || window.innerHeight;
let scrollPos = window.scrollY || window.pageYOffset;
let mouseX;
let mouseY;

// variables - elements
let bgCanvas;
let bgCanvasCtx;
let cdMouse;
let cdTime
let cdIp;





// on load
document.addEventListener('DOMContentLoaded', function () {
    // get elements
    cdMouse = document.getElementById('cd-mouse');
    cdTime = document.getElementById('cd-time');
    cdIp = document.getElementById('cd-ip');
    bgCanvas = document.getElementById('bgNoise');
    bgCanvasCtx = bgCanvas.getContext('2d');





    // initials
    // cornerdata ip
    fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
        cdIp.innerHTML = data.ip;
    });





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
    function updateTime() {
        let currentTime = new Date();
        let formattedTime = currentTime.toLocaleTimeString('en-US', {hour12: false});
        cdTime.textContent = formattedTime;
    }
    updateTime();
    setInterval(updateTime, 1000);


    // new terminal line
    let lineHeight = 0;
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

    // TypeIt test / 46 characters per line
    new TypeIt('#terminal-content', {
        cursorChar: "_",
        waitUntilVisible: true
    })
    .options({ speed: 100 })
    .type('GTCA OS<br>', { delay: 500 })
    .type('Bioinformatics GeneAccess BIOS <span class="color-yellow">v24.5.17</span><br>', { delay: 200 })
    .type('<span class="color-green">Initializing system...</span><br>', { delay: 2000 })

    .options({ speed: 50 })
    .type('<br><br>Memory: <span class="color-yellow">256</span>GB DDR<span class="color-yellow">4</span><br>', { delay: 500 })
    .type('Storage: <span class="color-yellow">5</span>TB NVMe SSD<br>', { delay: 2000 })

    .type('<br>Startup Time: <span class="color-yellow">0:00:07</span><br>', { delay: 200 })
    .type('Network: <span class="color-green">connected</span><br>', { delay: 200 })
    .type('IP: <span class="color-yellow">192.168.1.100</span><br>', { delay: 1000 })

    .type('<br><span class="color-green">Checking </span>hardware integrity...<br>', { delay: 3000 })
    .type('<span class="color-green">Loading </span>kernal modules...<br>', { delay: 5000 })
    .type('<span class="color-green">Verifying </span>network connection...<br>', { delay: 500 })
    .type('<span class="color-green">Starting </span>user interface...<br>', { delay: 2000 })

    .type('<br><span class="color-green">Loaded </span>mouseUp ........................... <span class="color-yellow">53%</span><br>', { delay: 200 })
    .type('<span class="color-green">Loaded </span>keyboardKeydown1 .................. <span class="color-yellow">58%</span><br>', { delay: 200 })
    .type('<span class="color-green">Loaded </span>keyboardKeydown2 .................. <span class="color-yellow">63%</span><br>', { delay: 200 })
    .type('<span class="color-green">Loaded </span>keyboardKeydown3 .................. <span class="color-yellow">68%</span><br>', { delay: 200 })
    .type('<span class="color-green">Loaded </span>keyboardKeydown4 .................. <span class="color-yellow">74%</span><br>', { delay: 200 })
    .type('<span class="color-green">Loaded </span>keyboardKeydown5 .................. <span class="color-yellow">79%</span><br>', { delay: 200 })
    .type('<span class="color-green">Loaded </span>keyboardKeydown ................... <span class="color-yellow">84%</span><br>', { delay: 300 })
    .type('<span class="color-green">Loaded </span>startup ........................... <span class="color-yellow">89%</span><br>', { delay: 1000 })
    
    .type('<br><br><span class="color-blue">PLEASE ENTER YOUR INFORMATION:</span><br>', { delay: 100 })

    .type('<br>First Name:<span class="color-blue">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;>&nbsp;</span>', { delay: 1000 }).options({ speed: 200 }).type('Vincent Anton<br>', { delay: 100 }).options({ speed: 50 }) //17 characters in fist string
    .type('Last Name:<span class="color-blue">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;>&nbsp;</span>', { delay: 1000 }).options({ speed: 200 }).type('Freeman<br>', { delay: 100 }).options({ speed: 50 }) //17 characters in fist string
    .type('Date of Birth:<span class="color-blue">&nbsp;&nbsp;>&nbsp;</span>', { delay: 1000 }).options({ speed: 200 }).type('2\\14\\1967<br>', { delay: 100 }).options({ speed: 50 }) //17 characters in fist string

    .type('<br><br><span class="color-blue">PLEASE NAME A NUMBER FROM 0 TO 1024:</span><br>', { delay: 100 })
    .type('<br><span class="color-blue">>&nbsp;</span>', { delay: 1000 }).options({ speed: 200 }).type('<span class="color-yellow">121</span><br>', { delay: 1000 }).options({ speed: 50 })
    .go();

    // functions - popup windows
    const windows = [
        document.querySelectorAll('.window').forEach(window => {
            new PopupWindow(
                window,
                document.querySelector(`.windowIcon[data-window="${window.id}"]`)
            );
        })
    ];
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