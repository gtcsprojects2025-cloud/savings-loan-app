/**
 * Cleans and formats one or more Nigerian numbers for an SMS Gateway.
 * @param {string} input - e.g., "07068497568, 2347068497568"
 * @returns {string} - e.g., "+2347068497568,+2347068497568"
 */
export default function prepareNumbersForSMS(input) {
    console.log("Number formatting started....", input);
    if (!input) return "";

    // 1. Remove ALL non-digits (spaces, +, -, etc.)
    let cleaned = String(input).trim().replace(/\D/g, '');
    console.log("Digits only: ", cleaned);

    // 2. Fix the 2340... error
    // If input was +2340803..., cleaned is 2340803...
    // 2(0) 3(1) 4(2) 0(3) <- Index 3 is the '0'
    if (cleaned.startsWith('2340')) {
        // We want '234' + everything AFTER the 0 (starting at index 4)
        cleaned = '234' + cleaned.substring(4);
        console.log("Removed extra 0 after 234: ", cleaned);
    }

    // 3. Convert local 070... to international 23470...
    if (cleaned.length === 11 && cleaned.startsWith('0')) {
        cleaned = '234' + cleaned.substring(1);
        console.log("Converted local 0 to 234: ", cleaned);
    }

    // 4. Ensure it starts with 234 (standardizes numbers like 7068...)
    if (cleaned.length === 10 && !cleaned.startsWith('234')) {
        cleaned = '234' + cleaned;
    }

    console.log("Number formatting ended....", `+${cleaned}`);
    
    // Return with the plus sign
    return `+${cleaned}`;
}

// --- Usage in your SMS logic ---
// const rawInput = "07068497568, +234 0803 123 4567";
// const validRecipientString = prepareNumbersForSMS(rawInput);

// console.log(validRecipientString); 
// Output: "+2347068497568,+2348031234567"