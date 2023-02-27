import * as React from 'react';
import * as styles from './PageShared.module.scss';
import { PagePlaceQuery } from '../gatsby-queries';
import PageWrapper, { IPageProps } from './PageWrapper';
import ModulesWrapper from '../components/ModulesWrapper';
import { TopSectionListInfo, TopSectionListItem } from '../ui/TopSectionListInfo';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { GatsbyImageWrapper } from '../components/ui/GatsbyImageWrapper';
import { graphql } from 'gatsby';

interface Props extends IPageProps {
	data: PagePlaceQuery;
}

class PagePlace extends React.Component<Props> {
	render() {
		const pageData = this.props.data.contentfulPagePlace;
		return (
			<PageWrapper location={this.props.location} pageData={pageData} type={'place'} title={pageData.title} pageContext={this.props.pageContext}>
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
							<meta className="swiftype" name="tags_category" data-type="enum" content="place" />
							<meta className="swiftype" name="filter_place_category" data-type="enum" content={pageData.filterPlaceCategory.contentful_id} />
							<meta className="swiftype" name="preview_image" data-type="enum" content={pageData.heroImage.file.url} />
							<meta className="swiftype" name="type" data-type="enum" content="place" />
							<meta className="swiftype" name="filter_is_qf" data-type="enum" content={pageData.isPartOfQatarFoundation + ''} />
						</Helmet>
					}
					<div className={styles.topSection}>
						<div className={`col-md-6 col-xl-4 ${styles.topSectionText}`}>
							<h1 className="text-style-h1">{pageData.headline.headline}</h1>
							<p className={`text-style-body ${styles.subtitle}`}>{pageData.subtitle.subtitle}</p>
							{pageData.websiteLink && (
								<a data-swiftype-index="false" className={`text-style-body ${styles.ctaLink}`} target="_blank" href={pageData.websiteLink.websiteLink}>
									<span>Go to website</span>
								</a>
							)}
						</div>
						<TopSectionListInfo>
							{pageData.phone && (
								<TopSectionListItem label={<FormattedMessage id={'Phone'} />} value={<a href={'tel:' + pageData.phone.replace(new RegExp(' ', 'g'), '')}>{pageData.phone}</a>} />
							)}
							{pageData.fax && (
								<TopSectionListItem label={<FormattedMessage id={'Fax'} />} value={<a href={'tel:' + pageData.fax.replace(new RegExp(' ', 'g'), '')}>{pageData.fax}</a>} />
							)}
							{pageData.email && <TopSectionListItem label={<FormattedMessage id={'E-mail'} />} value={<a href={'mailto:' + pageData.email}>{pageData.email}</a>} />}
							{pageData.location && (
								<TopSectionListItem
									label={<FormattedMessage id={'Address'} />}
									value={
										<span>
											{pageData.location.placeAddress}
											<br />
											<a href={`#map-${pageData.contentful_id}`}>
												<FormattedMessage id="See on map" />
											</a>
										</span>
									}
								/>
							)}
							{pageData.openingHours && <TopSectionListItem label={<FormattedMessage id={'opening_hours'} />} value={pageData.openingHours.openingHours} />}
						</TopSectionListInfo>
					</div>
					{pageData.heroImage && (
                        // @ts-ignore
						<GatsbyImageWrapper alt={this.props.title} outerWrapperClassName={`w-100 ${styles.heroImage}`} image={pageData.heroImage} />
					)}
					<ModulesWrapper
						languageCode={this.props.pageContext.languageCode}
						upcomingEventsData={this.props.pageContext.upcomingEvents}
						hasHeroImage={!!pageData.heroImage}
						data={pageData.modulesWrapper}
					/>
				</div>
			</PageWrapper>
		);
	}
}

export default PagePlace;

export const pageQuery = graphql`
	query PagePlaceQuery($id: String, $languageCode: String) {
		contentfulPagePlace(contentful_id: { eq: $id }, node_locale: { eq: $languageCode }) {
			contentful_id
			slug
			title
			headline {
				headline
			}
			subtitle {
				subtitle
			}
			location {
				contentful_id
				placeName
				placeAddress
			}
			phone
			fax
			email
			openingHours {
				openingHours
			}
			websiteLink {
				websiteLink
			}
			filterVerticalCategory {
				title
			}
			filterPlaceCategory {
				contentful_id
				title
			}
			isPartOfQatarFoundation
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
		verticalEnglish: contentfulPagePlace(contentful_id: { eq: $id }, node_locale: { eq: "en-US" }) {
			filterVerticalCategory {
				title
			}
		}
	}
`;
