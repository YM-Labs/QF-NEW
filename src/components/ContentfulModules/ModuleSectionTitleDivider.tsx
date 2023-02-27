import * as React from 'react';
import * as styles from './ModuleSectionTitleDivider.module.scss';
import { Component } from 'react';
import { ContentfulModuleSectionTitleDividerFragment } from '../../gatsby-queries';
import ViewableMonitor from '../ui/ViewableMonitor';
import { graphql } from 'gatsby';

export default class ModuleSectionTitleDivider extends Component<{ data: ContentfulModuleSectionTitleDividerFragment }> {
	render() {
		return (
			<ViewableMonitor fadeOnly={true}>
				<div className={`module-margin ${styles.wrapper}`}>
					<div className={`text-style-h2 ${styles.titleWrapper}`}>
						<h2>{this.props.data.sectionDividerTitle.sectionDividerTitle}</h2>
					</div>
				</div>
			</ViewableMonitor>
		);
	}
}

export const query = graphql`
	fragment ContentfulModuleSectionTitleDividerFragment on ContentfulModuleSectionTitleDivider {
		id
		sectionDividerTitle {
			sectionDividerTitle
		}
	}
`;
