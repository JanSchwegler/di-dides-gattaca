document.addEventListener('DOMContentLoaded', () => {
    const windowElement = document.querySelector('.window');
    const resizeElement = document.querySelector('.resize');
    const closeElement = document.querySelector('.close');
    const windowIconElement = document.querySelector('.windowIcon');
    let isDragging = false;
    let isResizing = false;
    let startX, startY, initialX, initialY, initialWidth, initialHeight;

    // Center the window initially
    function centerWindow() {
        windowElement.style.width = '500px';
        windowElement.style.height = '300px';
        windowElement.style.left = `calc(50% - 250px)`;
        windowElement.style.top = `calc(50% - 150px)`;
    }
    
    centerWindow();

    // Show the window with animation
    windowElement.classList.add('show');

    windowElement.addEventListener('mousedown', (e) => {
        if (e.target === resizeElement || e.target === closeElement) return; // Prevent dragging if resize or close handle is clicked

        if (e.target !== windowElement) return; // Only allow dragging from the window element itself

        isDragging = true;
        startX = e.clientX - windowElement.offsetLeft;
        startY = e.clientY - windowElement.offsetTop;

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    resizeElement.addEventListener('mousedown', (e) => {
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        initialWidth = windowElement.offsetWidth;
        initialHeight = windowElement.offsetHeight;

        document.addEventListener('mousemove', onResizeMove);
        document.addEventListener('mouseup', onResizeUp);
    });

    closeElement.addEventListener('click', () => {
        windowElement.classList.remove('show');
        setTimeout(() => {
            windowElement.style.display = 'none';
            // windowIconElement.style.display = 'block'; // No need to set it as it is always visible
        }, 200); // Match the transition duration
    });

    windowIconElement.addEventListener('click', () => {
        if (windowElement.style.display === 'flex') return; // Do nothing if the window is already open
        
        windowElement.style.display = 'flex';
        centerWindow();
        setTimeout(() => {
            windowElement.classList.add('show');
        }, 10); // Delay to allow for transition
        // windowIconElement.style.display = 'none'; // No need to set it as it is always visible
    });

    function onMouseMove(e) {
        if (!isDragging) return;

        let x = e.clientX - startX;
        let y = e.clientY - startY;

        // Constrain movement within the bounds of the background
        const maxX = document.body.clientWidth - windowElement.offsetWidth;
        const maxY = document.body.clientHeight - windowElement.offsetHeight;

        if (x < 0) x = 0;
        if (x > maxX) x = maxX;
        if (y < 0) y = 0;
        if (y > maxY) y = maxY;

        windowElement.style.left = `${x}px`;
        windowElement.style.top = `${y}px`;
    }

    function onResizeMove(e) {
        if (!isResizing) return;

        let newWidth = initialWidth + (e.clientX - startX);
        let newHeight = initialHeight + (e.clientY - startY);

        // Constrain resizing within the bounds of the background
        const maxWidth = document.body.clientWidth - windowElement.offsetLeft;
        const maxHeight = document.body.clientHeight - windowElement.offsetTop;

        if (newWidth > maxWidth) newWidth = maxWidth;
        if (newHeight > maxHeight) newHeight = maxHeight;
        if (newWidth < 100) newWidth = 100; // Minimum width
        if (newHeight < 100) newHeight = 100; // Minimum height

        windowElement.style.width = `${newWidth}px`;
        windowElement.style.height = `${newHeight}px`;
    }

    function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

    function onResizeUp() {
        isResizing = false;
        document.removeEventListener('mousemove', onResizeMove);
        document.removeEventListener('mouseup', onResizeUp);
    }
});
