import * as React from 'react';
import * as styles from './PageShared.module.scss';
import { PageArticleQuery } from '../gatsby-queries';
import PageWrapper, { IPageProps } from './PageWrapper';
import ModuleVideoYouTube from '../components/ContentfulModules/ModuleVideoYouTube';
import ModulesWrapper from '../components/ModulesWrapper';
import { Helmet } from 'react-helmet';
import { UIEventCategoryListing } from '../ui/UIEventCategoryListing';
import { FormattedDate, injectIntl, WrappedComponentProps } from 'react-intl';
import ModuleSectionTitleDivider from '../components/ContentfulModules/ModuleSectionTitleDivider';
import { ArticlePreview } from '../components/Previews/ArticlePreview';
import UIShareButtons from '../ui/UIShareButtons';
import ViewableMonitor from '../components/ui/ViewableMonitor';
import { GatsbyImageWrapper } from '../components/ui/GatsbyImageWrapper';
import Sharect from '../lib/sharect';
import { graphql } from 'gatsby';

interface Props extends IPageProps {
	data: PageArticleQuery;
	bilingual?: boolean;
}

class PageArticle extends React.Component<Props & WrappedComponentProps> {
    componentDidMount(): void {
        Sharect.config({
            facebook: false,
            twitter: true,
            twitterUsername: 'QF',
            backgroundColor: '#1DA1F2',
            iconColor: '#FFF',
            selectableElements: ['.page-article .text-style-body-module,.page-article .text-style-quote,.page-article .text-style-introduction'],
            tweetText: this.props.intl.formatMessage({ id: 'tweet' })
        }).init()
    }
	render() {
		const pageData = this.props.data.contentfulPageArticle;
		const previewImage = pageData.teaserImage ? pageData.teaserImage : pageData.heroImage;
		let darkMode = typeof document !== 'undefined' && document.body.classList.contains('dark-mode');

		return (
			//@ts-ignore:
			<PageWrapper
				location={this.props.location}
				pageData={pageData}
				type={'article'}
				title={pageData.title}
				metaTitle={pageData.metaTitle}
				bilingual={this.props.data.contentfulPageArticle.title === this.props.data.alternateTitle.title || this.props.data.alternateTitle.title === ' ' ? false : true}
				pageContext={this.props.pageContext}
			>
				{
					// @ts-ignore
					<div className={`container ${!pageData.heroVideoOptional ? 'pagePaddingTop' : 'pagePaddingTopCompact' } page-article`}>
					{
						//@ts-ignore:
						<Helmet>
							<meta
								className="swiftype"
								name="tags_vertical"
								data-type="enum"
								content={this.props.data.verticalEnglish.filterVerticalCategory && this.props.data.verticalEnglish.filterVerticalCategory.title}
							/>
							<meta
								className="swiftype"
								name="preview_image_aspect_ratio"
								data-type="enum"
								content={previewImage && previewImage.file && previewImage.file.details.image.width / previewImage.file.details.image.height + ''}
							/>
							<meta className="swiftype" name="preview_image" data-type="enum" content={previewImage && previewImage.file && previewImage.file.url} />
							{pageData.filterEntity &&
							pageData.filterEntity.map((entity, index) => <meta key={index} className="swiftype" name="filter_entity" data-type="enum" content={entity.contentful_id} />)}
							{pageData.filterPrograms &&
							pageData.filterPrograms.map((entity, index) => <meta key={index} className="swiftype" name="filter_program" data-type="enum" content={entity.contentful_id} />)}
							{pageData.filterArticleTags &&
							pageData.filterArticleTags.map((entity, index) => <meta key={index} className="swiftype" name="filter_article_tags" data-type="enum" content={entity.contentful_id} />)}
							<meta className="swiftype" name="filter_date" data-type="date" content={pageData.date && pageData.date} />
							<meta className="swiftype" name="type" data-type="enum" content="article" />
							{darkMode === true ? (
									<meta name="twitter:widgets:theme" content="dark" />
								) :
								<meta name="twitter:widgets:theme" content="light" />
							}
						</Helmet>
					}
					{
						// @ts-ignore
						!pageData.heroVideoOptional && (
							<div className={styles.topSectionLeadIn}>
								<UIEventCategoryListing type={'Article'} filterVerticalCategory={pageData.filterVerticalCategory} />
								<span>
									<FormattedDate value={new Date(pageData.date)} day="numeric" /> <FormattedDate value={new Date(pageData.date)} month="long" year="numeric" />
								</span>
							</div>
						)
					}
					<div className={styles.topSection}>
						<div className={`${styles.topSectionText} ${styles.topSectionTextFullWidth}`}>
							<h1 className="text-style-h1-large">{pageData.title}</h1>
							{pageData.opEdCreditOptional && pageData.introductionText && (
								<div className={`text-style-introduction-op-ed text-style-markdown`} dangerouslySetInnerHTML={{ __html: pageData.introductionText.childMarkdownRemark.html }} />
								)}
							<div className={styles.creditsShareWrapper + ' module-margin-small'}>
								{pageData.opEdCreditOptional && <div className={styles.creditsProfile + ' module-margin-small'}>
									{
                                        // @ts-ignore
                                        pageData.opEdCreditOptional.profilePhoto && <GatsbyImageWrapper alt={pageData.opEdCreditOptional.profilePhoto.title} outerWrapperClassName={styles.creditImage} image={pageData.opEdCreditOptional.profilePhoto.thumb} />}
									<div className={styles.creditAttributes}>
										<span className={styles.creditsName}>{pageData.opEdCreditOptional.name.name}</span>
										<span className={styles.creditsTitle}>{pageData.opEdCreditOptional.title.title}</span>
									</div>
								</div>}
								<UIShareButtons url={this.props.pageContext.currSlug} title={pageData.title} />
							</div>
						</div>
					</div>
					{
						// @ts-ignore
						pageData.heroImage && !pageData.heroVideoOptional && (
                            // @ts-ignore
							<GatsbyImageWrapper loading='eager' alt={pageData.title} outerWrapperClassName={`w-100 ${styles.heroImage}`} image={pageData.heroImage} />
						)
					}
					{
						// @ts-ignore
						pageData.heroVideoOptional && (
							<div className={styles.videoWrapper}>
								{
									// @ts-ignore
									pageData.heroVideoOptional && <ModuleVideoYouTube data={pageData.heroVideoOptional} />
								}
							</div>
						)
					}
					{
						// @ts-ignore
						(pageData.heroCaption || pageData.heroCopyrightText) && (
								<div className={'hero_caption'}>
									<p>
										{
											// @ts-ignore
											pageData.heroCaption && pageData.heroCaption}
									</p>
									<span>
									{
										// @ts-ignore
										pageData.heroCopyrightText && pageData.heroCopyrightText}
								</span>
								</div>
					)}
					{pageData.introductionText && !pageData.opEdCreditOptional && (
							<div className={`text-style-introduction text-style-markdown module-margin`} dangerouslySetInnerHTML={{ __html: pageData.introductionText.childMarkdownRemark.html }} />
					)}
					{pageData.modulesWrapper && (
						<ModulesWrapper
							languageCode={this.props.pageContext.languageCode}
							upcomingEventsData={this.props.pageContext.upcomingEvents}
							childrenLast={true}
							hasHeroImage={true}
							data={pageData.modulesWrapper}
						>
							<ViewableMonitor>
								<ModuleSectionTitleDivider
									data={{
										id: 'related_articles',
										sectionDividerTitle: { sectionDividerTitle: this.props.pageContext.languageCode === 'ar-QA' ? 'قصص ذات صلة' : 'Related Stories' }
									}}
								/>
							</ViewableMonitor>
							{this.props.data.relatedArticles && (
								<div className={styles.relatedArticlesWrapper}>
									{this.props.data.relatedArticles.edges.map((edge, index) => {
										return (
											<ViewableMonitor delay={index + 1} key={edge.node.contentful_id}>
												<ArticlePreview className={'relatedMode'} data={edge.node} />
											</ViewableMonitor>
										);
									})}
								</div>
							)}
						</ModulesWrapper>
					)}
				</div>
				}
			</PageWrapper>
		);
	}
}

export default injectIntl(PageArticle);

export const pageQuery = graphql`
	query PageArticleQuery($id: String, $languageCode: String, $vertical: String) {
		contentfulPageArticle(contentful_id: { eq: $id }, node_locale: { eq: $languageCode }) {
			id
			slug
			title
			introductionText {
				introductionText
				childMarkdownRemark {
					html
				}
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
			filterVerticalCategory {
				title
			}
			filterPrograms {
				contentful_id
			}
			date
			filterArticleTags {
				contentful_id
			}
			filterEntity {
				contentful_id
			}
			heroImage {
				title
				file {
					url
					details {
						image {
							width
							height
						}
					}
				}
				gatsbyImageData(
                    placeholder: NONE
                    width: 1680
                    height: 700
                    quality: 85
                    layout: FULL_WIDTH
                  )
			}
			heroVideoOptional {
				...ContentfulModuleVideoYouTubeFragment
			}
			heroCaption
			heroCopyrightText
			teaserImage {
				file {
					url
					details {
						image {
							width
							height
						}
					}
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
		alternateTitle: contentfulPageArticle(contentful_id: { eq: $id }, node_locale: { ne: $languageCode }) {
			title
		}
		verticalEnglish: contentfulPageArticle(contentful_id: { eq: $id }, node_locale: { eq: "en-US" }) {
			filterVerticalCategory {
				title
			}
		}
		relatedArticles: allContentfulPageArticle(
			limit: 2
			filter: { contentful_id: { nin: [$id, "5x2v9l1588imcQHfqPZfqe"] }, filterArticleTags: {elemMatch: {slug: {ne: "goals"}}}, node_locale: { eq: $languageCode }, filterVerticalCategory: { slug: { eq: $vertical } } }
			sort: { order: DESC, fields: [date] }
		) {
			edges {
				node {
					...ContentfulPageArticlePreviewFragment
				}
			}
		}
	}
`;
