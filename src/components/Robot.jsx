import { COMMANDS } from "./Cammand";
import { getlunaResponse } from "./AI";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import RobotModel from "./RobotModel";
import "../styles/Robot.css";
import Groq from "groq-sdk";

const Robot = () => {

  const [faceTarget, setFaceTarget] = useState(null);
  const [micOpen, setMicOpen] = useState(false);
  const [showWait, setShowWait] = useState(false);
  const robotRef = useRef(null);
  const recognitionRef = useRef(null);
  const micOpenRef = useRef(false);
  const shouldListenRef = useRef(true);
  const restartTimerRef = useRef(null);
  const processingRef = useRef(false);

  const normalizeText = (text) => {
    return String(text || "").toLowerCase().trim().replace(/\s+/g, " ");
  };

  const EXTENSION_ID = "bbkbbmibijbnlmdpeeanfkhfjjegahje";

  const sendToExtension = (message) => {
    if (typeof chrome === "undefined" || !chrome.runtime || typeof chrome.runtime.sendMessage !== "function") {
      console.log("Luna extension is not available.");
      return;
    }

    chrome.runtime.sendMessage(EXTENSION_ID, message, (response) => {
      if (chrome.runtime.lastError) {
        console.log("Extension:", chrome.runtime.lastError.message);
        return;
      }

      console.log("Extension response:", response);
    });
  };

  useEffect(() => {
    sendToExtension({type: "SAVE_WEBSITE_URL", url: window.location.href});
    sendToExtension({type: "START_EXTENSION_LUNA"});
  }, []);

  const wait = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };

  const getPageName = () => {
    const path = window.location.pathname;

    if (!path || path === "/") {
      return "Home";
    }

    const page = path.split("/").filter(Boolean).pop();

    if (!page) {
      return "Home";
    }

    return page.replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const speak = (text) => {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const message = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();

    const femaleVoice = voices.find((voice) => /Microsoft Zira|Google UK English Female|Samantha/i.test(voice.name)) || voices.find((voice) => voice.lang.startsWith("en") && /female|woman|zira|samantha/i.test(voice.name)) || voices.find((voice) => voice.lang.startsWith("en"));

    if (femaleVoice) {
      message.voice = femaleVoice;
    }

    message.lang = "en-PK";
    message.rate = 0.9;
    message.pitch = 1.01;
    message.volume = 1;

    message.onstart = () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };

    message.onend = () => {
      if (shouldListenRef.current && !document.hidden) {
        restartRecognition(300);
      }
    };

    message.onerror = () => {
      if (shouldListenRef.current && !document.hidden) {
        restartRecognition(300);
      }
    };

    window.speechSynthesis.speak(message);
  };

  const groq = new Groq({apiKey: import.meta.env.VITE_GROQ_API_KEY, dangerouslyAllowBrowser: true});

  const getElementText = (element) => {
    if (!element) {
      return "";
    }

    return normalizeText(element.textContent || element.getAttribute("aria-label") || element.getAttribute("placeholder") || element.getAttribute("name") || element.getAttribute("id") || "");
  };

  const findInputByName = (name) => {
    const wantedName = normalizeText(name);

    if (!wantedName) {
      return null;
    }

    const labels = document.querySelectorAll("label");

    for (const label of labels) {
      const labelText = normalizeText(label.textContent);

      if (labelText !== wantedName) {
        continue;
      }

      if (label.htmlFor) {
        const input = document.getElementById(label.htmlFor);

        if (input && input.matches("input, textarea, select")) {
          return input;
        }
      }

      const insideInput = label.querySelector("input, textarea, select");

      if (insideInput) {
        return insideInput;
      }

      const parentInput = label.parentElement?.querySelector("input, textarea, select");

      if (parentInput) {
        return parentInput;
      }
    }

    const spans = document.querySelectorAll("span");

    for (const span of spans) {
      const spanText = normalizeText(span.textContent);

      if (spanText !== wantedName) {
        continue;
      }

      const insideInput = span.querySelector("input, textarea, select");

      if (insideInput) {
        return insideInput;
      }

      const parentInput = span.parentElement?.querySelector("input, textarea, select");

      if (parentInput) {
        return parentInput;
      }

      let sibling = span.nextElementSibling;

      while (sibling) {
        if (sibling.matches?.("input, textarea, select")) {
          return sibling;
        }

        const nestedInput = sibling.querySelector?.("input, textarea, select");

        if (nestedInput) {
          return nestedInput;
        }

        sibling = sibling.nextElementSibling;
      }
    }

    const fields = document.querySelectorAll("input, textarea, select");

    for (const field of fields) {
      const values = [field.getAttribute("placeholder"), field.getAttribute("name"), field.getAttribute("id"), field.getAttribute("aria-label")];

      for (const value of values) {
        if (normalizeText(value) === wantedName) {
          return field;
        }
      }
    }

    return null;
  };

  const findButtonByName = (name) => {
    let wantedName = normalizeText(name);

    wantedName = wantedName.replace(/\s+button$/, "").trim();

    if (!wantedName) {
      return null;
    }

    const buttons = document.querySelectorAll("button, input[type='button'], input[type='submit'], [role='button']");

    for (const button of buttons) {
      const buttonText = getElementText(button);

      if (buttonText === wantedName) {
        return button;
      }
    }

    for (const button of buttons) {
      const buttonText = getElementText(button);

      if (buttonText.includes(wantedName) || wantedName.includes(buttonText)) {
        return button;
      }
    }

    return null;
  };

  const getRobotPosition = () => {
    if (!robotRef.current) {
      return {x: 0, y: 0};
    }

    return {
      x: Number(gsap.getProperty(robotRef.current, "x") || 0),
      y: Number(gsap.getProperty(robotRef.current, "y") || 0)
    };
  };

  const moveRobotTo = (target) => {
    return new Promise((resolve) => {
      if (!robotRef.current || !target) {
        resolve();
        return;
      }

      const robot = robotRef.current;
      const robotRect = robot.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      const targetX = targetRect.left + targetRect.width / 2;
      const targetY = targetRect.top + targetRect.height / 2;
      const robotX = robotRect.left + robotRect.width / 2;
      const robotY = robotRect.top + robotRect.height / 2;

      const moveX = targetX - robotX;
      const moveY = targetY - robotY;

      setFaceTarget({x: moveY, y: moveX});

      gsap.killTweensOf(robot);

      gsap.to(robot, {x: `+=${moveX}`, y: `+=${moveY}`, duration: 1.1, ease: "power2.inOut", overwrite: true, onComplete: resolve, onInterrupt: resolve});
    });
  };

  const returnRobotHome = (homePosition) => {
    return new Promise((resolve) => {
      if (!robotRef.current) {
        resolve();
        return;
      }

      const robot = robotRef.current;
      const current = getRobotPosition();

      const moveX = homePosition.x - current.x;
      const moveY = homePosition.y - current.y;

      setFaceTarget({x: moveY, y: moveX});

      gsap.to(robot, {
        x: homePosition.x,
        y: homePosition.y,
        duration: 1,
        ease: "power2.inOut",
        overwrite: true,
        onComplete: () => {
          setFaceTarget(null);
          resolve();
        },
        onInterrupt: () => {
          setFaceTarget(null);
          resolve();
        }
      });
    });
  };

  const typeValue = async (input, value) => {
    if (!input) {
      return;
    }

    input.focus();
    input.value = "";

    input.dispatchEvent(new Event("input", {bubbles: true}));

    for (const character of String(value)) {
      input.value += character;
      input.dispatchEvent(new Event("input", {bubbles: true}));
      await wait(45);
    }

    input.dispatchEvent(new Event("change", {bubbles: true}));
    input.blur();
  };

  const fillInput = async (input, value) => {
    if (!input) {
      return;
    }

    const homePosition = getRobotPosition();

    await moveRobotTo(input);
    await wait(700);

    setShowWait(true);

    await wait(1200);

    setShowWait(false);

    await typeValue(input, value);

    await wait(700);

    await returnRobotHome(homePosition);
  };

  const handleFieldCommand = async (command) => {
    const match = command.match(/^(.+?)\s+is\s+(.+)$/i);

    if (!match) {
      return;
    }

    const fieldName = match[1].trim();
    const value = match[2].trim();

    console.log("🎯 Field:", fieldName);
    console.log("📝 Value:", value);

    const input = findInputByName(fieldName);

    if (!input) {
      speak(`I could not find the ${fieldName} field.`);
      return;
    }

    await fillInput(input, value);
  };

  const clickButton = async (button) => {
    if (!button) {
      return;
    }

    const homePosition = getRobotPosition();

    await moveRobotTo(button);

    setShowWait(true);

    await wait(450);

    setShowWait(false);

    button.click();

    await returnRobotHome(homePosition);
  };

  const handleClickCommand = async (command) => {
    let buttonName = command.replace(/^click\s+/i, "").trim();

    buttonName = buttonName.replace(/\s+button$/i, "").trim();

    if (!buttonName) {
      return;
    }

    const button = findButtonByName(buttonName);

    if (!button) {
      speak(`I could not find the ${buttonName} button.`);
      return;
    }

    await clickButton(button);
  };

  const scrollDown = () => {
    window.scrollBy({top: window.innerHeight * 0.7, behavior: "smooth"});
  };

  const scrollUp = () => {
    window.scrollBy({top: -window.innerHeight * 0.7, behavior: "smooth"});
  };

  const scrollBottom = () => {
    window.scrollTo({top: document.documentElement.scrollHeight, behavior: "smooth"});
  };

  const handleCommand = async (rawCommand) => {
    if (processingRef.current) {
      return;
    }

    const command = normalizeText(rawCommand);

    console.log("🎤 Heard:", command);

    if (!command) {
      return;
    }

    if (!micOpenRef.current) {
      if (command === COMMANDS.OPEN) {
        micOpenRef.current = true;
        setMicOpen(true);
        speak("Can I help you?");
      }

      return;
    }

    if (command === COMMANDS.CLOSE) {
      micOpenRef.current = false;
      setMicOpen(false);
      setShowWait(false);
      processingRef.current = false;
      window.speechSynthesis.cancel();

      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }

      if (robotRef.current) {
        gsap.killTweensOf(robotRef.current);
        gsap.to(robotRef.current, {x: 0, y: 0, duration: 0.7, ease: "power2.out"});
      }

      return;
    }

    processingRef.current = true;

    if (command === "open my website" || command === "open your website") {
      sendToExtension({type: "OPEN_WEBSITE"});
      speak("Opening my website");
      return;
    }

    try {
      if (command === COMMANDS.SCROLL_DOWN) {
        scrollDown();
        return;
      }

      if (command === COMMANDS.SCROLL_UP) {
        scrollUp();
        return;
      }

      if (command === COMMANDS.SCROLL_BOTTOM) {
        scrollBottom();
        return;
      }

      if (command.startsWith("click ")) {
        await handleClickCommand(command);
        return;
      }

      if (/\s+is\s+/i.test(command)) {
        await handleFieldCommand(rawCommand);
        return;
      }

      const response = await getlunaResponse(rawCommand);

      if (response) {
        speak(response);
      }
    } finally {
      processingRef.current = false;
    }
  };

  const restartRecognition = (delay = 500) => {
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
    }

    restartTimerRef.current = setTimeout(() => {
      if (shouldListenRef.current && !document.hidden && !window.speechSynthesis.speaking) {
        startListening();
      }
    }, delay);
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.log("❌ Speech Recognition is not supported.");
      return;
    }

    if (recognitionRef.current) {
      return;
    }

    if (!shouldListenRef.current || document.hidden) {
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log("🎤 Jenny listener started");
    };

    recognition.onresult = (event) => {
      const lastResult = event.results[event.results.length - 1];

      if (!lastResult) {
        return;
      }

      const transcript = lastResult[0]?.transcript?.trim();

      if (!transcript) {
        return;
      }

      console.log("🎤 Transcript:", transcript);

      handleCommand(transcript);
    };

    recognition.onerror = (event) => {
      console.log("🎤 Jenny MIC:", event.error);

      if (["aborted", "no-speech", "network", "audio-capture"].includes(event.error)) {
        return;
      }

      if (event.error === "not-allowed") {
        console.log("❌ Microphone permission denied.");
      }
    };

    recognition.onend = () => {
      if (recognitionRef.current === recognition) {
        recognitionRef.current = null;
      }

      console.log("🎤 Jenny recognition ended");

      if (!shouldListenRef.current || document.hidden) {
        return;
      }

      restartRecognition(500);
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (error) {
      recognitionRef.current = null;
      console.log("Recognition start error:", error);
      restartRecognition(1000);
    }
  };

  useEffect(() => {
    shouldListenRef.current = true;

    const handleVisibility = () => {
      if (document.hidden) {
        micOpenRef.current = false;
        setMicOpen(false);
        setShowWait(false);
        processingRef.current = false;
        window.speechSynthesis.cancel();

        if (recognitionRef.current) {
          recognitionRef.current.onend = null;

          try {
            recognitionRef.current.stop();
          } catch {}

          recognitionRef.current = null;
        }

        if (robotRef.current) {
          gsap.killTweensOf(robotRef.current);
          gsap.set(robotRef.current, {x: 0, y: 0});
        }

        return;
      }

      micOpenRef.current = false;
      setMicOpen(false);
      setShowWait(false);
      processingRef.current = false;

      restartRecognition(300);
    };

    document.addEventListener("visibilitychange", handleVisibility);

    startListening();

    return () => {
      shouldListenRef.current = false;

      if (restartTimerRef.current) {
        clearTimeout(restartTimerRef.current);
      }

      document.removeEventListener("visibilitychange", handleVisibility);

      if (recognitionRef.current) {
        recognitionRef.current.onend = null;

        try {
          recognitionRef.current.stop();
        } catch {}

        recognitionRef.current = null;
      }

      window.speechSynthesis.cancel();

      if (robotRef.current) {
        gsap.killTweensOf(robotRef.current);
      }
    };
  }, []);

  return (
    <div className={`robot ${micOpen ? "robot-active" : "robot-sleep"}`} ref={robotRef}>
      {showWait && <div className="robot-wait">Wait...</div>}

      <Canvas camera={{position: [0, 1.5, 6], fov: 35}} dpr={[1, 2]} gl={{antialias: true, alpha: true}}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[3, 5, 5]} intensity={3} />
        <directionalLight position={[-3, 2, 3]} intensity={1.5} />
        <Environment preset="studio" />
        <RobotModel isActive={micOpen} faceTarget={faceTarget} />
      </Canvas>
    </div>
  );
};

export default Robot;