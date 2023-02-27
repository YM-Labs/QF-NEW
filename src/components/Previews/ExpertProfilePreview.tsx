import * as React from 'react';
import * as styles from './ExpertProfilePreview.module.scss';
import { GatsbyImageWrapper } from '../ui/GatsbyImageWrapper';
import { PageOverviewQuery } from '../../gatsby-queries';
import { FormattedMessage } from 'react-intl';
import Link from 'gatsby-link';
import * as stylesPage from '../../ui/Modal.module.scss';
import ViewableMonitor from '../../components/ui/ViewableMonitor';
import ReactModal from 'react-modal';
ReactModal.setAppElement('#___gatsby');

interface Props {
	className?: string;
	url?: string;
	title: string;
	filterData?: PageOverviewQuery;
	filter_expert_subjects?: string[] | string;
    filter_expert_expertise?: string[] | string;
	filter_entity?: string[] | string;
	introText?: string;
	description?: string;
	category?: string;
	imageBasePath: string;
	name: string;
	ecss?: boolean;
}

const initialState = { showModal: false };
type State = any;

export class ExpertProfilePreview extends React.Component<Props, State> {
	readonly state: State = initialState;

	constructor (props) {
		super(props);
		this.state = {
		  showModal: false
		};
		
		this.handleOpenModal = this.handleOpenModal.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
	}

	handleOpenModal (e) {
		e.preventDefault();
		this.setState({ showModal: true });
	}
	  
	handleCloseModal () {
		this.setState({ showModal: false });
	}
	public render() {
		const imageHeight = '&h=490&fit=fill';
		const expertSubjects = Array.isArray(this.props.filter_expert_subjects) ? this.props.filter_expert_subjects : [this.props.filter_expert_subjects];
		const subjectsString = expertSubjects && (expertSubjects as string[]).map(value => this.props.filterData?.allContentfulFilterExpertProfileSubject?.edges.find((edge => {
			if (edge.node.contentful_id === value) {
				return true;
			}
		}))).map(edge => edge?.node.title);
		const entities = Array.isArray(this.props.filter_entity) ? this.props.filter_entity : [this.props.filter_entity];
		// @ts-ignore
		const entitiesString = entities && (entities as string[]).map(value => this.props.filterData?.allContentfulEntities.edges.find((edge => {
			if (edge.node.contentful_id === value) {
				return true;
			}
		}))).map(edge => edge?.node.title).join(' | ');
		const intro = this.props.ecss ? this.props.introText : this.props.description
		const content = (
			<div className={styles.wrapperItem}>
				{this.props.imageBasePath && (
					<GatsbyImageWrapper
                        image={{
                        layout: 'fullWidth',
                        images: {
                            sources: [
                            {
                                sizes: "100vw",
                                srcSet: `${this.props.imageBasePath}?w=400${imageHeight}&fm=webp 400w`,
                                type: "image/webp",
                            },
                            ],
                        },
                        width: 400,
                        height: 490,
                        }
                    }
                        alt={this.props.title}
                    />
				)}
				<div className={styles.textWrapper}>
					<div className={styles.textWrapperInner}>
					<h2 className={`${styles.name}`}>{this.props.name}</h2>
					<h3 className={`${styles.title}`}>{this.props.title}</h3>
					<div className={styles.itemInfo}>
						{!subjectsString.includes(undefined) && subjectsString.join('   |   ')}
					</div>
					{intro && <p className={styles.description}>{intro}</p>}
					</div>
					<div className={styles.itemInfoReadMore}>
						<div></div>
						<div className={`text-style-body ${styles.ctaLink}`}>
							<span><FormattedMessage id={'read_more'} /></span>
						</div>
					</div>
				</div>
			</div>
		);

		return (
			<>
				{
					this.props.ecss && (
						<div data-clickable="true" className={stylesPage.wrapper + (this.props.className ? ' ' + this.props.className : '')}>
							<ReactModal 
								isOpen={this.state.showModal}
								contentLabel=""
								onRequestClose={this.handleCloseModal}
								style={{
									overlay: {
										zIndex: 9999,
									},
									content: {
										left: 0,
										top: 0,
										bottom: 0,
										right: 0,
										border: 0,
										borderRadius: 0,
										background: 'transparent !important'
									}
								}}
								closeTimeoutMS={600}
								>
								<div className="overlay"></div>
								<div className="content">
									<div className={`bg_sand ${stylesPage.wrapper}`}>
										<div className={stylesPage.topWrapper}>
											<div className={stylesPage.topSection}>
												<div className={`${stylesPage.topSectionText}`}>
													<div className={stylesPage.imageWrapper}>
													{this.props.imageBasePath && (
														<GatsbyImageWrapper
                                                            image={{
                                                            layout: 'fullWidth',
                                                            images: {
                                                                sources: [
                                                                {
                                                                    sizes: "100vw",
                                                                    srcSet: `${this.props.imageBasePath}?w=400${imageHeight}&fm=webp 400w`,
                                                                    type: "image/webp",
                                                                },
                                                                ],
                                                            },
                                                            width: 400,
                                                            height: 490,
                                                            }}
                                                            style={{ width: "100%" }}
                                                            alt={this.props.title}
                                                        />
													)}
													</div>
													<div className={stylesPage.introTextWrapper}>
														<div className={stylesPage.introInfo}>
															<h1 className={stylesPage.name}>{this.props.name}</h1>
															<h2 className={stylesPage.title}>{this.props.title}</h2>
														</div>
														<div className={`extra-margin-small ${stylesPage.bioTextWrapper}`} dangerouslySetInnerHTML={{ __html: this.props.description }} />
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className={stylesPage.top}>
										<div onClick={this.handleCloseModal} className={stylesPage.closeIcon} tabIndex={0}>
											<svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
												<g fill="none" fillRule="evenodd">
													<g className={stylesPage.close}>
														<path d="M6.72 6.01l6-6.01.72.7-6.02 6.02 6.02 6-.71.72-6.01-6.02L.7 13.44 0 12.73l6.01-6.01L0 .7.7 0l6.02 6.01z" />
													</g>
												</g>
											</svg>
										</div>
									</div>
								</div>

							</ReactModal>
						</div>
					)
				}
				<ViewableMonitor>
					<div data-clickable="true" className={styles.wrapper + (this.props.className ? ' ' + this.props.className : '')}>
						{this.props.url && this.props.ecss ? <a href={'#'} onClick={(e) => { this.handleOpenModal(e) }}>{content}</a> : <Link to={this.props.url}>{content}</Link>}
						{!this.props.url && content}
					</div>
				</ViewableMonitor>
			</>
		);
	}
}
