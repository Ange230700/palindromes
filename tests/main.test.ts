// tests/main.test.ts
import {
  separateDate,
  isValidDate,
  isPalindrome,
  skipToNextDay,
  getNextPalindromes,
} from "~/src/main";

describe("separateDate", () => {
  it("returns correct values for valid date", () => {
    expect(separateDate("02/04/2024")).toEqual({
      dayNumber: 2,
      monthNumber: 4,
      yearNumber: 2024,
    });
    expect(separateDate("31/12/1999")).toEqual({
      dayNumber: 31,
      monthNumber: 12,
      yearNumber: 1999,
    });
  });

  it("returns undefined for invalid format", () => {
    expect(separateDate("2024-04-02")).toBeUndefined();
    expect(separateDate("02/04/24")).toBeUndefined();
    expect(separateDate("")).toBeUndefined();
    expect(separateDate("abcd")).toBeUndefined();
  });
});

describe("isValidDate", () => {
  it("accepts valid dates", () => {
    expect(isValidDate("29/02/2024")).toBe(true); // Leap year
    expect(isValidDate("28/02/2023")).toBe(true);
    expect(isValidDate("31/01/2023")).toBe(true);
  });

  it("rejects impossible days/months/years", () => {
    expect(isValidDate("31/02/2024")).toBe(false); // February never has 31
    expect(isValidDate("30/02/2023")).toBe(false); // February 2023
    expect(isValidDate("29/02/2023")).toBe(false); // 2023 is not a leap year
    expect(isValidDate("32/01/2023")).toBe(false); // Too many days
    expect(isValidDate("00/01/2023")).toBe(false); // Day too low
    expect(isValidDate("01/13/2023")).toBe(false); // Month too high
    expect(isValidDate("01/00/2023")).toBe(false); // Month too low
    expect(isValidDate("01/01/999")).toBe(false); // Year too low
    expect(isValidDate("01/01/10000")).toBe(false); // Year too high
  });

  it("rejects wrong formats", () => {
    expect(isValidDate("2024-04-02")).toBe(false);
    expect(isValidDate("2/4/2024")).toBe(false);
    expect(isValidDate("")).toBe(false);
    expect(isValidDate("not a date")).toBe(false);
  });
});

describe("isPalindrome", () => {
  it("identifies palindromic dates", () => {
    expect(isPalindrome("02/02/2020")).toBe(true); // 02022020
    expect(isPalindrome("12/02/2021")).toBe(true); // 12022021
    expect(isPalindrome("12/12/2021")).toBe(false); // 12122021
    expect(isPalindrome("03/02/2030")).toBe(true); // 03022030
  });

  it("rejects invalid dates", () => {
    expect(isPalindrome("31/02/2024")).toBe(false);
    expect(isPalindrome("02-02-2020")).toBe(false);
    expect(isPalindrome("not a date")).toBe(false);
  });
});

describe("skipToNextDay", () => {
  it("skips to the next day in the same month", () => {
    expect(skipToNextDay("02/04/2024")).toBe("03/04/2024");
    expect(skipToNextDay("30/04/2024")).toBe("01/05/2024");
  });

  it("skips to the next month and year correctly", () => {
    expect(skipToNextDay("31/12/2024")).toBe("01/01/2025");
    expect(skipToNextDay("28/02/2023")).toBe("01/03/2023"); // Not leap year
    expect(skipToNextDay("28/02/2024")).toBe("29/02/2024"); // Leap year
    expect(skipToNextDay("29/02/2024")).toBe("01/03/2024"); // Leap year
  });

  it("returns input if date is invalid", () => {
    expect(skipToNextDay("not a date")).toBe("not a date");
    expect(skipToNextDay("31/02/2024")).toBe("31/02/2024");
  });
});

describe("getNextPalindromes", () => {
  it("finds next palindromic dates after 02/02/2020", () => {
    // After 02/02/2020, the next palindromic date is 12/02/2021
    expect(getNextPalindromes(1, "02/02/2020")).toEqual(["12/02/2021"]);
  });

  it("returns correct number of palindromes", () => {
    // The next two after 02/02/2020 are 12/02/2021 and 03/02/2030
    expect(getNextPalindromes(2, "02/02/2020")).toEqual([
      "12/02/2021",
      "22/02/2022",
    ]);
  });

  it("returns undefined if not enough palindromes found in a short test range", () => {
    // e.g., impossible date
    expect(getNextPalindromes(1, "99/99/9999")).toBeUndefined();
  });
});
