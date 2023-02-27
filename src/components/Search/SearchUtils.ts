export function convertFalseToUndefined(obj: object) {
	for (var k in obj) {
		if (typeof obj[k] == 'object' && obj[k] !== null) {
			convertFalseToUndefined(obj[k]);
		} else {
			if (obj[k] === false) {
				obj[k] = undefined;
			} else if (obj[k] === true) {
				obj[k] = 1;
			}
		}
	}
}

export function mergeLoadState(loadState: object, initState: object) {
	for (var k in loadState) {
		if (typeof loadState[k] == 'object' && loadState[k] !== null) {
			mergeLoadState(loadState[k], initState[k]);
		} else {
			if (loadState[k] === '1') {
				initState[k] = true;
			} else {
				initState[k] = loadState[k];
			}
		}
	}
}
export function cloneObject(object: object) {
	return JSON.parse(JSON.stringify(object));
}

export function deepCompare(newObject: object, oldObject: object) {
	return JSON.stringify(newObject) === JSON.stringify(oldObject);
}
