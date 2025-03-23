import { useState } from "react";
import styles from "./typingbox.module.css";

export default function TypingBox() {
  // State to hold the full text the user will type
  const [totalText, setTotalText] = useState(
    "If you want to build a ship, don't drum up the people to gather wood, divide the work, and give orders. Instead, teach them to yearn for the vast endless sea."
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

  // Function to handle user input
  const handleInput = (e) => {
    if (!startTime) {
      setStartTime(Date.now()); // Start the timer on the first key press
    }

    const currentWord = words[activeWord]; // Get the current word
    const currentChar = currentWord[activeChar]; // Get the current character in the word

    // Ignore non-character keys (e.g., Shift, Ctrl, etc.)
    if (e.key.length > 1 && e.key !== "Backspace" && e.key !== " ") {
      return;
    }

    // Prevent layout shifts by ensuring consistent rendering
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default behavior of Enter key
      return;
    }

    // Prevent typing beyond the length of the current word
    if (
      activeChar >= currentWord.length &&
      e.key !== "Backspace" &&
      e.key !== " "
    ) {
      return;
    }

    // If the user types the correct character
    if (e.key === currentChar) {
      console.log("Correct");

      // Update the typedWords state to store the correct character
      setTypedWords((prev) => {
        const updated = [...prev];
        updated[activeWord][activeChar] = e.key; // Replace null with the typed character
        return updated;
      });

      setActiveChar((prev) => prev + 1); // Move to the next character

      // Check if the current word is completed
      if (activeChar + 1 === currentWord.length) {
        if (activeWord + 1 === words.length) {
          // If it's the last word, mark the test as completed
          setIsCompleted(true);
          calculateResults(); // Calculate WPM and accuracy
        }
      }
    } else if (e.key === " ") {
      // Handle spacebar input
      e.preventDefault(); // Prevent adding a space in the input

      // Only allow space if the current word is fully typed
      if (activeChar === currentWord.length) {
        if (activeWord + 1 < words.length) {
          setActiveWord((prev) => prev + 1); // Move to the next word
          setActiveChar(0); // Reset character index for the new word
        }
      } else {
        console.log("Space pressed before completing the word");
      }
    } else if (e.key === "Backspace") {
      // Handle backspace input
      console.log("Backspace pressed");

      // Remove the last typed character
      if (activeChar > 0) {
        setTypedWords((prev) => {
          const updated = [...prev];
          updated[activeWord][activeChar - 1] = null; // Clear the last character
          return updated;
        });

        setActiveChar((prev) => prev - 1); // Move back one character
      }
    } else {
      // If the user types an incorrect character
      console.log("Incorrect");

      setMistakes((prev) => prev + 1); // Increment the mistake counter

      // Store the incorrect character in the typedWords state
      setTypedWords((prev) => {
        const updated = [...prev];
        updated[activeWord][activeChar] = e.key; // Replace null with the incorrect character
        return updated;
      });

      setActiveChar((prev) => prev + 1); // Move to the next character
    }
  };

  // Function to calculate WPM and accuracy
  const calculateResults = () => {
    const endTime = Date.now(); // Get the end time
    const timeInMinutes = (endTime - startTime) / 60000; // Convert time to minutes

    // Calculate WPM
    const totalWordsTyped = activeWord + 1; // Total words typed
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

    const calculatedAccuracy = Math.round(
      ((totalTypedChars - mistakes) / totalTypedChars) * 100
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
  };

  // Render the typing box and results
  return (
    <div className={styles.container}>
      {!isCompleted ? (
        <div className={styles.typingbox}>
          <div className={styles.staticText}>
            {/* Pre-render the full text to ensure consistent layout */}
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
                  if (typedWords[wordIndex][charIndex] === letter) {
                    charClass = styles.correctChar; // Correctly typed characters
                  } else if (
                    typedWords[wordIndex][charIndex] !== null &&
                    typedWords[wordIndex][charIndex] !== letter
                  ) {
                    charClass = styles.incorrectChar; // Incorrectly typed characters
                  }

                  return (
                    <span key={charIndex} className={charClass}>
                      {/* Render the cursor before the current character */}
                      {!isCompleted &&
                        activeWord === wordIndex &&
                        activeChar === charIndex && (
                          <span className={styles.cursor}></span>
                        )}
                      {typedWords[wordIndex][charIndex] || letter}
                    </span>
                  );
                })}
                {/* Render the cursor at the end of the word */}
                {!isCompleted &&
                  activeWord === wordIndex &&
                  activeChar === word.length && (
                    <span className={styles.cursor}></span>
                  )}{" "}
              </span>
            ))}
          </div>
          {/* Invisible input to capture user input */}
          <input
            className={styles.inputArea}
            type="text"
            onKeyDown={handleInput}
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
