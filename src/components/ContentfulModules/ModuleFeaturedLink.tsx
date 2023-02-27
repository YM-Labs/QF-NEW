import * as React from 'react';
import { Component } from 'react';
import * as styles from './ModuleFeaturedLink.module.scss';
import ViewableMonitor from '../ui/ViewableMonitor';
import { GatsbyImageWrapper } from '../ui/GatsbyImageWrapper';

class ModuleFeaturedLink extends Component<{ data: any; }> {
	render() {
		return (
			<div className={`module-margin ${styles.bgGrey}`}>
				<div className={`${styles.imageWrapper}`}>
					{
						// @ts-ignore
						<GatsbyImageWrapper image={this.props.data.image} alt={this.props.data.image?.title} />
					}
				</div>
				<div className={`${styles.innerWrapper}`}>
					<div className={`${styles.wrapper} container-padding`}>
						<ViewableMonitor>
							<div className={`${styles.textWrapper}`}>
								<div className={`text-style-h2`}>
									<h2>{ this.props.data.title }</h2>
								</div>
							</div>
						</ViewableMonitor>
						<ViewableMonitor>
							<div className={`text-style-body ${styles.detailsWrapper}`}>
                                { this.props.data.text }
								<a href={ this.props.data.url } data-swiftype-index="false" className={`text-style-body ${styles.ctaLink}`}>
                                    { this.props.data.ctaText }
                                </a>
							</div>
						</ViewableMonitor>
					</div>
				</div>
			</div>
		);
	}
}

export default ModuleFeaturedLink