import React from 'react';
import { ContentfulEventPreviewFragment, ContentfulModuleWrapperFragment, PageVerticalQuery_allContentfulPageProgram } from '../gatsby-queries';
import loadable from '@loadable/component'
import { graphql } from 'gatsby';

const ModuleMultipleQuotes = loadable(() => import('./ContentfulModules/ModuleMultipleQuotes'));
const ModuleProcess = loadable(() => import('./ContentfulModules/ModuleProcess'));
const ModuleForm = loadable(() => import('./ContentfulModules/ModuleForm'));
const ModuleCfForm = loadable(() => import('./ContentfulModules/ModuleCfForm'));
import ModuleSectionIntroduction from './ContentfulModules/ModuleSectionIntroduction';
const ModuleBodyText = loadable(() => import('./ContentfulModules/ModuleBodyText'));
const ModuleQuote = loadable(() => import('./ContentfulModules/ModuleQuote'));
const ModuleFaqList = loadable(() => import('./ContentfulModules/ModuleFaqList'));
const ModuleMediaList = loadable(() => import('./ContentfulModules/ModuleMediaList'));
const ModuleImageGrid = loadable(() => import('./ContentfulModules/ModuleImageGrid'));
const ModuleVideoEmbedded = loadable(() => import('./ContentfulModules/ModuleVideoEmbedded'));
const ModuleVideoYouTube = loadable(() => import('./ContentfulModules/ModuleVideoYouTube'));
const ModuleImageGallery = loadable(() => import('./ContentfulModules/ModuleImageGallery'));
const ModuleImageBody = loadable(() => import('./ContentfulModules/ModuleImageBody'));
const Module2Images = loadable(() => import('./ContentfulModules/Module2Images'));
const Module4Columns = loadable(() => import('./ContentfulModules/Module4Columns'));
const ModuleMediaDownloadList = loadable(() => import('./ContentfulModules/ModuleMediaDownloadList'));
const ModuleStatistic = loadable(() => import('./ContentfulModules/ModuleStatistic'));
const ModuleTextImageHighlight = loadable(() => import('./ContentfulModules/ModuleTextImageHighlight'));
import ModuleOneColumnText from './ContentfulModules/ModuleOneColumnText';
const ModulePinpointList = loadable(() => import('./ContentfulModules/ModulePinpointList'));
import ModuleSectionTitleDivider from './ContentfulModules/ModuleSectionTitleDivider';
const ModuleTabContainer = loadable(() => import('./ContentfulModules/ModuleTabContainer'));
const ModuleHighlightedPersonas = loadable(() => import('./ContentfulModules/ModuleHighlightedPersonas'));
const ModuleHighlightedItems = loadable(() => import('./ContentfulModules/ModuleHighlightedItems'));
const ModuleUpcomingEvents = loadable(() => import('./ContentfulModules/ModuleUpcomingEvents'));
const ModuleSideScrollerStoryList = loadable(() => import('./ContentfulModules/ModuleSideScrollerStoryList'));
const ModuleHighlightedEntities = loadable(() => import('./ContentfulModules/ModuleHighlightedEntities'));
const ModuleProgramsList = loadable(() => import('./ContentfulModules/ModuleProgramsList'));
const Module2FeaturedPageLinks = loadable(() => import('./ContentfulModules/Module2FeaturedPageLinks'));
const ModuleFeaturedPageLink = loadable(() => import('./ContentfulModules/ModuleFeaturedPageLink'));
const ModuleCtaLink = loadable(() => import('./ContentfulModules/ModuleCtaLink'));
const ModuleHomeNewsletter = loadable(() => import('./ContentfulModules/ModuleHomeNewsletter'));
const ModuleShortBoxedText = loadable(() => import('./ContentfulModules/ModuleShortBoxedText'));
const ModuleAccordion = loadable(() => import('./ContentfulModules/ModuleAccordion'));
const ModuleBulletPointList = loadable(() => import('./ContentfulModules/ModuleBulletPointList'));
const ModuleImageCompareSlider = loadable(() => import('./ContentfulModules/ModuleImageCompareSlider'));
const MediaGallery = loadable(() => import('./ContentfulModules/MediaGallery'));
const ModuleRichBodyText = loadable(() => import('./ContentfulModules/ModuleRichBodyText'));
const ModuleStatistics = loadable(() => import('./ContentfulModules/ModuleStatistics'));
const ModuleRecentMediaGalleriesLogos = loadable(() => import('./ContentfulModules/ModuleRecentMediaGalleriesLogos'));
const ModuleHeadingSummaryWithButtons = loadable(() => import('./ContentfulModules/ModuleHeadingSummaryWithButtons'));
const ModuleMediaNumberedTextList = loadable(() => import('./ContentfulModules/ModuleMediaNumberedTextList'));
const ModulePoll = loadable(() => import('./ContentfulModules/ModulePoll'));
const ModuleLatestTapStories = loadable(() => import('./ContentfulModules/ModuleLatestTapStories'));
const ModuleEventsTextbox = loadable(() => import('./ContentfulModules/ModuleEventsTextbox'));
class ModulesWrapper extends React.Component<{
	upcomingEventsData: ContentfulEventPreviewFragment[];
	programsListData?: PageVerticalQuery_allContentfulPageProgram;
	childrenLast?: boolean;
	data: ContentfulModuleWrapperFragment[];
	hasHeroImage?: boolean;
	className?: string;
	languageCode: 'en-US' | 'ar-QA';
	slug?: any;
    tabbed?: boolean;
}> {

	public render() {
		let sectionIndex = 0;
		let currModuleTextImageHighlightIndex = 0;
		const animationDirection = this.props.languageCode === 'ar-QA' ? -1 : 1;
		let modules = [];
		if (this.props.data) {
			this.props.data.forEach(function(moduleWrapper) {
				modules = modules.concat(moduleWrapper.modules);
			});
		}

		return (
            <div id={modules[0] ? modules[0].id : null} className={`container no-gutters ${this.props.className ? this.props.className : ''}`}>
                {!this.props.childrenLast && (this.props.slug !== 'media-center' && this.props.slug !== 'education-city-speaker-series') && this.props.children}
                {modules.map((module, index) => {
                    const id = module && module.id + index;
                    if (module && module.__typename !== 'ContentfulModuleTextImageHighlight') {
                        currModuleTextImageHighlightIndex = 0;
                    } else {
                        currModuleTextImageHighlightIndex++;
                    }
                    //@ts-ignore:
                    if ((this.props.slug === 'media-center'|| this.props.slug === 'education-city-speaker-series') && this.props.children && this.props.children.props && this.props.children.props.position === index) {
                        return (
                            <React.Fragment>
                                {this.props.children}
                                {this.props.slug !== 'education-city-speaker-series' && (
                                    <ModuleCtaLink key={id} data={module} />
                                )}
                            </React.Fragment>
                        );
                    }
                    switch (module && module.__typename) {
                        case 'ContentfulModuleSectionIntroduction':
                            !module.hideSectionNumber && sectionIndex++;
                            return (<ModuleSectionIntroduction offsetForHeroImage={index === 0 && this.props.hasHeroImage ? true : false} sectionNumber={sectionIndex} key={id} data={module} />);
                        case 'ContentfulModuleBodyText':
                            return (<ModuleBodyText key={id} data={module} />);
                        case 'ContentfulModuleRichBodyText':
                            return (<ModuleRichBodyText key={id} data={module} />);
                        case 'ContentfulModuleQuote':
                            return (<ModuleQuote key={id} data={module} />);
                        case 'ContentfulModuleFaqList':
                            return (<ModuleFaqList key={id} data={module} />);
                        case 'ContentfulModuleMediaList':
                            return (<ModuleMediaList key={id} data={module} />);
                        case 'ContentfulModuleImageGrid':
                            return (<ModuleImageGrid key={id} data={module} />);
                        case 'ContentfulModuleVideoEmbedded':
                            return (<ModuleVideoEmbedded key={id} data={module} />);
                        case 'ContentfulModuleVideoYouTube':
                            return (<ModuleVideoYouTube key={id} data={module} />);
                        case 'ContentfulModuleImageGallery':
                            return (<ModuleImageGallery animationDirection={animationDirection} key={id} data={module} />);
                        case 'ContentfulModuleImageBody':
                            return (<ModuleImageBody key={id} data={module} />);
                        case 'ContentfulModule2Images':
                            return (<Module2Images key={id} data={module} />);
                        case 'ContentfulModule4Columns':
                            return (<Module4Columns key={id} data={module} />);
                        case 'ContentfulModule2FeaturedPageLinks':
                            return (<Module2FeaturedPageLinks key={id} data={module} />);
                        case 'ContentfulModuleMediaDownloadList':
                            return (<ModuleMediaDownloadList key={id} data={module} />);
                        case 'ContentfulModuleStatistic':
                            return (<ModuleStatistic key={id} data={module} />);
                        case 'ContentfulModuleStatisticS':
                            return (<ModuleStatistics key={id} data={module} />);
                        case 'ContentfulModuleRecentMediaGalleriesLogos':
                            return (<ModuleRecentMediaGalleriesLogos key={id} data={module} />);
                        case 'ContentfulModuleTextImageHighlight':
                            return (<ModuleTextImageHighlight key={id} data={module} index={currModuleTextImageHighlightIndex} />);
                        case 'ContentfulModuleOneColumnText':
                            return (<ModuleOneColumnText key={id} data={module} />);
                        case 'ContentfulModuleCtaLink':
                            return (<ModuleCtaLink key={id} data={module} />);
                        case 'ContentfulModulePinpointList':
                            return (<ModulePinpointList key={id} data={module} />);
                        case 'ContentfulModuleSectionTitleDivider':
                            return (<ModuleSectionTitleDivider key={id} data={module} />);
                        case 'ContentfulModuleTabContainer':
                            return (
                                <ModuleTabContainer
                                    languageCode={this.props.languageCode}
                                    key={id}
                                    data={module}
                                    programsListData={this.props.programsListData}
                                    upcomingEventsData={this.props.upcomingEventsData}
                                />
                            );
                        case 'ContentfulModuleHighlightedPersonas':
                            return (<ModuleHighlightedPersonas key={id} data={module} currentSlug={this.props.slug} />);
                        case 'ContentfulModuleHighlightedItems':
                            return (<ModuleHighlightedItems tabbed={this.props.tabbed} key={id} data={module} />);
                        case 'ContentfulModuleSideScrollerStoryList':
                            return (<ModuleSideScrollerStoryList animationDirection={animationDirection} key={id} data={module} />);
                        case 'ContentfulModuleFeaturedPageLink':
                            return (<ModuleFeaturedPageLink key={id} data={module} />);
                        case 'ContentfulModuleHighlightedEntities':
                            return (<ModuleHighlightedEntities animationDirection={animationDirection} key={id} data={module} />);
                        case 'ContentfulModuleUpcomingEvents':
                            return (<ModuleUpcomingEvents animationDirection={animationDirection} events={this.props.upcomingEventsData} key={id} data={module} />);
                        case 'ContentfulModuleProgramsList':
                            return (this.props.programsListData ? <ModuleProgramsList programs={this.props.programsListData} key={id} data={module} /> : undefined);
                        case 'ContentfulModuleNewsletterSignup':
                            return (<ModuleHomeNewsletter data={module} />);
                        case 'ContentfulModuleShortBoxedText':
                            return (<ModuleShortBoxedText key={id} data={module} />);
                        case 'ContentfulModuleAccordion':
                            return (<ModuleAccordion key={id} data={module} />);
                        case 'ContentfulModuleBulletPointList':
                            return (<ModuleBulletPointList key={id} data={module} />);
                        case 'ContentfulModuleProcess':
                            return (<ModuleProcess key={id} data={module} languageCode={this.props.languageCode} />);
                        case 'ContentfulModuleHeadingSummaryWithButtons':
                            return (<ModuleHeadingSummaryWithButtons key={id} data={module} />);
                        case 'ContentfulModuleMultipleQuotes':
                            return (<ModuleMultipleQuotes key={id} data={module} />);
                        case 'ContentfulModuleMediaNumberedTextList':
                            return (<ModuleMediaNumberedTextList key={id} data={module} />);
                        case 'ContentfulModuleForm':
                            return (<ModuleForm key={id} data={module} />);
                        case 'ContentfulModuleCfForm':
                            return <ModuleCfForm key={id} data={module} languageCode={this.props.languageCode} />;    
                        case 'ContentfulMediaGallery':
                            return (<MediaGallery key={id} data={module} />);
                        case 'ContentfulModuleImageCompareSlider':
                            return (<ModuleImageCompareSlider key={id} data={module} />);
                        case 'ContentfulModulePoll':
                            return (<ModulePoll key={id} languageCode={this.props.languageCode} data={module} isUpcomingEvent={this.props.data['isUpcomingEvent']} />);
                        case 'ContentfulModuleLatestTapStories':
                            return <ModuleLatestTapStories key={id} data={module}/>
                        case 'ContentfulModuleEventsTextbox':
                            return <ModuleEventsTextbox key={id} data={module}/>    
                    }
                })}
                {this.props.childrenLast && this.props.slug !== 'media-center' && this.props.children}
            </div>
		);
	}
}

export default ModulesWrapper;

export const query = graphql`
	fragment ContentfulModuleWrapperFragment on ContentfulModuleWrapper {
		modules {
			__typename
			...ContentfulModuleSectionIntroductionFragment
			...ContentfulModuleBodyTextFragment
			...ContentfulModuleQuoteFragment
			...ContentfulModuleFaqListFragment
			...ContentfulModuleMediaListFragment
			...ContentfulModuleImageGridFragment
			...ContentfulModuleVideoEmbeddedFragment
			...ContentfulModuleVideoYouTubeFragment
			...ContentfulModuleImageGalleryFragment
			...ContentfulModuleImageBodyFragment
			...ContentfulModule2ImagesFragment
			...ContentfulModule4ColumnsFragment
			...ContentfulModuleMediaDownloadListFragment
			...ContentfulModuleStatisticFragment
			...ContentfulModuleStatisticsFragment
			...ContentfulModuleTextImageHighlightFragment
			...ContentfulModuleOneColumnTextFragment
			...ContentfulModulePinpointListFragment
			...ContentfulModuleSectionTitleDividerFragment
			...ContentfulModuleTabContainerFragment
			...ContentfulModuleHighlightedPersonasFragment
			...ContentfulModuleHighlightedItemsFragment
			...ContentfulModuleUpcomingEventsFragment
			...ContentfulModuleSideScrollerStoryListFragment
			...ContentfulModuleHighlightedEntitiesFragment
			...ContentfulModuleUpcomingEventsFragment
			...ContentfulModule2FeaturedPageLinksFragment
			...ContentfulModuleFeaturedPageLinkFragment
			...ContentfulModuleCtaLinkFragment
			...ContentfulModuleShortBoxedTextFragment
			...ContentfulModuleAccordionFragment
			...ContentfulModuleBulletPointListFragment
			...ContentfulModuleProcessFragment
			...ContentfulModuleMultipleQuotesFragment
			...ContentfulModuleFormFragment
            ...ContentfulModuleCfFormFragment
			...ContentfulMediaGalleryFragment
			...ContentfulModuleRichBodyTextFragment
			...ContentfulModuleRecentMediaGalleriesLogosFragment
			...ContentfulModuleHeadingSummaryWithButtonsFragment
			...ContentfulModuleMediaNumberedTextListFragment
			...ContentfulModuleImageCompareSliderFragment
			...ContentfulModulePollFragment
            ...ContentfulModuleLatestTapStoriesFragment
            ...ContentfulModuleEventsTextboxFragment
		}
	}
`;
