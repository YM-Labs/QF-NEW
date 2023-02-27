import { graphql } from 'gatsby';
import * as React from 'react';
import { Helmet } from 'react-helmet';
import { FormattedMessage, injectIntl, useIntl } from 'react-intl';
import Masonry from 'react-masonry-component';
import { TapStoryPreview } from '../components/Previews/TapStoryPreview';
import ViewableMonitor from '../components/ui/ViewableMonitor';
import * as sharedStyle from './PageShared.module.scss';
import * as styles from './PageTapStoryOverview.module.scss';
import { PageTapStoryOverviewQuery } from '../gatsby-queries';

import PageWrapper, { IPageProps } from './PageWrapper';

interface Props extends IPageProps {
    intl: ReturnType<typeof useIntl>;
	data: PageTapStoryOverviewQuery;
	bilingual?: boolean;
}

class PageTapStoryOverview extends React.Component<Props> {

	constructor(props) {
		super(props);
	}

	render() {
		const articles = this.props.data.allContentfulPageTapStory.edges.map((edge) => edge.node)
		const pageData = {
			slug: '/stories/tap-stories',
			title: this.props.intl.formatMessage({ id: 'tap_stories' })
		}

		const masonryOptions = {
			transitionDuration: 0,
			resize: true,
			horizontalOrder: false,
            originLeft: this.props.intl.locale === 'ar' ? false : true,
			percentPosition: true,
			gutter: 50
		};

		return (
			<PageWrapper
				location={this.props.location}
				pageData={pageData}
				type={'overview'}
				title={pageData.title}
				pageContext={this.props.pageContext}
			>
				<div className="container pagePaddingTopSearch">
					{
						//@ts-ignore:
						<Helmet>
							<meta className="swiftype" name="type" data-type="enum" content="page" />
						</Helmet>
					}

					<ViewableMonitor>
						<div className={sharedStyle.topSection}>
							<div>
								<h1 className={`text-style-quote ${sharedStyle.pageArticleTagItemsTitle}`} ><FormattedMessage id={'plural_article'} /><span> / {pageData.title}</span></h1>
							</div>
						</div>
					</ViewableMonitor>
					<div className={`${styles.wrapper}`}>
						<Masonry
							className={sharedStyle.itemsWrapper + ' ' + styles.masonryWrapper} // default ''
							disableImagesLoaded={false} // default false
							options={masonryOptions}
							updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
						>
							{articles.map((article, index) => {
								return (
									//TODO: UPDATE KEY
									<ViewableMonitor delay={index + 1} key={`tap_story_related_${article.contentful_id}`}>
										<TapStoryPreview data={article} className={``} mode={"overview"}/>
									</ViewableMonitor>
								)
							})}

						</Masonry>
					</div>
				</div>
			</PageWrapper>
		)
	}

}

export default injectIntl(PageTapStoryOverview);

export const pageQuery = graphql`
	query PageTapStoryOverviewQuery($languageCode: String) {
		allContentfulPageTapStory(filter: { title: { ne: "WORKAROUND. DO NOT DELETE." }, node_locale: { eq: $languageCode }}, sort: { order: DESC, fields: [date] }, limit: 9999) {
			edges {
				node {
					...ContentfulPageTapStoryPreviewFragment
				}
			}
		}
    }
`;