// variables
// variables - sizing and positioning
let screenWidth = document.documentElement.clientWidth || window.innerWidth;
let screenHeight = document.documentElement.clientHeight || window.innerHeight;
let scrollPos = window.scrollY || window.pageYOffset;

// on resize
window.addEventListener("resize", function() {
    // update screen width and height
    screenWidth = document.documentElement.clientWidth || window.innerWidth;
    screenHeight = document.documentElement.clientHeight || window.innerHeight;

    // function calls
    
});

// on scroll
window.addEventListener("scroll", function() {
    // update scroll position
    scrollPos = window.scrollY || window.pageYOffset;

    // function calls

});

// on load
document.addEventListener('DOMContentLoaded', function () {
    
    // new terminal line
    let lineHeight = 0;
    let firstPElement = document.querySelector('#terminal .terminal-line');
    if (firstPElement) {
        lineHeight = firstPElement.offsetHeight;
    }
    function addTerminalLine(content) {
        let terminal = document.getElementById('terminal-content');
        let newLine = document.createElement('div');
        newLine.classList.add('terminal-line');
        for (let i = 0; i < 2; i++) {
            let pElement = document.createElement('p');
            pElement.textContent = content;
            newLine.appendChild(pElement);
        }

        terminal.appendChild(newLine);

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
        

});