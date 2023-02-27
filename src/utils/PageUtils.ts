import { gsap } from 'gsap/dist/gsap.min';
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin';

export function gotoClickHandler (hash, event) {
    gsap.registerPlugin(ScrollToPlugin);
    if (event) {
        event.preventDefault();
        gsap.to(window, { duration: 0.5, scrollTo: { y: hash, autoKill: false }, ease: 'easeInOut' });
    }
};