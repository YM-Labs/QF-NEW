import { pageTransitionEvent } from '../ui/PageTransition';

export class ScrollMonitor {
	public lastScrollPosition = typeof window !== 'undefined' ? window.scrollY : 0;
	private scrollY = 0;
	public scrollingDown = true;
	private ticking = false;

	constructor() {
		if (typeof window !== 'undefined') {
			window.addEventListener('scroll', this.scrollHandler, { passive: true });
			(global as any).window.addEventListener(pageTransitionEvent, this.pageChangeHandler);
			// window.addEventListener('popstate', this.pageChangeHandler);
		}
	}

	private pageChangeHandler = () => {
		if (window.location.hash.indexOf('#map') !== 0) {
			this.lastScrollPosition = -9999999999;
			this.scrollingDown = true;
		}
	};

	private scrollHandler = () => {
		if (!this.ticking) {
			window.requestAnimationFrame(() => {
				this.scrollY = window.scrollY;
				this.scrollingDown = this.lastScrollPosition < this.scrollY;
				this.lastScrollPosition = this.scrollY;
				this.ticking = false;
			});
			this.ticking = true;
		}
	};
}
