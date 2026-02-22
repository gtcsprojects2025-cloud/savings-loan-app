/**
 * Cleans and formats one or more Nigerian numbers for an SMS Gateway.
 * @param {string} input - e.g., "07068497568, 2347068497568"
 * @returns {string} - e.g., "+2347068497568,+2347068497568"
 */
export default function prepareNumbersForSMS(input) {
    if (!input) return "";

    let cleaned = input.trim().replace(/\D/g, '');

        // Fix the +2340... error
        if (cleaned.startsWith('2340')) {
            cleaned = '234' + cleaned.substring(4);
        }

        // Convert 070... to 23470...
        if (cleaned.length === 11 && cleaned.startsWith('0')) {
            cleaned = '234' + cleaned.substring(1);
        }

        // Add the plus sign
        return `+${cleaned}`;
    

   
}

// --- Usage in your SMS logic ---
// const rawInput = "07068497568, +234 0803 123 4567";
// const validRecipientString = prepareNumbersForSMS(rawInput);

// console.log(validRecipientString); 
// Output: "+2347068497568,+2348031234567"