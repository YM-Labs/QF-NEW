const path = require('path');
const cacheMeOutside = require('cache-me-outside');

/* cache destination folder */
const cacheFolder = path.join('/opt/build/cache', 'storage');

/* Array of folders to cache */
const contentsToCache = [
	{
		contents: path.join(__dirname, '../public')
	}
	// ... add more folders if you want
];

// Run cacheMeOutside
try {
	cacheMeOutside(cacheFolder, contentsToCache).then(cacheInfo => {
		console.log('Success! You are ready to rock');
		cacheInfo.forEach(info => {
			console.log(info.cacheDir);
		});
	});
} catch {}
