import * as React from 'react';
import * as styles from './PageShared.module.scss';
// @ts-ignore
import { PageEcssTagItemsQuery } from '../gatsby-queries';
import PageWrapper, { IPageProps } from './PageWrapper';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import ViewableMonitor from '../components/ui/ViewableMonitor';
import { graphql } from 'gatsby';
import { ECSSPreview } from '../components/Previews/ECSSPreview';

interface Props extends IPageProps {
	intl: null;
	data: PageEcssTagItemsQuery;
}

class PageEcssTagItems extends React.Component<Props> {
	render() {
		const pageData = this.props.data.contentfulFilterEcssTag;
		return (
			<PageWrapper location={this.props.location} pageData={pageData} type={'press_release'} title={pageData.title} pageContext={this.props.pageContext}>
				<div className="container pagePaddingTopSearch">
					{
						<Helmet>
							<meta className="swiftype" name="type" data-type="enum" content="page" />
						</Helmet>
					}
					<ViewableMonitor>
						<div className={styles.topSection}>
							<div className={`${styles.topSectionText}`}>
								<h1 className={`text-style-quote`} ><FormattedMessage id={'ecss_short'} /><span className='pageEcssTagItemsTitle'> / {pageData.title}</span></h1>
							</div>
						</div>
					</ViewableMonitor>

					<div className='ecssTagItemsWrapper'>
						{this.props.pageContext.ecss.map((ecss, index) => {
							return (
								// @ts-ignore
								<ECSSPreview className={'small'} itemsClass='style6' data={ecss.preview} key={ecss.node.id + index} />
							)
						})}
					</div>
				</div>
			</PageWrapper>
		);
	}
}

export default injectIntl(PageEcssTagItems);

export const pageQuery = graphql`
	query PageEcssTagItemsQuery($id: String, $languageCode: String) {
		contentfulFilterEcssTag(contentful_id: { eq: $id }, node_locale: { eq: $languageCode }) {
			id
			slug
			title
		}
	}
`;
