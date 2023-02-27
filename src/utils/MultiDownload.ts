function fallback(urls) {
  var i = 0;

  (function createIframe() {
    var frame = document.createElement('iframe');
    frame.style.display = 'none';
    frame.src = urls[i++];
    document.documentElement.appendChild(frame);

    // the download init has to be sequential otherwise IE only use the first
    var interval = setInterval(function() {
      if (
        frame.contentWindow.document.readyState === 'complete' ||
        frame.contentWindow.document.readyState === 'interactive'
      ) {
        clearInterval(interval);

        // Safari needs a timeout
        setTimeout(function() {
          frame.parentNode.removeChild(frame);
        }, 1000);

        if (i < urls.length) {
          createIframe();
        }
      }
    }, 100);
  })();
}

function isFirefox() {
  // sad panda :(
  return typeof navigator !== 'undefined' && /Firefox\//i.test(navigator.userAgent);
}
const isChrome = typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
function sameDomain(url) {
  var a = document.createElement('a');
  a.href = url;

  return location.hostname === a.hostname && location.protocol === a.protocol;
}

function download(url) {
  var a = document.createElement('a');
  a.download = '';
  a.href = url;
  // firefox doesn't support `a.click()`...
  a.dispatchEvent(new MouseEvent('click'));
}

export function multiDownload(urls: string[]) {
  if (!urls) {
    throw new Error('`urls` required');
  }

  if (isChrome || typeof document.createElement('a').download === 'undefined') {
    return fallback(urls);
  }

  var delay = 0;

  urls.forEach(function(url) {
    // the download init has to be sequential for firefox if the urls are not on the same domain
    // console.log(sameDomain(url));
    if (isFirefox() && !sameDomain(url)) {
      return setTimeout(download.bind(null, url), 100 * ++delay);
    }

    download(url);
  });
}

const sindreDelay = ms => new Promise(resolve => setTimeout(resolve, ms));

const downloadSindre = async (url, name) => {
	const a = document.createElement('a');
	a.download = name;
	a.href = url;
	a.style.display = 'none';
	document.body.append(a);
	a.click();

	// Chrome requires the timeout
	await sindreDelay(100);
	a.remove();
};

export async function sindreDownload(urls:string[], options:any = {}) {
	if (!urls) {
		throw new Error('`urls` required');
	}

	for (const [index, url] of urls.entries()) {
		const name = typeof options.rename === 'function' ? options.rename({url, index, urls}) : '';

		await sindreDelay(index * 1000);
		downloadSindre(url, name);
	}
};
