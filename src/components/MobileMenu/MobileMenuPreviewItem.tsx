import * as React from 'react';

import * as styles from './MobileMenuSubMenu.module.scss';
import * as stylesPreview from './MobileMenuPreviewItem.module.scss';
import { TimelineMax } from 'gsap/dist/gsap.min';
import { FormattedMessage } from 'react-intl';
import { TopSectionListInfo, TopSectionListItem } from '../../ui/TopSectionListInfo';
import GatsbyLink from 'gatsby-link';
import { ResultItem } from './MobileMenu';
import GatsbyLinkExternalSupport from '../../ui/GatsbyLinkExternalSupport';
import { GatsbyImageWrapper } from '../ui/GatsbyImageWrapper';
import { Globals } from '../../utils/Globals';

export class MobileMenuPreviewItem extends React.Component<{ currentID: string; url: string; currentLanguage: string; menuData: { [key: string]: ResultItem }; closeCallback: (event) => void; isDesktop?: boolean; }> {
	private refWrapper: HTMLDivElement;

	private timeline: TimelineMax;

	private visible = false;

	private currData: ResultItem = undefined;

	public show = instant => {
		if (!this.visible) {
			this.visible = true;

			if (this.timeline) {
				this.timeline.kill();
				this.timeline = null;
			}

			this.timeline = new TimelineMax();
			this.timeline.set(this.refWrapper, { display: 'block' });
			this.timeline.to(this.refWrapper, 0.4, { opacity: 1, pointerEvents: 'all', force3D: true });
			if (instant) {
				this.timeline.progress(1);
			}
		}
	};

	public hide = instant => {
		if (this.visible) {
			this.visible = false;

			if (this.timeline) {
				this.timeline.kill();
				this.timeline = null;
			}

			this.timeline = new TimelineMax();
			this.timeline.set(this.refWrapper, { pointerEvents: 'none' });
			this.timeline.to(this.refWrapper, 0.3, { opacity: 0, force3D: true }, 0);
			this.timeline.set(this.refWrapper, { display: 'none' });
			if (instant) {
				this.timeline.progress(1);
			}
		}
	};

	public getWidth = () => {
		this.refWrapper.style.display = 'block';
		return this.refWrapper.clientWidth;
	};

	public render() {
		if (this.props.menuData && this.props.currentID !== '') {
			if (Globals.CURRENT_LANGUAGE_PREFIX === 'ar/') {
				if (!this.props.currentID.includes('___ar-QA')) {
					this.currData = this.props.menuData[this.props.currentID + '___ar-QA'];
				} else {
					this.currData = this.props.menuData[this.props.currentID];
				}
			} else {
				if (this.props.currentID.includes('___ar-QA')) {
					this.currData = this.props.menuData[this.props.currentID.replace(/___ar-QA/g, '')];
				} else {
					this.currData = this.props.menuData[this.props.currentID];
				}
			}
		}
		const type = this.currData && this.currData.type && this.currData.type.length > 0 ? this.currData.type[0] : undefined;
		const description =
			this.currData &&
			(this.currData.ct === 'entity'
				? this.currData.entityDescription
					? this.currData.entityDescription.entityDescription
					: undefined
				: this.currData.subtitle
				? this.currData.subtitle.subtitle
				: undefined);

		return (
			<div ref={ref => (this.refWrapper = ref)} className={`${styles.wrapper} ${this.props.isDesktop ? stylesPreview.mainMenuPreviewDesktopWrapper : '' } ${styles.mainMenuPreviewWrapper}`}>
				<div className={styles.menuColumnWrapper + ' ' + styles.subMenu}>
					{this.currData && (
						<div className={stylesPreview.wrapper}>
							{this.currData.heroImage && (
								<GatsbyImageWrapper
                                    image={{
                                        layout: 'fullWidth',
                                        images: {
                                        sources: [
                                            {
                                            sizes: "100vw",
                                            srcSet: `${this.currData.heroImage.file.url}?w=800&h=472&fit=fill&fm=webp 800w`,
                                            type: "image/webp",
                                            },
                                        ],
                                        },
                                        width: 400,
                                        height: 236,
                                    }}
                                    alt={this.currData.title}
                                />
							)}
							<div className={stylesPreview.wrapperContent}>
								{type && (
									<div className={stylesPreview.itemInfo}>
										<span className={stylesPreview.category}>
											<FormattedMessage id={'singular_' + type} />
										</span>
										{this.currData.filterVerticalCategory && <FormattedMessage id="in" />}
										{this.currData.filterVerticalCategory && <span>{this.currData.filterVerticalCategory.title}</span>}
									</div>
								)}
								<h3 tabIndex={0} className={`text-style-h3 ${stylesPreview.title}`}>
									{this.currData.title}
								</h3>
								{description && (
									<p tabIndex={0} className={stylesPreview.description}>
										{description}
									</p>
								)}
								<TopSectionListInfo className={stylesPreview.listInfo}>
									{this.currData.phone && (
										<TopSectionListItem
											label={<FormattedMessage id={'Phone'} />}
											value={<a href={'tel:' + this.currData.phone.replace(new RegExp(' ', 'g'), '')}>{this.currData.phone}</a>}
										/>
									)}
									{this.currData.fax && (
										<TopSectionListItem
											label={<FormattedMessage id={'Fax'} />}
											value={<a href={'tel:' + this.currData.fax.replace(new RegExp(' ', 'g'), '')}>{this.currData.fax}</a>}
										/>
									)}
									{this.currData.email && (
										<TopSectionListItem label={<FormattedMessage id={'E-mail'} />} value={<a href={'mailto:' + this.currData.email}>{this.currData.email}</a>} />
									)}
									{this.currData.location && (
										<TopSectionListItem
											label={<FormattedMessage id={'Address'} />}
											value={
												<>
													{this.currData.location.placeAddress}
													<br />
													<br />
													<a target="_blank" className={stylesPreview.directions} href={`https://www.google.com/maps/dir//${this.currData.location.placeAddress}`}>
														<FormattedMessage id="location.get_directions" />
													</a>
												</>
											}
										/>
									)}
									{this.currData.openingHours && <TopSectionListItem label={<FormattedMessage id={'opening_hours'} />} value={this.currData.openingHours.openingHours} />}
									{this.currData.filterEntity && (
										<TopSectionListItem
											label={<FormattedMessage id={'Offered at'} />}
											value={
												<FormattedMessage id="path_entity_base">
													{txt => <GatsbyLink to={txt + this.currData.filterEntity.slug}>{this.currData.filterEntity.title}</GatsbyLink>}
												</FormattedMessage>
											}
										/>
									)}
									{this.currData.filterProgramType && <TopSectionListItem label={<FormattedMessage id={'Type'} />} value={this.currData.filterProgramType.title} />}
									<GatsbyLinkExternalSupport
										activeClassName={styles.currentActivePageLink}
										onClick={this.props.closeCallback}
										to={this.props.url}
										className={`text-style-body ${stylesPreview.ctaLink}`}
										aria-label={this.currData.title}
									>
										<span>
											<FormattedMessage
												id="page.link"
												values={{
													pageName: type && <FormattedMessage id={'singular_' + this.currData.type[0]} />
												}}
											/>
										</span>
									</GatsbyLinkExternalSupport>
								</TopSectionListInfo>
							</div>
						</div>
					)}
				</div>
			</div>
		);
	}
}
