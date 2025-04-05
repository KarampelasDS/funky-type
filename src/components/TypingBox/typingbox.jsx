import { useState, useRef, useEffect } from "react";
import styles from "./typingbox.module.css";

export default function TypingBox() {
  // State to hold the full text the user will type
  const [totalText] = useState(
    "Child think mother is my protector who  from all bad , but what is , if mother herself Yo child life in risk by break child swear continuously, is it not betrayal to that child and child feelings ? What is the meaning of love ? That kiss every day and say I love you ? Or cooking good food and buy new dress and toys ? Take care of life ,or love is mean to respect feelings ? If it is love then why there is no fear of life and why there is no respect of feelings.Doesn't matter its your beloved or child'Respect of feelings is The love."
  );

  // Split the full text into an array of words
  const words = totalText.split(" ");

  // State to track the current word and character the user is typing
  const [activeWord, setActiveWord] = useState(0); // Index of the current word
  const [activeChar, setActiveChar] = useState(0); // Index of the current character in the word

  // State to track the user's typed characters for each word
  const [typedWords, setTypedWords] = useState(
    words.map((word) => Array(word.length).fill(null)) // Initialize with null for each character
  );

  // State to track the typing test's progress and results
  const [startTime, setStartTime] = useState(null); // When the typing test starts
  const [isCompleted, setIsCompleted] = useState(false); // Whether the test is completed
  const [wpm, setWpm] = useState(0); // Words per minute
  const [accuracy, setAccuracy] = useState(0); // Accuracy percentage
  const [mistakes, setMistakes] = useState(0); // Total mistakes made

  // State to track whether the input field is focused
  const [isFocused, setIsFocused] = useState(false);

  // Ref to track the input field for focusing
  const inputRef = useRef(null);

  // Focus the input field on page load
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Function to handle user input
  const handleInput = (e) => {
    // Start the timer only when the user types their first character
    if (!startTime) {
      setStartTime(Date.now());
    }

    const currentWord = words[activeWord]; // Get the current word
    const currentChar =
      activeChar < currentWord.length ? currentWord[activeChar] : " "; // Handle spaces between words

    // Ignore non-character keys (e.g., Shift, Ctrl, etc.)
    if (e.key.length > 1 && e.key !== "Backspace" && e.key !== " ") {
      return;
    }

    // If the user types the correct character (including spaces)
    if (e.key === currentChar) {
      setTypedWords((prev) => {
        const updated = [...prev];
        if (activeChar < currentWord.length) {
          updated[activeWord][activeChar] = true; // Mark the character as correct
        }
        return updated;
      });

      if (activeChar < currentWord.length) {
        setActiveChar((prev) => prev + 1); // Move to the next character
      } else if (e.key === " ") {
        // Handle spacebar input
        if (activeWord + 1 < words.length) {
          setActiveWord((prev) => prev + 1); // Move to the next word
          setActiveChar(0); // Reset character index for the new word
        }
      }

      // Check if the current word is completed
      if (
        activeChar + 1 === currentWord.length &&
        activeWord + 1 === words.length
      ) {
        setIsCompleted(true); // Mark the test as completed
        calculateResults(); // Calculate WPM and accuracy
      }
    } else if (e.key === "Backspace") {
      // Handle backspace input
      if (activeChar > 0) {
        setTypedWords((prev) => {
          const updated = [...prev];
          updated[activeWord][activeChar - 1] = null; // Clear the last character
          return updated;
        });

        setActiveChar((prev) => prev - 1); // Move back one character
      } else if (activeWord > 0) {
        // Move back to the previous word
        setActiveWord((prev) => prev - 1);
        setActiveChar(words[activeWord - 1].length); // Set character index to the end of the previous word
      }
    } else {
      // If the user types an incorrect character
      setMistakes((prev) => prev + 1); // Increment the mistake counter

      setTypedWords((prev) => {
        const updated = [...prev];
        if (activeChar < currentWord.length) {
          updated[activeWord][activeChar] = false; // Mark the character as incorrect
        }
        return updated;
      });

      if (activeChar < currentWord.length) {
        setActiveChar((prev) => prev + 1); // Move to the next character
      }
    }
  };

  // Function to calculate WPM and accuracy
  const calculateResults = () => {
    const endTime = Date.now(); // Get the end time
    const timeInMinutes = (endTime - startTime) / 60000; // Convert time to minutes

    // Calculate WPM
    const totalWordsTyped = words.slice(0, activeWord + 1).length; // Total words typed
    const calculatedWpm = Math.round(totalWordsTyped / timeInMinutes);
    setWpm(calculatedWpm);

    // Calculate accuracy
    let totalTypedChars = 0;

    typedWords.forEach((word) => {
      word.forEach((char) => {
        if (char !== null) {
          totalTypedChars++; // Count all typed characters
        }
      });
    });

    // Ensure accuracy is never negative
    const correctChars = totalTypedChars - mistakes;
    const calculatedAccuracy = Math.max(
      Math.round((correctChars / totalTypedChars) * 100),
      0
    );
    setAccuracy(calculatedAccuracy);
  };

  // Function to reset the test
  const retryTest = () => {
    setActiveWord(0); // Reset word index
    setActiveChar(0); // Reset character index
    setTypedWords(words.map((word) => Array(word.length).fill(null))); // Reset typedWords
    setStartTime(null); // Reset start time
    setIsCompleted(false); // Reset completion status
    setWpm(0); // Reset WPM
    setAccuracy(0); // Reset accuracy
    setMistakes(0); // Reset mistakes

    // Focus the input field after resetting with a slight delay
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  // Render the typing box and results
  return (
    <div className={styles.container}>
      {!isCompleted ? (
        <div className={styles.typingbox}>
          <div className={styles.staticText}>
            {words.map((word, wordIndex) => (
              <span
                key={wordIndex}
                className={
                  !isCompleted && activeWord === wordIndex
                    ? styles.activeWord // Highlight the active word
                    : ""
                }
              >
                {word.split("").map((letter, charIndex) => {
                  let charClass = "";

                  // Apply styles for correct and incorrect characters
                  if (typedWords[wordIndex][charIndex] === true) {
                    charClass = styles.correctChar; // Correctly typed characters
                  } else if (typedWords[wordIndex][charIndex] === false) {
                    charClass = styles.incorrectChar; // Incorrectly typed characters
                  }

                  return (
                    <span key={charIndex} className={charClass}>
                      {/* Render the cursor before the current character */}
                      {!isCompleted &&
                        isFocused &&
                        activeWord === wordIndex &&
                        activeChar === charIndex && (
                          <span className={styles.cursor}></span>
                        )}
                      {letter}
                    </span>
                  );
                })}
                {/* Render the cursor at the end of the word */}
                {!isCompleted &&
                  isFocused &&
                  activeWord === wordIndex &&
                  activeChar === word.length && (
                    <span className={styles.cursor}></span>
                  )}{" "}
              </span>
            ))}
          </div>
          {/* Invisible input to capture user input */}
          <input
            ref={inputRef} // Attach the ref to the input field
            className={styles.inputArea}
            type="text"
            onKeyDown={handleInput}
            onFocus={() => setIsFocused(true)} // Set focus state to true
            onBlur={() => setIsFocused(false)} // Set focus state to false
            value={""}
          />
        </div>
      ) : (
        // Display results when the test is completed
        <div className={styles.results}>
          <h1>WPM: {wpm}</h1>
          <h1>Accuracy: {accuracy}%</h1>
          <button className={styles.retryButton} onClick={retryTest}>
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
