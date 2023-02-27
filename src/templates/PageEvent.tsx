import * as React from 'react';
import * as styles from './PageShared.module.scss';
import { PageEventQuery } from '../gatsby-queries';
import PageWrapper, { IPageProps } from './PageWrapper';

import ModulesWrapper from '../components/ModulesWrapper';
import { TopSectionListInfo, TopSectionListItem } from '../ui/TopSectionListInfo';
import { Helmet } from 'react-helmet';
import { FormattedDate, FormattedMessage } from 'react-intl';
import GatsbyLink from 'gatsby-link';
import UIShareButtons from '../ui/UIShareButtons';
import EventsList from '../components/EventsList';
import { getPagePath } from '../utils/URLHelper';
import { isSameDate } from '../utils/DateHelpers';
import { GatsbyImageWrapper } from '../components/ui/GatsbyImageWrapper';
import { graphql } from 'gatsby';

interface Props extends IPageProps {
	data: PageEventQuery;
}

const initialState = { monthWidth: 0 };
type State = any;

class PageEvent extends React.Component<Props, State> {
	readonly state: State = initialState;
	componentDidMount() {
		var offset = this.props.data.contentfulEvent && document.getElementById('d1').getBoundingClientRect().width;
		this.state.monthWidth = offset;
	}
	render() {
		const animationDirection = this.props.pageContext.languageCode === 'ar-QA' ? -1 : 1;
		const pageData = this.props.data.contentfulEvent;
		const multiDateEvent = !isSameDate(pageData.startDate, pageData.endDate);

		const listMonth = (
			<div className={styles.topSectionDates}>
				<span className={`${styles.dateWrapper} ${this.state.monthWidth > 65 && styles.extraPadding}`} id="d1">
					<span className={styles.year}>
						<span>{new Date(pageData.startDate).getFullYear()}</span>
					</span>
					<span className={styles.month}>
						<FormattedDate value={new Date(pageData.startDate)} month="long" />
					</span>
					<span className="text-style-detail-1">
						<span>{new Date(pageData.startDate).getDate()}</span>
						{multiDateEvent && '–'}
					</span>
				</span>
				{multiDateEvent && (
					<span className={styles.dateWrapper} id="d2">
						<span className={styles.year}>
							<span>{new Date(pageData.endDate).getFullYear()}</span>
						</span>
						<span className={styles.month}>
							<FormattedDate value={new Date(pageData.endDate)} month="long" />
						</span>
						<span className="text-style-detail-1">
							<span>{new Date(pageData.endDate).getDate()}</span>
						</span>
					</span>
				)}
			</div>
		);

        //@ts-ignore:
        const isWCEvent = pageData.campaign?.filter((o) => o.slug === 'world-cup').length;

		return (
			<PageWrapper location={this.props.location} pageData={pageData} type={'event'} title={pageData.title} pageContext={this.props.pageContext}>
				<div className="container pagePaddingTop">
					{
						//@ts-ignore:
						<Helmet>
							<meta className="swiftype" name="preview_image" data-type="enum" content={pageData.image && pageData.image.file.url} />
							<meta className="swiftype" name="type" data-type="enum" content="event" />
							<meta
								className="swiftype"
								name="tags_vertical"
								data-type="enum"
								content={this.props.data.verticalEnglish.filterVerticalCategory && this.props.data.verticalEnglish.filterVerticalCategory.title}
							/>
							<meta className="swiftype" name="filter_event_category" data-type="enum" content={pageData.eventCategory && pageData.eventCategory.contentful_id} />
							<meta className="swiftype" name="filter_event_type" data-type="enum" content={pageData.type && pageData.type.contentful_id} />
							{pageData.organiser &&
								pageData.organiser.map((entity, index) => <meta key={index} className="swiftype" name="filter_organiser" data-type="enum" content={entity.contentful_id} />)}
							{pageData.eventTags &&
								pageData.eventTags.map((entity, index) => <meta key={index} className="swiftype" name="filter_event_tags" data-type="enum" content={entity.contentful_id} />)}
							{pageData.campaign &&
								pageData.campaign.map((entity, index) => <meta key={index} className="swiftype" name="filter_campaign" data-type="enum" content={entity.contentful_id} />)}
							<meta className="swiftype" name="filter_place" data-type="enum" content={pageData.place && pageData.place.contentful_id} />
							<meta className="swiftype" name="filter_start_date" data-type="date" content={pageData.startDate && pageData.startDate} />
							<meta className="swiftype" name="filter_end_date" data-type="date" content={pageData.endDate && pageData.endDate} />
						</Helmet>
					}
					<div className={styles.topSection}>
						<div className={`col-md-6 col-xl-4 ${styles.topSectionText}`}>
							<h1 className="text-style-h1">{pageData.title}</h1>
							{pageData.description && <span className={`text-style-body ${styles.subtitle}`} dangerouslySetInnerHTML={{ __html: pageData.description.childMarkdownRemark.html }} />}
							{pageData.registrationLink && (
								<a data-swiftype-index="false" className={`text-style-body ${styles.ctaLink}`} href={pageData.registrationLink}>
									<FormattedMessage id={'Click here to register'} />
								</a>
							)}
							{
							// @ts-ignore
							pageData.webinarLink && (
								// @ts-ignore
								<a data-swiftype-index="false" className={`text-style-body ${styles.ctaLink}`} href={pageData.webinarLink}>
									<FormattedMessage id={'Click here to join the seminar'} />
								</a>
							)}
							{
							// @ts-ignore
							pageData.registerThroughEcMobileApp && (
								// @ts-ignore
								<a data-swiftype-index="false" className={`text-style-body ${styles.ctaLink}`} href={pageData.registerThroughEcMobileApp}>
									<FormattedMessage id={'Register through EC app'} />
								</a>
							)}
							<UIShareButtons url={this.props.pageContext.currSlug} title={pageData.title} />
						</div>
						<TopSectionListInfo>
							<TopSectionListItem label={<FormattedMessage id="Date" />} value={listMonth} />
							{!pageData.allDay && (
								<TopSectionListItem
									label={<FormattedMessage id="Time" />}
									value={
										<span>
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
										</span>
									}
								/>
							)}
							{pageData.place && (
								<TopSectionListItem
									label={<FormattedMessage id="Where" />}
									value={
                                        <span>
											{
												// @ts-ignore
												pageData.placeDetail &&
												<>
													<span className={`TopSectionListInfo-module--value--TrUAX`}>
														{
															// @ts-ignore
															pageData.placeDetail
														}
													</span>
													<br />
												</>
											}
											<>
                                                <GatsbyLink to={`https://www.google.com/maps/place/${pageData.place.placeLocation.lat},${pageData.place.placeLocation.lon}`}>{pageData.place.placeAddress}</GatsbyLink>
											</>
										</span>
									}
								/>
							)}
							{(pageData.organiser || this.props.data.contentfulEvent.coOrganizer) && (
								<TopSectionListItem
									label={<FormattedMessage id="Organized by" />}
									//@ts-ignore:
									value={
										<span>
											{pageData.organiser && pageData.organiser.map((organiser, index) => {
												return (
													//@ts-ignore:
													organiser.filterVerticalCategory && organiser.isPartOfQatarFoundation ? (
														<>
															{index > 0 ? <br /> : ''}
															<GatsbyLink to={getPagePath(organiser.slug, 'entity', organiser.filterVerticalCategory?.slug)}>{organiser.title}</GatsbyLink>
														</>
													) : (
														<>
															{index > 0 ? <br /> : ''}
															<span className={`TopSectionListInfo-module--value--TrUAX`}>{organiser.title}</span>
														</>
													)
												);
											})}
											{
												// @ts-ignore
												this.props.data.contentfulEvent.coOrganizer &&
												<>
													{ pageData.organiser &&  <br /> }
													<span className={`TopSectionListInfo-module--value--TrUAX`}>
														{
															// @ts-ignore
															this.props.data.contentfulEvent.coOrganizer
														}
													</span>
												</>
											}
										</span>
									}
								/>
							)}
						</TopSectionListInfo>
					</div>
					{pageData.image && (
                        // @ts-ignore
						<GatsbyImageWrapper alt={this.props.title} outerWrapperClassName={`w-100 ${styles.heroImage}`} image={pageData.image} />
					)}
					<ModulesWrapper
						languageCode={this.props.pageContext.languageCode}
						upcomingEventsData={this.props.pageContext.upcomingEvents}
						childrenLast={true}
						hasHeroImage={true}
						data={pageData.modulesWrapper}
					>
						{this.props.pageContext.upcomingPageEvents && (
							<EventsList
								animationDirection={animationDirection}
								isWCEvent={isWCEvent >= 1}
                                // @ts-ignore
								events={isWCEvent >= 1 ? this.props.data.wcEvents.edges.filter( edgeItem => new Date(edgeItem.node.endDate) >= Date.now()) : this.props.pageContext.upcomingPageEvents}
								title={this.props.pageContext.languageCode === 'ar-QA' ? 'فعاليات ذات صلة' : 'Related Events'}
							/>
						)}
					</ModulesWrapper>
				</div>
			</PageWrapper>
		);
	}
}

export default PageEvent;

export const pageQuery = graphql`
	query PageEventQuery($id: String, $languageCode: String) {
		contentfulEvent(contentful_id: { eq: $id }, node_locale: { eq: $languageCode }) {
			contentful_id
			title
            slug
			description {
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
			type {
				contentful_id
			}
            campaign {
                slug
            }
			eventCategory {
				contentful_id
			}
			registrationLink
			webinarLink
			registerThroughEcMobileApp
			public
			allDay
			placeDetail
			place {
				contentful_id
				placeLocation {
					lon
					lat
				}
				placeName
				placeAddress
			}
			filterVerticalCategory {
				title
			}
			organiser {
				contentful_id
				slug
				title
				filterVerticalCategory {
					slug
				}
				isPartOfQatarFoundation
			}
			coOrganizer
			campaign {
				contentful_id
			}
			eventTags {
				contentful_id
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
		}
		verticalEnglish: contentfulEvent(contentful_id: { eq: $id }, node_locale: { eq: "en-US" }) {
			filterVerticalCategory {
				title
			}
		}
        wcEvents: allContentfulEvent(
            limit: 7, 
            filter: { contentful_id: { nin: [$id] }, campaign: {elemMatch: {slug: {eq: "world-cup"}}}, startDate: {} node_locale: { eq: $languageCode }}
            sort: { fields: [endDate], order: ASC }) {
                edges {
                    node {
                        id
                        contentful_id
                        title
                        startDate
                        endDate
                        slug
                        image {
                            file {
                                url
                            }
                        }
                        campaign {
                            slug
                        }
                        filterVerticalCategory {
                            title
                        }
                        type {
                            typeName
                        }
                        image {
                            gatsbyImageData(placeholder: NONE, width: 400, quality: 85)
                        }
                    }
                }
		}
	}
`;
