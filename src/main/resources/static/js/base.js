"use strict";

// Fill out bootstrap tooltips
up.compiler('[data-bs-toggle="tooltip"]', function (element) {
    new bootstrap.Tooltip(element);
});

up.compiler('.spoilerText', function (element) {
    element.addEventListener("click", (event) => {
        let target = event.target;
        target.classList.remove("hidden");
        target.setAttribute("role", "presentation");
    });
});

up.compiler('pre code', function (element) {
    hljs.highlightElement(element);
});

up.compiler("#nsfwModal", function (element) {
    const bsModal = new bootstrap.Modal(element);
    element.addEventListener('hide.bs.modal', event => {
        document.getElementById("nsfw-backdrop").hidden = true;
    });
    bsModal.show();
});

up.on('up:fragment:inserted', (event) => {
    twemoji.parse(document.body, {
        // The default Twemoji CDN ~will~ died at the end of the year. This tells it to use jsdelivr for emoji images instead
        base: "https://cdn.jsdelivr.net/gh/jdecked/twemoji@v14.0.2/assets/"
    });
});

up.on('up:request:loaded', (event) => {
    if (!event.response.ok) {
        if (event.response.status === 403) {
            event.preventDefault();
            // This looks very odd but it seems to work perfectly
            up.network.loadPage({url: ""});
        }
    }
});

up.on('up:request:offline', (event) => {
    //handle telling the user we're offline
    const alertPlaceholder = document.getElementById("alertPlaceholder");
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
    <div class="alert alert-danger alert-dismissible fade show mx-4 mt-2" role="alert">
        <strong>ERROR</strong> There was an issue loading this page.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
    `;
    alertPlaceholder.append(wrapper);
});


function isDiscordPage(url) {
    return !!url.match(/^https:\/\/discord\.com\/oauth2\/authorize\S*/gm);
}

up.compiler('.content', (element, data, meta) => {
    if (data.nsfw) {
        element.append(up.element.createFromHTML(`<div id="nsfw-backdrop" style=" background-color: rgba(255,255,255,0)"></div>`));

        const alertPlaceholder = document.getElementById("alertPlaceholder");

        let modalElement = up.element.createFromHTML(`
        <div class="modal" id="nsfwModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
         aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="staticBackdropLabel"><i
                                    class="bi bi-exclamation-triangle-fill text-warning fs-3"></i> NSFW Thread</h1>
                    </div>
                    <div class="modal-body">
                        <p>This Thread has been marked as containing Not Safe For Work content.</p>
                        <p>Do you wish to continue?</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary">Go Back</button>
                        <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Continue</button>
                    </div>
                </div>
            </div>
        </div>`);
        alertPlaceholder.append(modalElement);

        const bsModal = new bootstrap.Modal(modalElement);

        modalElement.addEventListener('hide.bs.modal', event => {
            document.getElementById("nsfw-backdrop").remove();
            document.getElementById("nsfwModal").remove();
        });
        bsModal.show();

    }
});