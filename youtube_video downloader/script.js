/* =========================================
   VELODROP — JAVASCRIPT
   ========================================= */


/* =========================================
   GET ELEMENTS
   ========================================= */

const downloadForm =
    document.getElementById("downloadForm");

const urlInput =
    document.getElementById("urlInput");

const clearBtn =
    document.getElementById("clearBtn");

const message =
    document.getElementById("message");

const resultCard =
    document.getElementById("resultCard");

const fileName =
    document.getElementById("fileName");

const fileType =
    document.getElementById("fileType");

const quality =
    document.getElementById("quality");

const downloadBtn =
    document.getElementById("downloadBtn");

const progressWrap =
    document.getElementById("progressWrap");

const progressBar =
    document.getElementById("progressBar");

const progressText =
    document.getElementById("progressText");


/* =========================================
   SHOW MESSAGE
   ========================================= */

function showMessage(text, type = "") {

    message.textContent = text;

    message.className =
        "message " + type;

}


/* =========================================
   CHECK URL
   ========================================= */

function isValidURL(value) {

    try {

        const url =
            new URL(value);

        return (
            url.protocol === "http:" ||
            url.protocol === "https:"
        );

    } catch {

        return false;

    }

}


/* =========================================
   GET FILE NAME
   ========================================= */

function getFileName(url) {

    try {

        const parsed =
            new URL(url);

        let name =
            decodeURIComponent(
                parsed.pathname
                    .split("/")
                    .filter(Boolean)
                    .pop() ||
                "video-file"
            );


        /*
         Remove file extension
        */

        name =
            name.replace(
                /\.[a-z0-9]{1,8}$/i,
                ""
            );


        if (!name) {

            name = "video-file";

        }


        return name.substring(0, 80);

    } catch {

        return "video-file";

    }

}


/* =========================================
   DETECT MEDIA TYPE
   ========================================= */

function detectMedia(url) {

    const lower =
        url.toLowerCase();


    if (
        /\.(mp4|webm|mov|m4v|mkv)(\?|#|$)/i
            .test(lower)
    ) {

        return "Video file detected";

    }


    if (
        /\.(mp3|wav|ogg|m4a)(\?|#|$)/i
            .test(lower)
    ) {

        return "Audio file detected";

    }


    return "Direct media URL";

}


/* =========================================
   CLEAR BUTTON
   ========================================= */

clearBtn.addEventListener(
    "click",
    function () {

        urlInput.value = "";

        resultCard.classList.add(
            "hidden"
        );

        progressWrap.classList.remove(
            "active"
        );

        progressBar.style.width =
            "0%";

        progressText.textContent =
            "0%";

        showMessage("");

        urlInput.focus();

    }
);


/* =========================================
   ANALYZE LINK
   ========================================= */

downloadForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const url =
            urlInput.value.trim();


        /* Empty URL */

        if (!url) {

            resultCard.classList.add(
                "hidden"
            );

            showMessage(
                "Please paste a video or media link.",
                "error"
            );

            return;

        }


        /* Invalid URL */

        if (!isValidURL(url)) {

            resultCard.classList.add(
                "hidden"
            );

            showMessage(
                "Please enter a valid http:// or https:// URL.",
                "error"
            );

            return;

        }


        /*
        Get information
        */

        const name =
            getFileName(url);

        const type =
            detectMedia(url);


        fileName.textContent =
            name;

        fileType.textContent =
            type;


        /*
        Show result card
        */

        resultCard.classList.remove(
            "hidden"
        );


        progressWrap.classList.remove(
            "active"
        );


        progressBar.style.width =
            "0%";

        progressText.textContent =
            "0%";


        showMessage(
            "Link analyzed successfully. Select a quality and download.",
            "ok"
        );


        /*
        Smooth scroll
        */

        setTimeout(
            function () {

                resultCard.scrollIntoView({

                    behavior: "smooth",

                    block: "center"

                });

            },
            150
        );

    }
);


/* =========================================
   QUALITY CHANGE
   ========================================= */

quality.addEventListener(
    "change",
    function () {

        const selected =
            quality.options[
                quality.selectedIndex
            ].text;


        showMessage(
            "Selected: " + selected,
            "ok"
        );

    }
);


/* =========================================
   DOWNLOAD FUNCTION
   ========================================= */

downloadBtn.addEventListener(
    "click",
    async function () {

        const url =
            urlInput.value.trim();


        /*
        Safety check
        */

        if (!isValidURL(url)) {

            showMessage(
                "Please enter a valid URL first.",
                "error"
            );

            return;

        }


        /*
        Disable button
        */

        downloadBtn.disabled =
            true;


        downloadBtn.style.opacity =
            "0.7";


        /*
        Show progress
        */

        progressWrap.classList.add(
            "active"
        );


        progressBar.style.width =
            "0%";

        progressText.textContent =
            "0%";


        showMessage(
            "Connecting to the file...",
            "ok"
        );


        /*
        Fake preparation progress
        */

        let progress = 0;


        const progressTimer =
            setInterval(
                function () {

                    progress +=
                        Math.random() * 12;


                    if (progress >= 90) {

                        progress = 90;

                        clearInterval(
                            progressTimer
                        );

                    }


                    progressBar.style.width =
                        progress.toFixed(0) + "%";


                    progressText.textContent =
                        progress.toFixed(0) + "%";

                },
                150
            );


        try {

            /*
            Fetch direct file
            */

            const response =
                await fetch(
                    url,
                    {
                        method: "GET",

                        mode: "cors"
                    }
                );


            /*
            Check response
            */

            if (!response.ok) {

                throw new Error(
                    "Server returned " +
                    response.status
                );

            }


            /*
            Convert response
            to Blob
            */

            const blob =
                await response.blob();


            /*
            Create temporary URL
            */

            const objectURL =
                URL.createObjectURL(
                    blob
                );


            /*
            Create download link
            */

            const downloadLink =
                document.createElement(
                    "a"
                );


            downloadLink.href =
                objectURL;


            /*
            File extension
            */

            let extension =
                "";


            if (
                blob.type.includes(
                    "video"
                )
            ) {

                extension =
                    ".mp4";

            }

            else if (
                blob.type.includes(
                    "audio"
                )
            ) {

                extension =
                    ".mp3";

            }


            downloadLink.download =
                getFileName(url) +
                extension;


            document.body.appendChild(
                downloadLink
            );


            /*
            Start download
            */

            downloadLink.click();


            /*
            Remove element
            */

            downloadLink.remove();


            /*
            Release memory
            */

            URL.revokeObjectURL(
                objectURL
            );


            /*
            Complete progress
            */

            clearInterval(
                progressTimer
            );


            progressBar.style.width =
                "100%";

            progressText.textContent =
                "100%";


            showMessage(
                "Download started successfully!",
                "ok"
            );


        } catch (error) {

            clearInterval(
                progressTimer
            );


            progressBar.style.width =
                "0%";

            progressText.textContent =
                "0%";


            showMessage(
                "Download blocked by the server. The URL may not allow browser downloads (CORS/access restrictions).",
                "error"
            );

            console.error(
                "Download error:",
                error
            );

        }


        /*
        Enable button again
        */

        downloadBtn.disabled =
            false;

        downloadBtn.style.opacity =
            "1";

    }
);


/* =========================================
   INPUT ANIMATION
   ========================================= */

urlInput.addEventListener(
    "focus",
    function () {

        urlInput.parentElement.style
            .transform =
            "scale(1.005)";

    }
);


urlInput.addEventListener(
    "blur",
    function () {

        urlInput.parentElement.style
            .transform =
            "scale(1)";

    }
);


/* =========================================
   ENTER KEY
   ========================================= */

urlInput.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            downloadForm.requestSubmit();

        }

    }
);


/* =========================================
   PAGE LOAD
   ========================================= */

window.addEventListener(
    "load",
    function () {

        console.log(
            "VeloDrop loaded successfully 🚀"
        );

    }
);