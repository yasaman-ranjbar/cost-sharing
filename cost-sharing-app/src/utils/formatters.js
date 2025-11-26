/**
 * Format a number as Iranian Toman currency
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
export const formatToman = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "0 تومان";
  }

  return new Intl.NumberFormat("fa-IR").format(Math.round(amount)) + " تومان";
};

/**
 * Parse a formatted Toman string back to a number
 * @param {string} formattedAmount - The formatted amount string
 * @returns {number} The numeric value
 */
export const parseToman = (formattedAmount) => {
  if (!formattedAmount) return 0;

  // Remove 'تومان' and any non-digit characters except Persian/Arabic numerals
  const cleaned = formattedAmount
    .replace(/تومان/g, "")
    .replace(/,/g, "")
    .trim();

  // Convert Persian/Arabic numerals to English
  const persianNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

  let result = cleaned;
  persianNumbers.forEach((num, index) => {
    result = result.replace(new RegExp(num, "g"), index.toString());
  });
  arabicNumbers.forEach((num, index) => {
    result = result.replace(new RegExp(num, "g"), index.toString());
  });

  return parseFloat(result) || 0;
};
