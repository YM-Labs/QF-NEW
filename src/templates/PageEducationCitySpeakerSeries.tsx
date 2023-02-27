import * as React from 'react';
import * as styles from './PageShared.module.scss';
// @ts-ignore
import * as stylesPage from './PageEducationCitySpeakerSeries.module.scss';
// @ts-ignore
import { PageEducationCitySpeakerSeriesQuery } from '../gatsby-queries';
import PageWrapper, { IPageProps } from './PageWrapper';
import ModulesWrapper from '../components/ModulesWrapper';
import { zeroPad } from '../utils/StringUtils';
import { Helmet } from 'react-helmet';
// @ts-ignore
import Masonry from 'react-masonry-component';
import { graphql, navigate } from 'gatsby';
import { FormattedMessage, injectIntl, useIntl } from 'react-intl';
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin';
import { Sine, gsap } from 'gsap/dist/gsap.min';
import GatsbyLink from 'gatsby-link';
import { GatsbyImageWrapper } from '../components/ui/GatsbyImageWrapper';
import ModuleShortBoxedText from '../components/ContentfulModules/ModuleShortBoxedText'
import { ModuleDynamicList } from '../components/ModuleDynamicList';
import { Globals } from '../utils/Globals';
import SearchECSS from '../components/Search/SearchECSS';

interface Props extends IPageProps {
    intl: ReturnType<typeof useIntl>;
	data: PageEducationCitySpeakerSeriesQuery;
}

const initialState = { showAllResultsLink: false };
type State = Readonly<typeof initialState>;

class PageEducationCitySpeakerSeries extends React.Component<Props, State> {
    readonly state: State = initialState;
    private searchInput: HTMLInputElement;

    componentDidMount() {
		gsap.registerPlugin(ScrollToPlugin);
        const checkEmpty = document.querySelector('#st-ecss-search-input-ecss');
            checkEmpty.addEventListener('input', () => {
            // @ts-ignore
            if (checkEmpty.value && checkEmpty.value.length > 0 && checkEmpty.value.trim().length > 0) { 
                this.setState({
                    showAllResultsLink: true
                });
                var el = document.getElementById('search_advanced_page_input');
                // @ts-ignore
                el.value = checkEmpty.value
                document.getElementById('ecss-search-submit').click()
            }
            else {
                this.setState({
                    showAllResultsLink: false
                })

                var el = document.getElementById('search_advanced_page_input');
                // @ts-ignore
                el.value = null
                document.getElementById('ecss-search-submit').click()
            }
        });
    }

    private scrollToHandler = event => {
        if(event.target.id === 'searchEcss' || event.target.id === 'searchEcssTags') {
            if(event.target.id === 'searchEcssTags') {
                // @ts-ignore
                const url = new URL(window.location);
                // @ts-ignore
                url.hash = 'page[type][]=ecss&currTypeFilters[filter_ecss_tags][]=' + event.currentTarget.dataset.id + '&s=';
                history.replaceState(null, document.title, url);
                window.location.reload();
            } else {
                gsap.to(window, { scrollTo: { y: event.target.getAttribute('href'), offsetY: 65, autoKill: false }, ease: Sine.easeInOut });
            }
        } else {
            // @ts-ignore
            const url = new URL(window.location);
            url.hash = '';
            history.replaceState(null, document.title, url);
            let hash;
            let offsetY = 65
            if(window.location.hash.substring(1)) {
                hash = '#' + window.location.hash.substring(1);
            } else {
                hash = event.target.getAttribute('href')
                event.preventDefault()
            }
    
            if (hash === '#formdone') {
                return;
            }
            if (event) {
                gsap.to(window, { scrollTo: { y: hash, offsetY: offsetY, autoKill: false }, ease: Sine.easeInOut });
            }

        }
	};
    private getTopNavSection(sections: any[]) {
		return (
			<div data-swiftype-index="false" className={`${styles.topSectionNav} ${stylesPage.ecssSection}`}>
				<h6 className={`text-style-quoted-by ${styles.sectionTitle}`}>
					<FormattedMessage id="Sections" />
				</h6>
				<ul>
                    <li key={'009'}>
                        <a onClick={this.scrollToHandler} className={`text-style-link-1 ${styles.sectionLink}`} href={`#section-0`}>
                            01. <FormattedMessage id="about_ecss" />
                        </a>
                    </li>
					{sections.map((module, index) => {
						return (
							<li key={module.id}>
								<a onClick={this.scrollToHandler} className={`text-style-link-1 ${styles.sectionLink}`} href={`#section-${index + 1}`}>
									{zeroPad(index + 2)}. {module.title}
								</a>
							</li>
						);
					})}
				</ul>
			</div>
		);
	}

    private shiftthefocus = event => {
		if (event.key == 'Enter' && event.target.id === 'st-ecss-search-input-ecss') {
            gsap.to(window, { scrollTo: { y: event.target.nextElementSibling.getAttribute('href'), offsetY: 80, autoKill: false }, ease: Sine.easeInOut });
		}
	};

    // @ts-ignore
    private allResultsClickHandler = event => {
		event.preventDefault();
		navigate(Globals.CURRENT_LANGUAGE_PREFIX + '/search#all=1&types[ecss]=1&s=' + encodeURIComponent(this.searchInput.value));
		return false;
	};

	render() {
		// @ts-ignore
		const masonryOptions = {
			transitionDuration: 0,
			resize: true,
			horizontalOrder: true,
			percentPosition: true,
			gutter: 50,
		};
		const pageData = this.props.data.contentfulPageEducationCitySpeakerSeries;
		const pageECSS = [];
		pageECSS.push(pageData.firstHighlightedEcss);
		this.props.data.allContentfulEcss.edges.forEach((node) => {
			if (node.node.contentful_id !== pageData.firstHighlightedEcss.contentful_id) {
				pageECSS.length < 9 && pageECSS.push(node.node);
			}
		});
        let featuredEvent = pageData.upcomingEcss ? pageData.upcomingEcss : pageData.firstHighlightedEcss
		const formateDate = featuredEvent && new Date(featuredEvent.startDate).toISOString().substring(0, 10);
		const ecssDate = new Date(formateDate);
        let modules = [];
		if (pageData.modulesWrapper) {
			pageData.modulesWrapper.forEach(moduleWrapper => modules.push(...moduleWrapper.modules));
		}
        let sections = [];
		modules.map(module => {
			if (module.__typename === 'ContentfulModuleSectionIntroduction' && !module.hideSectionNumber) {
				sections.push(module);
			}
		});

		return (
			<PageWrapper location={this.props.location} pageData={pageData} type={'overview'} title={pageData.title} pageContext={this.props.pageContext}>
				{
					//@ts-ignore:
					<Helmet>
						<html className={'page-ecss'} />
                        {
						//@ts-ignore:
						pageData.metaDescription && ( <meta name="description" content={pageData.metaDescription.metaDescription} /> )}
                        <meta
                            className="swiftype"
                            name="tags_vertical"
                            data-type="enum"
                            content="Community"
                        />
						<meta className="swiftype" name="type" data-type="enum" content="page" />
					</Helmet>
				}
				<div className={`container ecssPage`}>
					<div id='ecssBg' className={`pagePaddingTopEcss ${styles.topSection} ${styles.bgAlt}`}>
						<div className={`col-md-12 ${styles.topSectionText}`}>
							{
                                this.props.pageContext.languageCode !== 'ar-QA' ? (
                                    <h1 className={`${styles.h1} text-style-h1`}>
                                        <span>
                                            Education
                                        </span><br />
                                        <span>City</span>&nbsp;Speaker<br />
                                        Series
                                    </h1>
                                ) : (
                                    <h1 className={`${styles.h1} text-style-h1`}>
                                        <span>
                                        سلسلة
                                        </span><br />
                                        <span>محاضرات</span>&nbsp;المدينة<br />
                                        التعليمية
                                    </h1>
                                )
                            }
                        {sections.length > 0 && this.getTopNavSection(sections)}
						</div>
                        <div className={styles.searchEcssWrapper} id="searchEcssWrapper">
                            <div className={styles.innerWrapper}>
                                <label htmlFor="st-ecss-search-input" className="visually-hidden">
                                    <FormattedMessage id="SearchHelpText" />
                                </label>
                                <input
                                    title={this.props.intl.formatMessage({ id: 'searchinputtitle' })}
                                    ref={ref => {
                                        this.searchInput = ref;
                                    }}
                                    placeholder={this.props.intl.formatMessage({ id: 'Search' })}
                                    id="st-ecss-search-input-ecss"
                                    className="st-ecss-search-input-ecss"
                                    type="text"
                                    onKeyDown={this.shiftthefocus}
                                />
                                <a id='searchEcss' onClick={(e) => this.scrollToHandler(e)} className={styles.allResultsLink + (this.state.showAllResultsLink ? ' visible' : '')} href={'#search-ecss'}>
                                    <FormattedMessage id={'See all results'} />
                                </a>
                            </div>
                        </div>
						<div className={styles.ecssTagsWrapper}>
							{pageData.highlightedTags.map((node, index) => {
								return (
                                    // @ts-ignore
									<a id='searchEcssTags' data-id={node.contentful_id} className={styles.ecssTag} onClick={(e) => this.scrollToHandler(e)} href={'#search-ecss'} key={index}>{node.title}</a>
								)
							})}
						</div>
					</div>
					{
						// @ts-ignore
						(pageData.upcomingEcss || pageData.firstHighlightedEcss) && (
							<div>
								<div className={`${styles.upcomingEcssWrapper}`}>
									<div className={`${styles.upcomingEcss}`}>
										<div className={`text-style-body ${styles.itemDetails}`}>
											<strong className={`text-style-h4`}>
												{ pageData.upcomingEcss ? <FormattedMessage id="Upcoming event" /> : <FormattedMessage id="Featured video" /> }
											</strong>
											<div className={'ecssDate'}>
												<div className={`${styles.dateWrapper}`}>
													<span className={styles.date}>
														{ecssDate.getDate()}
													</span>
													<span className={styles.month}>
														{ecssDate.toLocaleString(this.props.pageContext.languageCode, { month: "short" })}
													</span>
												</div>
												<div className={`${styles.timeZone}`}>
													<div>
														<span>
															{new Date(featuredEvent.startDate)
																.toLocaleString('en-GB', { timeZone: 'Asia/Qatar' })
																.replace(/.*(\d{2}:\d{2}:\d{0}).*/, '$1')
																.slice(0, -1)}
														</span>{' '}
														-{' '}
														<span>
															{new Date(featuredEvent.endDate)
																.toLocaleString('en-GB', { timeZone: 'Asia/Qatar' })
																.replace(/.*(\d{2}:\d{2}:\d{0}).*/, '$1')
																.slice(0, -1)}
														</span>
														&nbsp;GMT+3 (<FormattedMessage id="Qatar" />)
													</div>
													<div>
														<span>
															{new Date(featuredEvent.startDate)
																.toLocaleString('en-GB', { timeZone: 'Europe/London' })
																.replace(/.*(\d{2}:\d{2}:\d{0}).*/, '$1')
																.slice(0, -1)}
														</span>{' '}
														-{' '}
														<span>
															{new Date(featuredEvent.endDate)
																.toLocaleString('en-GB', { timeZone: 'Europe/London' })
																.replace(/.*(\d{2}:\d{2}:\d{0}).*/, '$1')
																.slice(0, -1)}
														</span>
														&nbsp;GMT+1 (<FormattedMessage id="London" />)
													</div>
													<div>
														<span>
															{new Date(featuredEvent.startDate)
																.toLocaleString('en-GB', { timeZone: 'America/New_York' })
																.replace(/.*(\d{2}:\d{2}:\d{0}).*/, '$1')
																.slice(0, -1)}
														</span>{' '}
														-{' '}
														<span>
															{new Date(featuredEvent.endDate)
																.toLocaleString('en-GB', { timeZone: 'America/New_York' })
																.replace(/.*(\d{2}:\d{2}:\d{0}).*/, '$1')
																.slice(0, -1)}
														</span>
														&nbsp;GMT-4 (<FormattedMessage id="New York" />)
													</div>
												</div>
											</div>
											<h2 className={`text-style-h2 ${styles.title}`}>
												{featuredEvent.title}
											</h2>
											<div className={`${styles.description}`}>
												<div className={`text-style-markdown`} dangerouslySetInnerHTML={{ __html: featuredEvent.description?.childMarkdownRemark.html }} />
											</div>
											<GatsbyLink data-swiftype-index="false" className={`text-style-body ${styles.ctaLink} module-margin-small`}
												to={(this.props.pageContext.languageCode === 'ar-QA' ? '/ar' : '') + '/education-city-speaker-series/' + featuredEvent.slug}>
												{ pageData.upcomingEcss ? <FormattedMessage id="Sign up for the session" /> : <FormattedMessage id="Watch video" /> }
											</GatsbyLink>
										</div>
										<div className={`${styles.itemImage}`}>
											{
												<GatsbyImageWrapper
                                                    className={styles.ecssFeaturedImage}
                                                    // @ts-ignore
                                                    alt={featuredEvent.image.title}
                                                    // @ts-ignore
                                                    image={featuredEvent.image}
                                                />
											}
										</div>
									</div>
								</div>
							</div>
						)
					}
                    <div id='section-0'>
                        <ModuleShortBoxedText data={pageData.aboutEcss} marginSm={true} />
                    </div>
					<ModulesWrapper
						languageCode={this.props.pageContext.languageCode}
						upcomingEventsData={this.props.pageContext.upcomingEvents}
						hasHeroImage={false}
						// @ts-ignore
						data={this.props.data.contentfulPageEducationCitySpeakerSeries.modulesWrapper}
                        // @ts-ignore
                        slug={pageData.slug}
					>
                        <ModuleDynamicList position={1} count={0} title={null}>
                            <div id='search-ecss'></div>
                            <SearchECSS filterData={this.props.data} currLanguage={this.props.pageContext.languageCode} />
                        </ModuleDynamicList>
                    </ModulesWrapper>
				</div>
			</PageWrapper>
		);
	}
}

export default injectIntl(PageEducationCitySpeakerSeries);

export const pageQuery = graphql`
	query PageEducationCitySpeakerSeriesQuery($id: String, $languageCode: String) {
        allContentfulFilterEcssTag(filter: { node_locale: { eq: $languageCode } }) {
			edges {
				node {
					title
					contentful_id
				}
			}
		}
		contentfulPageEducationCitySpeakerSeries(contentful_id: { eq: $id }, node_locale: { eq: $languageCode }) {
			id
			title
            slug
			highlightedTags {
                contentful_id
				slug
				title
			}
            aboutEcss {
                ... on ContentfulModuleShortBoxedText {
                    ...ContentfulModuleShortBoxedTextFragment
                }
            }
			firstHighlightedEcss {
				contentful_id
				title
				description {
					childMarkdownRemark {
						html
					}
				}
				startDate
				endDate
				slug
				image {
					title
					file {
						url
					}
					gatsbyImageData(placeholder: NONE, quality: 85)
				}
				ecssTag {
					title
					slug
				}
			}
			upcomingEcss {
				contentful_id
				title
				description {
					childMarkdownRemark {
						html
					}
				}
				startDate
				endDate
				slug
				image {
					title
					file {
						url
					}
					gatsbyImageData(placeholder: NONE, layout: FULL_WIDTH, quality: 100)
				}
				ecssTag {
					title
					slug
				}
			}
			modulesWrapper {
				...ContentfulModuleWrapperFragment
			}
			metaTitle
			metaDescription {
				metaDescription
			}
		}
		allContentfulEcss(filter: { node_locale: { eq: $languageCode }}, limit: 8) {
			edges {
				node {
					...ContentfulEcssPreviewFragment
				}
			}
		}
	}
`;