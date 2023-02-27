import * as React from 'react';
import * as styles from './ModuleHeadingSummaryWithButtons.module.scss';
import { Component } from 'react';
import { ContentfulModuleHeadingSummaryWithButtonsFragment } from '../../gatsby-queries';
import ViewableMonitor from '../ui/ViewableMonitor';
import { graphql } from 'gatsby';
import ModuleCtaLink from './ModuleCtaLink';

class ModuleHeadingSummaryWithButtons extends Component<{ data: ContentfulModuleHeadingSummaryWithButtonsFragment }> {

	render() {
		return (
            // @ts-ignore
			<div className={`module-margin ${styles.wrapper} ${this.props.data.darkBackground ? styles.darkBackground : ''}`}>
				<ViewableMonitor>
					<div className={styles.shortBoxedWrapper}>
						<div>
							<p className={`${!this.props.data.links && 'text_black'} ${styles.title}`}>{this.props.data.moduleHeadingSummaryWithButtonsTitle.moduleHeadingSummaryWithButtonsTitle}</p>
							<div className={`${!this.props.data.links && 'text_black no_link'} ${styles.introParagraphText}`} dangerouslySetInnerHTML={{ __html: this.props.data.description.childMarkdownRemark.html }} />
						</div>
						{
							this.props.data.links && (
								<div className={styles.links}>
									{this.props.data.links?.map((link, index) => <ModuleCtaLink darkBackground={this.props.data.darkBackground} inline={true} data={link} key={link.id + index} />)}
								</div>
							)
						}
					</div>
				</ViewableMonitor>
			</div>
		);
	}
}

export default ModuleHeadingSummaryWithButtons;

export const query = graphql`
	fragment ContentfulModuleHeadingSummaryWithButtonsFragment on ContentfulModuleHeadingSummaryWithButtons {
		id
		moduleHeadingSummaryWithButtonsTitle {
			moduleHeadingSummaryWithButtonsTitle
		}
		description {
			childMarkdownRemark {
				html
			}
		}
		darkBackground
		links {
			...ContentfulModuleCtaLinkFragment
		}
	}
`;
