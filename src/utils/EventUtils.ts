export function debounce(callback: Function, wait: number, context = this) {
	let timeout = null;
	// let callbackArgs = null;

	const later = () => callback.apply(context /*, callbackArgs*/);

	return function() {
		// callbackArgs = arguments;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
}
