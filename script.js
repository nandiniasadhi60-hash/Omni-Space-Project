
// ==========================================
// OMNISPACE - SPATIAL AR OPERATING SYSTEM
// MAIN JAVASCRIPT
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    // ======================================
    // 1. GET HTML ELEMENTS
    // ======================================

    const clock = document.getElementById("clock");
    const appCards = document.querySelectorAll(".app-card");
    const sections = document.querySelectorAll(".app-section");

    // ======================================
    // 2. LIVE DIGITAL CLOCK
    // ======================================

    function updateClock() {
        if (!clock) return;

        const now = new Date();

        clock.textContent = now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
    }

    updateClock();
    setInterval(updateClock, 1000);

    // ======================================
    // 3. SECTION NAVIGATION
    // ======================================

    function showSection(sectionId) {

        sections.forEach(section => {
            section.style.display = "none";
        });

        const selectedSection =
            document.getElementById(sectionId);

        if (selectedSection) {
            selectedSection.style.display = "block";
        } else {
            console.warn("Section not found:", sectionId);
        }
    }

    // ======================================
    // 4. CLICKABLE APP CARDS
    // ======================================

    appCards.forEach(card => {

        card.addEventListener("click", () => {

            const target = card.dataset.target;

            if (target) {
                showSection(target);
            } else {
                const appName =
                    card.dataset.app ||
                    card.textContent.trim();

                showMessage("Opening " + appName);
            }

        });

    });

    // ======================================
    // 5. NAVIGATION BUTTONS
    // ======================================

    document.querySelectorAll("[data-section]")
        .forEach(button => {

            button.addEventListener("click", () => {

                const sectionId = button.dataset.section;

                showSection(sectionId);

            });

        });

    // ======================================
    // 6. HOME BUTTON
    // ======================================

    document.querySelectorAll(".home-btn")
        .forEach(button => {

            button.addEventListener("click", () => {

                showSection("home");

            });

        });

    // ======================================
    // 7. 3D SPACE
    // ======================================

    const spaceButton =
        document.getElementById("spaceBtn");

    const space3D =
        document.getElementById("space3D");

    if (spaceButton && space3D) {

        spaceButton.addEventListener("click", () => {

            const isHidden =
                window.getComputedStyle(space3D).display === "none";

            space3D.style.display =
                isHidden ? "block" : "none";

            spaceButton.textContent =
                isHidden ? "Close 3D Space" : "Open 3D Space";

        });

    }

    // ======================================
    // 8. MY FILES - UPLOAD FILES
    // ======================================

    const fileInput =
        document.getElementById("fileInput");

    const fileList =
        document.getElementById("fileList");

    if (fileInput && fileList) {

        fileInput.addEventListener("change", () => {

            fileList.innerHTML = "";

            Array.from(fileInput.files || [])
                .forEach(file => {

                    const fileItem =
                        document.createElement("div");

                    fileItem.className = "file-item";

                    fileItem.textContent =
                        "📄 " + file.name;

                    fileList.appendChild(fileItem);

                });

            showMessage("Files uploaded successfully!");

        });

    }

    // ======================================
    // 9. SETTINGS - THEME SWITCH
    // ======================================

    const themeButton =
        document.getElementById("themeBtn");

    if (themeButton) {

        themeButton.addEventListener("click", () => {

            document.body.classList.toggle("light-theme");

            const lightMode =
                document.body.classList.contains("light-theme");

            themeButton.textContent =
                lightMode ? "Dark Mode" : "Light Mode";

        });

    }

    // ======================================
    // 10. AR CAMERA PREVIEW
    // ======================================

    const cameraButton =
        document.getElementById("cameraBtn");

    const cameraVideo =
        document.getElementById("cameraPreview");

    const cameraStatus =
        document.getElementById("cameraStatus");

    let cameraStream = null;

    if (cameraButton && cameraVideo) {

        cameraButton.addEventListener("click", async () => {

            // STOP CAMERA
            if (cameraStream) {

                cameraStream.getTracks().forEach(track => {
                    track.stop();
                });

                cameraStream = null;
                cameraVideo.srcObject = null;

                cameraButton.textContent = "Start Camera";

                if (cameraStatus) {
                    cameraStatus.textContent = "Camera stopped";
                }

                return;
            }

            // START CAMERA
            try {

                if (!navigator.mediaDevices ||
                    !navigator.mediaDevices.getUserMedia) {

                    throw new Error(
                        "Camera requires HTTPS or localhost."
                    );

                }

                cameraStream =
                    await navigator.mediaDevices.getUserMedia({
                        video: true,
                        audio: false
                    });

                cameraVideo.srcObject = cameraStream;

                await cameraVideo.play();

                cameraButton.textContent = "Stop Camera";

                if (cameraStatus) {
                    cameraStatus.textContent = "Camera is active";
                }

            } catch (error) {

                console.error("Camera Error:", error);

                cameraStream = null;

                if (cameraStatus) {
                    cameraStatus.textContent =
                        "Camera permission denied or unavailable.";
                }

                alert(
                    "Please allow camera permission in your browser."
                );

            }

        });

    }

    // ======================================
    // 11. SEARCH APPLICATIONS
    // ======================================

    const searchInput =
        document.getElementById("searchInput");

    if (searchInput) {

        searchInput.addEventListener("input", () => {

            const searchText =
                searchInput.value.toLowerCase().trim();

            appCards.forEach(card => {

                const cardText =
                    card.textContent.toLowerCase();

                card.style.display =
                    cardText.includes(searchText) ? "" : "none";

            });

        });

    }

    // ======================================
    // 12. INITIAL HOME PAGE
    // ======================================

    if (document.getElementById("home")) {
        showSection("home");
    }

    // ======================================
    // 13. PROJECT INITIALIZATION
    // ======================================

    console.log(
        "OmniSpace initialized successfully!"
    );

});

// ==========================================
// 14. SHOW MESSAGE FUNCTION
// ==========================================

function showMessage(message) {

    const messageElement =
        document.getElementById("message");

    if (messageElement) {

        messageElement.textContent = message;

    } else {

        console.log(message);

    }

}

// ==========================================
// 15. CLEAN UP CAMERA WHEN LEAVING PAGE
// ==========================================

window.addEventListener("beforeunload", () => {

    const video =
        document.getElementById("cameraPreview");

    if (video && video.srcObject) {

        video.srcObject.getTracks().forEach(track => {
            track.stop();
        });

    }

});
