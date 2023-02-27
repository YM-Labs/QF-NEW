import React, { useRef } from "react";
import * as styles from './UIImageCircle.module.scss';
import loadable from '@loadable/component'
import useDarkMode from 'use-dark-mode'
//@ts-ignore
const Ecosystem = loadable(() => import('../../assets/svgs/IDKT/ecosystem.inline.svg'))
//@ts-ignore
const EcosystemDark = loadable(() => import('../../assets/svgs/IDKT/ecosystem-darkMode.inline.svg'))
//@ts-ignore
const EcosystemArabic = loadable(() => import('../../assets/svgs/IDKT/ecosystem-arabic.inline.svg'))
//@ts-ignore
const EcosystemDarkArabic = loadable(() => import('../../assets/svgs/IDKT/ecosystem-darkMode-arabic.inline.svg'))
import Popup from './Popup';

export const UIImageCircle = (currLang?: any) => {
  const ref = useRef(null);
  let initDarkMode = false;
  if (typeof window !== `undefined`) {
    initDarkMode = JSON.parse(localStorage.getItem('darkMode'))
  }
  const darkMode = useDarkMode(initDarkMode);
  return (
    <div className={`${styles.UIImageCircle}`}>
        <div id='chart' className={styles.circleContainer} ref={ref}>
          {
            currLang.currLang === 'ar-QA' ? darkMode.value ? <EcosystemDarkArabic /> : <EcosystemArabic /> : darkMode.value ? <EcosystemDark /> : <Ecosystem />
          }
        </div>
        {
          // @ts-ignore
          <Popup type='ecosystem' />
        }
    </div>
  );
}

