import React from "react";
import * as styles from './UIProcess.module.scss';
import loadable from '@loadable/component'
import useDarkMode from 'use-dark-mode'
//@ts-ignore
const EntrepreneursFlowchart = loadable(() => import( '../../assets/svgs/IDKT/entrepreneurs-flowchart.inline.svg'))
//@ts-ignore
const EntrepreneursFlowchartDark = loadable(() => import( '../../assets/svgs/IDKT/entrepreneurs-flowchart-darkMode.inline.svg'))
//@ts-ignore
const EntrepreneursFlowchartMobile = loadable(() => import( '../../assets/svgs/IDKT/entrepreneurs-flowchart-mobile.inline.svg'))
//@ts-ignore
const EntrepreneursFlowchartMobileDark = loadable(() => import( '../../assets/svgs/IDKT/entrepreneurs-flowchart-mobile-darkMode.inline.svg'))
//@ts-ignore
const EntrepreneursFlowchartArabic = loadable(() => import( '../../assets/svgs/IDKT/entrepreneurs-flowchart-arabic.inline.svg'))
//@ts-ignore
const EntrepreneursFlowchartArabicDark = loadable(() => import( '../../assets/svgs/IDKT/entrepreneurs-darkMode-flowchart-arabic.inline.svg'))
//@ts-ignore
const EntrepreneursFlowchartArabicMobile = loadable(() => import( '../../assets/svgs/IDKT/entrepreneurs-flowchart-mobile-arabic.inline.svg'))
//@ts-ignore
const EntrepreneursFlowchartArabicMobileDark = loadable(() => import( '../../assets/svgs/IDKT/entrepreneurs-flowchart-mobile-arabic-darkMode.inline.svg'))
import Popup from './Popup';

export const UIProcessEntrepreneurs = (currLang?: any) => {
  const darkMode = useDarkMode(false);
  const isMobile = (typeof window !== 'undefined') && window.innerWidth <= 768;

  var infoGraphics = null

  if(currLang.currLang === 'ar-QA') {
    if(isMobile) {
      if(darkMode.value) {
        infoGraphics = <EntrepreneursFlowchartArabicMobileDark />
      } else {
        infoGraphics = <EntrepreneursFlowchartArabicMobile />
      }
    } else {
      if(darkMode.value) {
        infoGraphics = <EntrepreneursFlowchartArabicDark />
      } else {
        infoGraphics = <EntrepreneursFlowchartArabic />
      }
    }
  } else {
    if(isMobile) {
      if(darkMode.value) {
        infoGraphics = <EntrepreneursFlowchartMobileDark />
      } else {
        infoGraphics = <EntrepreneursFlowchartMobile />
      }
    } else {
      if(darkMode.value) {
        infoGraphics = <EntrepreneursFlowchartDark />
      } else {
        infoGraphics = <EntrepreneursFlowchart />
      }
    }
  }

  return (
    <div>
        <div id='chart' className={styles.circleContainer}>
          { infoGraphics }
        </div>
        {
          <Popup type='for-entrepreneurs' />
        }
    </div>
  );
}

