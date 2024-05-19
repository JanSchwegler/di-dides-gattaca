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
        this.iconElement.addEventListener('click', () => this.openWindow());
    }

    startDrag(e) {
        this.focusWindow();
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
    let firstPElement = document.querySelector('#terminal .terminal-line');
    if (firstPElement) {
        lineHeight = firstPElement.offsetHeight;
    }
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
        
        if (!lineHeight) {
            firstPElement = document.querySelector('#terminal .terminal-line');
            if (firstPElement && lineHeight === 0) {
                lineHeight = firstPElement.offsetHeight;
            }
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
    startAddingLines();

    // functions - popup windows
    const windows = [
        new PopupWindow(
            document.getElementById('window1'),
            document.querySelector('.windowIcon[data-window="window1"]')
        ),
        new PopupWindow(
            document.getElementById('window2'),
            document.querySelector('.windowIcon[data-window="window2"]')
        )
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