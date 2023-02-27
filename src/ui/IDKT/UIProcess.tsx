import React from "react";
import * as styles from './UIProcess.module.scss';
import loadable from '@loadable/component'
import useDarkMode from 'use-dark-mode'
//@ts-ignore
const IndustryFlowchart = loadable(() => import('../../assets/svgs/IDKT/industry-flowchart.inline.svg'))
//@ts-ignore
const IndustryFlowchartDark = loadable(() => import('../../assets/svgs/IDKT/industry-flowchart-darkMode.inline.svg'))
//@ts-ignore
const IndustryFlowchartMobile = loadable(() => import('../../assets/svgs/IDKT/industry-flowchart-mobile.inline.svg'))
//@ts-ignore
const IndustryFlowchartMobileDark = loadable(() => import('../../assets/svgs/IDKT/industry-flowchart-mobile-darkMode.inline.svg'))
//@ts-ignore
const IndustryFlowchartArabic = loadable(() => import('../../assets/svgs/IDKT/industry-flowchart-arabic.inline.svg'))
//@ts-ignore
const IndustryFlowchartArabicDark = loadable(() => import('../../assets/svgs/IDKT/industry-flowchart-darkMode-arabic.inline.svg'))
//@ts-ignore
const IndustryFlowchartArabicMobile = loadable(() => import('../../assets/svgs/IDKT/industry-flowchart-mobile-arabic.inline.svg'))
//@ts-ignore
const IndustryFlowchartArabicMobileDark = loadable(() => import('../../assets/svgs/IDKT/industry-flowchart-mobile-arabic-darkMode.inline.svg'))
import Popup from './Popup';

export const UIProcess = (currLang?: any) => {
  const darkMode = useDarkMode(false);
  const isMobile = (typeof window !== 'undefined') && window.innerWidth <= 768;
  
  var infoGraphics = null

  if(currLang.currLang === 'ar-QA') {
    if(isMobile) {
      if(darkMode.value) {
        infoGraphics = <IndustryFlowchartArabicMobileDark />
      } else {
        infoGraphics = <IndustryFlowchartArabicMobile />
      }
    } else {
      if(darkMode.value) {
        infoGraphics = <IndustryFlowchartArabicDark />
      } else {
        infoGraphics = <IndustryFlowchartArabic />
      }
    }
  } else {
    if(isMobile) {
      if(darkMode.value) {
        infoGraphics = <IndustryFlowchartMobileDark />
      } else {
        infoGraphics = <IndustryFlowchartMobile />
      }
    } else {
      if(darkMode.value) {
        infoGraphics = <IndustryFlowchartDark />
      } else {
        infoGraphics = <IndustryFlowchart />
      }
    }
  }

  return (
    <div>
        <div id='chart' className={styles.circleContainer}>
          { infoGraphics }
        </div>
        {
          <Popup type='for-industry' />
        }
    </div>
  );
}

