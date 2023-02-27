export class Globals {
	public static BASE_URL: string = 'https://www.qf.org.qa';
	public static CURRENT_LANGUAGE_PREFIX: string = 'en';
	public static SITE_FIRST_LOAD: boolean = true;
    public static IS_TOUCH_DEVICE = () => {
		// @ts-ignore
		return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
	}
}
