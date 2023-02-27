import React from 'react';
import { Component } from 'react';
import Header from '../components/Header';
import { Helmet } from 'react-helmet';
import { getCurrentLangKey } from 'ptz-i18n';
import { IntlProvider } from 'react-intl';

//Styles:
import './LayoutIndex.scss';
import '../styles/index.scss';
import Footer from '../components/Footer';
import IDKTFooter from '../ui/IDKT/Footer';
import { globalsQueryAndLayout } from '../gatsby-queries';
import { Globals } from '../utils/Globals';
import { graphql, StaticQuery, Script } from 'gatsby';
import PageTransition from '../ui/PageTransition';
import KeyboardOnlyOutlines from '@moxy/react-keyboard-only-outlines';
import { UIBreadcrumb } from '../ui/UIBreadcrumb';

const initialState = { showNotification: false, alternateUrl: '', title: 'Qatar Foundation', bilingual: true, currentLocation: null };
type State = Readonly<typeof initialState>;

class TemplateWrapper extends Component<{ children: any; location: any; layoutData: globalsQueryAndLayout }, State> {
	readonly state: State = initialState;

	constructor(props) {
		super(props);
	}

	async componentDidMount() {
		await fetch('https://cdn.contentful.com/spaces/2h1qowfuxkq7/environments/master/entries/1UkArCmwqoGeweAo8yiMgG?access_token=58c4afc16acba8b5b5a1f79a13f22cb0e140a4e3a5ab3355da49ff6bfd9a7978')
		.then((resp) => resp.json())	
        .then(async response => {
            this.setState({ showNotification: response.fields.showStatementNotification });
        });
	}

	private helmetClientStateChange = newState => {
		if (newState.linkTags.length > 1) {
			let alternateLink = newState.linkTags[1].href;
			if (this.state.alternateUrl !== alternateLink) {
				this.setState({ alternateUrl: alternateLink });
			}
		}
		this.setState({ title: newState.title ? newState.title.replace(' | Qatar Foundation', '').replace(' | مؤسسة قطر', '') : newState.title });
	};

	render() {
		let { children, location } = this.props;
		const url = location.pathname;
		const { langs, defaultLangKey } = this.props.layoutData.site.siteMetadata.languages;
		const langsArray = langs.map(language => language.langKey);
		const currLangKey = getCurrentLangKey(langsArray, defaultLangKey, url);
		const currLangDir = currLangKey == 'en' ? 'ltr' : 'rtl';
		const activeGlobalsData = this.props.layoutData.siteGlobals.edges[currLangKey === 'en' ? 0 : 1].node;
		//@ts-ignore:
		const bilingual = this.props.pageContext.bilingual;

		//@ts-ignore:
		const pageTitle = this.props.pageContext.title;

		//Used in URLHelper.ts
		Globals.CURRENT_LANGUAGE_PREFIX = currLangKey === 'en' ? '' : 'ar/';

		let langsMenu = langs.map(function(language) {
			return {
				langKey: language.languageCode,
				selected: currLangKey === language.langKey,
				link: '/' + language.langPath
			};
		});

		const i18nMessages = require(`../data/messages/${currLangKey}`);
		const menuData = this.props.layoutData.allContentfulMenu.edges.map(node => node.node);
        const currLanguage = langsMenu[1].selected ? langsMenu[1] : langsMenu[0];

		const childrenWithProps = React.Children.map(children, child => React.cloneElement(child, { location: location }));
        let path = this.props.location.pathname;
		const isFrontPage = path === '/' || path === '/ar' || path === '/ar/';
        const isWCPage = path === '/education-city-world-cup' || path === '/education-city-world-cup/' || path === '/ar/education-city-world-cup' || path === '/ar/education-city-world-cup/';
		return (
			<KeyboardOnlyOutlines>
				<IntlProvider locale={currLangKey} messages={i18nMessages}>
					<div>
                        <Script
                            id="add-bodyclass-afterload"
                            dangerouslySetInnerHTML={{
                                __html: `if(document.readyState!=='loading'){document.querySelector('html').setAttribute('data-body-class','js')}else{document.addEventListener('DOMContentLoaded',function(){document.querySelector('html').setAttribute('data-body-class','js')})}`
                            }}
                        />
                        <Script
                            strategy="idle"
                            id="gtm"
                            dangerouslySetInnerHTML={{
                                __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-MBDXSWG');`
                            }}
                        />
                        <Script
                            id="userway"
                            dangerouslySetInnerHTML={{
                                __html: `(function(d){var s = d.createElement("script");s.setAttribute("data-account", "kwC0P4jhFt");s.setAttribute("src", "https://accessibilityserver.org/widget.js");(d.body || d.head).appendChild(s);})(document)`
                            }}
                        />
						<Header
							footerCopyrightMessage={activeGlobalsData.footerCopyrightMessage.footerCopyrightMessage}
							menuData={menuData}
							langs={langsMenu}
							programs={this.props.layoutData.programs}
							places={this.props.layoutData.places}
							entities={this.props.layoutData.entities}
							currPageTitle={this.state.title}
							pageTitle={pageTitle}
							location={location}
							alternateURL={this.state.alternateUrl}
							bilingual={bilingual}
                            // @ts-ignore
                            topBarInfo={activeGlobalsData.showTopInfoBar && activeGlobalsData.topInfoBarContent}
						/>
						<div className="siteWrapper" id="siteWrapper">
							{
								//@ts-ignore:
								<Helmet title="Qatar Foundation" onChangeClientState={this.helmetClientStateChange}>
									<html lang={currLangKey} dir={currLangDir} />
								</Helmet>
							}
							<div className="pageWrapper" data-swiftype-name="body" data-swiftype-type="text" data-swiftype-index="true">
                                {
                                    (!isFrontPage && !isWCPage) && <UIBreadcrumb location={this.props.location} currLanguage={currLanguage} currPageTitle={pageTitle ? pageTitle : this.state.title} />
                                }
								<PageTransition location={location}>{childrenWithProps}</PageTransition>
							</div>
						</div>
						{
							// @ts-ignore
							this.props.pageContext.currSlug && this.props.pageContext.currSlug.indexOf('/idkt') != -1 ? (
								<IDKTFooter
									locationPathName={location.pathname}
									currPageTitle={pageTitle}
									showStatementNotification={this.state.showNotification}
									pageTitle={pageTitle}
									menuData={menuData}
									siteGlobals={activeGlobalsData}
									currLanguage={langsMenu[1].selected ? langsMenu[1] : langsMenu[0]}
								/>
							) :
							(
								<Footer
									locationPathName={location.pathname}
									currPageTitle={pageTitle}
									showStatementNotification={this.state.showNotification}
									pageTitle={pageTitle}
									menuData={menuData}
									siteGlobals={activeGlobalsData}
									currLanguage={langsMenu[1].selected ? langsMenu[1] : langsMenu[0]}
                                    footerBarInfo={activeGlobalsData.footerInfoBarContent}
								/>
							)
						}
					</div>
				</IntlProvider>
			</KeyboardOnlyOutlines>
		);
	}
}

export default props => (
	<StaticQuery
		query={graphql`
			query globalsQueryAndLayout {
				site {
					siteMetadata {
						siteUrl
						languages {
							defaultLangKey
							langs {
								langPath
								languageCode
								langKey
							}
						}
					}
				}
				siteGlobals: allContentfulSitewideGlobalElements(filter: { contentful_id: { eq: "5YUWjk2bAcOkMOWsGAoQk8" } }) {
					edges {
						node {
							footerOrganizationName
							footerContactEmail
							footerCopyrightMessage {
								footerCopyrightMessage
							}
							footerContactPhoneNumber
							footerSmallLinks {
								childMarkdownRemark {
									html
								}
							}
                            showTopInfoBar
                            topInfoBarContent {
                                raw
                            }
                            footerInfoBarContent {
                                raw
                            }
						}
					}
				}
				programs: allSitePage(filter: { componentChunkName: { eq: "component---src-templates-page-program-tsx" } }) {
					edges {
						node {
							path
							pageContext
						}
					}
				}
				places: allSitePage(filter: { componentChunkName: { eq: "component---src-templates-page-place-tsx" } }) {
					edges {
						node {
							path
							pageContext
						}
					}
				}
				entities: allSitePage(filter: { componentChunkName: { eq: "component---src-templates-page-entity-tsx" } }) {
					edges {
						node {
							path
							pageContext
						}
					}
				}
				allContentfulMenu {
					edges {
						node {
							...MainMenuFragment
						}
					}
				}
			}
		`}
		render={data => <TemplateWrapper layoutData={data as globalsQueryAndLayout} {...props} />}
	/>
);
