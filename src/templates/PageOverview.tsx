import * as React from 'react';
import * as styles from './PageShared.module.scss';
import { PageOverviewQuery } from '../gatsby-queries';
import PageWrapper, { IPageProps } from './PageWrapper';
import ModulesWrapper from '../components/ModulesWrapper';
import { Helmet } from 'react-helmet';
import GatsbyLink from 'gatsby-link';
import { ModuleSearchCategoriesList } from '../components/ModuleSearchCategoriesList';
import { ModuleDynamicList } from '../components/ModuleDynamicList';
import { FormattedMessage } from 'react-intl';
import { UpcomingEventListItem } from '../components/ListItems/UpcomingEventListItem';
import { PressListItem } from '../components/ListItems/PressListItem';
import { getPagePath } from '../utils/URLHelper';
import Masonry from 'react-masonry-component';
import ViewableMonitor from '../components/ui/ViewableMonitor';
import { graphql } from 'gatsby';
import { ArticlePreview } from '../components/Previews/ArticlePreview';
import { MediaGalleryList } from '../components/MediaGalleryList';
import SearchExperts from '../components/Search/SearchExperts';

interface Props extends IPageProps {
	data: PageOverviewQuery;
}

class PageOverview extends React.Component<Props> {
	render() {
		const pageData = this.props.data.contentfulPageOverview;
		let searchCategoryListing = undefined;
		if (this.props.data.allContentfulCategory) {
			searchCategoryListing = <ModuleSearchCategoriesList data={this.props.data.allContentfulCategory} type={'event'} filterName={'filter_event_category'} />;
		}/* else if (this.props.data.allContentfulFilterArticleTag) {
			searchCategoryListing = <ModuleSearchCategoriesList data={this.props.data.allContentfulFilterArticleTag} type={'article'} filterName={'filter_article_tags'} />;
		}*/
		const upcomingEvents = (this.props.pageContext as any).upcomingEvents as any[];
		// @ts-ignore
		const allItems = [...new Map(this.props.data.allContentfulPressMediaMention.edges.map(item => [item.node.contentful_id, item])).values()];
		const masonryOptions = {
			transitionDuration: 0,
			resize: true,
			horizontalOrder: true,
			percentPosition: true,
			gutter: 50,
			columnWidth: '.module-margin-small:nth-child(2)'
		};
		const storiesPage = this.props.pageContext.newsPage;
		const expertsPage = this.props.pageContext.expertsPage;
		return (
			<PageWrapper location={this.props.location} pageData={pageData} type={'overview'} title={pageData.title} pageContext={this.props.pageContext}>
				<div className={`container ${storiesPage ? 'storiesPage' : ''} ${expertsPage ? 'expertsPage' : ''} ${storiesPage || expertsPage ? 'pagePaddingTopSearch' : 'pagePaddingTop'}`}>
					{
						//@ts-ignore:
						<Helmet htmlAttributes={(storiesPage || expertsPage) ? {class: 'noOverflowHidden'} : {}}>
							{this.props.data.allContentfulPagePressRelease && <html className={`page-media-center`} />}
							<meta className="swiftype" name="type" data-type="enum" content="page" />
						</Helmet>
					}
					<div className={styles.topSection}>
						<div className={`col-md-6 col-xl-4 ${styles.topSectionText} ${expertsPage ? styles.expertsPageTopSection : ''}`}>
							<h1 className="text-style-h1">{pageData.headline.headline}</h1>
							{pageData.subtitle && <div className={`text-style-body ${styles.subtitle}`} dangerouslySetInnerHTML={{ __html: pageData.subtitle.childMarkdownRemark.html }} />}
							{pageData.searchLink && pageData.searchLink.searchLink && (
								<GatsbyLink data-swiftype-index="false" className={`text-style-body ${styles.ctaLink}`} to={pageData.searchLink.searchLink}>
									<span>{pageData.searchLinkText}</span>
								</GatsbyLink>
							)}
						</div>
					</div>
					{this.props.data.allContentfulLogo && <MediaGalleryList data={this.props.data} logoMode={true} />}
					{this.props.data.allContentfulMediaGallery && <MediaGalleryList data={this.props.data} logoMode={false} />}
					{expertsPage && <SearchExperts filterData={this.props.data} currLanguage={this.props.pageContext.languageCode} />}
					{pageData.modulesWrapper && (
						<ModulesWrapper
							languageCode={this.props.pageContext.languageCode}
							upcomingEventsData={this.props.pageContext.upcomingEvents}
							hasHeroImage={true}
							childrenLast={storiesPage ? false : true}
							data={pageData.modulesWrapper}
						>
							{(storiesPage && this.props.data.allContentfulPageArticle) && (
								<div className={styles.featuredStoriesWrapper}>
									<div className={`${styles.wrapper} ${styles.featuredStories}`}>
										<Masonry
											className={styles.itemsWrapper + ' ' + styles.masonryLayout+ ' ' + styles.featuredStoriesMasonry} // default ''
											disableImagesLoaded={true} // default false
											options={masonryOptions}
											updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
										>
											{
												// @ts-ignore
												this.props.data.allContentfulPageArticle.edges.map((item, index) => {
													const id = module.id + index;
													return (
														<ViewableMonitor delay={index + 1} key={id}>
															{
																// @ts-ignore
																<ArticlePreview className={this.props.data.allContentfulPageArticle.edges.length > 4 && index > 1 ? 'small' : ''} data={item.node} />
															}
														</ViewableMonitor>
													);
												})}
										</Masonry>
									</div>
								</div>
							)}
							{searchCategoryListing}
							{upcomingEvents && (
								<ModuleDynamicList count={upcomingEvents.length} title={<FormattedMessage id="Upcoming Events" />}>
									<ul>
										{upcomingEvents.map((event, index) => {
											return <UpcomingEventListItem data={event} key={index} />;
										})}
									</ul>
									<GatsbyLink data-swiftype-index="false" className={`text-style-body ${styles.ctaLink} module-margin-small`}
												to={pageData.searchLink && pageData.searchLink.searchLink}>
										<FormattedMessage id="Browse all Events" />
									</GatsbyLink>
								</ModuleDynamicList>
							)}
							{this.props.data.allContentfulPagePressRelease && (
								<ModuleDynamicList count={this.props.data.allContentfulPagePressRelease.edges.length} title={<FormattedMessage id="Press Releases" />}>
									<ul>
										{this.props.data.allContentfulPagePressRelease.edges.map((edge, index) => {
											return <PressListItem title={edge.node.title} date={edge.node.date} url={getPagePath(edge.node.slug, 'press')} key={index} />;
										})}
									</ul>
								</ModuleDynamicList>
							)}
						</ModulesWrapper>
					)}
				</div>
			</PageWrapper>
		);
	}
}

export default PageOverview;

export const pageQuery = graphql`
	query PageOverviewQuery($id: String, $languageCode: String, $expertsPage:Boolean = false, $logosPage:Boolean = false, $eventsPage: Boolean = false, $newsPage: Boolean = false, $pressPage: Boolean = false, $mediaGalleriesPage:Boolean = false) {
		allContentfulEntities(filter: { title: { nin: ["WORKAROUND. DO NOT DELETE.", "Recreational Facilities"] }, node_locale: { eq: $languageCode } }) @include(if: $expertsPage) {
			edges {
				node {
					title
					contentful_id
				}
			}
		}
		allContentfulFilterExpertProfileSubject(filter: { node_locale: { eq: $languageCode } }) @include(if: $expertsPage) {
			edges {
				node {
					title
					contentful_id
				}
			}
		}
        allContentfulFilterExpertProfileExpertise(filter: { node_locale: { eq: $languageCode } }) @include(if: $expertsPage) {
			edges {
				node {
					title
					contentful_id
				}
			}
		}
		contentfulPageOverview(contentful_id: { eq: $id }, node_locale: { eq: $languageCode }) {
			id
			title
			headline {
				headline
			}
			searchLinkText
			searchLink {
				searchLink
			}
			subtitle {
				subtitle
				childMarkdownRemark {
					html
				}
			}
			modulesWrapper {
				...ContentfulModuleWrapperFragment
			}
		}
		allContentfulCategory(filter: { node_locale: { eq: $languageCode } }) @include(if: $eventsPage) {
			edges {
				node {
					contentful_id
					title: categoryName
					items: event {
						id @skip(if: $eventsPage)
					}
				}
			}
		}
		allContentfulMediaGallery(filter: { slug: { ne: "workaround-do-not-delete" }, mediaCenter: { eq: true }, node_locale: { eq: $languageCode }}, sort: { order: DESC, fields: [date] }) @include(if: $mediaGalleriesPage) {
			edges {
				node {
					id
					contentful_id
					mediaGalleryTitle {
						mediaGalleryTitle
					}
					filterTags {
						title
						id
					}
					medias {
						file {
							details {
								size
								image {
									width
									height
								}
							}
							url
						}
						thumb: gatsbyImageData(
                            placeholder: NONE
                            width: 400
                            height: 300
                            quality: 85
                          )
					}
					date
					slug
				}
			}
		}
		allContentfulLogo(filter: { node_locale: { eq: $languageCode }}) @include(if: $logosPage) {
			edges {
				node {
					id
					contentful_id
					title
					tags {
						title
						id
					}
					file {
						file {
							details {
								size
							}
							url
						}
					}
					preview {
						thumb: gatsbyImageData(
                            placeholder: NONE
                            width: 400
                            height: 240
                            quality: 85
                          )
					}
				}
			}
		}
		allContentfulFilterArticleTag(filter: { node_locale: { eq: $languageCode } }) @include(if: $newsPage) {
			edges {
				node {
					contentful_id
					title
					items: page__article {
						id @skip(if: $newsPage)
					}
				}
			}
		}
		allContentfulPressMediaMention(filter: { title: { title: { ne: "WORKAROUND. DO NOT DELETE." } } }, limit: 20, sort: { order: DESC, fields: [date] }) {
			edges {
				node {
					id
					node_locale
					mediaOrganisation
					title {
						title
					}
					contentful_id
					date
					link
				}
			}
		}
		allContentfulPagePressRelease(filter: { node_locale: { eq: $languageCode }, title: { ne: "WORKAROUND. DO NOT DELETE." } }, limit: 10, sort: { order: DESC, fields: [date] })
		@include(if: $pressPage) {
			edges {
				node {
					title
					slug
					date
				}
			}
		}
		allContentfulPageArticle(filter: { node_locale: { eq: $languageCode }}, limit: 8) @include(if: $newsPage) {
			edges {
				node {
					contentful_id
					title
					date
					slug
					filterVerticalCategory {
						title
						slug
					}
					opEdCreditOptional {
						name {
							name
						}
						title {
							title
						}
						profilePhoto {
							title
							thumb: gatsbyImageData(
                                placeholder: NONE
                                width: 100
                                height: 100
                                quality: 85
                              )
						}
					}
					contentTypePreviewInfo
					contentType {
						title
						slug
					}
					filterArticleTags {
						title
						slug
					}
					heroImage {
						gatsbyImageData(placeholder: NONE, width: 960, quality: 85)
					}
					teaserImage {
						gatsbyImageData(placeholder: NONE, width: 320, quality: 85)
					}
				}
			}
		}
	}
`;
