/**
 * Safely parse JSON without throwing
 * @param {string} value - The string to parse
 * @param {any} fallback - The fallback value if parsing fails
 * @returns {any} - The parsed value or fallback
 */
export const safeJSONParse = (value, fallback = null) => {
	try {
		return JSON.parse(value);
	} catch (error) {
		return fallback;
	}
};
