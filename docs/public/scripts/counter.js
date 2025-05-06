console.log("Counter script loaded");

// Simple counter implementation
let count = 0;
let clickHandler = null;

function incrementCounter() {
  count++;
  updateCallback();
}

function updateCallback() {
  if (typeof window !== "undefined" && window.demoCallback) {
    window.demoCallback(`Counter value: ${count} (Click to increment)`);
  }
}

// Cleanup function that will be called when the script is unloaded
function cleanupCounter() {
  if (clickHandler) {
    document.removeEventListener("click", clickHandler);
    clickHandler = null;
  }
  count = 0;
  console.log("Counter script cleanup complete");
}

// Initialize the counter and set up a click handler
if (typeof window !== "undefined") {
  // Clean up any previous instances first
  if (window.counterCleanup) {
    window.counterCleanup();
  }

  // Save reference to the click handler to ensure we remove the exact same function
  clickHandler = incrementCounter;

  // Set initial message
  updateCallback();

  // Add a click handler to the document
  document.addEventListener("click", clickHandler);

  // Set up the cleanup function
  window.counterCleanup = cleanupCounter;
}
