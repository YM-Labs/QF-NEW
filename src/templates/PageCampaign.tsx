import * as React from 'react';
import * as styles from './PageShared.module.scss';
import { PageCampaignQuery } from '../gatsby-queries';
import PageWrapper, { IPageProps } from './PageWrapper';
import { ModuleSearchCategoriesList } from '../components/ModuleSearchCategoriesList';
import ModulesWrapper from '../components/ModulesWrapper';
import { Helmet } from 'react-helmet';
import { GatsbyImageWrapper } from '../components/ui/GatsbyImageWrapper';
import { graphql } from 'gatsby';

interface Props extends IPageProps {
	data: PageCampaignQuery;
}

class PageCampaign extends React.Component<Props> {
	componentDidMount() {
		{
			this.props.data.contentfulPageCampaign.slug == 'summer' &&
				document
					.querySelector('.ModuleSearchCategoriesList-module--titleWrapper--3LF57')
					.parentElement.parentNode.insertBefore(
						document.querySelector('.ModuleSearchCategoriesList-module--titleWrapper--3LF57').parentElement,
						document.querySelector('.ModuleCtaLink-module--ctaLink--1Dgh_').parentElement
					);


			this.props.data.contentfulPageCampaign.slug == 'nsd2020' &&
				document
					.querySelector('.ModuleSearchCategoriesList-module--titleWrapper--3LF57')
					.parentElement.parentNode.insertBefore(
						document.querySelector('.ModuleSearchCategoriesList-module--titleWrapper--3LF57').parentElement,
						document.querySelector('.ModuleHighlightedItems-module--style2--3IAF3').parentElement
					);
		}
	}
	render() {
		const pageData = this.props.data.contentfulPageCampaign;
		let searchCategoryListing = undefined;
		let searchPlaceListing = undefined;

		//@ts-ignore:
		const allCategories = this.props.data.allContentfulCategory;
		//@ts-ignore:
		const allPlaces = this.props.data.allContentfulPlace;

		if (this.props.data && this.props.data.contentfulPageCampaign.contentful_id !== '663g1snbsf83fDaKhhIQ8f') {
			searchCategoryListing = (
				<ModuleSearchCategoriesList data={allCategories} type={'event'} filterName={'filter_event_category'} campaign={'filter_campaign'} filter_campaign={'4liiuveKdiy0kwS06Eoewu'} />
			);
			searchPlaceListing = (
				<ModuleSearchCategoriesList showCount={true} data={allPlaces} type={'event'} filterName={'filter_place'} campaign={'filter_campaign'} filter_campaign={'663g1snbsf83fDaKhhIQ8f'} />
			);
		}
		return (
			<PageWrapper location={this.props.location} pageData={pageData} type={'campaign'} title={pageData.title} pageContext={this.props.pageContext}>
				<div className="container pagePaddingTop">
					{
						//@ts-ignore:
						<Helmet>
							<meta
								className="swiftype"
								name="tags_vertical"
								data-type="enum"
								content={this.props.data.verticalEnglish.filterVerticalCategory && this.props.data.verticalEnglish.filterVerticalCategory.title}
							/>
							<meta className="swiftype" name="preview_image" data-type="enum" content={pageData.heroImage && pageData.heroImage.file.url} />
							<meta className="swiftype" name="type" data-type="enum" content="campaign" />
						</Helmet>
					}
					<div className={styles.topSection}>
						<div className={`${styles.topSectionText}`}>
							<h1 className="text-style-h1-large">{pageData.title}</h1>
							{pageData.description && <div className={`text-style-body ${styles.subtitle}`} dangerouslySetInnerHTML={{ __html: pageData.description.childMarkdownRemark.html }} />}
						</div>
					</div>
					{pageData.heroImage && (
                        // @ts-ignore
						<GatsbyImageWrapper alt={this.props.title} outerWrapperClassName={`w-100 ${styles.heroImage}`} image={pageData.heroImage} />
					)}
					{pageData.modulesWrapper && (
						<ModulesWrapper
							languageCode={this.props.pageContext.languageCode}
							upcomingEventsData={this.props.pageContext.upcomingEvents}
							hasHeroImage={true}
							childrenLast={true}
							data={pageData.modulesWrapper}
						>
							{pageData.slug == 'summer' && searchCategoryListing}
							{
								// @ts-ignore
								pageData.contentful_id == '663g1snbsf83fDaKhhIQ8f' && searchPlaceListing
							}
						</ModulesWrapper>
					)}
				</div>
			</PageWrapper>
		);
	}
}

export default PageCampaign;

export const pageQuery = graphql`
	query PageCampaignQuery($id: String, $languageCode: String, $eventsPage: Boolean = true) {
		contentfulPageCampaign(contentful_id: { eq: $id }, node_locale: { eq: $languageCode }) {
			id
			contentful_id
			slug
			title
			filterVerticalCategory {
				title
			}
			description {
				childMarkdownRemark {
					html
				}
			}
			heroImage {
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
		}
		allContentfulCategory(filter: { node_locale: { eq: $languageCode } }) @include(if: $eventsPage) {
			edges {
				node {
					contentful_id
					title: categoryName
					items: event {
						id @skip(if: $eventsPage)
						campaign {
							contentful_id: contentful_id
						}
					}
				}
			}
		}
		allContentfulPlace(filter: { contentful_id: {in: [ "3i2HaatkSkqEAyg0wOuWcC", "2uVEkxtXcEam0i4GUSQCk6", "sF2f7phPHwM2WuKmO6yqy", "6N1axbAAiQoQkeQq42Ucay" ]}, node_locale: { eq: $languageCode } }) @include(if: $eventsPage) {
			edges {
				node {
					contentful_id
					title: placeName
					items: event {
						id @skip(if: $eventsPage)
						campaign {
							contentful_id: contentful_id
						}
					}
				}
			}
		}
		verticalEnglish: contentfulPageCampaign(contentful_id: { eq: $id }, node_locale: { eq: "en-US" }) {
			filterVerticalCategory {
				title
			}
		}
	}
`;
