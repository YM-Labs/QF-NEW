import { Globals } from './Globals';

const URLTypeMapping = {
	event: ['events', 'events'],
	article: ['stories', 'stories'],
    tapStory: ['stories/tap', 'stories/tap'],
	entity: ['', ''],
	press: ['media-center', 'media-center'],
	search: ['search', 'search'],
	program: ['program', 'program'],
	persona: ['about/profile', 'about/profile'],
	mediaGallery: ['media-center/media-galleries', 'media-center/media-galleries'],
	terms: ['terms-of-use', 'terms-of-use'],
	hotline: ['balagh-qf-whistle-blower-hotline', 'balagh-qf-whistle-blower-hotline'],
	alert: ['statements.qf.org.qa', ''],
	ec: ['education/education-city', 'education/education-city'],
	education: ['education', 'education'],
	research: ['research', 'research'],
	community: ['community', 'community'],
	about: ['about', 'about'],
	ecss: ['education-city-speaker-series', 'education-city-speaker-series'],
	experts: ['media-center/experts', 'media-center/experts'],
	ecss_experts: ['education-city-speaker-series/experts', 'education-city-speaker-series/experts'],
	// IDKT Paths
	idkt: ['idkt', 'idkt'],
	technologies: ['idkt/technologies', 'idkt/technologies'],
	infoBank: ['idkt/info-bank', 'idkt/info-bank'],
	idktAbout: ['idkt/about', 'idkt/about'],
	technologyTransfer: ['idkt/road-to-technology-transfer', 'idkt/road-to-technology-transfer'],
	forIndustry: ['idkt/for-industry', 'idkt/for-industry'],
	forResearchers: ['idkt/for-researchers', 'idkt/for-researchers'],
	forEntrepreneurs: ['idkt/for-entrepreneurs', 'idkt/for-entrepreneurs']

};

export function getPagePath(slug: string, type: 'event' | 'article' | 'search' | 'press' | 'program' | 'entity' | 'persona' | 'ec' | 'education' | 'research' | 'community' | 'terms' | 'hotline' | 'about' | 'idkt' | 'technologies' | 'infoBank' | 'idktAbout' | 'technologyTransfer' | 'forIndustry' | 'forResearchers' | 'forEntrepreneurs' | 'mediaGallery' | 'ecss' | 'tapStory', vertical?: string) {
	return `/${Globals.CURRENT_LANGUAGE_PREFIX}${URLTypeMapping[type][Globals.CURRENT_LANGUAGE_PREFIX === '' ? 0 : 1]}${vertical ? vertical + '/' : slug ? '/' : ''}${slug}`;
}

export function getECSSPagePath() {
	return `https://www.qf.org.qa/${Globals.CURRENT_LANGUAGE_PREFIX}/education-city-speaker-series#section-1`;
}

export function getAbsolutePagePath(type: string) {
	return `${Globals.CURRENT_LANGUAGE_PREFIX}${URLTypeMapping[type][Globals.CURRENT_LANGUAGE_PREFIX === '' ? 0 : 1]}`;
}

export function validURL(url: string) {
	var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
	if (!regex.test(url)) {
		return false;
	} else {
		return true;
	}
}

export function makeAbsolute(url: string) {
	if (url?.indexOf('/') === 0) {
		return url;
	} else {
		if (url?.indexOf('#') !== 0) {
			return '/' + url;
		} else {
			return url;
		}
	}
}

export function sanitizeUrl(url: string) {
	return url.replace(/\/+/g, '/').replace(/\/+$/, '');
}

export function getRelativeURL(url: string) {
    var the_arr = url.replace('://','').split('/');
    the_arr.shift();
    return( '/'+the_arr.join('/') );
}

export function isExternal(url) {
    var match = url.match(/^([^:\/?#]+:)?(?:\/\/([^\/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/);
    if (typeof match[1] === "string" && match[1].length > 0 && match[1].toLowerCase() !== location.protocol) return true;
    if (typeof match[2] === "string" && match[2].length > 0 && match[2].replace(new RegExp(":("+{"http:":80,"https:":443}[location.protocol]+")?$"), "") !== location.host) return true;
    return false;
}