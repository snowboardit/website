window.addEventListener("DOMContentLoaded", (event) => {
    const { pathname } = window.location
    if (pathname === '/') {
        console.log("Vanta background init...");
        VANTA.HALO({
            el: "#vanta-bg",
            mouseControls: false,
            touchControls: false,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            amplitudeFactor: 0,
            xOffset: 0,
            yOffset: 0.05,
            size: .5
        })
    }
    window.removeEventListener('DOMContentLoaded', event);
});
