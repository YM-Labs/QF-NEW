import * as React from 'react';
import * as styles from './PageShared.module.scss';
import PageWrapper, { IPageProps } from './PageWrapper';
import SearchAdvanced from '../components/Search/SearchAdvanced';
import { PageSearchQuery } from '../gatsby-queries';
import { FormattedMessage, injectIntl, useIntl } from 'react-intl';
import { graphql } from 'gatsby';

interface Props extends IPageProps {
	intl: ReturnType<typeof useIntl>;
	data: PageSearchQuery;
}

class PageSearch extends React.Component<Props> {
	private shiftthefocus = event => {
		if (event.key == 'Tab') {
			//$("#search_advanced_page_input").focus();
		}
	};

	componentDidMount() {
		typeof window !== 'undefined' && window.scrollTo(0,0);
	}

	render() {
		return (
			<PageWrapper location={this.props.location} pageData={null} type={'search'} title={this.props.intl.formatMessage({ id: 'Search' })} pageContext={this.props.pageContext}>
				<div data-swiftype-index="false" className="container pagePaddingTopSearch">
					<div className={styles.topSection}>
						<div className={`col-md-6 col-xl-4 ${styles.topSectionText}`}>
							<h1 className="text-style-h1" tabIndex={0} onKeyDown={this.shiftthefocus}>
								<FormattedMessage id="Search" />
							</h1>
						</div>
					</div>
					<SearchAdvanced filterData={this.props.data} currLanguage={this.props.pageContext.languageCode} />
				</div>
			</PageWrapper>
		);
	}
}

export default injectIntl(PageSearch);

export const pageQuery = graphql`
	query PageSearchQuery($languageCode: String) {
		allContentfulFilterProgramType(filter: { node_locale: { eq: $languageCode } }) {
			edges {
				node {
					title
					contentful_id
				}
			}
		}
		allContentfulCategory(filter: { node_locale: { eq: $languageCode } }) {
			edges {
				node {
					title: categoryName
					contentful_id
				}
			}
		}
		allContentfulPagePersona(filter: { node_locale: { eq: $languageCode }, mediaSpokespeople: { eq: true } }) {
			edges {
				node {
					id
					contentful_id
					node_locale
					title: name
					slug
					introductionText {
						introductionText
					}
					previewImage {
						gatsbyImageData(
                            placeholder: NONE
                            height: 642
                            width: 502
                            quality: 85
                          )
					}
					mediaSpokespeople
				}
			}
		}
		allContentfulPressMediaMention(filter: { title: { title: { ne: "WORKAROUND. DO NOT DELETE." } } }, sort: { order: DESC, fields: [date] }) {
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
		allContentfulPageProgram(filter: { title: { ne: "WORKAROUND. DO NOT DELETE." }, node_locale: { eq: $languageCode } }) {
			edges {
				node {
					title: title
					contentful_id
				}
			}
		}
		allContentfulFilterSchoolType(filter: { node_locale: { eq: $languageCode } }) {
			edges {
				node {
					title: title
					contentful_id
				}
			}
		}
		allContentfulFilterPressReleaseTag(filter: { node_locale: { eq: $languageCode } }) {
			edges {
				node {
					title: title
					contentful_id
				}
			}
		}
		allContentfulEventType(filter: { node_locale: { eq: $languageCode } }) {
			edges {
				node {
					title: typeName
					contentful_id
				}
			}
		}
		allContentfulEventTag(filter: { node_locale: { eq: $languageCode } }) {
			edges {
				node {
					title: keyword
					contentful_id
				}
			}
		}
		allContentfulFilterArticleTag(filter: { node_locale: { eq: $languageCode } }) {
			edges {
				node {
					title: title
					contentful_id
				}
			}
		}
		allContentfulPlace(filter: { node_locale: { eq: $languageCode } }) {
			edges {
				node {
					title: placeName
					contentful_id
				}
			}
		}
		allContentfulPageCampaign(filter: { node_locale: { eq: $languageCode } }) {
			edges {
				node {
					title
					contentful_id
				}
			}
		}
		allContentfulFilterPersonaDepartment(filter: { node_locale: { eq: $languageCode } }) {
			edges {
				node {
					title
					contentful_id
				}
			}
		}
		allContentfulFilterPlaceCategory(filter: { node_locale: { eq: $languageCode } }) {
			edges {
				node {
					title
					contentful_id
				}
			}
		}
		allContentfulEntities(filter: { title: { nin: ["WORKAROUND. DO NOT DELETE.", "Recreational Facilities"] }, node_locale: { eq: $languageCode } }) {
			edges {
				node {
					title
					contentful_id
				}
			}
		}
	}
`;
