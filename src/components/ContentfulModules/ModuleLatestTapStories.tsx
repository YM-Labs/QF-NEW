import { graphql } from 'gatsby';
import { Component } from 'react';
import * as React from 'react';
import { injectIntl } from 'react-intl';
import { Globals } from '../../utils/Globals';
import { TapStoryPreview } from '../Previews/TapStoryPreview';
import ScrollList from '../ScrollList';
import ViewableMonitor from '../ui/ViewableMonitor';
import ModuleCtaLink from './ModuleCtaLink';
import * as styles from './ModuleLatestTapStories.module.scss';
import { FormattedMessage } from 'react-intl';
// import axios from 'axios';

const initialState = {
	articles: null
}
type State = Readonly<typeof initialState>;

class ModuleLatestTapStories extends Component<any> {
	readonly state: State = initialState;

	constructor(props) {
		super(props);
	}

	render() {
		const animationDirection = Globals.CURRENT_LANGUAGE_PREFIX === 'ar/' ? -1 : 1;
        let data = this.props.selectedTapStories ? this.props.selectedTapStories : this.props.data.selectedTapStories

		return (
			<div className={`${styles.wrapper} module-margin`}>
				<ViewableMonitor>
					<h2 tabIndex={0} className={styles.scrollerHeadline}>
                        <FormattedMessage id={'tap_stories'} />
					</h2>
				</ViewableMonitor>
				{
					data && (
						<ScrollList
							showPaginator={true}
							animationDirection={animationDirection}
							listClassName={styles.listClassName}
							className={'highlightedScroller'}
						>
							{
								// @ts-ignore
								data.map((item, index) => {
									// @ts-ignore
									return (<ViewableMonitor disabled={(index >= 3)} key={item.contentful_id + index} delay={index + 1}>
											{
												// @ts-ignore
												<TapStoryPreview data={item} className={styles.previewItem} mode={'preview'} />
											}
										</ViewableMonitor>
									);
								})
							}
						</ScrollList>
					)
				}

				<ModuleCtaLink inline={true} data={{
					id: 'book-interview',
					linkText: this.props.intl.formatMessage({ id: 'tap_story_more' }),
					url: Globals.CURRENT_LANGUAGE_PREFIX === 'ar/' ? '/ar/stories/tap' : '/stories/tap',
					// @ts-ignore
					highlighted: true,
					// @ts-ignore
					darkBackground: true
				}} />
			</div>
		);
	}
}

export default injectIntl(ModuleLatestTapStories);

export const pageQuery = graphql`
	fragment ContentfulModuleLatestTapStoriesFragment on ContentfulModuleLatestTapStories {
		title
		selectedTapStories {
			...ContentfulPageTapStoryPreviewFragment
		}
	}
`;