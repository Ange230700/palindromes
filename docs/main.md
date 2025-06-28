<!-- docs\main.md -->

# **Algorithmic Description of `main.ts`**

## `computeClues(guessArray, secretArray)`

The function `computeClues` compares a player's guess (`guessArray`) with the secret code (`secretArray`) and returns the breakdown of:

- **wellPlacedColors**: Colors that are correct and in the correct position.
- **misplacedColors**: Colors present in the secret code but in the wrong position.
- **notInCodeColors**: Colors not present in the secret code.

**Algorithm Steps:**

1. **Check Array Lengths**
   - If the guess and secret arrays are not the same length, treat all guesses as not in the code and return early.

2. **Find Well-Placed Colors**
   - Loop through each index.
   - If the guess at that index equals the secret at that index, add to `wellPlacedColors`.
   - Otherwise, add both values to separate "leftover" arrays for further processing.

3. **Find Misplaced and Not-In-Code Colors**
   - For each color left over in the guess:
     - If that color exists in the leftover secret array, it is a misplaced color. Remove one occurrence from the leftover secret.
     - Otherwise, it is not in the code.

4. **Return Clues**
   - Return an object with the three arrays: `wellPlacedColors`, `misplacedColors`, and `notInCodeColors`.

**Pseudocode Example:**

```plaintext
if guessArray.length != secretArray.length:
    return all guess colors as notInCodeColors

for each index i:
    if guessArray[i] == secretArray[i]:
        add to wellPlacedColors
    else:
        add guessArray[i] to leftoverGuess
        add secretArray[i] to leftoverSecret

for each color in leftoverGuess:
    if color in leftoverSecret:
        add to misplacedColors
        remove one instance from leftoverSecret
    else:
        add to notInCodeColors

return { wellPlacedColors, misplacedColors, notInCodeColors }
```
