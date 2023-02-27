import React from "react";
import * as styles from './UIProcessResearchers.module.scss';
import loadable from '@loadable/component'
import useDarkMode from 'use-dark-mode'
//@ts-ignore
const ResearchersFlowchart = loadable(() => import('../../assets/svgs/IDKT/researchers-flowchart.inline.svg'))
//@ts-ignore
const ResearchersFlowchartDark = loadable(() => import('../../assets/svgs/IDKT/researchers-flowchart-darkMode.inline.svg'))
//@ts-ignore
const ResearchersFlowchartMobile = loadable(() => import('../../assets/svgs/IDKT/researchers-flowchart-mobile.inline.svg'))
//@ts-ignore
const ResearchersFlowchartMobileDark = loadable(() => import('../../assets/svgs/IDKT/researchers-flowchart-mobile-darkMode.inline.svg'))
//@ts-ignore
const ResearchersFlowchartArabic = loadable(() => import('../../assets/svgs/IDKT/research-flowchart-arabic.inline.svg'))
//@ts-ignore
const ResearchersFlowchartArabicDark = loadable(() => import('../../assets/svgs/IDKT/research-flowchart-darkMode-arabic.inline.svg'))
//@ts-ignore
const ResearchersFlowchartArabicMobile = loadable(() => import('../../assets/svgs/IDKT/research-flowchart-mobile-arabic.inline.svg'))
//@ts-ignore
const ResearchersFlowchartArabicMobileDark = loadable(() => import('../../assets/svgs/IDKT/research-flowchart-mobile-arabic-darkMode.inline.svg'))
import Popup from './Popup';

export const UIProcessResearchers = (currLang?: any) => {
  const darkMode = useDarkMode(false);
  const isMobile = (typeof window !== 'undefined') && window.innerWidth <= 768;

  var infoGraphics = null

  if(currLang.currLang === 'ar-QA') {
    if(isMobile) {
      if(darkMode.value) {
        infoGraphics = <ResearchersFlowchartArabicMobileDark />
      } else {
        infoGraphics = <ResearchersFlowchartArabicMobile />
      }
    } else {
      if(darkMode.value) {
        infoGraphics = <ResearchersFlowchartArabicDark />
      } else {
        infoGraphics = <ResearchersFlowchartArabic />
      }
    }
  } else {
    if(isMobile) {
      if(darkMode.value) {
        infoGraphics = <ResearchersFlowchartMobileDark />
      } else {
        infoGraphics = <ResearchersFlowchartMobile />
      }
    } else {
      if(darkMode.value) {
        infoGraphics = <ResearchersFlowchartDark />
      } else {
        infoGraphics = <ResearchersFlowchart />
      }
    }
  }

  return (
    <div>
        <div id='chart' className={styles.circleContainer}>
          { infoGraphics }
        </div>
        {
          <Popup type='for-researchers' />
        }
    </div>
  );
}

