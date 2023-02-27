import { PageOverviewQuery } from '../gatsby-queries';
import { GatsbyImageWrapper } from './ui/GatsbyImageWrapper';
import { FormattedDate } from 'react-intl';
import * as React from 'react';
import * as styles from './MediaGalleryList.module.scss';
import { getPagePath } from '../utils/URLHelper';
import { humanFileSize, humanFiletype } from '../utils/StringUtils';

const initialState = { selectedIndex: -1, selectedFilterId: null };
type State = Readonly<typeof initialState>;

export class MediaGalleryList extends React.Component<{ data: PageOverviewQuery; logoMode:boolean }, State> {
	readonly state: State = initialState;
    // @ts-ignore
	private clickedTabItem = event => {
		if (event.key === 'Enter' || event.type === 'click') {
			if (event) {
				event.preventDefault();
				const newIndex = parseInt(event.target.dataset.index);
				if (this.state.selectedIndex !== newIndex) {
					this.setState({ selectedIndex: newIndex, selectedFilterId: newIndex === -1 ? null : this.filters[newIndex].id});
				}
			}
		}
	};
	private filters: any[];

	constructor(props) {
		super(props);
		this.filters = [];
		if (this.props.logoMode) {
			this.props.data.allContentfulLogo.edges.forEach((media) => media.node.tags?.forEach(filter => {
				this.filters[filter.id] = filter;
			}));
		} else {
			this.props.data.allContentfulMediaGallery.edges.forEach((media) => media.node.filterTags?.forEach(filter => {
				this.filters[filter.id] = filter;
			}));
		}
		this.filters = Object.values(this.filters);

	}

	render() {
		return <div className={`module-margin-small ${styles.wrapper}`}>
			{
                /*
                <ul className={styles.filterList}>
                    <li onKeyDown={this.clickedTabItem} onClick={this.clickedTabItem} tabIndex={0} data-index={-1} className={styles.tabItem + (this.state.selectedIndex === -1 ? ' ' + styles.active : '')}>
                        <FormattedMessage id={'all_galleries'} />
                    </li>
                    {this.filters.map((filter, index) => {
                        const activeClass = this.state.selectedIndex === index ? ' ' + styles.active : '';
                        return (
                            // @ts-ignore
                            <li onKeyDown={this.clickedTabItem} onClick={this.clickedTabItem} tabIndex={0} data-index={index} className={styles.tabItem + activeClass} key={filter.id}>
                                {filter.title}
                            </li>
                        );
                    })}
                </ul>
                */
            }
			<div className={`module-margin-small ${styles.imagesWrapper}`}>
				{!this.props.logoMode && this.props.data.allContentfulMediaGallery.edges.map((media, index) => {
					const dateItem = new Date(media.node.date);
					return (
						<a className={(this.state.selectedIndex === -1 || media.node.filterTags?.findIndex((value => value.id === this.state.selectedFilterId)) !== -1) ? styles.visible : styles.hidden} href={getPagePath(media.node.slug, 'mediaGallery')} key={media.node.id + index}>
                            {
                                // @ts-ignore
							    <GatsbyImageWrapper alt={media.node.mediaGalleryTitle?.mediaGalleryTitle} image={media.node.medias && media.node.medias[0].thumb} />
                            }
							<div className={styles.infoWrapper}>
                                <span className={styles.title}>{media.node.mediaGalleryTitle?.mediaGalleryTitle}</span>
								<span className={styles.date}>{dateItem.getDate()} <FormattedDate value={dateItem} month="short" /> {dateItem.getFullYear()}</span>
							</div>
						</a>
					);
				})}
				{this.props.logoMode && this.props.data.allContentfulLogo.edges.map((media, index) => {
					return (
						<a className={styles.logoWrapper + ' ' + ((this.state.selectedIndex === -1 || media.node.tags?.findIndex((value => value.id === this.state.selectedFilterId)) !== -1) ? styles.visible : styles.hidden)} key={media.node.contentful_id + index} download href={media.node.file?.file?.url}>
                            {
                                // @ts-ignore
							    <GatsbyImageWrapper alt={media.node.title} outerWrapperClassName={styles.logo} image={media.node.preview?.thumb} />
                            }
							<div className={styles.infoWrapper}>
								<span className={styles.title}>{media.node.title}</span>
								<span className={styles.date}>{humanFiletype(media.node.file?.file && media.node.file?.file?.url)+" - " +humanFileSize(media.node.file?.file && media.node.file?.file?.details?.size, true)}</span>
							</div>
						</a>
					);
				})}
			</div>
		</div>;
	}
}
