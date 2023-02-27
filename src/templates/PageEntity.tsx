import * as React from 'react';
import * as styles from './PageShared.module.scss';
import { PageEntityQuery } from '../gatsby-queries';
import PageWrapper, { IPageProps } from './PageWrapper';

import ModulesWrapper from '../components/ModulesWrapper';
import { TopSectionListInfo, TopSectionListItem } from '../ui/TopSectionListInfo';
import { Helmet } from 'react-helmet';
import EventsList from '../components/EventsList';
import { FormattedMessage } from 'react-intl';
import { GatsbyImageWrapper } from '../components/ui/GatsbyImageWrapper';
import { graphql } from 'gatsby';

interface Props extends IPageProps {
	data: PageEntityQuery;
}

class PageEntity extends React.Component<Props> {
	render() {
		const animationDirection = this.props.pageContext.languageCode === 'ar-QA' ? -1 : 1;
		//@ts-ignore:
		const pageData = this.props.data.contentfulEntities;
		const pageType = pageData.type ? pageData.type[0] : 'entity';
		return (
			<PageWrapper location={this.props.location} pageData={pageData} type={'entity'} title={pageData.title} pageContext={this.props.pageContext}>
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
							<meta className="swiftype" name="tags_category" data-type="enum" content="entity" />
							<meta className="swiftype" name="preview_image" data-type="enum" content={pageData.heroImage && pageData.heroImage.file.url} />
							<meta className="swiftype" name="type" data-type="enum" content={pageType} />
							{pageData.type &&
								pageType === 'school' &&
								pageData.schoolTypes &&
								pageData.schoolTypes.map((entity, index) => <meta key={index} className="swiftype" name="filter_school_types" data-type="enum" content={entity.contentful_id} />)}
							<meta className="swiftype" name="filter_is_qf" data-type="enum" content={pageData.isPartOfQatarFoundation + ''} />
						</Helmet>
					}
					<div className={styles.topSection}>
						<div className={`col-md-6 col-xl-4 ${styles.topSectionText}`}>
							<h1 className="text-style-h1">{pageData.title}</h1>
							<p className={`text-style-body ${styles.subtitle}`}>{pageData.entityDescription.entityDescription}</p>
							{pageData.entityUrl && (
								<a data-swiftype-index="false" className={`text-style-body ${styles.ctaLink}`} href={pageData.entityUrl}>
									<FormattedMessage id={'Go to website'} />
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
						<>
							{
							// @ts-ignore
							<GatsbyImageWrapper alt={pageData.heroImage.title} outerWrapperClassName={`w-100 ${styles.heroImage}`} image={pageData.heroImage} />
							}
						</>
					)}
					<ModulesWrapper
						languageCode={this.props.pageContext.languageCode}
						programsListData={this.props.data.allContentfulPageProgram}
						upcomingEventsData={this.props.pageContext.upcomingEvents}
						childrenLast={true}
						hasHeroImage={true}
						data={pageData.modulesWrapper}
					>
						{this.props.pageContext.upcomingPageEvents && (
							<EventsList
								animationDirection={animationDirection}
								events={this.props.pageContext.upcomingPageEvents}
								title={this.props.pageContext.languageCode === 'ar-QA' ? 'فعاليات ذات صلة' : 'Related Events'}
							/>
						)}
					</ModulesWrapper>
				</div>
			</PageWrapper>
		);
	}
}

export default PageEntity;

export const pageQuery = graphql`
	query PageEntityQuery($id: String, $languageCode: String) {
		contentfulEntities(contentful_id: { eq: $id }, node_locale: { eq: $languageCode }) {
			contentful_id
			slug
			title
			type
			schoolTypes {
				contentful_id
			}
			entityDescription {
				entityDescription
			}
			phone
			fax
			email
			openingHours {
				openingHours
			}
			entityUrl
			filterVerticalCategory {
				title
			}
			location {
				contentful_id
				placeName
				placeAddress
			}
			isPartOfQatarFoundation
			heroImage {
				title
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
            entityLogo {
                file {
                    url
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
		verticalEnglish: contentfulEntities(contentful_id: { eq: $id }, node_locale: { eq: "en-US" }) {
			filterVerticalCategory {
				title
			}
		}
		allContentfulPageProgram(
			filter: { node_locale: { eq: $languageCode }, filterEntity: { contentful_id: { eq: $id } }, title: { ne: "WORKAROUND. DO NOT DELETE." } }
			sort: { order: ASC, fields: [title] }
		) {
			edges {
				node {
					slug
					title
					filterEntity {
						title
						contentful_id
					}
					filterProgramType {
						title
						contentful_id
					}
				}
			}
		}
	}
`;
