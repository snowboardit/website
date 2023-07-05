window.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed");
    console.log("Vanta background init...");
    VANTA.HALO({
        el: "#vanta-bg",
        mouseControls: false,
        touchControls: false,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        amplitudeFactor: 0.5,
        xOffset: 0,
        yOffset: -0
    })
});
