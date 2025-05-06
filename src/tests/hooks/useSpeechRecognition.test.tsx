import React from "react";
import { render, screen, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import useSpeechRecognition, {
  useSpeechRecognitionBasic,
  useSpeechSupport,
} from "../../hooks/useSpeechRecognition";
import { features } from "../../utils/browser";

// Mock the Speech Recognition API
const mockSpeechRecognition = {
  grammars: {},
  lang: "en-US",
  continuous: false,
  interimResults: false,
  maxAlternatives: 1,
  serviceURI: "",
  onresult: null as any,
  onerror: null as any,
  onstart: null as any,
  onend: null as any,
  onaudiostart: null as any,
  onaudioend: null as any,
  onsoundstart: null as any,
  onsoundend: null as any,
  onspeechstart: null as any,
  onspeechend: null as any,
  start: jest.fn(function () {
    if (this.onstart) this.onstart(new Event("start"));
  }),
  stop: jest.fn(function () {
    if (this.onend) this.onend(new Event("end"));
  }),
  abort: jest.fn(function () {
    if (this.onend) this.onend(new Event("end"));
  }),
};

// Mock grammar list
const mockGrammarList = {
  addFromString: jest.fn(),
  addFromURI: jest.fn(),
  length: 0,
  item: jest.fn(),
};

// Mock browser utilities
jest.mock("../../utils/browser", () => ({
  features: {
    speechRecognition: jest.fn(),
  },
}));

// Mock speech utility functions
jest.mock("../../utils/speech", () => ({
  getSpeechRecognition: jest.fn(),
  getSpeechGrammarList: jest.fn(),
  isSpeechRecognitionSupported: jest.fn(),
}));

describe("useSpeechRecognition Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Reset the mock speech recognition
    Object.assign(mockSpeechRecognition, {
      grammars: {},
      lang: "en-US",
      continuous: false,
      interimResults: false,
      maxAlternatives: 1,
      serviceURI: "",
      onresult: null,
      onerror: null,
      onstart: null,
      onend: null,
      onaudiostart: null,
      onaudioend: null,
      onsoundstart: null,
      onsoundend: null,
      onspeechstart: null,
      onspeechend: null,
    });

    // Reset mock functions
    mockSpeechRecognition.start.mockImplementation(function () {
      // @ts-ignore
      if (this.onstart) this.onstart(new Event("start"));
    });

    mockSpeechRecognition.stop.mockImplementation(function () {
      // @ts-ignore
      if (this.onend) this.onend(new Event("end"));
    });

    mockGrammarList.addFromString.mockClear();

    // Setup our mocks for each test
    (features.speechRecognition as jest.Mock).mockReturnValue(true);

    // Create a constructor function
    const mockConstructor = jest.fn(() => mockSpeechRecognition);
    const mockGrammarListConstructor = jest.fn(() => mockGrammarList);

    // Setup utility function mocks
    const speechUtils = require("../../utils/speech");
    speechUtils.getSpeechRecognition.mockReturnValue(mockConstructor);
    speechUtils.getSpeechGrammarList.mockReturnValue(
      mockGrammarListConstructor
    );
    speechUtils.isSpeechRecognitionSupported.mockReturnValue(true);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // Helper function to simulate recognition result
  function simulateResult(transcript: string, isFinal = true) {
    if (!mockSpeechRecognition.onresult) return;

    const event = {
      resultIndex: 0,
      results: [[{ transcript, confidence: 0.9 }]],
    };

    // Set isFinal property on the results
    Object.defineProperty(event.results[0], "isFinal", {
      get: () => isFinal,
    });

    mockSpeechRecognition.onresult(event as any);
  }

// Helper function to simulate error
  function simulateError(errorType: string) {
    if (!mockSpeechRecognition.onerror) return;

    const errorEvent = {
      error: errorType,
      message: `Error: ${errorType}`,
    };

    mockSpeechRecognition.onerror(errorEvent as any);
  }

  describe("useSpeechSupport", () => {
    it("returns true when speech recognition is supported", () => {
      (features.speechRecognition as jest.Mock).mockReturnValue(true);

      function TestComponent() {
        const isSupported = useSpeechSupport();
        return (
          <div data-testid="result">
            {isSupported ? "supported" : "not supported"}
          </div>
        );
      }

      render(<TestComponent />);
      expect(screen.getByTestId("result")).toHaveTextContent("supported");
    });

    it("returns false when speech recognition is not supported", () => {
      (features.speechRecognition as jest.Mock).mockReturnValue(false);

      function TestComponent() {
        const isSupported = useSpeechSupport();
        return (
          <div data-testid="result">
            {isSupported ? "supported" : "not supported"}
          </div>
        );
      }

      render(<TestComponent />);
      expect(screen.getByTestId("result")).toHaveTextContent("not supported");
    });
  });

  describe("useSpeechRecognitionBasic", () => {
    function TestComponent() {
      const {
        transcript,
        isListening,
        error,
        isSupported,
        start,
        stop,
        reset,
      } = useSpeechRecognitionBasic();

      return (
        <div>
          <div data-testid="transcript">{transcript}</div>
          <div data-testid="isListening">{isListening ? "true" : "false"}</div>
          <div data-testid="isSupported">{isSupported ? "true" : "false"}</div>
          <div data-testid="error">{error ? error.message : "no error"}</div>
          <button data-testid="start" onClick={start}>
            Start
          </button>
          <button data-testid="stop" onClick={stop}>
            Stop
          </button>
          <button data-testid="reset" onClick={reset}>
            Reset
          </button>
        </div>
      );
    }

    it("initializes with correct default values", () => {
      render(<TestComponent />);

      expect(screen.getByTestId("transcript")).toHaveTextContent("");
      expect(screen.getByTestId("isListening")).toHaveTextContent("false");
      expect(screen.getByTestId("isSupported")).toHaveTextContent("true");
      expect(screen.getByTestId("error")).toHaveTextContent("no error");
    });

    it("starts listening when start is called", async () => {
      render(<TestComponent />);

      userEvent.click(screen.getByTestId("start"));

      await waitFor(() => {
        expect(screen.getByTestId("isListening")).toHaveTextContent("true");
      });
    });

    it("stops listening when stop is called", async () => {
      render(<TestComponent />);

      // Start listening first
      userEvent.click(screen.getByTestId("start"));
      await waitFor(() => {
        expect(screen.getByTestId("isListening")).toHaveTextContent("true");
      });

      // Then stop
      userEvent.click(screen.getByTestId("stop"));
      await waitFor(() => {
        expect(screen.getByTestId("isListening")).toHaveTextContent("false");
      });
    });

    it("updates transcript when speech is recognized", async () => {
      render(<TestComponent />);

      // Start listening
      userEvent.click(screen.getByTestId("start"));

      // Simulate a recognition result
      act(() => {
        simulateResult("hello world");
      });

      await waitFor(() => {
        expect(screen.getByTestId("transcript")).toHaveTextContent(
          "hello world"
        );
      });
    });

    it("resets transcript when reset is called", async () => {
      render(<TestComponent />);

      // Start and get a result
      userEvent.click(screen.getByTestId("start"));
      act(() => {
        simulateResult("hello world");
      });

      // Verify transcript was updated
      expect(screen.getByTestId("transcript")).toHaveTextContent("hello world");

      // Call reset
      userEvent.click(screen.getByTestId("reset"));

      // Wait for state update
      await waitFor(() => {
        expect(screen.getByTestId("transcript")).toBeEmptyDOMElement();
      });
    });

    it("sets error when speech recognition is not supported", async () => {
      (features.speechRecognition as jest.Mock).mockReturnValue(false);

      render(<TestComponent />);

      // Try to start
      userEvent.click(screen.getByTestId("start"));

      await waitFor(() => {
        expect(screen.getByTestId("error")).toHaveTextContent(
          "Speech recognition is not supported in this browser"
        );
      });
    });

    it("handles recognition errors correctly", async () => {
      render(<TestComponent />);

      // Start listening
      userEvent.click(screen.getByTestId("start"));

      // Simulate an error
      act(() => {
        simulateError("not-allowed");
      });

      await waitFor(() => {
        expect(screen.getByTestId("error")).toHaveTextContent(
          "Speech recognition error: not-allowed"
        );
        expect(screen.getByTestId("isListening")).toHaveTextContent("false");
      });
    });

    it("handles the 'already started' error gracefully", async () => {
      render(<TestComponent />);

      // Mock the start method to throw "already started" error on second call
      const originalStart = mockSpeechRecognition.start;
      let startCount = 0;
      mockSpeechRecognition.start = jest.fn(() => {
        startCount++;
        if (startCount === 1) {
          // First call works normally
          if (mockSpeechRecognition.onstart) {
            mockSpeechRecognition.onstart(new Event("start"));
          }
        } else {
          // Second call throws an error
          const error = new Error("already started");
          throw error;
        }
      });

      // Start first time
      userEvent.click(screen.getByTestId("start"));

      await waitFor(() => {
        expect(screen.getByTestId("isListening")).toHaveTextContent("true");
      });

      // Try to start again - should handle the error gracefully
      userEvent.click(screen.getByTestId("start"));

      // Still listening, no error
      expect(screen.getByTestId("isListening")).toHaveTextContent("true");
      expect(screen.getByTestId("error")).toHaveTextContent("no error");

      // Restore original function
      mockSpeechRecognition.start = originalStart;
    });

    it("handles the 'not started' error gracefully when stopping", async () => {
      render(<TestComponent />);

      // Mock the stop method to throw "not started" error
      const originalStop = mockSpeechRecognition.stop;
      mockSpeechRecognition.stop = jest.fn(() => {
        const error = new Error("not started");
        throw error;
      });

      // Start first
      userEvent.click(screen.getByTestId("start"));

      await waitFor(() => {
        expect(screen.getByTestId("isListening")).toHaveTextContent("true");
      });

      // Try to stop - should handle the error gracefully
      userEvent.click(screen.getByTestId("stop"));

      // Should not be listening anymore, no error
      await waitFor(() => {
        expect(screen.getByTestId("isListening")).toHaveTextContent("false");
      });
      expect(screen.getByTestId("error")).toHaveTextContent("no error");

      // Restore original function
      mockSpeechRecognition.stop = originalStop;
    });

    it("handles initialization error correctly", async () => {
      // Mock the speech recognition constructor to throw an error
      const speechUtils = require("../../utils/speech");
      const originalGetSpeechRecognition = speechUtils.getSpeechRecognition;

      speechUtils.getSpeechRecognition.mockImplementation(() => {
        return function MockErrorConstructor() {
          throw new Error("Failed to initialize");
        };
      });

      render(<TestComponent />);

      // Should show initialization error
      await waitFor(() => {
        expect(screen.getByTestId("error")).toHaveTextContent(
          "Failed to initialize speech recognition"
        );
      });

      // Restore original function
      speechUtils.getSpeechRecognition = originalGetSpeechRecognition;
    });
  });

  describe("useSpeechRecognition (full version)", () => {
    it("initializes with correct default values", () => {
      function TestComponent() {
        const result = useSpeechRecognition();
        return (
          <div>
            <div data-testid="transcript">{result.transcript}</div>
            <div data-testid="interimTranscript">
              {result.interimTranscript}
            </div>
            <div data-testid="finalTranscript">{result.finalTranscript}</div>
            <div data-testid="isListening">
              {result.isListening ? "true" : "false"}
            </div>
            <div data-testid="isSupported">
              {result.isSupported ? "true" : "false"}
            </div>
            <div data-testid="error">
              {result.error ? result.error.message : "no error"}
            </div>
          </div>
        );
      }

      render(<TestComponent />);

      expect(screen.getByTestId("transcript")).toHaveTextContent("");
      expect(screen.getByTestId("interimTranscript")).toHaveTextContent("");
      expect(screen.getByTestId("finalTranscript")).toHaveTextContent("");
      expect(screen.getByTestId("isListening")).toHaveTextContent("false");
      expect(screen.getByTestId("isSupported")).toHaveTextContent("true");
      expect(screen.getByTestId("error")).toHaveTextContent("no error");
    });

    it("applies custom options correctly", () => {
      // Create component
      function TestComponent() {
        const options = {
          continuous: true,
          interimResults: true,
          lang: "fr-FR",
          maxAlternatives: 2,
        };

        const result = useSpeechRecognition(options);

        return (
          <div>
            <button data-testid="start" onClick={result.start}>
              Start
            </button>
          </div>
        );
      }

      render(<TestComponent />);

      // Trigger useEffect by starting
      userEvent.click(screen.getByTestId("start"));

      // Verify options were applied
      expect(mockSpeechRecognition.continuous).toBe(true);
      expect(mockSpeechRecognition.interimResults).toBe(true);
      expect(mockSpeechRecognition.lang).toBe("fr-FR");
      expect(mockSpeechRecognition.maxAlternatives).toBe(2);
    });

    it("distinguishes between interim and final results", () => {
      // Create component with state access for testing
      let interimValue = "";
      let finalValue = "";
      let transcriptValue = "";

      function TestComponent() {
        const result = useSpeechRecognition({ interimResults: true });

        // Update test values
        interimValue = result.interimTranscript;
        finalValue = result.finalTranscript;
        transcriptValue = result.transcript;

        return (
          <div>
            <button data-testid="start" onClick={result.start}>
              Start
            </button>
          </div>
        );
      }

      render(<TestComponent />);

      // Start listening
      userEvent.click(screen.getByTestId("start"));

      // Simulate an interim result
      act(() => {
        simulateResult("interim text", false);
      });

      // Check transcripts - direct access to component state
      expect(interimValue).toBe("interim text");
      expect(finalValue).toBe("");
      expect(transcriptValue).toBe("interim text");

      // Simulate a final result
      act(() => {
        simulateResult("final text", true);
      });

      // Check transcripts again
      expect(interimValue).toBe("");
      expect(finalValue).toBe("final text");
      expect(transcriptValue).toBe("final text");
    });

    it("properly uses grammar list when provided", () => {
      // Set up grammar list
      const grammars = [
        '<grammar version="1.0" xml:lang="en-US">',
        "item1",
        "item2",
      ];

      function TestComponent() {
        const result = useSpeechRecognition({ grammars });
        return (
          <div>
            <button data-testid="start" onClick={result.start}>
              Start
            </button>
          </div>
        );
      }

      render(<TestComponent />);

      // Start listening to trigger setup
      userEvent.click(screen.getByTestId("start"));

      // Verify grammars were added correctly
      expect(mockGrammarList.addFromString).toHaveBeenCalledTimes(3);
      expect(mockGrammarList.addFromString).toHaveBeenCalledWith(
        grammars[0],
        1
      );
      expect(mockGrammarList.addFromString).toHaveBeenCalledWith(
        grammars[1],
        2
      );
      expect(mockGrammarList.addFromString).toHaveBeenCalledWith(
        grammars[2],
        3
      );
      expect(mockSpeechRecognition.grammars).toBe(mockGrammarList);
    });

    it("handles grammar list errors gracefully", () => {
      // Set up grammar list to throw error
      const grammars = ['<grammar version="1.0" xml:lang="en-US">'];
      mockGrammarList.addFromString.mockImplementation(() => {
        throw new Error("Failed to add grammar");
      });

      // Spy on console.warn
      jest.spyOn(console, "warn").mockImplementation(() => {});

      function TestComponent() {
        const result = useSpeechRecognition({ grammars });
        return (
          <div>
            <button data-testid="start" onClick={result.start}>
              Start
            </button>
            <div data-testid="isListening">
              {result.isListening ? "true" : "false"}
            </div>
          </div>
        );
      }

      render(<TestComponent />);

      // Start listening to trigger setup
      userEvent.click(screen.getByTestId("start"));

      // Should continue without grammar but log warning
      expect(console.warn).toHaveBeenCalledWith(
        "Failed to set up speech grammars:",
        expect.any(Error)
      );
    });

    it("processes multiple results correctly", () => {
      // Setup component with testable output
      function TestComponent() {
        const result = useSpeechRecognition({ interimResults: true });

        return (
          <div>
            <div data-testid="transcript">{result.transcript}</div>
            <div data-testid="interimTranscript">
              {result.interimTranscript}
            </div>
            <div data-testid="finalTranscript">{result.finalTranscript}</div>
            <button data-testid="start" onClick={result.start}>
              Start
            </button>
          </div>
        );
      }

      render(<TestComponent />);

      // Start listening
      act(() => {
        userEvent.click(screen.getByTestId("start"));
      });

      // Simulate results one by one
      act(() => {
        // First result - interim
        simulateResult("first interim", false);
      });

      expect(screen.getByTestId("interimTranscript")).toHaveTextContent(
        "first interim"
      );
      expect(screen.getByTestId("finalTranscript")).toHaveTextContent("");
      // The combined transcript should include both
      expect(screen.getByTestId("transcript")).toHaveTextContent(
        "first interim"
      );

      act(() => {
        // Second result - final
        simulateResult("first final", true);
      });

      expect(screen.getByTestId("interimTranscript")).toHaveTextContent("");
      expect(screen.getByTestId("finalTranscript")).toHaveTextContent(
        "first final"
      );
      expect(screen.getByTestId("transcript")).toHaveTextContent("first final");

      act(() => {
        // Third result - interim again
        simulateResult("second interim", false);
      });

      expect(screen.getByTestId("interimTranscript")).toHaveTextContent(
        "second interim"
      );
      expect(screen.getByTestId("finalTranscript")).toHaveTextContent(
        "first final"
      );
      expect(screen.getByTestId("transcript")).toHaveTextContent(
        "first finalsecond interim"
      );
    });

    it("resets all transcripts when reset is called", async () => {
      // Component with testable output
      function TestComponent() {
        const result = useSpeechRecognition({ interimResults: true });

        return (
          <div>
            <div data-testid="transcript">{result.transcript}</div>
            <div data-testid="interimTranscript">
              {result.interimTranscript}
            </div>
            <div data-testid="finalTranscript">{result.finalTranscript}</div>
            <button data-testid="start" onClick={result.start}>
              Start
            </button>
            <button data-testid="reset" onClick={result.reset}>
              Reset
            </button>
          </div>
        );
      }

      render(<TestComponent />);

      // Start and get results
      act(() => {
        userEvent.click(screen.getByTestId("start"));
      });

      // Directly update our mock values
      act(() => {
        simulateResult("final text", true);
      });

      // Verify transcript was updated
      expect(screen.getByTestId("transcript")).toHaveTextContent("final text");
      expect(screen.getByTestId("finalTranscript")).toHaveTextContent(
        "final text"
      );

      // Call reset
      userEvent.click(screen.getByTestId("reset"));

      // Wait for state update
      await waitFor(() => {
        expect(screen.getByTestId("transcript")).toBeEmptyDOMElement();
        expect(screen.getByTestId("interimTranscript")).toBeEmptyDOMElement();
        expect(screen.getByTestId("finalTranscript")).toBeEmptyDOMElement();
      });
    });
  });
});
