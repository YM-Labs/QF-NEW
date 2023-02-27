import * as React from 'react';
import * as styles from './ModuleOneColumnText.module.scss';
import { Component } from 'react';
import { ContentfulModuleOneColumnTextFragment } from '../../gatsby-queries';
import ViewableMonitor from '../ui/ViewableMonitor';
import { graphql } from 'gatsby';

class ModuleOneColumnText extends Component<{ data: ContentfulModuleOneColumnTextFragment }> {
	render() {
		return (
			// @ts-ignore
			<div className={this.props.data.fluidLayout && styles.fluidLayout}>
				<ViewableMonitor>
					<div className={!this.props.data.compactMode && `module-margin`}>
						{this.props.data.titleOptional && <h3 className={`text-style-subheadline ${!this.props.data.isFullWidth && styles.maxWidth}`}>{this.props.data.titleOptional.titleOptional}</h3>}
						<div
							className={`text-style-body ${styles.body} ${!this.props.data.isFullWidth && styles.maxWidth}`}
							dangerouslySetInnerHTML={{ __html: this.props.data.body?.childMarkdownRemark?.html }}
						/>
					</div>
				</ViewableMonitor>
			</div>
		);
	}
}

export default ModuleOneColumnText;

export const query = graphql`
	fragment ContentfulModuleOneColumnTextFragment on ContentfulModuleOneColumnText {
		id
		titleOptional {
			titleOptional
		}
		body {
			childMarkdownRemark {
				html
			}
		}
		isFullWidth
		fluidLayout
        compactMode
	}
`;
