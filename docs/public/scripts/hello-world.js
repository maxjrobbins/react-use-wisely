console.log("Hello from hello-world.js");

// Call the demo callback function if it exists
if (typeof window !== "undefined" && window.demoCallback) {
  window.demoCallback("Hello world script loaded successfully!");
}
