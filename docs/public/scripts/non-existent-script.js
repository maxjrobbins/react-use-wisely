// This is a controlled error script
console.log("Error script loaded - will throw an error");

// Create a custom error
const customError = new Error(
  "This is a deliberate error for demonstration purposes"
);

// Call the demo callback with the error message
if (typeof window !== "undefined" && window.demoCallback) {
  window.demoCallback(
    "This script throws a deliberate error for demonstration purposes"
  );

  // Create a cleanup function
  window.counterCleanup = function () {
    console.log("Error script cleanup");
  };

  // Throw the error after a small delay to ensure our message is shown
  setTimeout(() => {
    throw customError;
  }, 100);
}
