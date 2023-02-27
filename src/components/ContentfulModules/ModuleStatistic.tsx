import * as React from 'react';
import * as styles from './ModuleStatistic.module.scss';
import { Component } from 'react';
import { ContentfulModuleStatisticFragment } from '../../gatsby-queries';
import ViewableMonitor from '../ui/ViewableMonitor';
import { graphql } from 'gatsby';

class ModuleStatistic extends Component<{ data: ContentfulModuleStatisticFragment }> {
	render() {
		return (
			<ViewableMonitor>
				<div className={`module-margin ${styles.wrapper}`}>
                    <div className={`${styles.title}`}>{this.props.data.statTitle?.statTitle}</div>
					<div className={`text-style-body ${styles.subtitle}`}>{this.props.data.subtitle?.subtitle}</div>
					<div className={`text-style-detail-2 ${styles.statistic}`}>{this.props.data.statisticalCallout}</div>
				</div>
			</ViewableMonitor>
		);
	}
}

export default ModuleStatistic;

export const query = graphql`
	fragment ContentfulModuleStatisticFragment on ContentfulModuleStatistic {
		id
		subtitle {
			subtitle
		}
		statTitle {
			statTitle
		}
		statisticalCallout
	}
`;
