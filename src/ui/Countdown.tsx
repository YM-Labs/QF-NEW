import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import * as styles from "./Countdown.module.scss"
import ContentLoader from 'react-content-loader';
import { StaticImage } from "gatsby-plugin-image"

export const Countdown = () => {
    // @ts-ignore
  const [retirementDate, setRetirementDate] = useState(new Date("2022-12-18T18:00:00.000+03:00").getTime());
  const [daysLeft, setDaysLeft] = useState('-');
  const [hoursLeft, setHoursLeft] = useState('-');
  const [minutesLeft, setMinutesLeft] = useState('-');
  const [secondsLeft, setSecondsLeft] = useState('-');

  const Loader = () => (
    <ContentLoader
      width={40}
      viewBox="0 0 40 30"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      <rect x="0" y="0" rx="0" ry="0" width="40" height="30" />
    </ContentLoader>
  )

  const padZero = (number) => {
    return number !== '-' ? String(number).padStart(2, '0') : <Loader />
  }

  useEffect(() => {
    const interval = setInterval(() => {
      // Get today's date
      const today = new Date().getTime();

      // Get the difference
      const diff =  retirementDate - today;

      // Calculate
      setDaysLeft(String(Math.floor(diff / (1000 * 60 * 60 * 24))));
      setHoursLeft(String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))));
      setMinutesLeft(String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))));
      setSecondsLeft(String(Math.floor((diff % (1000 * 60)) / 1000)));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
        <>
            <div className={styles.countBox}>
                <div className={styles.logo}>
                    <StaticImage
                        src="../assets/images/football_for_all_logo.png"
                        placeholder="none"
                        width={119}
                        height={118}
                        alt="football_for_all_logo"
                    />
                </div>
                <span className={styles.kickoffText}>
                    <FormattedMessage id="kickoff_text" />
                </span>
                <div className={`${styles.countBoxItem} ${styles.firstCount}`}>
                    <div className={`${styles.count}`}>{padZero(daysLeft)}</div>
                    <div className={styles.label}>{<FormattedMessage id="days" />}</div>
                </div>
                <div className={styles.countBoxItem}>
                    <div className={styles.count}>{padZero(hoursLeft)}</div>
                    <div className={styles.label}>{<FormattedMessage id="hours" />}</div>
                </div>
                <div className={styles.countBoxItem}>
                    <div className={styles.count}>{padZero(minutesLeft)}</div>
                    <div className={styles.label}>{<FormattedMessage id="min" />}</div>
                </div>
                <div className={styles.countBoxItem}>
                    <div className={styles.count}>{padZero(secondsLeft)}</div>
                    <div className={styles.label}>{<FormattedMessage id="sec" />}</div>
                </div>
            </div>
        </>
  );
};