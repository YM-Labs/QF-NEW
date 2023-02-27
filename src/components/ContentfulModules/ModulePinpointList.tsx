import * as React from 'react';
import { Component } from 'react';
import * as styles from './ModulePinpointList.module.scss';
import { ContentfulModulePinpointListFragment, ContentfulModulePinpointListFragment_pinpoints } from '../../gatsby-queries';
import { zeroPad } from '../../utils/StringUtils';
import ViewableMonitor from '../ui/ViewableMonitor';
import { graphql } from 'gatsby';
import { GatsbyImageWrapper } from '../ui/GatsbyImageWrapper';

class PinpointListItem extends Component<{ data: ContentfulModulePinpointListFragment_pinpoints; index: number; usesImages:boolean }> {

	render() {
		return (
			<li className={styles.listItem + (this.props.usesImages && !this.props.data.image ? ' ' + styles.imagePlaceholder : '')}>
				<h3 className={`text-style-h3 ${styles.title}`}>{this.props.data.title.title}</h3>
				{
                    // @ts-ignore
                    this.props.data.image && <GatsbyImageWrapper alt={this.props.data.image.title} outerWrapperClassName={styles.image} image={this.props.data.image.thumb} />
                }
				{!this.props.usesImages && <span className={`text-style-detail-1 ${styles.detail}`}>{zeroPad(this.props.index + 1)}</span>}
				<div className={styles.descriptionWrapper}>
					<div>
						<div className={`text-style-body`} dangerouslySetInnerHTML={{ __html: this.props.data.description.description }} />
						{this.props.data.ctaLinkOptional && this.props.data.ctaTextOptional && (
							<a className={`text-style-link-1 module-margin-small ${styles.ctaLink}`} href={this.props.data.ctaLinkOptional}>
								{this.props.data.ctaTextOptional}
							</a>
						)}
					</div>
				</div>
			</li>
		);
	}
}

class ModulePinpointList extends Component<{ data: ContentfulModulePinpointListFragment }> {
	render() {
		let lengthClass = styles.length4;
		if (this.props.data.pinpoints.length === 2) {
			lengthClass = styles.length2;
		} else if (this.props.data.pinpoints.length === 3) {
			lengthClass = styles.length3;
		}
		let usesImages = false;
		this.props.data.pinpoints.forEach((media) => {
				if (media.image) {
					usesImages = true;
				}
			}
		);
		return (
			<div className={`module-margin ${styles.wrapper} ${lengthClass}`}>
				<ul className={styles.listWrapper}>
					{this.props.data.pinpoints.map((item, index) => (
						<ViewableMonitor delay={index + 1} key={item.id + index}>
							<PinpointListItem data={item} index={index} usesImages={usesImages} />
						</ViewableMonitor>
					))}
				</ul>
			</div>
		);
	}
}

export default ModulePinpointList;

export const query = graphql`
	fragment ContentfulModulePinpointListFragment on ContentfulModulePinpointList {
		id
		pinpoints {
			id
			title {
				title
			}
			description {
				description
			}
			image {
				title
				thumb: gatsbyImageData(
                    placeholder: NONE
                    width: 120
                    height: 120
                    quality: 85
                  )
			}
			ctaTextOptional
			ctaLinkOptional
		}
	}
`;
