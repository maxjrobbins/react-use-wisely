// Copy text to clipboard
import { useState, useCallback } from 'react';

/**
 * Hook for clipboard operations
 * @param {number} timeout - Reset the copied state after this time
 * @returns {Array} [isCopied, copyToClipboard] - State and copy function
 */
const useClipboard = (timeout = 2000) => {
	const [isCopied, setIsCopied] = useState(false);

	const copyToClipboard = useCallback((text) => {
		if (!navigator.clipboard) {
			// Fallback for older browsers
			const textArea = document.createElement('textarea');
			textArea.value = text;

			// Make the textarea out of viewport
			textArea.style.position = 'fixed';
			textArea.style.left = '-999999px';
			textArea.style.top = '-999999px';
			document.body.appendChild(textArea);

			textArea.focus();
			textArea.select();

			try {
				document.execCommand('copy');
				setIsCopied(true);

				setTimeout(() => {
					setIsCopied(false);
				}, timeout);
			} catch (err) {
				console.error('Failed to copy text: ', err);
			}

			document.body.removeChild(textArea);
			return;
		}

		// Modern approach with Clipboard API
		navigator.clipboard.writeText(text)
			.then(() => {
				setIsCopied(true);

				setTimeout(() => {
					setIsCopied(false);
				}, timeout);
			})
			.catch((err) => {
				console.error('Failed to copy text: ', err);
			});
	}, [timeout]);

	return [isCopied, copyToClipboard];
}

export default useClipboard;
