import * as React from 'react';

import * as styles from './UIEventDate.module.scss';
import { FormattedDate } from 'react-intl';
import { isSameDate, isSameMonth } from '../utils/DateHelpers';

export function UIEventDate(props: { startDate: string; endDate: string; type?: string; className: string; newFormat?: boolean }) {
	const showEndDate = props.endDate && !isSameDate(props.startDate, props.endDate);
	const showEndMonth = !isSameMonth(props.startDate, props.endDate) ? 'short' : undefined;
	const isMobile = false;
	var path = typeof window !== 'undefined' && window.location.pathname.split('/');
	return (
        props.newFormat ? (
            <span className={styles.newLayout}>
                <div className={styles.column}>
                    <div className={styles.eventMonth}>
                        { <FormattedDate value={new Date(props.startDate)} month={'short'} /> }
                    </div>
                    <div className={styles.eventDate}>
                        { new Date(props.startDate).getDate() }
                    </div>
                    <div className={styles.eventYear}>
                        { new Date(props.startDate).getFullYear() }
                    </div>
                </div>
                <p className={styles.hyphen}>-</p>
                <div className={styles.column}>
                    <div className={styles.eventMonth}>
                        { <FormattedDate value={new Date(props.endDate)} month={'short'} /> }
                    </div>
                    <div className={styles.eventDate}>
                        { new Date(props.endDate).getDate() }
                    </div>
                    <div className={styles.eventYear}>
                        { new Date(props.endDate).getFullYear() }
                    </div>
                </div>
            </span>                          
        ) : (
            props.type === 'ecss' ? (
                <span className={`text-style-detail-3 ${props.className} ${styles.ecssDate}`}>
                    <span>{new Date(props.startDate).getDate()}</span>
                    {' '}
                    <FormattedDate value={new Date(props.startDate)} month={'long'} />
                    <br />
                    <span className={styles.year}>
                        {' '}
                        <span>{new Date(showEndDate ? props.endDate : props.startDate).getFullYear()}</span>
                    </span>
                </span>
            ) : (
                <span className={`text-style-detail-3 ${props.className}`}>
                    <span>{new Date(props.startDate).getDate()}</span>
                    {!showEndDate && new Date(props.startDate) && <span>&nbsp;</span>}
                    {new Date(props.startDate) && showEndMonth && <span>&nbsp;</span>}
                    {(!showEndDate || showEndMonth) && isMobile && path[1] == 'ar' && props.type !== 'ContentfulEvent' && <br />}
                    {(!showEndDate || showEndMonth) && <FormattedDate value={new Date(props.startDate)} month={'short'} />}

                    {showEndDate && <span>–</span>}

                    {showEndDate && showEndMonth && isMobile && props.startDate.split('-')[1] !== '12' && <br />}
                    {showEndDate && <span>{new Date(props.endDate).getDate()}</span>}
                    {showEndDate && <span>&nbsp;</span>}
                    {showEndDate && !showEndMonth && isMobile && path[1] != 'ar' && <br />}
                    {showEndDate && isMobile && path[1] == 'ar' && props.type !== 'ContentfulEvent' && props.startDate.split('-')[1] !== '12' &&  <br />}
                    {showEndDate && showEndMonth && <FormattedDate value={new Date(props.endDate)} month="short" />}
                    {showEndDate && !showEndMonth && <FormattedDate value={new Date(props.startDate)} month="short" />}
                    <span className={styles.year}>
                        {' '}
                        <span>{new Date(showEndDate ? props.endDate : props.startDate).getFullYear()}</span>
                        {/*<FormattedDate value={new Date(showEndDate ? props.endDate : props.startDate)} year="numeric" />*/}
                    </span>
                </span>
            )
        )
	);
}