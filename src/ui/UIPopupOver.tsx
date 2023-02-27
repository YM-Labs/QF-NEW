import React from 'react';
import * as styles from './UIPopupOver.module.scss';

const UIPopupOver = (props) => {
  return (
    <div className={styles.popOver + ' ' + (props.showPopup && styles.popup__visible)}>
        <div className={styles.popOverTitleDetail}>
            <h3>{props.title}</h3>
        </div>
        <div className={styles.popOverDescription}>
            <div className={`text-style-body ${styles.popOverBody}`} dangerouslySetInnerHTML={{ __html: props.description }} />
        </div>
        <div onClick={props.closePopup} className={styles.closeIcon} tabIndex={0}>
            <svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" fillRule="evenodd">
                    <g className={styles.close}>
                        <path d="M6.72 6.01l6-6.01.72.7-6.02 6.02 6.02 6-.71.72-6.01-6.02L.7 13.44 0 12.73l6.01-6.01L0 .7.7 0l6.02 6.01z" />
                    </g>
                </g>
            </svg>
        </div>
    </div>
  )
}
export default UIPopupOver