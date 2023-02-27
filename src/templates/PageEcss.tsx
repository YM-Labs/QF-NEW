import * as React from 'react';
import * as styles from './PageShared.module.scss';
// @ts-ignore
import { PageEcssQuery } from '../gatsby-queries';
import PageWrapper, { IPageProps } from './PageWrapper';
import ModulesWrapper from '../components/ModulesWrapper';
import { Helmet } from 'react-helmet';
// @ts-ignore
import { FormattedDate, FormattedMessage, injectIntl, useIntl } from 'react-intl';
import { getPagePath } from '../utils/URLHelper';
import ViewableMonitor from '../components/ui/ViewableMonitor';
import ModuleVideoEmbedded from '../components/ContentfulModules/ModuleVideoEmbedded';
import ModuleVideoYouTube from '../components/ContentfulModules/ModuleVideoYouTube';
import { ExpertProfilePreview } from '../components/Previews/ExpertProfilePreview';
import ModuleSectionIntroduction from '../components/ContentfulModules/ModuleSectionIntroduction';
import ModuleHighlightedItems from '../components/ContentfulModules/ModuleHighlightedItems';
import { sanitizeUrl } from '../utils/URLHelper';
import UIShareButtons from '../ui/UIShareButtons';
import ModuleCfForm from '../components/ContentfulModules/ModuleCfForm';
import Poll from '../components/ContentfulModules/ModulePoll'
import { BLOCKS, MARKS, INLINES } from "@contentful/rich-text-types"
import { renderRichText } from "gatsby-source-contentful/rich-text"
import Ecss from '../templates/Email/Ecss'
import { GatsbyImageWrapper } from '../components/ui/GatsbyImageWrapper';
import { graphql } from 'gatsby';

interface Props extends IPageProps {
	intl: ReturnType<typeof useIntl>;
	data: PageEcssQuery;
}

const initialState = { monthWidth: 0 };
type State = any;

class PageEcss extends React.Component<Props, State> {
	readonly state: State = initialState;
    private options = {
        renderMark: {
          [MARKS.BOLD]: text => <b>{text}</b>,
        },
        renderText: text => {
            return text.split('\n').reduce((children, textSegment, index) => {
                return [...children, index > 0 && <br key={index} />, textSegment];
            }, []);
        },
        renderNode: {
          // @ts-ignore
          [BLOCKS.PARAGRAPH]: (node, children) => <p style={{ Margin: '0', webkitTextSizeAdjust: 'none', msTextSizeAdjust: 'none', msoLineHeightRule: 'exactly', lineHeight: '21px', color: '#5f6062', fontSize: '14px'}} dir={this.dir}>{children}</p>,
          [BLOCKS.EMBEDDED_ASSET]: node => {
            return (
              <>
                <h2>Embedded Asset</h2>
                <pre>
                  <code>{JSON.stringify(node, null, 2)}</code>
                </pre>
              </>
            )
          },
          [INLINES.HYPERLINK]: (node) => {
            return <a href={node.data.uri} style={{ color: '#FF6600' }}>{node.content[0].value}</a>;
          },
        },
    }
	render() {
		const pageData = this.props.data.contentfulEcss;
		const formateDate = new Date(pageData.startDate).toISOString().substring(0, 10);
		const ecssDate = new Date(formateDate);
		var modulesWrapperPoll = pageData.modulesWrapper && pageData.modulesWrapper.filter((event, i) => {
			return event.modules[i].__typename == "ContentfulModulePoll";
		})
		if(pageData.modulesWrapper) {
			pageData.modulesWrapper['isUpcomingEvent'] = pageData.upcomingEvent;
		}

		return (
			<PageWrapper location={this.props.location} pageData={pageData} type={'ecss'} title={pageData.title} pageContext={this.props.pageContext}>
                <div id="emailBody">
                    {
                        // @ts-ignore
                        pageData.emailTemplate && renderRichText(pageData.emailTemplate.body, this.options)
                    }
                </div>
                <div id="emailTemplate">
                    {
                        <Ecss body={typeof document !== 'undefined' && document.getElementById("emailBody")?.innerHTML} image={`https:${pageData.emailTemplate?.image?.file?.url}`} currLang={this.props.pageContext.languageCode} />
                    }
                </div>
				<div className={`container ecssPage ecssPageSingle ${pageData.upcomingEvent && 'upcomingEcssSingle'}`}>
					{
						//@ts-ignore:
						<Helmet>
							<html className={`${pageData.upcomingEvent ? 'upcoming-ecss' : 'ecss-single'}`} />
							<meta className="swiftype" name="preview_image" data-type="enum" content={pageData.image && pageData.image.file.url} />
							<meta className="swiftype" name="type" data-type="enum" content="ecss" />
							<meta className="swiftype" name="filter_start_date" data-type="date" content={pageData.startDate && pageData.startDate} />
							<meta className="swiftype" name="filter_end_date" data-type="date" content={pageData.endDate && pageData.endDate} />
                            {
                                // @ts-ignore
							    <meta className="swiftype" name="body" data-type="text" content={pageData.description?.description} />
                            }
                            {pageData.ecssTag &&
							pageData.ecssTag.map((tag, index) => <meta key={index} className="swiftype" name="filter_ecss_tags" data-type="enum" content={tag.contentful_id} />)}
							{
                                // @ts-ignore
							    <meta className="swiftype" name="body" data-type="text" content={pageData.description?.description} />
                            }
                            {pageData.ecssTag &&
							pageData.ecssTag.map((tag, index) => <meta key={index} className="swiftype" name="filter_ecss_tags" data-type="enum" content={tag.contentful_id} />)}
						</Helmet>
					}
					{
						!pageData.upcomingEvent ? (
							<>
								<div className={styles.topSectionLeadInEcss}>
                                    {
                                        (pageData.ecssVideo || pageData.promotionalVideo) && (
                                            <span>
                                                <FormattedMessage id="Video" />
                                            </span>
                                        )
                                    }
									<div>
										<FormattedDate value={new Date(pageData.startDate)} day="numeric" /> <FormattedDate value={new Date(pageData.startDate)} month="long" year="numeric" />
									</div>
								</div>
							</>
						) : (
							<>
								<div className={styles.topSectionLeadInEcss}>
									<FormattedMessage id="Upcoming event" /> <span className='topSectionLeadInTeaser'>| <FormattedMessage id="ecss_title" /></span>
								</div>
							</>
						)
					}
					{
						!pageData.upcomingEvent ? (
							<div id='ecssBg' className={`${pageData.ecssVideo || pageData.promotionalVideo || pageData.ecssImage ? `pagePaddingTopEcss` : `pagePaddingTopEcssXs`} ${styles.topSection} ${styles.bgAlt}`}>
								<h1 className={`text-style-h1-large ${styles.ecssTitle}`}>{pageData.title}</h1>
								<div id='ecssTagsWrapper' className={styles.ecssTagsWrapper}>
									{pageData.ecssTag.map((node, index) => {
										return (
											<a className={styles.ecssTag} href={getPagePath(node.slug, 'ecss')} key={index}>{node.title}</a>
										)
									})}
								</div>
								<div className={`${styles.description}`}>
									<div className={`text-style-introduction-op-ed text-style-markdown`} dangerouslySetInnerHTML={{ __html: pageData.description?.childMarkdownRemark.html }} />
								</div>
								<UIShareButtons color={'white'} url={this.props.pageContext.currSlug} title={pageData.title} />
							</div>
						) : (
							<>
								<div id='ecssBg' className={`pagePaddingTopEcss ${styles.topSection} ${styles.topSectionEcssWrapper} ${styles.bgAlt}`}>
									<div className={`${styles.upcomingEcssIntro}`}>
										<h1 className={`text-style-h1-large topSectionEcssTitle ${styles.ecssTitle}`}>{pageData.title}</h1>
										<div className={`${styles.description}`}>
											<div className={`text-style-body`} dangerouslySetInnerHTML={{ __html: pageData.description?.childMarkdownRemark.html }} />
										</div>
										<div className={'ecssDate module-margin-small'}>
											<div className={`${styles.dateWrapper} ecssPageSingleDateWrapper`}>
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
														{new Date(pageData.startDate)
															.toLocaleString('en-GB', { timeZone: 'Asia/Qatar' })
															.replace(/.*(\d{2}:\d{2}:\d{0}).*/, '$1')
															.slice(0, -1)}
													</span>{' '}
													-{' '}
													<span>
														{new Date(pageData.endDate)
															.toLocaleString('en-GB', { timeZone: 'Asia/Qatar' })
															.replace(/.*(\d{2}:\d{2}:\d{0}).*/, '$1')
															.slice(0, -1)}
													</span>
													&nbsp;GMT+3 (<FormattedMessage id="Qatar" />)
												</div>
												<div>
													<span>
														{new Date(pageData.startDate)
															.toLocaleString('en-GB', { timeZone: 'Europe/London' })
															.replace(/.*(\d{2}:\d{2}:\d{0}).*/, '$1')
															.slice(0, -1)}
													</span>{' '}
													-{' '}
													<span>
														{new Date(pageData.endDate)
															.toLocaleString('en-GB', { timeZone: 'Europe/London' })
															.replace(/.*(\d{2}:\d{2}:\d{0}).*/, '$1')
															.slice(0, -1)}
													</span>
													&nbsp;GMT+1 (<FormattedMessage id="London" />)
												</div>
												<div>
													<span>
														{new Date(pageData.startDate)
															.toLocaleString('en-GB', { timeZone: 'America/New_York' })
															.replace(/.*(\d{2}:\d{2}:\d{0}).*/, '$1')
															.slice(0, -1)}
													</span>{' '}
													-{' '}
													<span>
														{new Date(pageData.endDate)
															.toLocaleString('en-GB', { timeZone: 'America/New_York' })
															.replace(/.*(\d{2}:\d{2}:\d{0}).*/, '$1')
															.slice(0, -1)}
													</span>
													&nbsp;GMT-4 (<FormattedMessage id="New York" />)
												</div>
											</div>
										</div>
										<UIShareButtons color={'white'} url={this.props.pageContext.currSlug} title={pageData.title} />
									</div>
									{
										pageData.upcomingEvent && (
                                            (pageData.registrationForm || modulesWrapperPoll) && (
                                                <div className={`${styles.upcomingEcssSignup}`}>
                                                    {
                                                        pageData.registrationForm && (
                                                            <>
                                                                <h2 id='ecssFormHeading' className={`${styles.ecssFormHeading} text-style-subheadline`}>
                                                                    <FormattedMessage id="Register to attend" />
                                                                </h2>
                                                                <ModuleCfForm ecss={true} subject={pageData.emailTemplate.subject.subject} data={pageData.registrationForm} languageCode={this.props.pageContext.languageCode} inPerson={pageData.inPerson} inPersonCapacity={pageData.inPersonCapacity} />
                                                            </>
                                                        )
                                                    }
                                                    <div id='poll'>
                                                        {
                                                            // @ts-ignore
                                                            modulesWrapperPoll && <Poll theme='light' data={modulesWrapperPoll[0].modules[0]} isUpcomingEvent={true} languageCode={this.props.pageContext.languageCode} />
                                                        }
                                                    </div>
                                                </div>
                                            )
										)
									}
								</div>
							</>
						)
					}
                    {(pageData.ecssVideo || pageData.promotionalVideo) && (
                        <ViewableMonitor>
                            <div className={styles.videoWrapperECSS}>
                                { pageData.ecssVideo ? <ModuleVideoYouTube data={pageData.ecssVideo} /> : <ModuleVideoEmbedded data={pageData.promotionalVideo} />}
                            </div>
                        </ViewableMonitor>
                    )}
                    {pageData.ecssImage && (
                        <ViewableMonitor>
                            <div className={styles.videoWrapperECSS}>
                                <div className={'module-margin'}>
                                    {
                                        // @ts-ignore
                                        <GatsbyImageWrapper alt={pageData.ecssImage.title} image={pageData.ecssImage} outerWrapperClassName={styles.ecssImage} />
                                    }
                                </div>
                            </div>
                        </ViewableMonitor>
                    )}
                    {
                        pageData.modulesWrapper && (
                            <ModulesWrapper
                                languageCode={this.props.pageContext.languageCode}
                                upcomingEventsData={this.props.pageContext.upcomingEvents}
                                childrenLast={true}
                                hasHeroImage={true}
                                data={pageData.modulesWrapper}
                            >
                            </ModulesWrapper>
                        )
                    }
					<div className={`module-margin ${styles.speakerProfileWrapper}`}>
						<div>
							<ViewableMonitor>
								<h2 tabIndex={0} className="text-style-category-headline"><FormattedMessage id="About the speaker" /></h2>
							</ViewableMonitor>
						</div>
						<div className={`module-margin-small ${styles.profileWrapper}`}>
							{
							// @ts-ignore
							pageData.speaker && pageData.speaker.map((node, index) => {
								return (
									// @ts-ignore
									<ViewableMonitor delay={index + 1} key={'profile-' + node.id}>
										<ExpertProfilePreview
										// @ts-ignore
											url={getPagePath(sanitizeUrl(node.slug), 'ecss_experts')} 
											// @ts-ignore
											key={node.id}
											// @ts-ignore
											imageBasePath={node.previewImage?.file.url}
											category={null}
											filterData={null}
											filter_expert_subjects={null}
											filter_entity={null}
											// @ts-ignore
											name={node.name}
											// @ts-ignore
											title={node.title?.title}
											// @ts-ignore
											introText={node.description?.description.substring(0, 350).trimEnd() + " ..."}
											description={node.description?.childMarkdownRemark.html}
											ecss={true}
										/>
									</ViewableMonitor>
								);
							})}
						</div>
					</div>
					{
						pageData.moderator && (
							<div className={`module-margin ${styles.moderatorProfileWrapper}`}>
								<div>
									<ViewableMonitor>
										<h2 tabIndex={0} className="text-style-category-headline"><FormattedMessage id="About the moderator" /></h2>
									</ViewableMonitor>
								</div>
								<div className={`module-margin-small ${styles.profileWrapper}`}>
									{
											// @ts-ignore
											<ViewableMonitor delay={1} key={'profile-' + pageData.moderator?.id}>
												<ExpertProfilePreview
												// @ts-ignore
													url={pageData.moderator && getPagePath(sanitizeUrl(pageData.moderator?.slug), 'ecss_experts')}
													// @ts-ignore
													key={pageData.moderator?.id}
													// @ts-ignore
													imageBasePath={pageData.moderator?.previewImage?.file.url}
													category={null}
													filterData={null}
													filter_expert_subjects={null}
													filter_entity={null}
													// @ts-ignore
													name={pageData.moderator?.name}
													// @ts-ignore
													title={pageData.moderator?.title?.title}
													// @ts-ignore
													introText={pageData.moderator?.description?.description.substring(0, 350).trimEnd() + " ..."}
													description={pageData.moderator?.description?.childMarkdownRemark.html}
													ecss={true}
												/>
											</ViewableMonitor>
										}
								</div>
							</div>
						)
					}
					{
						pageData.relatedArticles && (
							<>
								{ 
									<>
									{
										// @ts-ignore
										<ModuleSectionIntroduction data={{ id: 'eafoae23', introductionText: undefined, title: this.props.intl.formatMessage({ id: 'Related Articles' }) }} hideSectionNumber={true} offsetForHeroImage={false} />
									}
									{
										// @ts-ignore
										<ModuleHighlightedItems useScrollList={false} data={{
											id: 'blalba',
											headline: { title: null },
											highlightedItems: pageData.relatedArticles,
											useMasonryLayout: false,
											// @ts-ignore
											readMoreCta: null,
											showLatestFromCategory: null,
											highlightedBackground: false,
											sortByDate: true
										}} />

									}
									</>
								}
							</>
							
						)
					}
				</div>
			</PageWrapper>
		);
	}
}

export default injectIntl(PageEcss)

export const pageQuery = graphql`
	query PageEcssQuery($id: String, $languageCode: String) {
		contentfulEcss(contentful_id: { eq: $id }, node_locale: { eq: $languageCode }) {
			contentful_id
			title
			description {
				description
				childMarkdownRemark {
					html
				}
			}
			startDate
			endDate
			image {
				file {
					url
				}
			}
			promotionalVideo {
				... on ContentfulModuleVideoEmbedded {
					__typename
					...ContentfulModuleVideoEmbeddedFragment
				}
			}
			ecssVideo {
				... on ContentfulModuleVideoYouTube {
					__typename
					...ContentfulModuleVideoYouTubeFragment
				}
			}
            ecssImage {
                title
                gatsbyImageData(
                    placeholder: NONE
                    height: 600
                    quality: 85
                  )
            }
			ecssTag {
				contentful_id
				title
				slug
			}
			speaker {
				... on ContentfulPageExpertProfile {
					id
					slug
					name
					title {
						title
					}
					phoneNumberOptional
					emailOptional
					languages {
						languages
					}
					affiliation {
						affiliation
					}
					description {
						description
						childMarkdownRemark {
							html
						}
					}
					filterEntity {
						contentful_id
					}
					filterSubjects {
						contentful_id
						title
					}
					previewImage {
						title
						file {
							url
						}
						gatsbyImageData(
                            placeholder: NONE
                            width: 888
                            height: 1196
                            quality: 85
                          )
					}
				}
			}
			moderator {
				... on ContentfulPageExpertProfile {
					id
					slug
					name
					title {
						title
					}
					phoneNumberOptional
					emailOptional
					languages {
						languages
					}
					affiliation {
						affiliation
					}
					description {
						description
						childMarkdownRemark {
							html
						}
					}
					filterEntity {
						contentful_id
					}
					filterSubjects {
						contentful_id
						title
					}
					previewImage {
						title
						file {
							url
						}
						gatsbyImageData(
                            placeholder: NONE
                            width: 888
                            height: 1196
                            quality: 85
                          )
					}
				}
			}
			image {
				file {
					url
				}
				gatsbyImageData(
                    placeholder: NONE
                    width: 1680
                    height: 700
                    quality: 85
                    layout: FULL_WIDTH
                  )
			}
			modulesWrapper {
				...ContentfulModuleWrapperFragment
			}
			relatedArticles {
				__typename
				...ContentfulPageArticlePreviewFragment
			}
			upcomingEvent
			emailTemplate {
				subject {
					subject
				}
				image {
					file {
					  url
					}
				}
				body {
				  raw
				}
			}
            inPerson
            inPersonCapacity
            registrationForm {
                ... on ContentfulModuleCfForm {
                    ...ContentfulModuleCfFormFragment
                }
            }
		}
	}
`;
