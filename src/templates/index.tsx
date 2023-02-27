import React from 'react';
import loadable from '@loadable/component'
import { navigate } from 'gatsby-link';
import LandingPageGallery from '../components/ContentfulModules/LandingPageGallery';
import PageWrapper, { IPageProps } from './PageWrapper';
import { HomeQuery } from '../gatsby-queries';
import { Helmet } from 'react-helmet';
const ModulesWrapper = loadable(() => import('../components/ModulesWrapper'));
const Module3Links = loadable(() => import('../components/ContentfulModules/Module3Links'));
const ModuleFeaturedLink = loadable(() => import('../components/ContentfulModules/ModuleFeaturedLink'));
const ModuleHomeNewsletter = loadable(() => import('../components/ContentfulModules/ModuleHomeNewsletter'));
const NewsList = loadable(() => import('../components/NewsList'));
const EventsList = loadable(() => import('../components/EventsList'));
const ModuleLatestTapStories = loadable(() => import('../components/ContentfulModules/ModuleLatestTapStories'));
import { graphql } from 'gatsby';

interface Props extends IPageProps {
	data: HomeQuery;
}

const initialState = { userCountry: null };
type State = Readonly<typeof initialState>;

class IndexPage extends React.Component<Props, State> {
    readonly state: State = initialState;

	private gallery: LandingPageGallery;
	private menuNormalMode = false;

	async componentDidMount() {
        document.getElementById("fixedWrapper").style.top = "0";
        const url = 'https://www.cloudflare.com/cdn-cgi/trace';
        await fetch(url)
		.then(res => res.text() ).then(t => {
			var data = t.replace(/[\r\n]+/g, '","').replace(/\=+/g, '":"');
				data = '{"' + data.slice(0, data.lastIndexOf('","')) + '"}';
			var jsondata = JSON.parse(data);
            // @ts-ignore
            this.setState({ userCountry: jsondata.loc });

		})
        .catch(error => console.log(error));

		this.removeProgressIndicator();
		window.addEventListener('resize', this.checkMenuScroll);
		window.addEventListener('scroll', this.checkMenuScroll);
		this.checkMenuScroll();
		setTimeout(this.checkMenuScroll, 0);

		const cookieLang = typeof window !== 'undefined' && window.localStorage.getItem('nf_lang');
		if (this.props.location.pathname === '/ar' && cookieLang === 'en') {
			navigate('/');
		}

		if (this.props.pageContext.id === 'home') {
			var element = document.getElementById('breadcrumb');
			if (!element?.classList.contains('hidden')) {
				element?.classList.add('hidden');
			}
		}
	}

	private removeProgressIndicator() {
		var indicatorCheck = typeof document !== 'undefined' && document.getElementById('gatsby-plugin-page-progress');
		if (indicatorCheck) indicatorCheck.remove();
	}

	componentWillUnmount(): void {
		window.removeEventListener('resize', this.checkMenuScroll);
		window.removeEventListener('scroll', this.checkMenuScroll);
		document.body.classList.remove('menu-normal');
	}

	private checkMenuScroll = () => {
		if (window.pageYOffset > this.gallery.wrapperHeight - 100) {
			if (!this.menuNormalMode) {
				this.menuNormalMode = true;
				document.body.classList.add('menu-normal');
			}
		} else {
			if (this.menuNormalMode) {
				this.menuNormalMode = false;
				document.body.classList.remove('menu-normal');
			}
		}
	};

	componentDidUpdate() {
		this.removeProgressIndicator();
	}

    getFeaturedLinkData() {
        let homepageData = this.props.data.contentfulPageHome
        return {
            'title': homepageData.featuredLinkTitle,
            'text': homepageData.featuredLinkText.featuredLinkText,
            'ctaText': homepageData.featuredLinkCtaText,
            'url': homepageData.featuredLinkUrl,
            'image': homepageData.featuredLinkImage
        }
    }

	render() {
		const animationDirection = this.props.pageContext.languageCode === 'ar-QA' ? -1 : 1;
		this.removeProgressIndicator();
		return (
            <PageWrapper location={this.props.location} pageData={this.props.data.contentfulPageHome} type="home" title={this.props.data.contentfulPageHome.title} metaTitle={this.props.data.contentfulPageHome.metaTitle} pageContext={this.props.pageContext}>
                <div>
                    <div data-swiftype-index="false">
                        {
                            //@ts-ignore:
                            <Helmet>
                                <html className={'page-home'} />
                            </Helmet>
                        }
                        {
                            <LandingPageGallery
                                ref={ref => (this.gallery = ref)}
                                items={this.props.data.contentfulPageHome.landingGallery}
                                // @ts-ignore
                                promo={this.props.data.promotionalVideoTitleEnglish.promotionalVideo && this.props.data.promotionalVideoTitleEnglish.promotionalVideo.title.title}
                                promotionalVideo={this.props.data.contentfulPageHome.promotionalVideo}
                                animationDirection={animationDirection}
                            />
                        }
                    </div>
                    <Module3Links />
                    <ModuleFeaturedLink data={this.getFeaturedLinkData()} />
                    <ModulesWrapper
                        languageCode={this.props.pageContext.languageCode}
                        upcomingEventsData={this.props.pageContext.upcomingEvents}
                        childrenLast={true}
                        hasHeroImage={false}
                        data={this.props.data.contentfulPageHome.modulesWrapper}
                    ></ModulesWrapper>
                    {this.props.pageContext.latestPageArticles && (
                        // @ts-ignore
                        <NewsList
                            articles={this.props.pageContext.latestPageArticles}
                            languageCode={this.props.location.pathname === '/ar/' ? 'ar-QA' : 'en-US'}
                            animationDirection={animationDirection}
                            title={this.props.pageContext.languageCode === 'ar-QA' ? 'أبرز الفعاليات' : 'Featured Events'}
                        />
                    )}

                    {this.props.pageContext.upcomingPageEvents && (
                        <EventsList
                            animationDirection={animationDirection}
                            events={this.props.pageContext.upcomingPageEvents}
                            title={this.props.pageContext.languageCode === 'ar-QA' ? 'أبرز الفعاليات' : 'Featured Events'} />
                    )}
                    <div className="container-padding">
                        {
                            // @ts-ignore
                            this.props.data.contentfulPageHome.latestTapStories && (
                                // @ts-ignore
                                <ModuleLatestTapStories selectedTapStories={this.props.data.contentfulPageHome.latestTapStories.selectedTapStories} />
                            )
                        }
                    </div>
                    <div className={'bgGrey'}>
                        <div className="container-padding">
                            {
                                // @ts-ignore
                                <ModuleHomeNewsletter currLang={this.props.pageContext.languageCode} />
                            }
                        </div>
                    </div>
                </div>
            </PageWrapper>
		);
	}
}

export default IndexPage;

export const pageQuery = graphql`
	query HomeQuery($languageCode: String) {
		contentfulPageHome(contentful_id: { eq: "1UkArCmwqoGeweAo8yiMgG" }, node_locale: { eq: $languageCode }, title: { ne: "WORKAROUND. DO NOT DELETE." } ) {
			title
			slug
			...LandingPageGalleryFragment
			promotionalVideo {
				title {
					title
				}
				subtitle {
					subtitle
				}
				useVideo
				videoUrl
				mobileVideoUrl
				ctaText
				ctaLink {
					ctaLink
				}
			}
			modulesWrapper {
				...ContentfulModuleWrapperFragment
			}
            latestTapStories {
                ...ContentfulModuleLatestTapStoriesFragment
            }
			showStatementNotification
			metaTitle
			metaDescription {
				metaDescription
			}
            featuredLinkTitle
            featuredLinkText {
                featuredLinkText
            }
            featuredLinkCtaText
            featuredLinkUrl
            featuredLinkImage {
                title
                gatsbyImageData(
                    placeholder: NONE
                    width: 1680
                    height: 700
                    quality: 85
                    layout: FULL_WIDTH
                )
            }
		}
		promotionalVideoTitleEnglish: contentfulPageHome(contentful_id: { eq: "1UkArCmwqoGeweAo8yiMgG" }, node_locale: { eq: "en-US" }) {
			promotionalVideo {
				title {
					title
				}
			}
		}
	}
`;
