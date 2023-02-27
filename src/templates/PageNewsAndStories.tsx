import * as React from 'react';
import * as styles from './PageShared.module.scss';
import { PageNewsAndStoriesQuery } from '../gatsby-queries';
import PageWrapper, { IPageProps } from './PageWrapper';
import ModulesWrapper from '../components/ModulesWrapper';
import { Helmet } from 'react-helmet';
import Masonry from 'react-masonry-component';
import ViewableMonitor from '../components/ui/ViewableMonitor';
import { graphql } from 'gatsby';
import { ArticlePreview } from '../components/Previews/ArticlePreview';
import { FormattedMessage } from 'react-intl';
import { getPagePath } from '../utils/URLHelper';

interface Props extends IPageProps {
	data: PageNewsAndStoriesQuery;
}

class PageNewsAndStories extends React.Component<Props> {
	render() {
		const masonryOptions = {
			transitionDuration: 0,
			resize: true,
			horizontalOrder: true,
			percentPosition: true,
			gutter: 50,
			columnWidth: '.module-margin-small:nth-child(2)'
		};
		const pageData = this.props.data.contentfulPageNewsAndStories;
		const pageArticles = [];
		pageArticles.push(pageData.firstHighlightedStory);
		this.props.data.allContentfulPageArticle.edges.forEach((node) => {
			if (node.node.contentful_id !== pageData.firstHighlightedStory.contentful_id && node.node.filterArticleTags?.filter(e => e.slug === 'goals').length === 0) {
				pageArticles.length < 9 && pageArticles.push(node.node);
			}
		});
		const editorsPicks = <div className={styles.editorsPick}>
			<h3><FormattedMessage id={'editors_picks'} /></h3>
			<ol>
				{pageData.highlightedStoriesBox.map((node, index) => {
					return <li key={node.contentful_id + index}><a href={getPagePath(node.slug, 'article')}><span>0{index + 1}</span><span>{node.title}</span><span>{(node.contentType ? node.contentType.title : <FormattedMessage id={'Article'} />)}</span></a></li>
				})}
			</ol>
		</div>;
		return (
			<PageWrapper location={this.props.location} pageData={pageData} type={'overview'} title={pageData.title} pageContext={this.props.pageContext}>
				<div className={`container storiesPage pagePaddingTopSearch`}>
					{
						//@ts-ignore:
						<Helmet htmlAttributes={{class: 'noOverflowHidden'}}>
							<meta className="swiftype" name="type" data-type="enum" content="page" />
						</Helmet>
					}
					<div className={styles.topSection}>
						<div className={`col-md-6 col-xl-4 ${styles.topSectionText}`}>
							<h1 className="text-style-h1">{pageData.headline.headline}</h1>
						</div>
					</div>
					{pageData.modulesWrapper && (
						<ModulesWrapper
							languageCode={this.props.pageContext.languageCode}
							upcomingEventsData={this.props.pageContext.upcomingEvents}
							hasHeroImage={true}
							childrenLast={false}
							data={pageData.modulesWrapper}
							className={styles.pageNewsAndStoriesModulesWrapper}
						>
							{pageArticles && (
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
												pageArticles.map((item, index) => {
													const id = module.id + index;
													if (index === 3) {
														return editorsPicks;
													}
													return (<ViewableMonitor delay={index + 1} key={id}>
															{
																// @ts-ignore
																<ArticlePreview className={pageArticles.length > 4 && index > 1 ? 'small' : ''} data={item} />
															}
														</ViewableMonitor>);
												})}
										</Masonry>
									</div>
									{editorsPicks}
								</div>
							)}
						</ModulesWrapper>
					)}
				</div>
			</PageWrapper>
		);
	}
}

export default PageNewsAndStories;

export const pageQuery = graphql`
	query PageNewsAndStoriesQuery($id: String, $languageCode: String) {
		contentfulPageNewsAndStories(contentful_id: { eq: $id }, node_locale: { eq: $languageCode }) {
			id
			title
			headline {
				headline
			}
			modulesWrapper {
				...ContentfulModuleWrapperFragment
			}
			highlightedStoriesBox {
				contentful_id
				title
				date
				slug
				contentType {
					title
					slug
				}
			}
			firstHighlightedStory {
				...ContentfulPageArticlePreviewFragment
			}
			metaTitle
			metaDescription {
				metaDescription
			}
		}
		allContentfulFilterArticleTag(filter: { node_locale: { eq: $languageCode } }) {
			edges {
				node {
					contentful_id
					title
					items: page__article {
						id @skip(if: true)
					}
				}
			}
		}
		allContentfulPageArticle(filter: { node_locale: { eq: $languageCode }}, limit: 8, sort: { order: DESC, fields: [date] }) {
			edges {
				node {
					...ContentfulPageArticlePreviewFragment
				}
			}
		}
	}
`;
