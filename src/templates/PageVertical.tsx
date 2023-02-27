import * as React from 'react';
import * as styles from './PageShared.module.scss';
import { PageVerticalQuery } from '../gatsby-queries';
import PageWrapper, { IPageProps } from './PageWrapper';
import { FormattedMessage } from 'react-intl';
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin';
import { Sine, gsap } from 'gsap/dist/gsap.min';
import ModulesWrapper from '../components/ModulesWrapper';
import { FixedTopSectionNav } from '../ui/FixedTopSectionNav';
import { zeroPad } from '../utils/StringUtils';
import { Helmet } from 'react-helmet';
import { GatsbyImageWrapper } from '../components/ui/GatsbyImageWrapper';
import { graphql } from 'gatsby';
import { UIImageCircle } from '../ui/IDKT/UIImageCircle';
import { UIProcess } from '../ui/IDKT/UIProcess';
import { UIProcessResearchers } from '../ui/IDKT/UIProcessResearchers';
import { UIProcessEntrepreneurs } from '../ui/IDKT/UIProcessEntrepreneurs';
import { Countdown } from "../ui/Countdown";
interface Props extends IPageProps {
	data: PageVerticalQuery;
}

const initialState = { hidden: false, verticalColor: null };
type State = any;

class PageVertical extends React.Component<Props, State> {
    readonly state: State = initialState;
	componentDidMount() {
		gsap.registerPlugin(ScrollToPlugin);

        document.onreadystatechange = () => {
            if (document.readyState === 'complete') {
                this.setState({ hidden: false });
            }
        };

		if (this.props.data?.contentfulPageVertical.slug === 'idkt/for-industry' || this.props.data?.contentfulPageVertical.slug === 'idkt/for-researchers' || this.props.data?.contentfulPageVertical.slug === 'idkt/for-entrepreneurs') {
			var wrapper = document.getElementById("section-2");
			var chart = document.getElementById("chart");

			wrapper.appendChild(chart);
		}

		if (this.props.data?.contentfulPageVertical.slug === 'idkt') {
			var wrapper = document.getElementById("section-1");
			var chart = document.getElementById("chart");

			wrapper.appendChild(chart);
		}
		
		if(window.location.hash) {
			setTimeout(() => {
				this.scrollToHandler(this)
			}, 1000);
		}

        const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
        var navDesktop = typeof document !== 'undefined' && document.getElementById('menu');
        var navMobile = typeof document !== 'undefined' && document.getElementById('mobilemenu');
        const verticalColor = isMobile ? navMobile && navMobile.getAttribute('data-color') : navDesktop && navDesktop.getAttribute('data-color')
        this.setState({ verticalColor: verticalColor });
	}

	private scrollToHandler = event => {
		let hash;
		let offsetY = 0
		if(window.location.hash.substring(1)) {
			hash = '#' + window.location.hash.substring(1);
		} else {
            if(event.target.tagName === 'SELECT') {
                hash = event.target.value
            } else {
                hash = event.target.getAttribute('href')
            }
			event.preventDefault()
		}

		if (hash === '#formdone') {
			return;
		}
		if (event) {
			gsap.to(window, { scrollTo: { y: hash, offsetY: offsetY, autoKill: false }, ease: Sine.easeInOut });
		}
	};

	private getTopNavSection(sections: any[]) {
		return (
			<div data-swiftype-index="false" className={styles.topSectionNav}>
				<h2 className={`text-style-quoted-by ${styles.sectionTitle}`}>
					<FormattedMessage id="Sections" />
				</h2>
				<ul>
					{sections.map((module, index) => {
						return (
							<li key={module.id}>
								<a onClick={this.scrollToHandler} className={`text-style-link-1 ${styles.sectionLink}`} href={`#section-${index + 1}`}>
									{zeroPad(index + 1)}. {module.title}
								</a>
							</li>
						);
					})}
				</ul>
			</div>
		);
	}

	render() {
		if (!this.props.data) {
			return <h1 style={{'marginTop': '100px'}}>ERROR</h1>;
		}
		const pageData = this.props.data.contentfulPageVertical;
		//@ts-ignore:
		const pressReleaseData = this.props.data.allPR;
		//@ts-ignore:
		const idktPressReleaseData = this.props.data.idktPR;
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

		const interactiveVideoTeaserImage = this.props.pageContext.languageCode === 'ar-QA' ? 'https://images.ctfassets.net/2h1qowfuxkq7/1AJYPj2ZhI4MxdvsgHGyGV/458b1fab5dbb4ca37968b1dccb263e1d/IQ6.2.png' : 'https://images.ctfassets.net/2h1qowfuxkq7/1AJYPj2ZhI4MxdvsgHGyGV/66031fa4a1ebcb89166d64a2238a3cdc/IQ5.2__2_.png'
		const langPrefix = this.props.pageContext.languageCode === 'ar-QA' ? '/ar' : ''

		return (
			//@ts-ignore:
			<PageWrapper location={this.props.location} pageData={pageData} type={'vertical'} title={pageData.title} metaTitle={pageData.metaTitle} pageContext={this.props.pageContext}>
				<div className={`container ${this.props.data.contentfulPageVertical.slug !== "idkt" ? this.props.data.contentfulPageVertical.slug === "education-city-world-cup" ? 'wc-page' : 'pagePaddingTop' : 'idktPage'}`}>
					{
						this.props.data.contentfulPageVertical.slug === "idkt" && (	
							//@ts-ignore:
							<Helmet>
								<html className={'page-idkt'} />
							</Helmet>
						)
					}
					<Helmet>
						{
						//@ts-ignore:
						pageData.metaDescription && ( <meta name="description" content={pageData.metaDescription.metaDescription} /> )}
						<meta className="swiftype" name="preview_image" data-type="enum" content={pageData.heroImage && pageData.heroImage.file.url} />
                        <meta
                            className="swiftype"
                            name="tags_vertical"
                            data-type="enum"
                            content={this.props.data.verticalEnglish && this.props.data.verticalEnglish.filterVerticalCategory && this.props.data.verticalEnglish.filterVerticalCategory.title}
                        />
						<meta className="swiftype" name="type" data-type="enum" content="page" />
					</Helmet>
					{
						this.props.data.contentfulPageVertical.slug === "25-years-of-qatar-foundation" && (
							<Helmet>
								<meta property="og:image" content={interactiveVideoTeaserImage} />
								<meta name="twitter:image" content={interactiveVideoTeaserImage} />
							</Helmet>
						)
					}
					{sections.length > 0 && this.props.data.contentfulPageVertical.slug !== "idkt" && 
                        !this.state.hidden && <FixedTopSectionNav sections={sections} />
                    }
					<div id='ecssBg' className={`${this.props.data.contentfulPageVertical.slug === "idkt" ? 'pagePaddingTopEcss' : '' } ${styles.topSection}`}>
						{
							// @ts-ignore
							<div className={`${pageData.fullWidthLayout ? 'col-md-12' : 'col-md-6 col-xl-4'} ${styles.topSectionText}`}>
								{
                                    (pageData.filterVerticalCategory && this.state.verticalColor) && (
                                        <h1 className={`text-style-h1 ${styles.verticalCategory} ${styles[this.state.verticalColor]}`}>{
                                            // @ts-ignore
                                            pageData.filterVerticalCategory?.title
                                        }</h1>
                                    )
                                }
                                {
                                    <h1 className={`text-style-h1 ${pageData.fullWidthLayout && 'max-width'}`}>{pageData.headline && pageData.headline.headline}</h1>
                                }
								{
                                    // @ts-ignore
                                    <p className={`text-style-body ${styles.subtitle} ${pageData.fullWidthLayout ? 'text-style-introduction' : ''}`} dangerouslySetInnerHTML={{ __html: pageData.subtitle && pageData.subtitle.subtitle }} />
                                }
                                { this.props.data.contentfulPageVertical.slug === "education-city-world-cup" && <Countdown /> }
								{
									this.props.data.contentfulPageVertical.slug === "idkt" && (
										<div className={styles.linksWrapper}>
											<a href={`${langPrefix}/idkt/technologies`}><FormattedMessage id={'technologies'} /></a>
											<a href={`${langPrefix}/idkt/for-industry`}><FormattedMessage id={'for_industry'} /></a>
											<a href={`${langPrefix}/idkt/for-researchers`}><FormattedMessage id={'for_researchers'} /></a>
											<a href={`${langPrefix}/idkt/for-entrepreneurs`}><FormattedMessage id={'for_entrepreneurs'} /></a>
											<a href={`${langPrefix}/idkt/info-bank`}><FormattedMessage id={'infobank'} /></a>
										</div>
									)
								}
							</div>
						}
						{sections.length > 0 && this.props.data.contentfulPageVertical.slug !== "idkt" && this.getTopNavSection(sections)}
					</div>
                    <div className={styles.sectionsDropdownWrapper}>
                        <select className={`${styles.sectionsDropdown} select_alt`} onChange={this.scrollToHandler}>
                            {sections.map((module, index) => {
                                return (
                                    <option key={module.id} value={`#section-${index + 1}`}>
                                        {zeroPad(index + 1)}. {module.title}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
					{
						this.props.data.contentfulPageVertical.slug !== "idkt" && pageData.heroImage && (
							// @ts-ignore
							<GatsbyImageWrapper loading='eager' alt={pageData.heroImage && pageData.heroImage.title} outerWrapperClassName={`w-100 ${sections.length > 0 && this.props.data.contentfulPageVertical.slug !== "idkt" && 'no-paddding-top'} ${styles.heroImage}`} image={pageData.heroImage} />
						)
					}
					<ModulesWrapper
						languageCode={this.props.pageContext.languageCode}
						programsListData={this.props.data.allContentfulPageProgram}
						upcomingEventsData={this.props.pageContext.upcomingEvents}
						hasHeroImage={true}
						data={pageData.modulesWrapper}
						slug={pageData.slug}
					>
					</ModulesWrapper>
				</div>
				{pageData.slug == 'idkt' && (
					<div className="module-margin">
						<UIImageCircle currLang={this.props.pageContext.languageCode} />
					</div>
				)}
				{pageData.slug == 'idkt/for-industry' && (
					<div className="module-margin">
						<UIProcess currLang={this.props.pageContext.languageCode} />
					</div>
				)}
				{pageData.slug == 'idkt/for-researchers' && (
					<div className="module-margin">
						<UIProcessResearchers  currLang={this.props.pageContext.languageCode} />
					</div>
				)}
				{pageData.slug == 'idkt/for-entrepreneurs' && (
					<div className="module-margin">
						<UIProcessEntrepreneurs currLang={this.props.pageContext.languageCode} />
					</div>
				)}
			</PageWrapper>
		);
	}
}

export default PageVertical;

export const pageQuery = graphql`
	query PageVerticalQuery($id: String, $languageCode: String) {
		contentfulPageVertical(contentful_id: { eq: $id }, node_locale: { eq: $languageCode }) {
			id
			slug
			title
			headline {
				headline
			}
			subtitle {
				subtitle
			}
			metaTitle
			metaDescription {
				metaDescription
			}
            filterVerticalCategory {
				title
			}
			heroImage {
				title
				file {
					url
				}
				gatsbyImageData(
                    placeholder: NONE
                    width: 1680
                    height: 700
                    quality: 85
                    layout: FULL_WIDTH
                  )
			}
			modulesWrapper {
				...ContentfulModuleWrapperFragment
			}
			fullWidthLayout
		}
		verticalEnglish: contentfulPagePlace(contentful_id: { eq: $id }, node_locale: { eq: "en-US" }) {
			filterVerticalCategory {
				title
			}
		}
		allContentfulPageProgram(filter: { node_locale: { eq: $languageCode }, title: { ne: "WORKAROUND. DO NOT DELETE." } }, sort: { order: ASC, fields: [title] }) {
			edges {
				node {
					slug
					title
					filterEntity {
						title
						contentful_id
					}
					filterProgramType {
						title
						contentful_id
					}
				}
			}
		}
		allPR: allContentfulPagePressRelease(filter: { node_locale: { eq: $languageCode }, title: { ne: "WORKAROUND. DO NOT DELETE." } }, limit: 10, sort: { order: DESC, fields: [date] }) {
			edges {
				node {
					title
					slug
					date
				}
			}
		}

		idktPR: allContentfulPagePressRelease(filter: { node_locale: { eq: $languageCode }, filterTags: {elemMatch: {title: {eq: "IDKT"}}}}, limit: 10, sort: { order: DESC, fields: [date] }) {
			edges {
			  node {
				title
				slug
				date
			  }
			}
		}
	}
`;
