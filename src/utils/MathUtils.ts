export function randomInteger(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomIntsFromRange(count: number, range: number) {
	let i = 0;
	let stack = [];
	let randomImages: number[] = [];

	// Generate stack
	for (i; i < range; i++) {
		stack.push(i + 1);
	}

	// Add random from stack
	i = 0;
	let tempTotal = range - 1;
	let randomInt;
	for (i; i < count; i++) {
		randomInt = randomInteger(0, tempTotal);
		randomImages.push(stack[randomInt]);

		stack.splice(randomInt, 1);

		tempTotal--;
	}

	return randomImages;
}

export function clamp(value: number, min: number, max: number) {
	return Math.min(max, Math.max(min, value));
}

export function degreesToRadians(degrees: number) {
	return (degrees * Math.PI) / 180;
}

export function radiansToDegrees(radians: number) {
	return (radians * 180) / Math.PI;
}

/** This method will calculate how big a circle is needed to make the square fit in it */
export function squareToCircle(width: number) {
	let radius: number;

	let a = width;
	let b = width;
	let c = Math.pow(a, 2) + Math.pow(b, 2);

	radius = Math.sqrt(c);

	return radius;
}

/** This method will calculate the largest square that can fit in the circle */
export function circleToSquare(radius: number) {
	let width: number;

	let c = radius;
	let ab = Math.pow(c, 2);
	let a = ab * 0.5;

	width = Math.sqrt(a);

	return width;
}

export function normalize(val: number, min: number, max: number) {
	return (val - min) / (max - min);
}
