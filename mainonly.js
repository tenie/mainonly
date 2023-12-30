// A JavaScript bookmarklet designed to isolate and highlight a specific element on a webpage, effectively hiding all other elements.

(function () {
    // if re-run on the same page, remove the previous instance
    if (document.getElementsByClassName("mainonly").length) {
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    }

    var selectedElement = document.body;
    selectedElement.classList.add("mainonly");

    const style = document.head.appendChild(document.createElement("style"));
    style.textContent = ".mainonly { outline: 2px solid red; }";

    /** @param {*} element */
    function outlineElement(element) {
        if (element instanceof HTMLElement) { // Ignores non-HTMLElements
            selectedElement.classList.remove("mainonly");
            selectedElement = element;
            selectedElement.classList.add("mainonly");
        }
    }

    /** @param {MouseEvent} event */
    function onMouseOver(event) {
        outlineElement(event.target);
    }

    /** @param {MouseEvent} event */
    function onClick(event) {
        event.preventDefault();
        style.textContent = `* { visibility: hidden; } .mainonly, .mainonly * { visibility: visible; }`;
        cleanupEventListeners();
    }

    /** @param {KeyboardEvent} event */
    function onKeydown(event) {
        if (event.key === "Escape") {
            // Prevent the default action of the escape key
            event.preventDefault();
            // Recover the hidden elements
            style.remove();
            document.removeEventListener("keydown", onKeydown);
            cleanupEventListeners();
            selectedElement.classList.remove("mainonly");
        }
    }

    /** @param {WheelEvent} event */
    function onWheel(event) {
        event.preventDefault();
        if (event.deltaY < 0) {
            // Scrolling up, select parent element
            outlineElement(selectedElement.parentElement);
        } else {
            // Scrolling down, select first child element
            outlineElement(selectedElement.firstElementChild);
        }
    }

    function cleanupEventListeners() {
        document.removeEventListener("mouseover", onMouseOver);
        document.removeEventListener("click", onClick);
        document.removeEventListener("wheel", onWheel);
    }

    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("click", onClick);
    document.addEventListener("wheel", onWheel, { passive: false });
    document.addEventListener("keydown", onKeydown);
})();