import * as React from 'react';
import * as styles from './ModuleHighlightedItems.module.scss';
import { Component } from 'react';
import { ContentfulModuleHighlightedItemsFragment } from '../../gatsby-queries';
import { EventPreview } from '../Previews/EventPreview';
import { ECSSPreview } from '../Previews/ECSSPreview';
import { ArticlePreview } from '../Previews/ArticlePreview';
import ViewableMonitor from '../ui/ViewableMonitor';
import Masonry from 'react-masonry-component';
import { graphql } from 'gatsby';
import ScrollList from '../ScrollList';
import ModuleFeaturedPageLink from './ModuleFeaturedPageLink';
import { Globals } from '../../utils/Globals';
import { GatsbyImageWrapper } from '../ui/GatsbyImageWrapper';
import { getPagePath } from '../../utils/URLHelper';
import ModuleCtaLink from './ModuleCtaLink';
import GatsbyLink from 'gatsby-link';

export default class ModuleHighlightedItems extends Component<{ data: ContentfulModuleHighlightedItemsFragment, useScrollList?: boolean, tabbed?: boolean }> {
	render() {
		const animationDirection = Globals.CURRENT_LANGUAGE_PREFIX === 'ar/' ? -1 : 1;

		if (this.props.data.showLatestFromCategory) {
			this.props.data.highlightedItems = this.props.data.showLatestFromCategory.pageArticles as any;
		}
		if (this.props.data.useMasonryLayout) {
			const masonryOptions = {
				transitionDuration: 0,
				resize: true,
				horizontalOrder: true,
				percentPosition: true,
				gutter: 50
			};

			return (
				<div className={`module-margin ${styles.wrapper}`}>
					<div>
						<ViewableMonitor>
							<h2 tabIndex={0} className="text-style-category-headline">{this.props.data.headline.title}</h2>
						</ViewableMonitor>
					</div>
					<Masonry
						className={styles.itemsWrapper + ' ' + styles.masonryLayout} // default ''
						disableImagesLoaded={false} // default false
						options={masonryOptions}
						updateOnEachImageLoad={true} // default false and works only if disableImagesLoaded is false
					>
						{this.props.data.highlightedItems.map((item, index) => {
							const id = module.id + index;
							switch (item.__typename) {
								case 'ContentfulEvent':
									return (
										<ViewableMonitor delay={index + 1} key={id}>
											<EventPreview className={this.props.data.highlightedItems.length > 4 && index > 1 ? 'small' : ''} data={item} newLayout={this.props.data.newLayout ? true : false} rangeDate={this.props.data.newLayout ? true : false} />
										</ViewableMonitor>
									);
                                // @ts-ignore    
								case 'ContentfulEcss':
									return (
										<ViewableMonitor delay={index + 1} key={id}>
											<ECSSPreview className={this.props.data.highlightedItems.length > 4 && index > 1 ? 'small' : ''} data={item} />
										</ViewableMonitor>
									);	
								case 'ContentfulPageArticle':
									return (
										<ViewableMonitor delay={index + 1} key={id}>
											<ArticlePreview className={this.props.data.highlightedItems.length > 4 && index > 1 ? 'small' : ''} data={item} />
										</ViewableMonitor>
									);
							}
						})}
					</Masonry>
				</div>
			);
		} else if (this.props.data.highlightedItems) {
			const wrapperClass = this.props.data.highlightedItems.length > 5 ? styles.wrapperMoreThan5 : styles['style' + (this.props.data.showLatestFromCategory ? 'Latest' + this.props.data.highlightedItems.length : this.props.data.highlightedItems.length === 1 ? 2 : this.props.data.highlightedItems.length)];
			let featuredPageLinkItems = [];
			let fitlerArticleTags = [];
			this.props.data.highlightedItems.forEach((item) => {
				if (item.__typename === 'ContentfulModuleFeaturedPageLink') {
					featuredPageLinkItems.push(item);
				}
				if (item.__typename === 'ContentfulFilterArticleTag') {
					// @ts-ignore
					if(item.slug !== 'news') {
						fitlerArticleTags.push(item);
					}
				}
			});
			if (featuredPageLinkItems.length > 0) {
				return (<div className={`${styles.wrapper} module-margin`}>
					{
                        // @ts-ignore
                        !this.props.data.hideTitle && (
                            // @ts-ignore
                            <h2 tabIndex={0} className={`${!this.props.data.compactMode ? (this.props.data.varientTitle ? 'text-style-h2 module-margin-small' : styles.scrollerHeadline) : 'text-style-category-headline module-margin-sm' }`}>
                                {this.props.data.headline.title}
                            </h2>
                        )
                    }
					<ScrollList tabbed={this.props.tabbed} showPaginator={true} animationDirection={animationDirection} listClassName={'module-margin-small'} className={!this.props.data.compactMode && 'highlightedScroller'}>
						{
							// @ts-ignore
							featuredPageLinkItems.map((edge, index) => {
								// @ts-ignore
								return (<ViewableMonitor disabled={(index >= 3)} key={edge.id + index} delay={index + 1}>
										{
											// @ts-ignore
											<ModuleFeaturedPageLink data={edge} asHighlightedItem={true} compactMode={this.props.data.compactMode} />
										}
									</ViewableMonitor>
								);
							})
						}
					</ScrollList>
				</div>);
			} else if (fitlerArticleTags.length > 0) {
				return (<div className={`${styles.wrapper}`}>
					<ScrollList showPaginator={true} animationDirection={animationDirection} listClassName={'module-margin-small'} className={'highlightedScroller'}>
						{
							// @ts-ignore
							fitlerArticleTags
							// @ts-ignore
							.sort(function(a, b) {
								// @ts-ignore
								return b.sortOrder - a.sortOrder;
							}).map((edge, index) => {
								return (<ViewableMonitor disabled={(index >= 6)} key={edge.id + index} delay={index + 1}>
										{
											// @ts-ignore
											<GatsbyLink to={getPagePath(edge.slug, 'article')} className={styles.articleTag}>
												{edge.image && <GatsbyImageWrapper alt={edge.image.title} image={edge.image} />}
												<span>{edge.title}</span>
											</GatsbyLink>
										}
									</ViewableMonitor>
								);
							})
						}
					</ScrollList>
				</div>);
			} else if (this.props.useScrollList) {
				return (<div className={`${styles.wrapper} ${styles.relatedArticlesWrapper}`}>
					<ScrollList showPaginator={true} animationDirection={animationDirection} listClassName={'module-margin-small'} className={'highlightedScroller'}>
						{this.props.data.highlightedItems.map((item, index) => {
							const id = module.id + index;
							switch (item.__typename) {
								case 'ContentfulEvent':
									return (
										<ViewableMonitor delay={index + 1} key={id}>
											<EventPreview className={this.props.data.highlightedItems.length > 4 && index > 1 ? 'small' : ''} data={item} newLayout={this.props.data.newLayout ? true : false} rangeDate={this.props.data.newLayout ? true : false} />
										</ViewableMonitor>
									);
                                // @ts-ignore        
								case 'ContentfulEcss':
									return (
										<ViewableMonitor delay={index + 1} key={id}>
											<ECSSPreview className={this.props.data.highlightedItems.length > 4 && index > 1 ? 'small' : ''} data={item} />
										</ViewableMonitor>
									);	
								case 'ContentfulPageArticle':
									return (
										<ViewableMonitor delay={index + 1} key={id}>
											<ArticlePreview className={(this.props.data.highlightedItems.length || this.props.data.showLatestFromCategory) > 4 && index > 1 ? 'small' : ''}
															data={item} />
										</ViewableMonitor>
									);
							}
						})}
					</ScrollList>
				</div>);
			} else {
                // @ts-ignore
				if(this.props.data.useScrollList) {
					return (<div className={`${styles.wrapper} module-margin`}>
						{
                            // @ts-ignore
                            !this.props.data.hideTitle && (
                                // @ts-ignore
                                <h2 tabIndex={0} className={`${!this.props.data.compactMode ? (this.props.data.varientTitle ? 'text-style-h2 module-margin-small' : styles.scrollerHeadline) : 'text-style-category-headline module-margin-sm' }`}>
                                    {this.props.data.headline.title}
                                </h2>
                            )
                        }
						<ScrollList showPaginator={true} animationDirection={animationDirection} listClassName={'module-margin-small'} className={'highlightedScroller'}>
							{
								// @ts-ignore
								this.props.data.highlightedItems.map((item, index) => {
									item['index'] = index  + 1
									// @ts-ignore
									return (<ViewableMonitor disabled={(index >= 3)} key={item.id + index} delay={index + 1}>
											{
												// @ts-ignore
												<ModuleFeaturedPageLink data={item} asHighlightedItem={true} articles={true} />
											}
										</ViewableMonitor>
									);
								})
							}
						</ScrollList>
					</div>);
				} else {

					// @ts-ignore
					var items = this.props.data.sortByDate ? this.props.data.highlightedItems.sort((a, b) => { return new Date(b.startDate) > new Date(a.startDate) ? -1 : 1; }) : this.props.data.highlightedItems;		

					return (
						<div
							className={`module-margin ${styles.wrapper} ${this.props.data.showLatestFromCategory ? styles.showLatest : ''} ${this.props.data.highlightedBackground ? styles.highlightedBackground : ''}`}>
							{
                                // @ts-ignore
                                !this.props.data.hideTitle && (
                                    // @ts-ignore
                                    <h2 tabIndex={0} className={`${!this.props.data.compactMode ? (this.props.data.varientTitle ? 'text-style-h2 module-margin-small' : typeof this.props.tabbed === 'undefined' ? 'text-style-category-headline' : styles.scrollerHeadline) : (this.props.data.varientTitle ? 'text-style-h2 module-margin-small' : 'text-style-category-headline module-margin-sm') }`}>
                                        {this.props.data.headline.title}
                                    </h2>
                                )
                            }
							<div className={styles.itemsWrapper + ' ' + ((this.props.data.newLayout && this.props.data.compactMode) ? styles.styleLatest5 : wrapperClass)}>
								{items.map((item, index) => {
									const id = module.id + index;
									switch (item.__typename) {
										case 'ContentfulEvent':
											return (
												<ViewableMonitor delay={index + 1} key={id}>
													<EventPreview className={this.props.data.highlightedItems.length > 4 && index > 1 ? 'small' : ''} data={item} newLayout={this.props.data.newLayout ? true : false} compact={this.props.data.compactMode ? true : false} rangeDate={this.props.data.newLayout ? true : false} />
												</ViewableMonitor>
											);
                                        // @ts-ignore        
										case 'ContentfulEcss':
											return (
												<ViewableMonitor delay={index + 1} key={id}>
													<ECSSPreview className={this.props.data.highlightedItems.length > 4 && index > 1 ? 'small' : ''} data={item} />
												</ViewableMonitor>
											);	
										case 'ContentfulPageArticle':
											return (
												<ViewableMonitor delay={index + 1} key={id}>
													<ArticlePreview className={(this.props.data.highlightedItems.length || this.props.data.showLatestFromCategory) > 4 && index > 1 ? 'small' : ''}
																	data={item} />
												</ViewableMonitor>
											);
									}
								})}
							</div>
							{this.props.data.readMoreCta && <ModuleCtaLink data={this.props.data.readMoreCta} />}
						</div>
					);
				}
			}
		} else {
			return <div>{this.props.data.showLatestFromCategory?.title}{this.props.data.showLatestFromCategory?.pageArticles.length}</div>;
		}
	}
}

export const query = graphql`
	fragment ContentfulModuleHighlightedItemsFragment on ContentfulModuleHighlightedItems {
		id
		headline: title {
			title
		}
		sortByDate
		useMasonryLayout
		useScrollList
        compactMode
        varientTitle
        hideTitle
        newLayout
		highlightedItems {
			__typename
			...ContentfulEventPreviewFragment
			...ContentfulEcssPreviewFragment
			...ContentfulPageArticlePreviewFragment
			...ContentfulModuleFeaturedPageLinkFragment
			... on ContentfulFilterArticleTag {
				title
				id
				slug
				image {
					title
					gatsbyImageData(
                        placeholder: NONE
                        width: 400
                        height: 230
                        quality: 85
                    )
				}
				sortOrder
			}
		}
		highlightedBackground
		readMoreCta {
			...ContentfulModuleCtaLinkFragment
		}
		showLatestFromCategory {
			... on ContentfulFilterArticleTag {
				id
				title
				pageArticles(limit: 4) {
					__typename
					...ContentfulPageArticlePreviewFragment
				}
			}
			... on ContentfulFilterArticleType {
				id
				title
				pageArticles(limit: 4) {
					__typename
					...ContentfulPageArticlePreviewFragment
				}
			}
		}
	}
`;
