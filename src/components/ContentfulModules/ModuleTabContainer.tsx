import * as React from 'react';
import { Component } from 'react';
import * as styles from './ModuleTabContainer.module.scss';
import { ContentfulEventPreviewFragment, ContentfulModuleTabContainerFragment, ContentfulModuleWrapperFragment, PageVerticalQuery_allContentfulPageProgram } from '../../gatsby-queries';
import ModulesWrapper from '../ModulesWrapper';
import { gsap, Power1, Sine, TweenMax } from 'gsap/dist/gsap.min'
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin';
import { graphql } from 'gatsby';

const initialState = { selectedIndex: 0, open: false };
type State = Readonly<typeof initialState>;

class ModuleTabContainer extends Component<
	{
		data: ContentfulModuleTabContainerFragment;
		upcomingEventsData: ContentfulEventPreviewFragment[];
		programsListData?: PageVerticalQuery_allContentfulPageProgram;
		languageCode: 'en-US' | 'ar-QA';
        wcPage?: boolean;
	},
	State
> {
	readonly state: State = initialState;

	private tabContainerWrapper: HTMLDivElement;
	private tabContainers: HTMLDivElement[] = [];
    
    componentDidMount() {
        gsap.registerPlugin(ScrollToPlugin);
        if(this.props.wcPage && window.location.hash) {
            let selectedTab = document.getElementById(window.location.hash)
            selectedTab.click()
            // @ts-ignore
            this.setState({ selectedIndex: Number(selectedTab.dataset.index) });
        
            window.setTimeout(() => {
                gsap.to(window, { duration: 0.5, scrollTo: { y: '#wcTab', offsetY: 30, autoKill: false }, ease: 'easeInOut' });
            }, 0); 
        }
    }

	private clickedTabItem = event => {
		if (event.key === 'Enter' || event.type === 'click') {
			if (event) {
				event.preventDefault();
                this.setState({
                    open: true
                })
				const newIndex = parseInt(event.target.dataset.index);

                if(this.props.wcPage) {
                    let tabSectionFooter = document.getElementById('tabSectionFooter')
                    if(newIndex === 0) {
                        tabSectionFooter.classList.remove('color-orange')
                        tabSectionFooter.classList.remove('color-purple')
                        tabSectionFooter.classList.add('color-maroon')
                    } else if(newIndex === 1) {
                        tabSectionFooter.classList.add('color-orange')
                        tabSectionFooter.classList.remove('color-purple')
                        tabSectionFooter.classList.remove('color-maroon')
                    } else if(newIndex === 2) {
                        tabSectionFooter.classList.remove('color-orange')
                        tabSectionFooter.classList.add('color-purple')
                        tabSectionFooter.classList.remove('color-maroon')
                    }
                    window.location.hash = event.target.id;
                }
				
				if (this.state.selectedIndex !== newIndex) {
					TweenMax.set(this.tabContainerWrapper, { height: this.tabContainerWrapper.clientHeight });

					const oldIndex = this.state.selectedIndex;
					const newTabContainer = this.tabContainers[newIndex];
					const oldTabContainer = this.tabContainers[oldIndex];

					

					newTabContainer.style.display = 'block';
					const newHeight = newTabContainer.clientHeight;
					newTabContainer.style.display = 'none';

					TweenMax.to(oldTabContainer, 0.45, { opacity: 0, ease: Sine.easeOut });
					TweenMax.to(this.tabContainerWrapper, 0.45, {
						height: newHeight,
						ease: Power1.easeOut,
						onComplete: () => {
							oldTabContainer.style.display = 'none';
							newTabContainer.style.display = 'block';
							TweenMax.to(newTabContainer, 0.75, { opacity: 1, ease: Sine.easeOut });
							TweenMax.set(this.tabContainerWrapper, { height: 'auto' });
                            newTabContainer.style.position = 'unset'
                            newTabContainer.style.top = 'unset'
                            newTabContainer.style.left = 'unset'
						}
					});

					window.setTimeout(() => {
                        // @ts-ignore
						document.querySelector(`#tabContainer-${newIndex} #persona-0`) && document.querySelector(`#tabContainer-${newIndex} #persona-0`).focus()
					}, 500); 

					this.setState({ selectedIndex: newIndex });

					
					
				}
			}
		}
	};

	render() {
		return (
			<>
                {
                    this.props.wcPage ? (
                        <div className={styles.wcTabsWrapper} id='wcTab'>
                            <ul className={`${styles.tabList} container-padding`}>
                                {this.props.data.moduleWrappers.map((moduleWrapper, index) => {
                                    const activeClass = this.state.selectedIndex === index ? ' ' + styles.active : '';
                                    return (
                                        <li className={`${styles.wcTab}`}>
                                            <div>
                                                {
                                                    // @ts-ignore
                                                    <a href={`#tabItem-${index}`} id={`#${moduleWrapper.hashIdentifier}`} onKeyDown={this.clickedTabItem} onClick={this.clickedTabItem} tabIndex={0} data-index={index} className={styles.tabItem + activeClass} key={moduleWrapper.id}>
                                                        {moduleWrapper.titleForBackendOverviewPurposesOnly}
                                                    </a>
                                                }
                                            </div>
                                            <div className={`text-style-h3 container-padding ${styles.wcTabIntro} ${activeClass}`}>
                                                <p>
                                                    {
                                                        // @ts-ignore
                                                        moduleWrapper.introText?.introText
                                                    }
                                                </p>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                            <div ref={ref => (this.tabContainerWrapper = ref)} className={styles.tabContainersWrapper + ' module-margin-small'}>
                                {this.props.data.moduleWrappers.map((moduleWrapper, index) => {
                                    return (
                                        <div id={`tabContainer-${index}`} ref={ref => (this.tabContainers[index] = ref)} key={moduleWrapper.id} className={`${styles.tabContainer} container-padding`}>
                                            <ModulesWrapper
                                                languageCode={this.props.languageCode}
                                                programsListData={this.props.programsListData}
                                                upcomingEventsData={this.props.upcomingEventsData}
                                                className={'nested-container'}
                                                data={[moduleWrapper as ContentfulModuleWrapperFragment]}
                                                tabbed={this.state.open}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                    <div className={`module-margin`}>
                        <h3 className={`text-style-h2 ${styles.title}`}>
                            { this.props.data.title }
                        </h3>
                        <ul className={styles.tabList}>
                            {this.props.data.moduleWrappers.map((moduleWrapper, index) => {
                                const activeClass = this.state.selectedIndex === index ? ' ' + styles.active : '';
                                return (
                                    // @ts-ignore
                                    <li id={`tabItem-${index}`} onKeyDown={this.clickedTabItem} onClick={this.clickedTabItem} tabIndex={0} data-index={index} className={styles.tabItem + activeClass} key={moduleWrapper.id}>
                                        {moduleWrapper.titleForBackendOverviewPurposesOnly}
                                    </li>
                                );
                            })}
                        </ul>
                        <div ref={ref => (this.tabContainerWrapper = ref)} className={styles.tabContainersWrapper + ' module-margin-small'}>
                            {this.props.data.moduleWrappers.map((moduleWrapper, index) => {
                                return (
                                    <div id={`tabContainer-${index}`} ref={ref => (this.tabContainers[index] = ref)} key={moduleWrapper.id} className={styles.tabContainer}>
                                        <ModulesWrapper
                                            languageCode={this.props.languageCode}
                                            programsListData={this.props.programsListData}
                                            upcomingEventsData={this.props.upcomingEventsData}
                                            className={'nested-container'}
                                            data={[moduleWrapper as ContentfulModuleWrapperFragment]}
                                            tabbed={this.state.open}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
			</>
		);
	}
}

export default ModuleTabContainer;

export const query = graphql`
	fragment ContentfulModuleTabContainerFragment on ContentfulModuleTabContainer {
		id
        title
		moduleWrappers {
			id
			titleForBackendOverviewPurposesOnly
            hashIdentifier
            introText {
                introText
            }
			modules {
				__typename
				...ContentfulModuleSectionIntroductionFragment
                ...ContentfulModuleRichBodyTextFragment
				...ContentfulModuleBodyTextFragment
				...ContentfulModuleQuoteFragment
				...ContentfulModuleFaqListFragment
				...ContentfulModuleVideoEmbeddedFragment
				...ContentfulModuleVideoYouTubeFragment
				...ContentfulModuleImageGalleryFragment
				...ContentfulModuleImageBodyFragment
				...ContentfulModule2ImagesFragment
				...ContentfulModuleMediaDownloadListFragment
				...ContentfulModuleStatisticFragment
				...ContentfulModuleTextImageHighlightFragment
				...ContentfulModuleOneColumnTextFragment
				...ContentfulModulePinpointListFragment
				...ContentfulModuleSectionTitleDividerFragment
				...ContentfulModuleHighlightedPersonasFragment
				...ContentfulModuleHighlightedItemsFragment
				...ContentfulModuleUpcomingEventsFragment
				...ContentfulModuleSideScrollerStoryListFragment
				...ContentfulModuleHighlightedEntitiesFragment
				...ContentfulModule2FeaturedPageLinksFragment
				...ContentfulModuleFeaturedPageLinkFragment
				...ContentfulModuleCtaLinkFragment
                ...ContentfulModuleCfFormFragment
                ...ContentfulModuleHeadingSummaryWithButtonsFragment
                ...ContentfulModuleEventsTextboxFragment
                ...ContentfulModuleLatestTapStoriesFragment
			}
		}
	}
`;
