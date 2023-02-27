import * as React from 'react';
import { SFC } from 'react';
import { Helmet } from 'react-helmet';
// @ts-ignore
import { ContentfulEventPreviewFragment, ContentfulEcssPreviewFragment, ContentfulPageArticlePreviewFragment, PageArticleQuery_contentfulPageArticle, PageEcssQuery_contentfulEcss } from '../gatsby-queries';
import { Globals } from '../utils/Globals';
import SEO from '../components/SEO/SEO';
import { Script } from "gatsby"

export interface IPathContext {
	alternateLanguage: string | null;
	id: string;
	languageCode: 'en-US' | 'ar-QA';
	currSlug: string;
	upcomingEvents?: ContentfulEventPreviewFragment[];
	upcomingPageEvents?: ContentfulEventPreviewFragment[];
	latestPageArticles?: ContentfulPageArticlePreviewFragment[];
	latestArticles?: ContentfulPageArticlePreviewFragment[];
	articles?: {preview: ContentfulPageArticlePreviewFragment, node:PageArticleQuery_contentfulPageArticle}[];
	ecss?: {preview: ContentfulEcssPreviewFragment, node:PageEcssQuery_contentfulEcss}[];
	bilingual?: boolean;
	expertsPage?: boolean;
	newsPage?: boolean;
}

export interface IPageProps {
	pageContext: IPathContext;
	pageData: any;
	type: 'home' | 'article' | 'event' | 'ecss' | 'ecss_expert' | 'expert_profile' | 'press_release' | 'campaign' | 'overview' | 'media_gallery' | 'persona' | 'entity' | 'place' | 'program' | 'search' | 'vertical' | 'tap-story';
	title: string;
	location: any;
	metaTitle?: string;
	bilingual?: boolean;
}

const PageWrapper: SFC<IPageProps> = ({ children, pageData, type, pageContext, title, bilingual, metaTitle }) => {
	const languageAlternatives =
		pageContext.alternateLanguage !== null ? <link rel="alternate" href={`${Globals.BASE_URL}${pageContext.alternateLanguage === '/' ? '' : pageContext.alternateLanguage}`} hrefLang={pageContext.languageCode === 'en-US' ? 'ar' : 'en'} /> : null;

	const languageCode = pageContext.languageCode === 'en-US' ? 'en' : 'ar';
	pageContext.bilingual = bilingual;
	let additionalTitle = '';
	const homeURL = ['/', '/ar']
	if(!homeURL.includes(pageContext.currSlug)) {
		additionalTitle = `| ${pageContext.languageCode === 'en-US' ? 'Qatar Foundation' : 'مؤسسة قطر'}`
	}
	return (
		<>
			{pageData && <SEO data={pageData} page={type} lang={pageContext.languageCode} />}
			<Helmet>
				<title>{title === 'Qatar Foundation' || title === 'مؤسسة قطر' ? title : `${metaTitle ? metaTitle : title} ${additionalTitle}`}</title>
				{!pageData && (
					<meta name="description" content="Qatar Foundation (QF) is a non-profit organization made up of more than 50 entities working in education, research, and community development." />
				)}
				<meta className="swiftype" name="title" data-type="string" content={title} />
				<meta className="swiftype" name="language" data-type="enum" content={languageCode} />
				<link rel="alternate" href={`${Globals.BASE_URL}${pageContext.currSlug === '/' ? '' : pageContext.currSlug}`} hrefLang={languageCode} />
				{languageAlternatives && languageAlternatives}
				<link rel="alternate" href={`${Globals.BASE_URL}${pageContext.languageCode === 'en-US' ? pageContext.currSlug === '/' ? '' : pageContext.currSlug : pageContext.alternateLanguage === '/' ? '' : pageContext.alternateLanguage}`} hrefLang="x-default" />
			</Helmet>
            <Script
                id="remove-utm-afterload"
                dangerouslySetInnerHTML={{
                    __html: `let url=window.location.href;if(url.includes("?")){var retryCounter=0;function checkIfAnalyticsLoaded(){if("function"==typeof ga&&ga.loaded||retryCounter++>20){if(history&&history.replaceState&&location.search){var e=location.search.slice(1).split("&");var t=e.filter(function(e){return"utm_"!==e.slice(0,4)});if(t.length<e.length){var a=t.length?"?"+t.join("&"):"",l=location.pathname+a+location.hash;history.replaceState(null,null,l)}}}else setTimeout(checkIfAnalyticsLoaded,100)}checkIfAnalyticsLoaded()}`
                }}
                strategy={'idle'}
            />
            <Script
                id="alias-redirect"
                dangerouslySetInnerHTML={{
                    __html: `switch(window.location.hostname){case"alumni.qf.org.qa":window.location.replace("https://www.qf.org.qa/education/alumni-program");break;case"www.qatarfoundation.net.qa":case"www.qatarfoundation.com.qa":case"www.qf.qa":case"www.qf.net":case"www.qf.com.qa":case"www.qf.net.qa":case"www.qf.edu.qa":case"www.qfradio.com":case"www.qfradio.info":case"www.qfradio.org":case"www.qatarfoundation.edu.qa":case"www.qatarfoundation.org":case"www.qatarfoundation.org.qa":case"www.renad.qa":case"www.woral.org":window.location.replace("https://www.qf.org.qa")}`
                }}
            />
			{children}
		</>
	);
};

export default PageWrapper;
