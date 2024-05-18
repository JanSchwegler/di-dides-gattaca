// variables
// variables - sizing and positioning
let screenWidth = document.documentElement.clientWidth || window.innerWidth;
let screenHeight = document.documentElement.clientHeight || window.innerHeight;
let scrollPos = window.scrollY || window.pageYOffset;
let mouseX;
let mouseY;

// variables - elements
let cdMouse;
let cdTime
let cdIp;





// on load
document.addEventListener('DOMContentLoaded', function () {
    // get elements
    cdMouse = document.getElementById('cd-mouse');
    cdTime = document.getElementById('cd-time');
    cdIp = document.getElementById('cd-ip');





    // initials
    // cornerdata ip
    fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
        cdIp.innerHTML = "<span class='color-yellow'>" + data.ip + "</span>";
    });





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





    // on mouse move
    window.addEventListener("mousemove", function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // update corderdata
        cdMouse.innerHTML = "x: <span class='color-yellow'>" + mouseX + "</span> | y: <span class='color-yellow'>" + mouseY + "</span>";
    });
    



    
    // functions
    // functions - cd time
    function updateTime() {
        const currentTime = new Date();
        const formattedTime = currentTime.toLocaleTimeString('en-US', {hour12: false});
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
        const typing = setInterval(() => {
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
            typeText(pElement2, content, 50); // Adjust the delay as needed
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
});