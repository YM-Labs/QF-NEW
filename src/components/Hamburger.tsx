import React from 'react';
import { WrappedComponentProps } from 'react-intl';
import * as styles from './Hamburger.module.scss';
import useSticky from "./useSticky";
import { FormattedMessage } from 'react-intl';

const Hamburger = (props: { toggleHandler: (event) => void, intl?: WrappedComponentProps }) => {

    const { sticky, stickyRef } = useSticky();
    
    function shiftfocus() {
        window.setTimeout(function () {
            document.getElementById('firstMenuItem').focus();
        }, 0);
    };

	return (
        <div className={`${styles.hamburgerWrapper} ${sticky ? styles.containerXs : ''}`}>
            <span id="NavigationBg" ref={stickyRef} className={`${styles.menuCircle} ${sticky ? styles.circle : ''}`}></span>
            <a aria-label="Main Menu Icon" id="NavigationButton" onKeyDown={shiftfocus} onClick={props.toggleHandler} href="#menu-open" className={`${styles.wrapper}`}>
                <span className={styles.menuText}>
                    <FormattedMessage id='menu' />
                </span>
                <span className={styles.menuLine}>
                    <div className={`${styles.line} ${styles.line1}`} />
                    <div className={`${styles.line} ${styles.line2}`} />
                    <div className={`${styles.line} ${styles.line3}`} />
                </span>
            </a>
        </div>
	)
}

export default Hamburger;