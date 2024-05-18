// script.js

document.addEventListener('DOMContentLoaded', () => {
    const texts = document.querySelectorAll('.text');
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const maxChromaticOffset = 2; // Increased for stronger effect
    const maxBlur = 0.8; // Increased for stronger effect
    const maxDistortion = 0.005; // Adjusted for barrel distortion effect
    const maxRotation = -1; // Maximum rotation angle in degrees

    function applyEffects() {
        texts.forEach(text => {
            const rect = text.getBoundingClientRect();
            const elementCenterX = rect.left + rect.width / 2;
            const elementCenterY = rect.top + rect.height / 2;

            const distX = (elementCenterX - centerX) / centerX;
            const distY = (elementCenterY - centerY) / centerY;

            const distance = Math.sqrt(distX * distX + distY * distY);
            const distortion = distance * distance * maxDistortion;
            const rotation = Math.atan2(distY, distX) * (180 / Math.PI); // Calculate angle in degrees

            const chromaticX = distX * maxChromaticOffset;
            const chromaticY = distY * maxChromaticOffset;
            const blurAmount = distance * maxBlur;
            const distortionScale = 1 + distortion; // Apply barrel distortion

            text.style.textShadow = `
                ${-chromaticX}px ${chromaticY}px 0 red,
                ${chromaticX}px ${-chromaticY}px 0 cyan,
                ${chromaticX}px ${chromaticY}px 0 green
            `;
            text.style.filter = `blur(${blurAmount}px)`;
            text.style.transform = `translate(-50%, -50%) scale(${distortionScale}) rotate(${rotation}deg)`;
        });
    }

    window.addEventListener('scroll', applyEffects);
    window.addEventListener('resize', applyEffects);
    applyEffects(); // Apply the effect initially
});
