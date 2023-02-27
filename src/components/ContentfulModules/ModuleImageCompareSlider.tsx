import * as React from 'react';
import { Component } from 'react';
// @ts-ignore
import * as styles from './ModuleImageCompareSlider.module.scss';
// @ts-ignore
import { ContentfulModuleImageCompareSliderFragment } from '../../gatsby-queries';
import { ImgComparisonSlider } from '@img-comparison-slider/react';
// @ts-ignore
import ViewableMonitor from '../ui/ViewableMonitor';
import { graphql } from 'gatsby';

class ModuleImageCompareSlider extends Component<{ data: ContentfulModuleImageCompareSliderFragment }> {
	render() {
		return (
			<ViewableMonitor>
				<div className={`${styles.wrapper} module-margin`}>
					<ImgComparisonSlider className={styles.img_comparison_slider}>
						<img slot="before" alt={this.props.data.rightImage?.title} src={this.props.data.rightImage?.file.url} />
						<img slot="after" alt={this.props.data.leftImage?.title} src={this.props.data.leftImage?.file.url} />
						<div slot="handle" className={styles.__rcs_handle_button}>
							<div className={styles.__rcs_handle_icon_left}>
							</div>
							<div className={styles.__rcs_handle_icon_right}>
							</div>
						</div>
					</ImgComparisonSlider>
					{
						// @ts-ignore
						(this.props.data.caption) && (
							<div className={styles.caption}>
								<p>
									{
									// @ts-ignore
									this.props.data.caption.caption && this.props.data.caption.caption}
								</p>
							</div>
						)
					}
				</div>
			</ViewableMonitor>
		);
	}
}

export default ModuleImageCompareSlider;

export const query = graphql`
	fragment ContentfulModuleImageCompareSliderFragment on ContentfulModuleImageCompareSlider {
		id
		caption {
			caption
		}
		leftImage {
			title
			file {
                url
            }
		}
		rightImage {
			title
			file {
                url
            }
		}
	}
`;