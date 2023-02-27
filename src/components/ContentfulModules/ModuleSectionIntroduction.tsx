import * as React from 'react';
import * as styles from './ModuleSectionIntroduction.module.scss';
import { Component } from 'react';
import { ContentfulModuleSectionIntroductionFragment } from '../../gatsby-queries';
import ViewableMonitor from '../ui/ViewableMonitor';
import { graphql } from 'gatsby';

class ModuleSectionIntroduction extends Component<{ data: ContentfulModuleSectionIntroductionFragment; sectionNumber: number; offsetForHeroImage: boolean }> {
	render() {
		return (
			<div id={`section-${this.props.sectionNumber}`} className={`${!this.props.offsetForHeroImage ? !this.props.data.removeTopMargin && 'module-margin ' : ''}${styles.wrapper}`}>
				<ViewableMonitor delay={this.props.offsetForHeroImage ? 3 : false}>
					<div className={`${styles.title} ${!this.props.data.hideTopBorder && 'devider'}`}>
						<div className={`text-style-h2 ${styles.titleWrapper}`}>
							<h2 tabIndex={0}>{this.props.data.title}</h2>
							{
                                // @ts-ignore
								!this.props.data.hideSectionNumber && !this.props.data.useIcon && (
									<span>{ `${this.props.sectionNumber ? '0' + this.props.sectionNumber : '' }`}</span>
								)
							}
                            {
                                // @ts-ignore
								!this.props.data.hideSectionNumber && this.props.data.useIcon && (
                                    // @ts-ignore
                                    this.props.data.useIcon === 'Quote' && (
                                        <span className={styles.quote}></span>
                                    )
								)
							}
						</div>
					</div>
				</ViewableMonitor>
				{this.props.data.introductionText && (
					<ViewableMonitor>
						<div
							className={`text-style-introduction text-style-markdown module-margin ${styles.introductionText}`}
							dangerouslySetInnerHTML={{ __html: this.props.data.introductionText.childMarkdownRemark.html }}
						/>
					</ViewableMonitor>
				)}
			</div>
		);
	}
}

export default ModuleSectionIntroduction;

export const query = graphql`
	fragment ContentfulModuleSectionIntroductionFragment on ContentfulModuleSectionIntroduction {
		id
		title
		introductionText {
			childMarkdownRemark {
				html
			}
		}
		hideSectionNumber
        hideTopBorder
        removeTopMargin
        useIcon
	}
`;