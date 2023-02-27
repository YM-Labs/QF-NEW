import * as React from 'react';
import * as styles from './NewsList.module.scss';
import { useIntl, FormattedMessage } from 'react-intl';
import { ArticlePreview } from './Previews/ArticlePreview';
// @ts-ignore
import { ContentfulPageArticlePreviewFragment } from '../gatsby-queries';
import ScrollList from './ScrollList';
import { PlaceHolderImage } from "../ui/PlaceHolderImage"
import ViewableMonitor from './ui/ViewableMonitor';
import GatsbyLink from 'gatsby-link';
import { getPagePath } from '../utils/URLHelper';

function withPlaceHolderImageHook(Component) {
    return function WrappedComponent(props) {
      const intl = useIntl();
      const image = PlaceHolderImage()
      return <Component key={`comp-${props}`} {...props} moreText={intl.formatMessage({ id: 'More' }) } placeholderImage={image} />;
    }
}

class NewsList extends React.Component<{ articles?: ContentfulPageArticlePreviewFragment; animationDirection: 1 | -1; id?: any; introText?: any; type?: string }> {

    render() {
        // @ts-ignore
        const rowLen = this.props.articles.length;
        let allArticles = Object.assign(this.props.articles, { 7: {
                id: "b677a68f-8cd8-5b20-a675-a438f925f607",
                key: 'b677a68f-8cd8-5b20-a675-a438f925f607',
                title: <FormattedMessage id={'education_city_link'} />,
                contentful_id: null,
                slug: "",
                // @ts-ignore
                filterVerticalCategory: {title: this.props.moreText},
                // @ts-ignore
                teaserImage: this.props.placeholderImage.contentfulAsset
            }
        })
        
		return (
			<div id={this.props.id} className={`${styles.wrapper} w-100 module-margin`}>
                <div className={`${styles.innerWrapper}`}>
                    <ScrollList showPaginator={false} animationDirection={this.props.animationDirection} listClassName={'module-margin-small'} className={'NewsList'}>
                        <div className='module-margin-small'>
                            { this.props.type !== 'stories' && <h2 className={'text-style-h2'}><FormattedMessage id={'latest_news_title'} /></h2> }
                            <div className={`text-style-h2 ${styles.description}`}>
                                {
                                    this.props.introText ? this.props.introText : 
                                    <FormattedMessage id={'latest_news_content'} />
                                }
                            </div>
                            <div>
                                <GatsbyLink to={getPagePath('', 'article')} data-swiftype-index="false" className={`text-style-body ${styles.ctaLink}`}>
                                    {
                                        this.props.type === 'stories' ? <FormattedMessage id={'latest_stories_link'} /> : <FormattedMessage id={'latest_news_link'} />
                                    }
                                </GatsbyLink>
                            </div>
                        </div>
                        {  
                        // @ts-ignore
                        allArticles.map((edge, index) => {
                            return (
                                <ViewableMonitor disabled={this.props.animationDirection === -1 ? index <= 1 : index <= -1} key={edge.id + index} delay={index + 1}>
                                    {
                                    // @ts-ignore
                                    <ArticlePreview portraitMode={true} className={'portraitMode'} data={edge} placeHolderImage={this.props.placeholderImage.contentfulAsset} />
                                    }
                                </ViewableMonitor>
                            );
                        })
                        }
                    </ScrollList>
                </div>
			</div>
		);
	}
}

export default withPlaceHolderImageHook(NewsList)