/**
 * Formats a Nigerian phone number to the +234XXXXXXXXXX format.
 * @param {string} phoneNumber - The raw input string.
 * @returns {string|null} - The formatted number or null if invalid.
 */
export async function formatNigerianNumber(phoneNumber) {
    if (!phoneNumber) return null;

    // 1. Remove all non-numeric characters (spaces, dashes, plus signs)
    let cleaned = phoneNumber.replace(/\D/g, '');

    // 2. Handle the '+2340...' case (remove the leading 0 after 234)
    if (cleaned.startsWith('2340')) {
        cleaned = '234' + cleaned.substring(4);
    }

    // 3. Logic based on length and prefix
    if (cleaned.length === 11 && cleaned.startsWith('0')) {
        // Case: 07068497568 -> +2347068497568
        return `+234${cleaned.substring(1)}`;
    } 
    
    if (cleaned.length === 13 && cleaned.startsWith('234')) {
        // Case: 2347068497568 -> +2347068497568
        return `+${cleaned}`;
    }

    // Return null or original if it doesn't match expected Nigerian patterns
    return cleaned.length >= 10 ? `+${cleaned}` : null;
}

// --- Test Cases ---
// console.log(formatNigerianNumber("07068497568"));      // +2347068497568
// console.log(formatNigerianNumber("2347068497568"));    // +2347068497568
// console.log(formatNigerianNumber("+23407068497568"));  // +2347068497568