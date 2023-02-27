import * as React from 'react';
import * as stylesPage from './PageExpertProfile.module.scss';
import { PageExpertProfileQuery } from '../gatsby-queries';
import PageWrapper, { IPageProps } from './PageWrapper';
import ModulesWrapper from '../components/ModulesWrapper';
import { Helmet } from 'react-helmet';
import { graphql } from 'gatsby';
import ModuleSectionIntroduction from '../components/ContentfulModules/ModuleSectionIntroduction';
import { FormattedMessage, injectIntl, useIntl } from 'react-intl';
import GatsbyLinkExternalSupport from '../ui/GatsbyLinkExternalSupport';
import { GatsbyImageWrapper } from '../components/ui/GatsbyImageWrapper';
import ViewableMonitor from '../components/ui/ViewableMonitor';
import ModuleCtaLink from '../components/ContentfulModules/ModuleCtaLink';
import ModuleHighlightedItems from '../components/ContentfulModules/ModuleHighlightedItems';

interface Props extends IPageProps {
	intl: ReturnType<typeof useIntl>;
	data: PageExpertProfileQuery;
}

class PageExpertProfile extends React.Component<Props> {
	render() {
		const pageData = this.props.data.contentfulPageExpertProfile;
		const subjectsString = pageData.filterSubjects?.map(edge => edge?.title).join('   |   ');
		// @ts-ignore
		const type = (pageData.ecssSpeaker || pageData.ecssModerator) ? 'ecss_expert' : 'expert_profile'
		return (
			<PageWrapper location={this.props.location} pageData={pageData} type={type} title={pageData.name} pageContext={this.props.pageContext}>
				<div className={`container pagePaddingTopSearch ${stylesPage.pageWrapper}`}>
					{
						//@ts-ignore:
						<Helmet>
                            <title>
                                {
                                    // @ts-ignore
                                    (pageData.titlePrefix ? pageData.titlePrefix + ' ' : '') + pageData.name + ' ' + pageData.lastName
                                }
                            </title>
							<meta className="swiftype" name="type" data-type="enum" content={type} />
                            {
                                // @ts-ignore
                                <meta className="swiftype" name="title_prefix" data-type="enum" content={pageData.titlePrefix} />
                            }
							<meta className="swiftype" name="first_name" data-type="enum" content={pageData.name} />
                            {
                                // @ts-ignore
                                <meta className="swiftype" name="last_name" data-type="enum" content={pageData.lastName} />
                            }
							<meta className="swiftype" name="expert_title" data-type="enum" content={pageData.title.title} />
                            {
                                // @ts-ignore
							    <meta className="swiftype" name="expert_introduction" data-type="enum" content={pageData.introductionText ? pageData.introductionText.introductionText : pageData.description?.description.substring(0, 600).trimEnd() + " ..."} />
                            }
							<meta className="swiftype" name="preview_image" data-type="enum" content={pageData.previewImage && pageData.previewImage.file.url} />
							{pageData.filterEntity &&
							pageData.filterEntity.map((entity, index) => <meta key={index} className="swiftype" name="filter_entity" data-type="enum" content={entity.contentful_id} />)}
							{pageData.filterSubjects &&
							pageData.filterSubjects.map((entity, index) => <meta key={index} className="swiftype" name="filter_expert_subjects" data-type="enum" content={entity.contentful_id} />)}
                            {pageData.filterExpertise &&
							pageData.filterExpertise.map((entity, index) => <meta key={index} className="swiftype" name="filter_expert_expertise" data-type="enum" content={entity.contentful_id} />)}
						</Helmet>
					}
					<div className={stylesPage.wrapper}>
						<div className={stylesPage.topWrapper}>
							<div className={stylesPage.topSection}>
								<div className={`${stylesPage.topSectionText}`}>
									<div className={stylesPage.imageWrapper}>
                                        {
                                        // @ts-ignore
										<GatsbyImageWrapper alt={pageData.previewImage?.title} image={pageData.previewImage} />
                                        }
									</div>
									<div className={stylesPage.introTextWrapper}>
										<div className={stylesPage.introInfo}>
											<h1 className={stylesPage.name}>{
                                                // @ts-ignore
                                                (pageData.titlePrefix ? pageData.titlePrefix + ' ' : '') + pageData.name + ' ' + pageData.lastName
                                                }
                                            </h1>
											<h3 className={stylesPage.title}>{pageData.title.title}</h3>
											<div className={stylesPage.itemInfo}>
												{subjectsString}
											</div>
										</div>
										{
                                            // @ts-ignore
											(pageData.ecssSpeaker || pageData.ecssModerator) && (
												<div className={`extra-margin-small ${stylesPage.bioTextWrapper}`} dangerouslySetInnerHTML={{ __html: pageData.description.childMarkdownRemark.html }} />
											)
										}
									</div>
								</div>
								{
                                    // @ts-ignore
									(!pageData.ecssSpeaker && !pageData.ecssModerator) && (
										<div className={stylesPage.bioWrapper}>
											<div className={stylesPage.infoWrapper}>
												{pageData.phoneNumberOptional &&
												<div><span className={stylesPage.label}><FormattedMessage id={'Phone'} /></span><span>{pageData.phoneNumberOptional}</span></div>}
												{pageData.emailOptional &&
												<div><span className={stylesPage.label}><FormattedMessage id={'E-mail'} /></span><span><a href={`mailto:${pageData.emailOptional}`}>{pageData.emailOptional}</a></span>
												</div>}
												{
													pageData.affiliation && (
														<div><span className={stylesPage.label}><FormattedMessage id={'affiliation'} /></span><span>{pageData.affiliation.affiliation}</span></div>
													)
												}
												{
													pageData.languages && (
														<div><span className={stylesPage.label}><FormattedMessage id={'languages'} /></span><span>{pageData.languages.languages}</span></div>
													)
												}
											</div>
											<div className={stylesPage.bioTextWrapper}>
												{
													pageData.introductionText && (
														<h3 dangerouslySetInnerHTML={{ __html: pageData.introductionText.childMarkdownRemark.html }} />
													)
												}
												{
													<div dangerouslySetInnerHTML={{ __html: pageData.description.childMarkdownRemark.html }} />
												}
												<ModuleCtaLink inline={true} data={{
													id: 'book-interview',
													linkText: this.props.intl.formatMessage({ id: 'book_interview' }),
													url: this.props.intl.formatMessage({ id: 'book_interview_link' }) + pageData.name,
													// @ts-ignore
													highlighted: true,
                                                    compact: false
												}} />
											</div>
										</div>
									)
								}
							</div>
						</div>
					</div>
					<ModulesWrapper languageCode={this.props.pageContext.languageCode} upcomingEventsData={null} data={pageData.modulesWrapper}>
					</ModulesWrapper>
					{
						pageData.publications && pageData.projects && (
							// @ts-ignore
							<ModuleSectionIntroduction data={{ id: 'eafoae3', introductionText: undefined, title: this.props.intl.formatMessage({ id: 'publications_projects' }) }} sectionNumber={1} offsetForHeroImage={false} />
						)
					}
					<div className={`${stylesPage.projectsContainer}`}>
						<ViewableMonitor>
							<div>
								{
									pageData.publications && (
										<h2 className={stylesPage.projectsTitle}><FormattedMessage id={'publications'} /></h2>
									)
								}
								{pageData.publications?.map((project, index) => {
									if (project.link) {
										return <GatsbyLinkExternalSupport className={stylesPage.project} key={project.id + index} to={project.link.link}>
											<div>
												<h5>{project.title.title}</h5>
												<div dangerouslySetInnerHTML={{ __html: project.subtitle.childMarkdownRemark.html }} />
												<span><span className={stylesPage.year}>{project.year}</span> | {project.attribution.attribution}</span>
											</div>
										</GatsbyLinkExternalSupport>;
									} else {
										return <div className={stylesPage.project} key={project.id + index}>
											<div>
												<h5>{project.title.title}</h5>
												<div dangerouslySetInnerHTML={{ __html: project.subtitle.childMarkdownRemark.html }} />
												<span><span className={stylesPage.year}>{project.year}</span> | {project.attribution.attribution}</span>
											</div>
										</div>;
									}
								})}
							</div>
						</ViewableMonitor>
						<ViewableMonitor>
							<div>
								{pageData.projects && (
									<h2 className={stylesPage.projectsTitle}><FormattedMessage id={'projects'} /></h2>
								)}
								{pageData.projects?.map((project, index) => {
									if (project.link) {
										return <GatsbyLinkExternalSupport className={stylesPage.project} key={project.id + index} to={project.link.link}>
											<div>
												<h5>{project.title.title}</h5>
												<div dangerouslySetInnerHTML={{ __html: project.subtitle.childMarkdownRemark.html }} />
												<span><span className={stylesPage.year}>{project.year}</span> | {project.attribution.attribution}</span>
											</div>
										</GatsbyLinkExternalSupport>;
									} else {
										return <div className={stylesPage.project} key={project.id + index}>
											<div>
												<h5>{project.title.title}</h5>
												<div dangerouslySetInnerHTML={{ __html: project.subtitle.childMarkdownRemark.html }} />
												<span><span className={stylesPage.year}>{project.year}</span> | {project.attribution.attribution}</span>
											</div>
										</div>;
									}
								})}
							</div>
						</ViewableMonitor>
					</div>
					{
						pageData.relatedArticles && (
							// @ts-ignore
							<ModuleSectionIntroduction data={{ id: 'eafoae23', introductionText: undefined, title: this.props.intl.formatMessage({ id: 'Related Articles' }), hideSectionNumber: true }}
							offsetForHeroImage={false} />
						)
					}
					{
						// @ts-ignore
						<ModuleHighlightedItems useScrollList={true} data={{
							id: 'blalba',
							headline: { title: 'test' },
							highlightedItems: pageData.relatedArticles,
							useMasonryLayout: false,
							// @ts-ignore
							readMoreCta: null,
							showLatestFromCategory: null,
							highlightedBackground: false,
							sortByDate: true
						}} />

					}
				</div>
			</PageWrapper>
		);
	}

}

export default injectIntl(PageExpertProfile);


export const pageQuery = graphql`
	query PageExpertProfileQuery($id: String, $languageCode: String) {
		contentfulPageExpertProfile(contentful_id: { eq: $id }, node_locale: { eq: $languageCode }) {
			id
			slug
			titlePrefix
			name
            lastName
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
			introductionText {
				introductionText
				childMarkdownRemark {
					html
				}
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
            filterExpertise {
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
			publications {
				id
				title {
					title
				}
				subtitle {
					childMarkdownRemark {
						html
					}
				}
				year
				attribution {
					attribution
				}
				link {
					link
				}
			}
			projects {
				id
				title {
					title
				}
				subtitle {
					childMarkdownRemark {
						html
					}
				}
				year
				attribution {
					attribution
				}
				link {
					link
				}
			}
			relatedArticles {
				__typename
				...ContentfulPageArticlePreviewFragment
			}
			modulesWrapper {
				...ContentfulModuleWrapperFragment
			}
			ecssSpeaker
			ecssModerator
		}
	}
`;