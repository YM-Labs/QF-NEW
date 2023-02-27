import * as React from 'react';
import { Component } from 'react';
import * as styles from './ModuleImageGrid.module.scss';
import { ContentfulModuleImageGridFragment, ContentfulModuleImageGridFragment_items } from '../../gatsby-queries';
import ViewableMonitor from '../ui/ViewableMonitor';
import { GatsbyImageWrapper } from '../ui/GatsbyImageWrapper';
import { graphql } from 'gatsby';

const initialState = { open: false };
type State = Readonly<typeof initialState>;

class ImageGridItem extends Component<{ data: ContentfulModuleImageGridFragment_items }, State> {
	readonly state: State = initialState;

	render() {
		return (
			<div className={styles.listItem}>
				<span className={`text-style-detail-1`}>
				{ 
					// @ts-ignore
					<GatsbyImageWrapper alt={this.props.data.image && this.props.data.image.title} image={this.props.data.image && this.props.data.image} />
				}
				</span>
				<h3 className={`text-style-h3 ${styles.title}`}>{this.props.data.title}</h3>
				<div>
						<p className={`text-style-body`}>
							{ this.props.data.description.description }
						</p>
				</div>
			</div>
		);
	}
}

class ModuleImageGrid extends Component<{ data: ContentfulModuleImageGridFragment }> {
	render() {
		return (
			<ViewableMonitor>
				<div className={`module-margin`}>
					<div className={styles.listWrapper}>
						{this.props.data.items.map(question => (
							<ImageGridItem key={question.id} data={question} />
						))}
					</div>
				</div>
			</ViewableMonitor>
		);
	}
}

export default ModuleImageGrid;

export const query = graphql`
	fragment ContentfulModuleImageGridFragment on ContentfulModuleImageGrid {
		id
		items {
			id
			title
			description {
				description
			}
			image {
                title
				gatsbyImageData(
                    placeholder: NONE
                    height: 328
                    width: 500
                    quality: 85
                  )
			}
		}
	}
`;
