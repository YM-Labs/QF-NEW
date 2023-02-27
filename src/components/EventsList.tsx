import * as React from 'react';

import * as styles from './EventsList.module.scss';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import ModuleSectionTitleDivider from './ContentfulModules/ModuleSectionTitleDivider';
import { ContentfulEventPreviewFragment } from '../gatsby-queries';
import { EventPreview } from './Previews/EventPreview';
import GatsbyLink from 'gatsby-link';
import { getPagePath } from '../utils/URLHelper';
import ScrollList from './ScrollList';
import ViewableMonitor from './ui/ViewableMonitor';

class EventsList extends React.Component<{ events: ContentfulEventPreviewFragment[]; title?: string; animationDirection: 1 | -1, isWCEvent?: boolean } & WrappedComponentProps> {
	public render() {
		return (
			<div className={styles.wrapper + (this.props.title ? ' w-100' : '') + ' module-margin'}>
				<div className={this.props.title ? 'container-padding' : ''}>
					{this.props.title && (
						<ModuleSectionTitleDivider
							data={{
								id: 'related_events',
								sectionDividerTitle: { sectionDividerTitle: typeof this.props.title === 'string' ? this.props.title : this.props.intl.formatMessage({ id: this.props.title }) }
							}}
						/>
					)}
				</div>
				<ScrollList showPaginator={true} animationDirection={this.props.animationDirection} listClassName={'module-margin-small'} className={'EventList'}>
					{this.props.events.map((edge, index) => {
                        // @ts-ignore
                        const data = this.props.isWCEvent ? edge.node : edge
						return (
							<ViewableMonitor disabled={index > 2} key={data.contentful_id + index} delay={index + 1}>
								<EventPreview className={'relatedMode'} data={data} />
							</ViewableMonitor>
						);
					})}
				</ScrollList>
				<div className={styles.ctaBottom + ' module-margin-small'}>
					<FormattedMessage id={'Interested in more events?'} />
					<GatsbyLink to={getPagePath('#all=1&types[event]=1&s=', 'search')} data-swiftype-index="false" className={`text-style-body ${styles.ctaLink}`}>
						<FormattedMessage id={'Browse all Events'} />
					</GatsbyLink>
				</div>
			</div>
		);
	}
}

export default injectIntl(EventsList);
