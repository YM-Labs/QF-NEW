import * as React from 'react';
import { Component } from 'react';
import * as styles from './Module4Columns.module.scss';
// @ts-ignore
import { ContentfulModule4ColumnsFragment } from '../../gatsby-queries';
//import ViewableMonitor from '../ui/ViewableMonitor';
import { GatsbyImageWrapper } from '../ui/GatsbyImageWrapper';
import { graphql } from 'gatsby';
import GatsbyLink from 'gatsby-link';

class Module4Columns extends Component<{ data: ContentfulModule4ColumnsFragment }> {
	render() {
		return (
			<div id='four-column-module' className={`module-margin ${styles.wrapper} ${styles.length4}`}>
				<ul className={styles.listWrapper}>
					<>
						<li className={`${styles.listItem}`}>
							{
								// @ts-ignore
								<GatsbyLink to={this.props.data.firstLink}>
									<h2 className={`text-style-h3 ${styles.title}`}>{this.props.data.firstTitle}</h2>
									<span className={`text-style-detail-1 ${styles.detail}`}>
									{ 
										// @ts-ignore
										<GatsbyImageWrapper alt={this.props.data.firstImage && this.props.data.firstImage.title} image={this.props.data.firstImage && this.props.data.firstImage} />
									}
									</span>
									<div className={styles.descriptionWrapper}>
										<div>
											<div className={`text-style-body`} dangerouslySetInnerHTML={{ __html: this.props.data.firstDescription.firstDescription }} />
										</div>
									</div>
								</GatsbyLink>
							}
						</li>
						<li className={`${styles.listItem}`}>
							{
								// @ts-ignore
								<GatsbyLink to={this.props.data.secondLink}>
									<h2 className={`text-style-h3 ${styles.title}`}>{this.props.data.secondTitle}</h2>
									<span className={`text-style-detail-1 ${styles.detail}`}>
									{ 
										// @ts-ignore
										<GatsbyImageWrapper alt={this.props.data.secondImage && this.props.data.secondImage.title} image={this.props.data.secondImage && this.props.data.secondImage} />
									}
									</span>
									<div className={styles.descriptionWrapper}>
										<div>
											<div className={`text-style-body`} dangerouslySetInnerHTML={{ __html: this.props.data.secondDescription.secondDescription }} />
										</div>
									</div>
								</GatsbyLink>
							}
						</li>
						<li className={`${styles.listItem}`}>
							{
								// @ts-ignore
								<GatsbyLink to={this.props.data.thirdLink}>
									<h2 className={`text-style-h3 ${styles.title}`}>{this.props.data.thirdTitle}</h2>
									<span className={`text-style-detail-1 ${styles.detail}`}>
									{ 
										// @ts-ignore
										<GatsbyImageWrapper alt={this.props.data.thirdImage && this.props.data.thirdImage.title} image={this.props.data.thirdImage && this.props.data.thirdImage} />
									}
									</span>
									<div className={styles.descriptionWrapper}>
										<div>
											<div className={`text-style-body`} dangerouslySetInnerHTML={{ __html: this.props.data.thirdDescription.thirdDescription }} />
										</div>
									</div>
								</GatsbyLink>
							}
						</li>
						<li className={`${styles.listItem}`}>
							{
								// @ts-ignore
								<GatsbyLink to={this.props.data.fourthLink}>
									<h2 className={`text-style-h3 ${styles.title}`}>{this.props.data.fourthTitle}</h2>
									<span className={`text-style-detail-1 ${styles.detail}`}>
									{ 
										// @ts-ignore
										<GatsbyImageWrapper alt={this.props.data.fourthImage && this.props.data.fourthImage.title} image={this.props.data.fourthImage && this.props.data.fourthImage} />
									}
									</span>
									<div className={styles.descriptionWrapper}>
										<div>
											<div className={`text-style-body`} dangerouslySetInnerHTML={{ __html: this.props.data.fourthDescription.fourthDescription }} />
										</div>
									</div>
								</GatsbyLink>
							}
						</li>
					</>
				</ul>
			</div>
		);
	}
}

export default Module4Columns;

export const query = graphql`
	fragment ContentfulModule4ColumnsFragment on ContentfulModule4Columns {
		id
		firstTitle
		firstImage {
			gatsbyImageData(
        placeholder: NONE
        width: 520
        height: 718
        quality: 85
      )
			title
		}
		firstDescription {
			firstDescription
		}
		firstLink
		secondTitle
		secondImage {
			gatsbyImageData(
        placeholder: NONE
        width: 520
        height: 718
        quality: 85
      )
			title
		}
		secondDescription {
			secondDescription
		}
		secondLink
		thirdTitle
		thirdImage {
			gatsbyImageData(
        placeholder: NONE
        width: 520
        height: 718
        quality: 85
      )
			title
		}
		thirdDescription {
			thirdDescription
		}
		thirdLink
		fourthTitle
		fourthImage {
			gatsbyImageData(
        placeholder: NONE
        width: 520
        height: 718
        quality: 85
      )
			title
		}
		fourthDescription {
			fourthDescription
		}
		fourthLink
	}
`;
