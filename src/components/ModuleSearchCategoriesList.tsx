import * as React from 'react';

import * as styles from './ModuleSearchCategoriesList.module.scss';
import { PageOverviewQuery_allContentfulCategory } from '../gatsby-queries';
import GatsbyLink from 'gatsby-link';
import { FormattedMessage } from 'react-intl';
import ViewableMonitor from './ui/ViewableMonitor';
import { getPagePath } from '../utils/URLHelper';

const initialState = { records: {}, ids: [] };
type State = Readonly<typeof initialState>;

export class ModuleSearchCategoriesList extends React.Component<
	{ showCount?: boolean; type: string; filterName: string; data: PageOverviewQuery_allContentfulCategory; campaign?: string; filter_campaign?: string },
	State
> {
	readonly state: State = initialState;

	private renderCategories(edge, index) {
		var campaignFilter = '';
		if (this.props.campaign) {
			campaignFilter = `&currTypeFilters[${this.props.campaign}]=${this.props.filter_campaign ? this.props.filter_campaign : edge.node.contentful_id}`;
		}
		var to = getPagePath(`#all=1&types[${this.props.type}]=1`, 'search') + `&currTypeFilters[${this.props.filterName}]=${edge.node.contentful_id}${campaignFilter}&s=`;

		const events = edge.node.items ? edge.node.items.length : 0;
		return (
			<GatsbyLink className={styles.item} key={index} to={to}>
				<div className={'aspect-content'}>
					<span className={styles.count}>
						{!this.props.campaign && events}
					</span>
					<span className={'text-style-h3 ' + styles.title}>{edge.node.title}</span>
				</div>
			</GatsbyLink>
		);
	}

	public render() {
		return (
			<ViewableMonitor>
				<div className={`module-margin`}>
					<div className={styles.titleWrapper}>
						<h2 tabIndex={0} className="text-style-category-headline">
							{this.props.showCount ? <FormattedMessage id="Browse Events by Location" /> : <FormattedMessage id="Browse by Category" /> }
						</h2>
					</div>
					<div className={'module-margin-small ' + styles.itemsWrapper}>
						{this.props.data.edges.map((edge, index) => {
							if (this.props.campaign) {
                                if (edge.node.contentful_id == '2ObGggfkQ0CC2oUKKUiEII' || edge.node.contentful_id == '28RSR66KGAMKSyUuSqc6Om' || edge.node.contentful_id == '2dKnTZ0tpqkCSe22A2yg02' || edge.node.contentful_id == "3i2HaatkSkqEAyg0wOuWcC" || edge.node.contentful_id ==  "2uVEkxtXcEam0i4GUSQCk6" || edge.node.contentful_id == "sF2f7phPHwM2WuKmO6yqy" || edge.node.contentful_id == "6N1axbAAiQoQkeQq42Ucay")
									return this.renderCategories(edge, index);
                            } else {
                                return this.renderCategories(edge, index);
                            }
						})}
					</div>
				</div>
			</ViewableMonitor>
		);
	}
}
