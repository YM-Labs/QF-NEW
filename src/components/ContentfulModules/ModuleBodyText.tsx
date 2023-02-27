import * as React from 'react';
import * as styles from './ModuleBodyText.module.scss';
import { Component } from 'react';
import { ContentfulModuleBodyTextFragment } from '../../gatsby-queries';
import ViewableMonitor from '../ui/ViewableMonitor';
import { graphql } from 'gatsby';

class ModuleBodyText extends Component<{ data: ContentfulModuleBodyTextFragment }> {
	render() {
		if (this.props.data.text) {
			return (
				<ViewableMonitor>
					{this.props.data.text.childMarkdownRemark && (
						<div className={`module-margin text-style-body-module ${styles.wrapper}`} dangerouslySetInnerHTML={{ __html: this.props.data.text.childMarkdownRemark.html }} />
					)}
				</ViewableMonitor>
			);
		} else {
			return <span />;
		}
	}
}

export default ModuleBodyText;

export const query = graphql`
	fragment ContentfulModuleBodyTextFragment on ContentfulModuleBodyText {
		id
		text {
			childMarkdownRemark {
				html
			}
		}
	}
`;
