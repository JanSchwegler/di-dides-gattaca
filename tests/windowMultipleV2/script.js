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
        this.centerWindow();
        this.windowElement.querySelector('.close').addEventListener('click', () => this.closeWindow());
        this.windowElement.querySelector('.resize').addEventListener('mousedown', (e) => this.startResize(e));
        this.windowElement.addEventListener('mousedown', (e) => this.startDrag(e));
        this.iconElement.addEventListener('click', () => this.openWindow());
    }

    centerWindow() {
        this.windowElement.style.left = `calc(50% - ${this.windowElement.offsetWidth / 2}px)`;
        this.windowElement.style.top = `calc(50% - ${this.windowElement.offsetHeight / 2}px)`;
    }

    startDrag(e) {
        if (e.target === this.windowElement.querySelector('.resize') || e.target === this.windowElement.querySelector('.close')) return;

        if (e.target !== this.windowElement) return;

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
    }

    startResize(e) {
        this.isResizing = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.initialWidth = this.windowElement.offsetWidth;
        this.initialHeight = this.windowElement.offsetHeight;

        document.addEventListener('mousemove', this.onResizeMove);
        document.addEventListener('mouseup', this.onResizeUp);
    }

    onResizeMove = (e) => {
        if (!this.isResizing) return;

        let newWidth = this.initialWidth + (e.clientX - this.startX);
        let newHeight = this.initialHeight + (e.clientY - this.startY);

        const maxWidth = document.body.clientWidth - this.windowElement.offsetLeft;
        const maxHeight = document.body.clientHeight - this.windowElement.offsetTop;

        if (newWidth > maxWidth) newWidth = maxWidth;
        if (newHeight > maxHeight) newHeight = maxHeight;
        if (newWidth < 100) newWidth = 100;
        if (newHeight < 100) newHeight = 100;

        this.windowElement.style.width = `${newWidth}px`;
        this.windowElement.style.height = `${newHeight}px`;
    }

    onResizeUp = () => {
        this.isResizing = false;
        document.removeEventListener('mousemove', this.onResizeMove);
        document.removeEventListener('mouseup', this.onResizeUp);
    }

    closeWindow() {
        this.windowElement.classList.remove('show');
        setTimeout(() => {
            this.windowElement.style.display = 'none';
        }, 200);
    }

    openWindow() {
        if (this.windowElement.style.display === 'flex') {
            this.focusWindow();
            return;
        }
        
        this.windowElement.style.display = 'flex';
        this.centerWindow();
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

document.addEventListener('DOMContentLoaded', () => {
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
});
