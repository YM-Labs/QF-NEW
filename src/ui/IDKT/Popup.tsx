import React, { useState, useEffect } from "react";
import * as styles from './Popup.module.scss';
import { isExternal } from '../../utils/URLHelper';
import { useIntl, FormattedMessage } from 'react-intl';
import { navigate } from 'gatsby'
import { gsap, Sine } from 'gsap/dist/gsap.min';

// @ts-ignore
const Popup = (type) => {
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [popupLogo, setPopupLogo] = useState(null);
    const [popupTitle, setPopupTitle] = useState(null);
    const [popupContent, setPopupContent] = useState(null);
    const [popupLink, setPopupLink] = useState(null);
    const [darkmode, setDarkmode] = useState(false);
    const intl = useIntl()
    let topOffset = 0;
    var overlay = typeof document !== 'undefined' && document.createElement('div');

    useEffect(() => {
        let darkMode = document.body.classList.contains('dark-mode');
        setDarkmode(darkMode)
        // Bind the event listener
        document.addEventListener("click", handleClick);
        return () => {
          // Unbind the event listener on clean up
          document.removeEventListener("click", handleClick);
        };
    });

    // @ts-ignore
    const handleClick = (event) => {
        // Get arbitrary element with id "my-element"
        var ecosystemNode = document.querySelector('#chart');
        var popOver = document.querySelector('#popOver');

        if (ecosystemNode.contains(event.target)) {
            if (event && event.target.closest("a")) {
                event.preventDefault();
                var item_title = event.target.closest("a").getAttributeNS('http://www.w3.org/1999/xlink', 'title')
                var item_link = event.target.closest("a").getAttributeNS('http://www.w3.org/1999/xlink', 'href')
                var item_target = event.target.closest("a").getAttribute('target')
                selectCallback(itemSelected(1, item_title, item_link, item_target));
                overlay.className = 'overlay';
                document.querySelector('body').appendChild(overlay);
            }
        }
        
        if (popOver.contains(event.target) && event.target.getAttribute('href')) {
            event.preventDefault();
            var overlayNode = document.querySelector('.overlay');
            var gotoUrl = event.target.getAttribute('href')
            var origin = event.target.getAttribute('data-origin')
            if(overlayNode) {
                if(isExternal(gotoUrl)) {
                    window.open(gotoUrl, "_blank")
                } else {
                    setSelectedIndex(-1);
                    overlayNode.remove()
                    if(origin === 'same') {
                        gsap.to(window, { scrollTo: { y: '#' + gotoUrl.split("#").pop(), offsetY: 0, autoKill: false }, ease: Sine.easeInOut });
                    } else {
                        navigate(gotoUrl)
                    }
                }
            }
        }
    }

    const selectCallback = (index) => {
        return index
    }
    
    const itemSelected = (index: number, item_title: any, item_link: any, item_target: any) => {
            if (selectedIndex !== -1) {
                index = -1;
            }
            if (selectedIndex !== index) {
                setSelectedIndex(index);
        }
        var content = intl.formatMessage({id: `${item_link.slice(1)}_popup_content`})
        setPopupLogo(item_link.slice(1))
        setPopupTitle(item_title)
        setPopupContent(content)
        setPopupLink(item_target)
    };

    const closeHandler = () => {
        setSelectedIndex(-1);
        document.querySelector('.overlay').remove();
    };
    const logoSrc = type.type === 'ecosystem' ? `./IDKT/logos/${popupLogo}.png` : `./svg/${type.type}/${darkmode ? 'dark/' : ''}${popupLogo}.svg`
    return (
        <div id='popOver' style={{ top: topOffset }} className={styles.popOver + (selectedIndex >= 0 ? ' ' + styles.popOverOpen : '')}>
            <div className={styles.popOverTitleDetail}>
                { popupLogo != null && popupLogo !== 'other' && <img src={logoSrc} /> }
                <h3>{popupTitle}</h3>
            </div>
            <div className={styles.popOverDescription}>
                <div className={`text-style-body ${styles.popOverBody}`} dangerouslySetInnerHTML={{ __html: popupContent }} />
                    {
                        type.type === 'ecosystem' && (
                            <a className={styles.ctaLink} href={popupLink}>
                                <FormattedMessage id={popupLogo === 'other' ? 'goto_higher_education' : 'goto_website'} />
                            </a>
                        )
                    }
            </div>
            <div onClick={closeHandler} className={styles.closeIcon} tabIndex={0}>
                <svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                    <g fill="none" fillRule="evenodd">
                        <g className={styles.close}>
                            <path d="M6.72 6.01l6-6.01.72.7-6.02 6.02 6.02 6-.71.72-6.01-6.02L.7 13.44 0 12.73l6.01-6.01L0 .7.7 0l6.02 6.01z" />
                        </g>
                    </g>
                </svg>
            </div>
        </div>
    );
}

export default Popup;