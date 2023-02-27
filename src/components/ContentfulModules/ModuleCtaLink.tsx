import * as React from 'react';
import * as styles from './ModuleCtaLink.module.scss';
import { Component } from 'react';
import { ContentfulModuleCtaLinkFragment } from '../../gatsby-queries';
import ViewableMonitor from '../ui/ViewableMonitor';
import { graphql } from 'gatsby';

class ModuleCtaLink extends Component<{ data: ContentfulModuleCtaLinkFragment, inline?:boolean, darkBackground?:boolean }> {
	render() {
		return (
			<ViewableMonitor disabled={this.props.inline === true}>
				<div>
					<a className={`text-style-body ${styles.ctaLink} ${this.props.data.highlighted ? styles.highlighted : ''} ${this.props.data.compact ? styles.compact : ''} ${this.props.darkBackground === true ? styles.darkBackground : ''}`} href={this.props.data.url}>
						<span>{this.props.data.linkText}</span>
					</a>
				</div>
			</ViewableMonitor>
		);
	}
}

export default ModuleCtaLink;

export const query = graphql`
	fragment ContentfulModuleCtaLinkFragment on ContentfulModuleCtaLink {
		id
		linkText
		url
		highlighted
        compact
	}
`;
