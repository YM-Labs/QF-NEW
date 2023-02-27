import * as React from 'react';
import * as styles from './EntryPreview.module.scss';
import { FormattedMessage } from 'react-intl';
import Link from 'gatsby-link';
import { GatsbyImageWrapper } from '../ui/GatsbyImageWrapper';
import { StaticImage } from "gatsby-plugin-image"

export class EntryPreview extends React.Component<{
	aspectRatio?: number;
	className?: string;
	url?: string;
	title: string;
	description: string;
	category: string;
	vertical: string;
	imageBasePath: string;
}> {
	public render() {
		const imageHeight = this.props.aspectRatio ? '&h=1000' : '&h=472&fit=fill';
		const category = this.props.category ? this.props.category : 'entity';
		const content = (
			<div>
				{this.props.imageBasePath ? (
					<GatsbyImageWrapper
                        image={{
                        layout: 'fullWidth',
                        images: {
                            sources: [
                            {
                                sizes: "100vw",
                                srcSet: `${this.props.imageBasePath}?w=800${imageHeight}&fm=webp 800w`,
                                type: "image/webp",
                            },
                            ],
                        },
                        width: 400,
                        height: 236,
                        }}
                        alt={this.props.title}
                    />
				) : (
                    <StaticImage
                        src="../../assets/images/placeholder-image.png"
                        alt="Placeholder Image"
                        width={400}
                        height={236}
                    />
                )}
				<div className={styles.itemInfo}>
					{
						(category !== 'spokes_people') && (
							(category === 'ecss') ? (
								<span className={styles.category}>
									<FormattedMessage id={'ecss_title'} />
								</span>
							) : (
								<span className={styles.category}>
									<FormattedMessage id={'singular_' + category} />
								</span>
							)

						)
					}
					{this.props.vertical && <FormattedMessage id="in" />}
					{this.props.vertical && <FormattedMessage id={this.props.vertical} />}
				</div>
				<h1 className={`text-style-h3 ${styles.title}`}>{this.props.title}</h1>
				{this.props.description && <p className={category === 'spokes_people' ? styles.description : null}>{this.props.description}</p>}
			</div>
		);

		return (
			<div data-clickable="true" className={styles.wrapper + (this.props.className ? ' ' + this.props.className : '')}>
				{this.props.url && <Link to={this.props.url}>{content}</Link>}
				{!this.props.url && content}
			</div>
		);
	}
}
