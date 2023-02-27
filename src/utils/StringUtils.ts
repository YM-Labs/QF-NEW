export function zeroPad(value: number): string {
	if (value.toString().length == 1) {
		return '0' + value;
	}
	return '' + value;
}

export function isArabic(text: string): boolean {
	var arabic = /[\u0600-\u06FF]/;
	var result = arabic.test(text);
	return result;
}

export function humanFileSize(bytes:number, si) {
	var thresh = si ? 1000 : 1024;
	if (Math.abs(bytes) < thresh) {
		return bytes + ' B';
	}
	var units = si ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
	var u = -1;
	do {
		bytes /= thresh;
		++u;
	} while (Math.abs(bytes) >= thresh && u < units.length - 1);
	return bytes.toFixed(1) + ' ' + units[u];
}

export function humanFiletype(url:string) {
	var theresult = url && url.split(/\#|\?/)[0].split('.').pop().trim();
	return theresult && theresult.toUpperCase();
}
