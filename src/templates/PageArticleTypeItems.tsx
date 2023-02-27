import * as React from 'react';
import * as styles from './PageShared.module.scss';
import { PageArticleTypeItemsQuery } from '../gatsby-queries';
import PageWrapper, { IPageProps } from './PageWrapper';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import ViewableMonitor from '../components/ui/ViewableMonitor';
import { graphql } from 'gatsby';
import { ArticlePreview } from '../components/Previews/ArticlePreview';

interface Props extends IPageProps {
	intl: null;
	data: PageArticleTypeItemsQuery;
}

class PageArticleTypeItems extends React.Component<Props> {
	render() {
		const pageData = this.props.data.contentfulFilterArticleType;
		return (
			<PageWrapper location={this.props.location} pageData={pageData} type={'press_release'} title={pageData.title} pageContext={this.props.pageContext}>
				<div className="container pagePaddingTopSearch">
					{
						//@ts-ignore:
						<Helmet>
							{/*<meta className="swiftype" name="preview_image" data-type="enum" content={pageData.heroImage && pageData.heroImage.file.url} />*/}
{/*							{pageData.filterTags &&
							pageData.filterTags.map((entity, index) => <meta key={index} className="swiftype" name="filter_media_gallery" data-type="enum" content={entity.contentful_id} />)}*/}
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
							return (
								<ArticlePreview className={'small'} data={article.preview} key={article.node.id + index} />
							)
						})}
					</div>
				</div>
			</PageWrapper>
		);
	}
}

export default injectIntl(PageArticleTypeItems);

export const pageQuery = graphql`
	query PageArticleTypeItemsQuery($id: String, $languageCode: String) {
		contentfulFilterArticleType(contentful_id: { eq: $id }, node_locale: { eq: $languageCode }) {
			id
			slug
			title
		}
	}
`;
