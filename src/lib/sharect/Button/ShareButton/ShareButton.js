import Button from '../Button'

function truncate(source, size) {
    return source.length > size ? source.slice(0, size - 1) + "..." : source;
}

export function getParsedURL(url, username, tweetText) {
  var maxCharLimit  = 280
  var urlLength = window.location.href.length
  var charLimit = maxCharLimit - urlLength
  var text = window.getSelection().toString()
  var filteredText = text.startsWith('“') ? text : '“' + text + '”'

  return url
    .replace(/PAGE_URL/, window.location.href.replace(/^\/|\/$/g, ''))
    .replace(/TEXT_SELECTION/, truncate(filteredText, charLimit))
    .replace(/USERNAME/, username)
}

export default function createShareButton(icon, url, username, tweetText) {
  const btn = Button(tweetText, icon, function() {
    const parsedURL = getParsedURL(url, username, tweetText)
    window.open(parsedURL, 'Share', 'width=550, height=280')
  })
  return btn
}