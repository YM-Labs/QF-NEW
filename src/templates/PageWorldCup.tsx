import * as React from 'react';
import * as styles from './PageWorldCup.module.scss';
import * as stylesPage from '../ui/Modal.module.scss';
// @ts-ignore
import { PageWorldCupQuery } from '../gatsby-queries';
import PageWrapper, { IPageProps } from './PageWrapper';
import ModulesWrapper from '../components/ModulesWrapper';
import ModuleTabContainer from '../components/ContentfulModules/ModuleTabContainer'
import { Helmet } from 'react-helmet';
import { GatsbyImageWrapper } from '../components/ui/GatsbyImageWrapper';
import { graphql } from 'gatsby';
import { FormattedMessage, injectIntl, useIntl } from 'react-intl';
import { gotoClickHandler } from '../utils/PageUtils';
import ModuleVideoYouTube from '../components/ContentfulModules/ModuleVideoYouTube';
import { StaticImage } from "gatsby-plugin-image"
import ReactModal from 'react-modal';
ReactModal.setAppElement('#___gatsby');
interface Props extends IPageProps {
    intl: ReturnType<typeof useIntl>;
	data: PageWorldCupQuery;
}

const initialState = { showAllResultsLink: false, showModal: false };
type State = Readonly<typeof initialState>;

class PageWorldCup extends React.Component<Props, State> {
    readonly state: State = initialState;

    componentDidMount() {
		this.handleOpenModal = this.handleOpenModal.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);

        // @ts-ignore
        document.getElementById('bgvid-wc').play();
    }

    handleOpenModal (e) {
		e.preventDefault();
		this.setState({ showModal: true });
	}

	handleCloseModal () {
		this.setState({ showModal: false });
	}

	render() {
        const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
		const pageData = this.props.data.contentfulPageWorldCup;
        let modules = [];
		if (pageData.modulesWrapper) {
			pageData.modulesWrapper.forEach(moduleWrapper => modules.push(...moduleWrapper.modules));
		}
        let sections = [];
		modules.map(module => {
			if (module.__typename === 'ContentfulModuleSectionIntroduction' && !module.hideSectionNumber) {
				sections.push(module);
			}
		});

		return (
			<PageWrapper location={this.props.location} pageData={pageData} type={'overview'} title={pageData.title} pageContext={this.props.pageContext}>
				{
					//@ts-ignore:
					<Helmet htmlAttributes={{class: 'noOverflowHidden'}}>
                        {
                            //@ts-ignore:
                            pageData.metaTitle && <title>{pageData.metaTitle}</title>
                        }
                        {
						//@ts-ignore:
						pageData.metaDescription && ( <meta name="description" content={pageData.metaDescription.metaDescription} /> )}
                        <meta
                            className="swiftype"
                            name="tags_vertical"
                            data-type="enum"
                            content="Community"
                        />
						<meta className="swiftype" name="type" data-type="enum" content="page" />
					</Helmet>
				}
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
                    <div className={`content ${styles.popupWrapper}`}>
                        <div className={`bg_sand ${styles.popup}`}>
                            <div className={styles.popupVideoWrapper}>
                                {
                                    // @ts-ignore
                                    <ModuleVideoYouTube data={pageData.fullVideo} compact={true} />
                                }
                            </div>
                        </div>
                        <div className={stylesPage.top}>
                            <div onClick={this.handleCloseModal} className={`${stylesPage.closeIcon} ${styles.closeIcon}`} tabIndex={0}>
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
                <div className={styles.videoWrapper}>
                    {
                        // @ts-ignore
                        <GatsbyImageWrapper loading='eager' id="placeholder" alt={pageData.backgroundVideo.image.title} outerWrapperClassName={`${styles.placeHolder}`} image={pageData.backgroundVideo.image} />
                    }
                    {
                        <video 
                            id={`bgvid-wc`} 
                            muted 
                            playsInline 
                            preload="true" 
                            autoPlay={true}
                            loop 
                            src={isMobile ? pageData.backgroundVideo.mobileVideoUrl : pageData.backgroundVideo.videoUrl} 
                        />
                    }
                </div>
                <div className={`${styles.contentWrapper}`}>
                    <div className={`${styles.bgWrapper} container-padding`}>
                        <div className={styles.wrap}>
                            <div className={styles.logo}>
                                <StaticImage
                                    src="../assets/images/football_for_all_logo.png"
                                    placeholder="none"
                                    width={119}
                                    height={118}
                                    alt="football_for_all_logo"
                                />
                            </div>
                            <div className={styles.wcHeading}>
                                <h1 className={`text-style-h1`}>
                                    {pageData.title}
                                </h1>
                                <a href='#' onClick={(e) => { this.handleOpenModal(e) }} className={`${styles.btnWatchFullVideo} ${styles.ctaLink}`}>
                                    <span>
                                        <FormattedMessage id='Watch video' />
                                        {
                                            this.props.pageContext.languageCode === 'en-US' && <span className='extraSpace'></span>
                                        }
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`${styles.tabsWrapper}`}>
                    <ModuleTabContainer
                        languageCode={this.props.pageContext.languageCode}
                        data={pageData.tabs}
                        programsListData={null}
                        upcomingEventsData={this.props.pageContext.upcomingEvents}
                        wcPage={true}
                    />
                </div>
                <div id='tabSectionFooter' className={`${styles.tabSectionFooter}`}>
                    <a
                        title={this.props.intl.formatMessage({ id: 'Gototopbuttontitle' })}
                        aria-label={this.props.intl.formatMessage({ id: 'Gototopbuttonarialabel' })}
                        className={styles.topArrow}
                        onClick={(e) => gotoClickHandler(0, e)}
                        href="#top"
                    />
                </div>
				<div className={`container ${styles.wrapper}`}>
					<ModulesWrapper
						languageCode={this.props.pageContext.languageCode}
						upcomingEventsData={this.props.pageContext.upcomingEvents}
						hasHeroImage={false}
						// @ts-ignore
						data={this.props.data.contentfulPageWorldCup.modulesWrapper}
                        // @ts-ignore
                        slug={pageData.slug}
					>
                    </ModulesWrapper>
				</div>
			</PageWrapper>
		);
	}
}

export default injectIntl(PageWorldCup);

export const pageQuery = graphql`
	query PageWorldCupQuery($id: String, $languageCode: String) {
		contentfulPageWorldCup(contentful_id: { eq: $id }, node_locale: { eq: $languageCode }) {
			id
			title
            slug
			hideCountdown
            backgroundVideo {
				title {
					title
				}
				subtitle {
					subtitle
				}
                image {
                    title
                    gatsbyImageData(
                        placeholder: NONE
                        width: 1680
                        quality: 85
                        layout: FULL_WIDTH
                    )
                }
				useVideo
				videoUrl
				mobileVideoUrl
				ctaText
				ctaLink {
					ctaLink
				}
			}
            fullVideo {
                ... on ContentfulModuleVideoYouTube {
                    __typename
                    ...ContentfulModuleVideoYouTubeFragment
                }
            }
            modulesWrapper {
				...ContentfulModuleWrapperFragment
			}
            tabs {
                __typename
                ...ContentfulModuleTabContainerFragment
            }
            metaTitle
			metaDescription {
				metaDescription
			}
        }
	}
`;