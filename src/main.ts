// src\main.ts

type DateSeparated = {
  dayNumber: number;
  monthNumber: number;
  yearNumber: number;
};

export function separateDate(date: string): DateSeparated | undefined {
  if (typeof date !== "string") {
    return;
  }

  if (date.length !== 10) {
    return;
  }

  if (date[2] !== "/" || date[5] !== "/") {
    return;
  }

  let dayNumber = 0;
  let monthNumber = 0;
  let yearNumber = 0;
  let datePart = "";

  for (let position = 0; position < date.length; position++) {
    if (position === 2 && date[position] === "/") {
      dayNumber = parseInt(datePart, 10);
      datePart = "";
    }

    if (position === 5 && date[position] === "/") {
      monthNumber = parseInt(datePart, 10);
      datePart = "";
    }

    if (date[position] === "/") {
      continue;
    }

    datePart += date[position];

    if (position === date.length - 1) {
      yearNumber = parseInt(datePart, 10);
      datePart = "";
    }
  }

  return {
    dayNumber: dayNumber,
    monthNumber: monthNumber,
    yearNumber: yearNumber,
  };
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function isValidDate(date: string): boolean {
  // Enforce format first
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(date)) return false;

  // Extract numbers
  const [dayStr, monthStr, yearStr] = date.split("/");
  const day = parseInt(dayStr, 10);
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr, 10);

  if (
    isNaN(day) ||
    isNaN(month) ||
    isNaN(year) ||
    day < 1 ||
    month < 1 ||
    month > 12 ||
    year < 1000 ||
    year > 9999
  ) {
    return false;
  }

  // Days in each month, adjust February for leap years
  const daysInMonth = [
    31,
    isLeapYear(year) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  if (day > daysInMonth[month - 1]) {
    return false;
  }

  // Optional: check if creating a Date object gives same day/month/year (catches weird overflows)
  const jsDate = new Date(year, month - 1, day);
  if (
    jsDate.getFullYear() !== year ||
    jsDate.getMonth() + 1 !== month ||
    jsDate.getDate() !== day
  ) {
    return false;
  }

  return true;
}

function rewriteDateWithoutSlash(dateSeparated: DateSeparated): string {
  if (dateSeparated.dayNumber < 10 && dateSeparated.monthNumber < 10) {
    return `0${dateSeparated.dayNumber}0${dateSeparated.monthNumber}${dateSeparated.yearNumber}`;
  }

  if (dateSeparated.dayNumber < 10) {
    return `0${dateSeparated.dayNumber}${dateSeparated.monthNumber}${dateSeparated.yearNumber}`;
  }

  if (dateSeparated.monthNumber < 10) {
    return `${dateSeparated.dayNumber}0${dateSeparated.monthNumber}${dateSeparated.yearNumber}`;
  }

  return `${dateSeparated.dayNumber}${dateSeparated.monthNumber}${dateSeparated.yearNumber}`;
}

export function isPalindrome(date: string): boolean {
  if (!isValidDate(date)) {
    return false;
  }

  const dateSeparated = separateDate(date);
  if (!dateSeparated) return false;

  const dateWithoutSlash = rewriteDateWithoutSlash(dateSeparated);

  for (
    let index1 = 0, index2 = dateWithoutSlash.length - 1;
    index1 <= index2;
    index1++, index2--
  ) {
    if (dateWithoutSlash[index1] !== dateWithoutSlash[index2]) {
      return false;
    }
  }

  return true;
}

export function skipToNextDay(date: string): string {
  if (!isValidDate(date)) return date;

  const dateSeparated = separateDate(date);
  if (!dateSeparated) return date;

  const daysInMonth = [
    31,
    isLeapYear(dateSeparated.yearNumber) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  dateSeparated.dayNumber++;

  if (dateSeparated.dayNumber > daysInMonth[dateSeparated.monthNumber - 1]) {
    dateSeparated.dayNumber = 1;
    dateSeparated.monthNumber++;
  }

  if (dateSeparated.monthNumber > 12) {
    dateSeparated.monthNumber = 1;
    dateSeparated.yearNumber++;
  }

  return rewriteDateInProperFormat(dateSeparated);
}

function rewriteDateInProperFormat(dateSeparated: DateSeparated): string {
  if (dateSeparated.dayNumber < 10 && dateSeparated.monthNumber < 10) {
    return `0${dateSeparated.dayNumber}/0${dateSeparated.monthNumber}/${dateSeparated.yearNumber}`;
  }

  if (dateSeparated.dayNumber < 10) {
    return `0${dateSeparated.dayNumber}/${dateSeparated.monthNumber}/${dateSeparated.yearNumber}`;
  }

  if (dateSeparated.monthNumber < 10) {
    return `${dateSeparated.dayNumber}/0${dateSeparated.monthNumber}/${dateSeparated.yearNumber}`;
  }

  return `${dateSeparated.dayNumber}/${dateSeparated.monthNumber}/${dateSeparated.yearNumber}`;
}

export function getNextPalindromes(
  numberOfNextPalindromes: number,
  dateFromWhichToStart: string,
): string[] | undefined {
  let counter = 0;
  const nextPalindromes: string[] = [];
  let potentialPalindrome = skipToNextDay(dateFromWhichToStart);

  // Add a failsafe to avoid infinite loops!
  const MAX_ITERATIONS = 100_000;
  let tries = 0;

  while (counter < numberOfNextPalindromes && tries < MAX_ITERATIONS) {
    tries++;
    if (isPalindrome(potentialPalindrome)) {
      nextPalindromes.push(potentialPalindrome);
      counter++;
    }
    potentialPalindrome = skipToNextDay(potentialPalindrome);
  }

  if (tries === MAX_ITERATIONS) {
    // Too many iterations; likely unreachable
    return;
  }

  if (nextPalindromes.length !== numberOfNextPalindromes) {
    return;
  }
  if (nextPalindromes.length === 0) {
    return;
  }
  return nextPalindromes;
}
