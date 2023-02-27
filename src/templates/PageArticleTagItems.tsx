import * as React from 'react';
import * as styles from './PageShared.module.scss';
import { PageArticleTagItemsQuery } from '../gatsby-queries';
import PageWrapper, { IPageProps } from './PageWrapper';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import ViewableMonitor from '../components/ui/ViewableMonitor';
import { graphql } from 'gatsby';
import { ArticlePreview } from '../components/Previews/ArticlePreview';

interface Props extends IPageProps {
	intl: null;
	data: PageArticleTagItemsQuery;
}

class PageArticleTagItems extends React.Component<Props> {
	render() {
		const pageData = this.props.data.contentfulFilterArticleTag;
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
								<h1 className={`text-style-quote ${styles.pageArticleTagItemsTitle}`} ><FormattedMessage id={'plural_article'} /><span> / {pageData.title}</span></h1>
							</div>
						</div>
					</ViewableMonitor>

					<div className={styles.itemsWrapper + ' ' + styles.style4Even}>
						{this.props.pageContext.articles.map((article, index) => {
							if(article.node.title !== ' ') { 
                                return (
                                    <ArticlePreview className={'small'} data={article.preview} key={article.node.id + index} />
                                )
                            }
						})}
					</div>
				</div>
			</PageWrapper>
		);
	}
}

export default injectIntl(PageArticleTagItems);

export const pageQuery = graphql`
	query PageArticleTagItemsQuery($id: String, $languageCode: String) {
		contentfulFilterArticleTag(contentful_id: { eq: $id }, node_locale: { eq: $languageCode }) {
			id
			slug
			title
		}
	}
`;
