// script.js

const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

// Specify the local PDF file URL
const pdfUrl = 'OCA Oracle.pdf'; // Local PDF file in the same folder
const pdfCanvas = document.getElementById('pdf-canvas');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
let pdfDoc = null;
let currentPage = 1;
let isRendering = false;

// Load the PDF file
pdfjsLib.getDocument(pdfUrl).promise
    .then((pdf) => {
        pdfDoc = pdf;
        renderPage(currentPage);
        updateButtons();
    })
    .catch((error) => {
        console.error("Error loading PDF:", error);
        alert("Could not load PDF. Please check the file path or try again later.");
    });

// Render a page
function renderPage(pageNumber) {
    if (isRendering) return;
    isRendering = true;
    pdfDoc.getPage(pageNumber).then((page) => {
        const viewport = page.getViewport({ scale: 1 });
        pdfCanvas.height = viewport.height;
        pdfCanvas.width = viewport.width;

        const renderContext = {
            canvasContext: pdfCanvas.getContext('2d'),
            viewport: viewport,
        };
        page.render(renderContext).promise.then(() => {
            isRendering = false;
        });
    });
}

// Update the button state
function updateButtons() {
    prevButton.disabled = currentPage <= 1;
    nextButton.disabled = currentPage >= pdfDoc.numPages;
}

// Navigate to the previous page
prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderPage(currentPage);
        updateButtons();
    }
});

// Navigate to the next page
nextButton.addEventListener('click', () => {
    if (currentPage < pdfDoc.numPages) {
        currentPage++;
        renderPage(currentPage);
        updateButtons();
    }
});
