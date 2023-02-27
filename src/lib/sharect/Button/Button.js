import style from './style'
import hasSelection from '../helpers/hasSelection'

function handleMouseOver() {
  this.style.transform = 'scale(1)'
}

function handleMouseOut() {
  this.style.transform = 'scale(1)'
}

export default function createButton(tweetText, icon, handleMouseDown) {

    console.log(hasSelection())

  const btn = document.createElement('div')
  btn.style.cssText = style
  btn.innerHTML =  `<span style="color: #fff;position: relative;top: -7px;padding-left: 5px;padding-right: 5px;font-weight: 600;">${tweetText}</span>` + icon
  btn.onmousedown = handleMouseDown
  btn.onmouseover = handleMouseOver
  btn.onmouseout = handleMouseOut

  return btn
}
