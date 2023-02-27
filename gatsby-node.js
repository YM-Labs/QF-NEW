const Promise = require(`bluebird`);
const path = require(`path`);
const languages = require('./src/data/languages');
const fs = require('fs');
// Implement the Gatsby API “createPages”. This is
// called after the Gatsby bootstrap is finished so you have
// access to any information necessary to programmatically
// create pages.
exports.createPages = ({ graphql, actions }) => {
	const { createPage, createRedirect } = actions;

	function createTemplatePage(pathPrefix, pathPrefixArabic, edge, template, edges, extraContextOptions, resultData, defer) {
		const slug = edge.node.slug;

		if (slug === 'workaround-do-not-delete') {
			return;
		}

		// Gatsby uses Redux to manage its internal state.
		// Plugins and sites can use functions like "createPage"
		// to interact with Gatsby.

		if (extraContextOptions.upcomingPageEvents) {
			let events = extraContextOptions.upcomingPageEvents.map(edge => {
				return edge.preview;
			});
			events = trimToUpcomingEvents(events);
			extraContextOptions.upcomingPageEvents = events;
			if (extraContextOptions.upcomingPageEvents.length === 0) {
				delete extraContextOptions.upcomingPageEvents;
			}
		}

		if (extraContextOptions.latestPageArticles) {
			let articles = extraContextOptions.latestPageArticles.map(edge => {
				return edge.preview;
			});
			articles = trimToLatestArticles(articles);
			extraContextOptions.latestPageArticles = articles;
			if (extraContextOptions.latestPageArticles.length === 0) {
				delete extraContextOptions.latestPageArticles;
			}
		}

		// Add events to pageContext for pages with the Module: Upcoming events
		if (edge.node.modulesWrapper) {
			if (edge.node.modulesWrapper.length > 0) {
				edge.node.modulesWrapper.forEach(moduleWrapper => {
					if (moduleWrapper.modules) {
						if (moduleWrapper.modules.length > 0) {
							moduleWrapper.modules.forEach((module, index) => {
								if (module.id) {
									extraContextOptions = extraContextOptions ? extraContextOptions : {};
									let events = [];
									if (module.fromVertical) {
										if (module.fromVertical.length) {
											module.fromVertical.forEach(vertical => {
												events.push(...vertical.event);
											});
										} else {
											events = module.fromVertical.event;
										}
									}
									extraContextOptions.upcomingEvents = trimToUpcomingEvents(events);
								}
							});
						}
					}
				});
			}
		}

		if (slug !== null) {
			if (pathPrefix !== '') {
				pathPrefix = pathPrefix + '/';
			}
			if (pathPrefixArabic !== '') {
				pathPrefixArabic = pathPrefixArabic + '/';
			}

			const localePrefix = prefixNodeLocale(edge.node);
			const path = makePath(edge.node.node_locale === 'en-US' ? pathPrefix : pathPrefixArabic, localePrefix, slug);
			// console.log('page: ', path);

			const slugAlternate = findAlternateLanguageVersion(edge.node, edges, edge.node.node_locale === 'en-US' ? pathPrefixArabic : pathPrefix);

			let context = {
				id: edge.node.contentful_id,
				languageCode: edge.node.node_locale,
				alternateLanguage: slugAlternate,
				currSlug: path,
				title: edge.node.title
			};
			if (extraContextOptions) {
				Object.keys(extraContextOptions).forEach(key => (context[key] = extraContextOptions[key]));
			}

			// console.log("slugAlternate: ", slugAlternate);
			createPage({
				// Each page is required to have a `path` as well
				// as a template component. The `context` is
				// optional but is often necessary so the template
				// can query data specific to each page. (GraphQL)
				path: path,
				component: slash(template),
				context,
                defer: defer
			});
		}
	}

    function slash(path) {
        const isExtendedLengthPath = /^\\\\\?\\/.test(path);
        const hasNonAscii = /[^\u0000-\u0080]+/.test(path); // eslint-disable-line no-control-regex

        if (isExtendedLengthPath || hasNonAscii) {
            return path;
        }

        return path.replace(/\\/g, '/');
    }

	function trimToUpcomingEvents(events) {
		const today = new Date();
		events = events.filter(event => {
			if (event !== undefined) {
				// Filter for only upcoming events:
				if (new Date(event.endDate) >= today) {
					return true;
				}
			}
			return false;
		});
		return events.length > 8 ? events.slice(0, 7) : events;
	}

	function trimToLatestArticles(articles) {
        articles = articles.filter(article => {
            if (article.filterArticleTags?.filter(e => e.slug === 'goals').length === 0) {
                return true;
            }
            return false;
        })
		return articles.length > 8 ? articles.slice(0, 7) : articles;
	}

	function createPageUnderVertical(pathPrefix, pathPrefixArabic, edge, template, edges, verticalEdges, resultData, contextOptions) {
		let verticalPath = edge.node.filterVerticalCategory ? edge.node.filterVerticalCategory.slug : '';
		let verticalPathAlternate = '';
		let extraContext = contextOptions ? contextOptions : {};

		if (edge.node.filterVerticalCategory) {
			verticalPath = verticalEdges.find(node => node.node.contentful_id === edge.node.filterVerticalCategory.contentful_id && node.node.node_locale === edge.node.node_locale).node.slug;
			verticalPathAlternate = verticalEdges.find(node => node.node.contentful_id === edge.node.filterVerticalCategory.contentful_id && node.node.node_locale !== edge.node.node_locale).node.slug;

			if (edge.node.type) {
				extraContext.type = edge.node.type[0];
			}
			extraContext.vertical = edge.node.filterVerticalCategory.slug;

			createTemplatePage(
				edge.node.node_locale === 'en-US' ? verticalPath : verticalPathAlternate,
				edge.node.node_locale === 'en-US' ? verticalPathAlternate : verticalPath,
				edge,
				template,
				edges,
				extraContext,
				resultData
			);
		} else {
			createTemplatePage('entity', 'entity', edge, template, edges, extraContext, resultData);
			// createTemplatePage('entity', 'kian', edge, template, edges, extraContext, resultData);
		}
	}

	function createPageWithVerticalInfo(pathPrefix, pathPrefixArabic, edge, template, edges, resultData, contextOptions) {
		if (edge.node.filterVerticalCategory) {
			let extraContext = contextOptions ? contextOptions : {};
			extraContext.vertical = edge.node.filterVerticalCategory.slug;
			createTemplatePage(pathPrefix, pathPrefixArabic, edge, template, edges, extraContext, resultData);
		} else if (edge.node.internal && edge.node.internal.type === 'ContentfulEcss') {
			let extraContext = contextOptions ? contextOptions : {};
			createTemplatePage(pathPrefix, pathPrefixArabic, edge, template, edges, extraContext, resultData);
		}
	}

	function getFutureEvents(eventEdges, node_locale) {
		const today = new Date();

		eventEdges = JSON.parse(JSON.stringify(eventEdges));

		return eventEdges
			.filter(eventEdge => {
				// Filter for only upcoming events:
				if (eventEdge.node.node_locale === node_locale && new Date(eventEdge.node.endDate) >= today) {
					return true;
				}
				return false;
			})
			.map(edge => {
				//Sanitize data:
				delete edge.node.node_locale;
				delete edge.node.contentful_id;
				delete edge.node.id;
				if (edge.node.type) {
					edge.node.typeName = edge.node.type.typeName;
					delete edge.node.type;
				}
				if (edge.node.filterVerticalCategory) {
					edge.node.vertical = edge.node.filterVerticalCategory.title;
					delete edge.node.filterVerticalCategory;
				}
				return edge.node;
			});
	}

	function createOverviewPage(pathPrefix, pathPrefixArabic, edge, template, edges, resultData) {
		if (edge.node.slug === 'events' /* || edge.node.slug === 'ahdath'*/) {
			let extraContext = { eventsPage: true };
			extraContext.upcomingPageEvents = getFutureEvents(resultData.allContentfulEvent.edges, edge.node.node_locale);

			createTemplatePage(pathPrefix, pathPrefixArabic, edge, template, edges, extraContext, resultData);
		}
		if (edge.node.slug === 'education-city-speaker-series' /* || edge.node.slug === 'ahdath'*/) {
			let extraContext = { ecssPage: true };
			createTemplatePage(pathPrefix, pathPrefixArabic, edge, template, edges, extraContext, resultData);
		}
		if (edge.node.slug === 'stories') {
			let extraContext = { newsPage: true };
			createTemplatePage(pathPrefix, pathPrefixArabic, edge, template, edges, extraContext, resultData);
		} else if (edge.node.slug === 'media-center' /* || edge.node.slug === 'sahafa'*/) {
			let extraContext = { pressPage: true };
			createTemplatePage(pathPrefix, pathPrefixArabic, edge, template, edges, extraContext, resultData);
		} else if (edge.node.slug === 'media-center/media-galleries' /* || edge.node.slug === 'sahafa'*/) {
			let extraContext = { mediaGalleriesPage: true };
			createTemplatePage(pathPrefix, pathPrefixArabic, edge, template, edges, extraContext, resultData);
		} else if (edge.node.slug === 'media-center/experts' /* || edge.node.slug === 'sahafa'*/) {
			let extraContext = { expertsPage: true };
			createTemplatePage(pathPrefix, pathPrefixArabic, edge, template, edges, extraContext, resultData);
		} else if (edge.node.slug === 'media-center/logos' /* || edge.node.slug === 'sahafa'*/) {
			let extraContext = { logosPage: true };
			createTemplatePage(pathPrefix, pathPrefixArabic, edge, template, edges, extraContext, resultData);
		} else {
			createTemplatePage(pathPrefix, pathPrefixArabic, edge, template, edges, {}, resultData);
		}
	}

	const pathSearch = ['search', 'search'];

	// const pathSearch = ['search', 'bahath'];

	function createHomeAndSearchPage(events, articles) {
		//Create static pages:
		languages.langs.forEach(language => {
			const prefixHome = language.langKey === 'en' ? '/' : `/${language.langKey}`;
			const prefixLanguage = language.langKey === 'en' ? '/' : `/${language.langKey}/`;
			const prefixAlternateLanguage = language.langKey === 'en' ? '/ar/' : '/';

			let homePageEvents = events
				.filter(event => {
					let result = false;
					try {
						result = language.languageCode === event.node.node_locale && event.node.featuredOnFrontpage;
					} catch (e) {
						result = false;
					}
					return result;
				})
				.map(edge => {
					return edge.preview;
				});

			let homePageArticles = articles
				.filter(articles => {
					let result = false;
					try {
						result = language.languageCode === articles.node.node_locale;
					} catch (e) {
						result = false;
					}
					return result;
				})
				.map(edge => {
					return edge.preview;
				});

			homePageEvents = trimToUpcomingEvents(homePageEvents);
			homePageArticles = trimToLatestArticles(homePageArticles);

			//Create index page:
			createPage({
				path: `${prefixHome}`,
				component: path.resolve(`./src/templates/index.tsx`),
				context: {
					...language,
					id: 'home',
					languageCode: language.languageCode,
					alternateLanguage: language.langKey === 'en' ? '/ar' : '/',
					currSlug: prefixHome,
					upcomingPageEvents: homePageEvents.length > 0 ? homePageEvents : undefined,
					latestPageArticles: homePageArticles.length > 0 ? homePageArticles : undefined
				}
			});

			const currLangIndex = language.langKey === 'en' ? 0 : 1;
			const alternateLangIndex = language.langKey === 'en' ? 1 : 0;
			//Create search page:
			createPage({
				path: `${prefixLanguage}${pathSearch[currLangIndex]}`,
				component: path.resolve(`./src/templates/PageSearch.tsx`),
				context: {
					...language,
					id: 'search',
					languageCode: language.languageCode,
					alternateLanguage: `${prefixAlternateLanguage}${pathSearch[alternateLangIndex]}`,
					currSlug: `${prefixLanguage}${pathSearch[currLangIndex]}`
				}
			});
		});
	}

    function createTapStoryOverview (articles, template) {
		languages.langs.forEach(language => {
			const prefixLanguage = language.langKey === 'en' ? 'stories/tap' : `${language.langKey}/stories/tap`;
				const prefixAlternateLanguage = language.langKey === 'en' ? '/ar/stories/tap' : '/stories/tap';

			let homePageArticles = articles
				.filter(articles => {
					let result = false;
					try {
						result = language.languageCode === articles.node.node_locale;
					} catch (e) {
						result = false;
					}
					return result;
				})
				.map(edge => {
					return edge.preview;
				});

			createPage({
				path: `${prefixLanguage}`,
				component: template,
				context: {
					...language,
					articles: homePageArticles,
					alternateLanguage: `${prefixAlternateLanguage}`,
					currSlug: `/${prefixLanguage}`
				}
			});
		});
	}

	return new Promise((resolve, reject) => {
		// The “graphql” function allows us to run arbitrary
		// queries against the local Contentful graphql schema. Think of
		// it like the site has a built-in database constructed
		// from the fetched data that you can run queries against.
		graphql(
			`
				fragment ContentfulEventPreviewFragment on ContentfulEvent {
					contentful_id
					title
					startDate
					endDate
					slug
					image {
						file {
							url
						}
					}
					filterVerticalCategory {
						title
					}
                    campaign {
                        slug
                    }
					type {
						typeName
					}
					image {
						gatsbyImageData(placeholder: NONE, width: 400, quality: 85)
					}
                    description {
                        childMarkdownRemark {
                            html
                        }
                    }
				}

				fragment ContentfulEcssPreviewFragment on ContentfulEcss {
					contentful_id
					title
					startDate
					endDate
					slug
					image {
						file {
							url
						}
					}
					ecssTag {
						title
						slug
					}
					image {
						gatsbyImageData(placeholder: NONE, width: 960, quality: 85)
					}
				}

				fragment ContentfulArticlePreviewFragment on ContentfulPageArticle {
					id
					title
					contentful_id
					node_locale
					slug
					filterVerticalCategory {
						title
					}
					opEdCreditOptional {
						name {
							name
						}
						title {
							title
						}
						profilePhoto {
							title
							thumb: gatsbyImageData(placeholder: NONE, 
                width: 100
                height: 100
                resizingBehavior: FILL
                quality: 85
              )
						}
					}
					contentTypePreviewInfo
					contentType {
						title
						slug
					}
					filterArticleTags {
						title
						slug
					}
					teaserImage {
						gatsbyImageData(placeholder: NONE, width: 960, quality: 85)
					}
				}

				fragment ContentfulModuleUpcomingEventsFragment on ContentfulModuleUpcomingEvents {
					id
					fromVertical {
						event {
							...ContentfulEventPreviewFragment
						}
					}
				}
				{
					allContentfulEvent(limit: 9999, sort: { fields: [endDate], order: ASC }) {
						edges {
							node {
								id
								title
								contentful_id
								node_locale
								slug
								endDate
								startDate
								organiser {
									contentful_id
								}
								featuredOnFrontpage
								filterVerticalCategory {
									title
								}
								type {
									typeName
								}
								modulesWrapper {
									modules {
										...ContentfulModuleUpcomingEventsFragment
									}
								}
							}
							preview: node {
								...ContentfulEventPreviewFragment
							}
						}
					}
					allContentfulEcss(filter: { title: { ne: "WORKAROUND. DO NOT DELETE." } }, limit: 9999, sort: { fields: [endDate], order: ASC }) {
						edges {
							node {
								id
								contentful_id
								node_locale
								title
								slug
								internal {
									type
								}
								description {
									childMarkdownRemark {
										html
									}
								}
								startDate
								endDate
								image {
									file {
										url
									}
								}
								ecssTag {
									contentful_id
								}
								image {
									file {
										url
									}
									gatsbyImageData(placeholder: NONE, 
                    width: 1680
                    height: 700
                    resizingBehavior: FILL
                    layout: FULL_WIDTH
                    quality: 85
                  )
								}
								modulesWrapper {
									modules {
										...ContentfulModuleUpcomingEventsFragment
									}
								}
							}
							preview: node {
								...ContentfulEcssPreviewFragment
							}
						}
					}
					allContentfulPageVertical(limit: 1000) {
						edges {
							node {
								id
								title
								contentful_id
								node_locale
								slug
								modulesWrapper {
									modules {
										...ContentfulModuleUpcomingEventsFragment
									}
								}
							}
						}
					}
					allContentfulPageOverview(filter: { slug: { ne: "statements" } }, limit: 1000) {
						edges {
							node {
								id
								title
								contentful_id
								node_locale
								slug
								modulesWrapper {
									modules {
										...ContentfulModuleUpcomingEventsFragment
									}
								}
							}
						}
					}
					allContentfulPageNewsAndStories(filter: { slug: { ne: "statements" } }, limit: 1000) {
						edges {
							node {
								id
								title
								contentful_id
								node_locale
								slug
							}
						}
					}
					allContentfulPageEducationCitySpeakerSeries(filter: { title: { ne: "WORKAROUND. DO NOT DELETE." } }, limit: 1000) {
						edges {
							node {
								id
								title
								contentful_id
								node_locale
								slug
							}
						}
					}
                    allContentfulPageWorldCup(filter: { title: { ne: "WORKAROUND. DO NOT DELETE." } }, limit: 1000) {
						edges {
							node {
								id
								title
								contentful_id
								node_locale
								slug
                                tabs {
                                    moduleWrappers {
                                        modules {
                                            ...ContentfulModuleUpcomingEventsFragment
                                        }
                                    }
                                }
							}
						}
					}
					allContentfulPagePersona(limit: 1000) {
						edges {
							node {
								id
								contentful_id
								node_locale
								slug
								modulesWrapper {
									modules {
										...ContentfulModuleUpcomingEventsFragment
									}
								}
								mediaSpokespeople
							}
						}
					}
					allMediaCenterExpertProfile: allContentfulPageExpertProfile(filter: { name: { ne: "WORKAROUND. DO NOT DELETE." }, ecssSpeaker: { ne: true }, ecssModerator: { ne: true }  }, limit: 1000) {
						edges {
						   node {
							  id
							  contentful_id
							  node_locale
							  slug
							  name
							  ecssSpeaker
							  ecssModerator
						   }
						}
					}
					allEcssSpeakerExpertProfile: allContentfulPageExpertProfile(filter: { name: { ne: "WORKAROUND. DO NOT DELETE." }, ecssSpeaker: { eq: true } }, limit: 1000) {
						edges {
						   node {
							  id
							  contentful_id
							  node_locale
							  slug
							  name
							  ecssSpeaker
						   }
						}
					}
					allEcssModeratorExpertProfile: allContentfulPageExpertProfile(filter: { name: { ne: "WORKAROUND. DO NOT DELETE." }, ecssModerator: { eq: true } }, limit: 1000) {
						edges {
						   node {
							  id
							  contentful_id
							  node_locale
							  slug
							  name
							  ecssModerator
						   }
						}
					}
					allContentfulPageProgram(limit: 1000) {
						edges {
							node {
								id
								title
								contentful_id
								node_locale
								slug
								modulesWrapper {
									modules {
										...ContentfulModuleUpcomingEventsFragment
									}
								}
							}
						}
					}
					allContentfulEntities(limit: 1000) {
						edges {
							node {
								id
								title
								contentful_id
								node_locale
								slug
								type
								isPartOfQatarFoundation
								filterVerticalCategory {
									slug
									contentful_id
								}
								modulesWrapper {
									modules {
										...ContentfulModuleUpcomingEventsFragment
									}
								}
							}
						}
					}
					allContentfulPageCampaign(limit: 1000) {
						edges {
							node {
								id
								title
								contentful_id
								node_locale
								slug
								filterVerticalCategory {
									slug
									contentful_id
								}
								modulesWrapper {
									modules {
										...ContentfulModuleUpcomingEventsFragment
									}
								}
							}
						}
					}
					allContentfulPageArticle(sort: { order: DESC, fields: [date] }, limit: 9999) {
						edges {
							node {
								id
								title
								contentful_id
								node_locale
								slug
								filterVerticalCategory {
									slug
									contentful_id
								}
								filterArticleTags {
									slug
									contentful_id
								}
								contentType {
									title
									slug
									contentful_id
								}
								modulesWrapper {
									modules {
										...ContentfulModuleUpcomingEventsFragment
									}
								}
							}
							preview: node {
								...ContentfulArticlePreviewFragment
							}
						}
					}
					allContentfulFilterEcssTag(limit: 9999) {
						edges {
							node {
								id
								title
								contentful_id
								node_locale
								slug
							}
						}
					}
					allContentfulFilterArticleTag(limit: 9999) {
						edges {
							node {
								id
								title
								contentful_id
								node_locale
								slug
							}
						}
					}
					allContentfulFilterArticleType(limit: 9999) {
						edges {
							node {
								id
								title
								contentful_id
								node_locale
								slug
							}
						}
					}
					allContentfulPagePressRelease(limit: 9999) {
						edges {
							node {
								id
								title
								contentful_id
								node_locale
								slug
                                csvPage
								modulesWrapper {
									modules {
										...ContentfulModuleUpcomingEventsFragment
									}
								}
							}
						}
					}
					allContentfulPressMediaMention(filter: { title: { title: { ne: "WORKAROUND. DO NOT DELETE." } } }, limit: 9999, sort: { fields: [date], order: DESC }) {
						edges {
							node {
								id
								node_locale
								mediaOrganisation
								title {
									title
								}
								contentful_id
								date
								link
							}
						}
					}
					allContentfulPagePlace(limit: 1000) {
						edges {
							node {
								id
								title
								contentful_id
								node_locale
								slug
								filterVerticalCategory {
									slug
									contentful_id
								}
								modulesWrapper {
									modules {
										...ContentfulModuleUpcomingEventsFragment
									}
								}
							}
						}
					}
					allContentfulMediaGallery(filter: { slug: { ne: "workaround-do-not-delete" } }, limit: 9999, sort: { fields: [date], order: DESC }) {
						edges {
							node {
								id
								contentful_id
								node_locale
								mediaGalleryTitle {
									mediaGalleryTitle
								}
								date
								slug
							}
						}
					}
					allContentfulModuleForm(limit: 1000) {
						edges {
							node {
								id
								contentful_id
								isFormOnTheSide
								formBody {
									raw
								}
							}
						}
					}
					allContentfulFilterVertical(limit: 1000) {
						edges {
							node {
								id
								title
								contentful_id
								node_locale
								slug
							}
						}
					}
					allContentfulRedirection(limit: 9999) {
						edges {
							node {
								fromPath
								toPath {
									toPath
								}
								isPermanent
								force
							}
						}
					}
					menuPreviewEntities: allContentfulEntities(filter: { title: { ne: "WORKAROUND. DO NOT DELETE." } }) {
						edges {
							node {
								contentful_id
								title
								phone
								fax
								email
								node_locale
								entityDescription {
									entityDescription
								}
								type
								filterVerticalCategory {
									title
								}
								openingHours {
									openingHours
								}
								location {
									contentful_id
									placeName
									placeAddress
									placeLocation {
										lon
										lat
									}
								}
								heroImage {
									file {
										url
									}
								}
                                entityLogo {
									file {
										url
									}
								}
								isPartOfQatarFoundation
							}
						}
					}
					menuPreviewPagePlaces: allContentfulPagePlace(filter: { title: { ne: "WORKAROUND. DO NOT DELETE." } }) {
						edges {
							node {
								contentful_id
								title
								phone
								fax
								email
								node_locale
								subtitle {
									subtitle
								}
								filterVerticalCategory {
									title
								}
								filterPlaceCategory {
									title
								}
								openingHours {
									openingHours
								}

								location {
									contentful_id
									placeName
									placeAddress
									placeLocation {
										lon
										lat
									}
								}
								heroImage {
									file {
										url
									}
								}
							}
						}
					}
					menuPreviewPagePrograms: allContentfulPageProgram(filter: { title: { ne: "WORKAROUND. DO NOT DELETE." } }) {
						edges {
							node {
								contentful_id
								title
								node_locale
								filterEntity {
									slug
									contentful_id
									title
								}
								filterProgramType {
									title
								}
								heroImage {
									file {
										url
									}
								}
							}
						}
					}
                    allContentfulPageTapStory(filter: { title: { ne: "WORKAROUND. DO NOT DELETE." } }, limit: 9999, sort: { fields: [date], order: DESC }) {
						edges {
							node {
								id
								title
								contentful_id
								node_locale
								slug
								date
							}
						}
					}
				}
			`
		).then(result => {
			if (result.errors) {
				reject(result.errors);
			}

			let previews = {};
			result.data.menuPreviewEntities.edges.forEach(item => {
				if (item.node.filterVerticalCategory && item.node.isPartOfQatarFoundation) {
					let id = item.node.node_locale === 'en-US' ? item.node.contentful_id : item.node.contentful_id + '___' + item.node.node_locale;
					item.node.ct = 'entity';
					previews[id] = item.node;
				}
			});
			result.data.menuPreviewPagePlaces.edges.forEach(item => {
				if (item.node.filterVerticalCategory) {
					let id = item.node.node_locale === 'en-US' ? item.node.contentful_id : item.node.contentful_id + '___' + item.node.node_locale;
					item.node.ct = 'place';
					previews[id] = item.node;
				}
			});
			result.data.menuPreviewPagePrograms.edges.forEach(item => {
				let id = item.node.node_locale === 'en-US' ? item.node.contentful_id : item.node.contentful_id + '___' + item.node.node_locale;
				item.node.ct = 'program';
				previews[id] = item.node;
			});

			fs.writeFile(`./public/menupreviews.json`, JSON.stringify(previews), 'utf8', () => {
				console.log('wrote menu previews file');
			});

			const templateEvent = path.resolve(`./src/templates/PageEvent.tsx`);
			const templateVertical = path.resolve(`./src/templates/PageVertical.tsx`);
			const templateOverview = path.resolve(`./src/templates/PageOverview.tsx`);
			const templateNewsAndStories = path.resolve(`./src/templates/PageNewsAndStories.tsx`);
			const templateEducationCitySpeakerSeries = path.resolve(`./src/templates/PageEducationCitySpeakerSeries.tsx`);
			const templateEcss = path.resolve(`./src/templates/PageEcss.tsx`);
			const templateFilterEcssTag = path.resolve(`./src/templates/PageEcssTagItems.tsx`);
			const templatePersona = path.resolve(`./src/templates/PagePersona.tsx`);
			const templateExpertProfile = path.resolve(`./src/templates/PageExpertProfile.tsx`);
			const templateEntity = path.resolve(`./src/templates/PageEntity.tsx`);
			const templatePlace = path.resolve(`./src/templates/PagePlace.tsx`);
			const templateProgram = path.resolve(`./src/templates/PageProgram.tsx`);
			const templateCampaign = path.resolve(`./src/templates/PageCampaign.tsx`);
			const templateArticle = path.resolve(`./src/templates/PageArticle.tsx`);
			const templateFilterArticleTag = path.resolve(`./src/templates/PageArticleTagItems.tsx`);
			const templateFilterArticleType = path.resolve(`./src/templates/PageArticleTypeItems.tsx`);
			const templatePressRelease = path.resolve(`./src/templates/PagePressRelease.tsx`);
			const templateMediaGallery = path.resolve(`./src/templates/PageMediaGallery.tsx`);
            const templateTapStory = path.resolve(`./src/templates/PageTapStory.tsx`);
			const templateTapStoryOverview = path.resolve(`./src/templates/PageTapStoryOverview.tsx`)
            const templateWorldCup = path.resolve(`./src/templates/PageWorldCup.tsx`);

			const allEcssExpertProfile = [...result.data.allEcssSpeakerExpertProfile.edges, ...result.data.allEcssModeratorExpertProfile.edges]
            createTapStoryOverview(result.data.allContentfulPageTapStory.edges, templateTapStoryOverview)

			// We want to create a detailed page for each
            result.data.allContentfulPageTapStory.edges.forEach((edge) => {
				createTemplatePage('stories/tap', 'stories/tap', edge, templateTapStory, result.data.allContentfulPageTapStory.edges, {}, result.data)
			});
			result.data.allContentfulEntities.edges.forEach(edge => {
				let events = result.data.allContentfulEvent.edges.filter(event => {
					return edge.node.node_locale === event.node.node_locale && event.node.organiser && event.node.organiser.findIndex(node => node.contentful_id === edge.node.contentful_id) !== -1;
				});
				edge.node.isPartOfQatarFoundation &&
				createPageUnderVertical('entity', 'entity', edge, templateEntity, result.data.allContentfulEntities.edges, result.data.allContentfulFilterVertical.edges, result.data, {
					upcomingPageEvents: events
				});
			});
			result.data.allContentfulPageCampaign.edges.forEach(edge =>
				createPageUnderVertical('campaign', 'campaign', edge, templateCampaign, result.data.allContentfulPageCampaign.edges, result.data.allContentfulFilterVertical.edges, result.data)
			);
			result.data.allContentfulPageArticle.edges.forEach(edge => {
				let relatedEvents = result.data.allContentfulPageArticle.edges.filter(event => {
					let result = false;
					try {
						result =
							edge.node.node_locale === event.node.node_locale &&
							event.node.contentful_id !== edge.node.contentful_id &&
							edge.node.filterVerticalCategory.slug === event.node.filterVerticalCategory.slug;
					} catch (e) {
						result = false;
					}
					return result;
				});
				createPageWithVerticalInfo('stories', 'stories', edge, templateArticle, result.data.allContentfulPageArticle.edges, result.data, { upcomingPageEvents: relatedEvents });
			});
			result.data.allContentfulFilterArticleTag.edges.forEach((edge) => {
				let tagArticles = result.data.allContentfulPageArticle.edges.filter(article => {
					let result = false;
					try {
						result = edge.node.node_locale === article.node.node_locale && article.node.filterArticleTags && article.node.filterArticleTags.find((tag) => tag.contentful_id === edge.node.contentful_id);
					} catch (e) {
						result = false;
					}
					return result;
				});
				createTemplatePage('stories', 'stories', edge, templateFilterArticleTag, result.data.allContentfulFilterArticleTag.edges, { articles: tagArticles }, result.data);
			});
			result.data.allContentfulFilterEcssTag.edges.forEach((edge) => {
				let tagEcss = result.data.allContentfulEcss.edges.filter(ecss => {
					let result = false;
					try {
						result = edge.node.node_locale === ecss.node.node_locale && ecss.node.ecssTag && ecss.node.ecssTag.find((tag) => tag.contentful_id === edge.node.contentful_id);
					} catch (e) {
						result = false;
					}
					return result;
				});
				createTemplatePage('education-city-speaker-series', 'education-city-speaker-series', edge, templateFilterEcssTag, result.data.allContentfulFilterEcssTag.edges, { ecss: tagEcss }, result.data);
			});
			result.data.allContentfulFilterArticleType.edges.forEach((edge) => {
				let tagArticles = result.data.allContentfulPageArticle.edges.filter(article => {
					let result = false;
					try {
						result = edge.node.node_locale === article.node.node_locale && article.node.contentType && article.node.contentType.contentful_id === edge.node.contentful_id;
					} catch (e) {
						result = false;
					}
					return result;
				});
				createTemplatePage('stories', 'stories', edge, templateFilterArticleType, result.data.allContentfulFilterArticleType.edges, { articles: tagArticles }, result.data);
			});
			result.data.allContentfulPagePlace.edges.forEach(edge => {
				let events = result.data.allContentfulEvent.edges.filter(event => {
					return event.node.organiser && event.node.organiser.findIndex(node => node.contentful_id === edge.node.contentful_id) !== -1;
				});
				createPageUnderVertical('place', 'place', edge, templatePlace, result.data.allContentfulPagePlace.edges, result.data.allContentfulFilterVertical.edges, result.data, {
					upcomingPageEvents: events
				});
			});
			result.data.allContentfulPagePersona.edges.forEach(edge =>
				createTemplatePage('about/profile', 'about/profile', edge, templatePersona, result.data.allContentfulPagePersona.edges, {}, result.data)
			);
			result.data.allMediaCenterExpertProfile.edges.forEach(edge =>
				createTemplatePage('media-center/experts', 'media-center/experts', edge, templateExpertProfile, result.data.allMediaCenterExpertProfile.edges, {}, result.data)
			);
			allEcssExpertProfile.forEach(edge =>
				createTemplatePage('education-city-speaker-series/experts', 'education-city-speaker-series/experts', edge, templateExpertProfile, allEcssExpertProfile, {}, result.data)
			);
			result.data.allContentfulPageVertical.edges.forEach(edge => createTemplatePage('', '', edge, templateVertical, result.data.allContentfulPageVertical.edges, {}, result.data));
			result.data.allContentfulPageOverview.edges.forEach(edge => createOverviewPage('', '', edge, templateOverview, result.data.allContentfulPageOverview.edges, result.data));
			result.data.allContentfulPageNewsAndStories.edges.forEach(edge => createOverviewPage('', '', edge, templateNewsAndStories, result.data.allContentfulPageNewsAndStories.edges, result.data));
			result.data.allContentfulPageEducationCitySpeakerSeries.edges.forEach(edge => createOverviewPage('', '', edge, templateEducationCitySpeakerSeries, result.data.allContentfulPageEducationCitySpeakerSeries.edges, result.data));
			result.data.allContentfulPageProgram.edges.forEach(edge => createTemplatePage('program', 'program', edge, templateProgram, result.data.allContentfulPageProgram.edges, {}, result.data));
			result.data.allContentfulPagePressRelease.edges.forEach(edge => {
                if(edge.node.csvPage) {
                        createTemplatePage('media-center', 'media-center', edge, templatePressRelease, result.data.allContentfulPagePressRelease.edges, {}, result.data, true)
                    } else {
                        createTemplatePage('media-center', 'media-center', edge, templatePressRelease, result.data.allContentfulPagePressRelease.edges, {}, result.data, false)
                    }
                }
            );
			result.data.allContentfulMediaGallery.edges.forEach(edge =>
				createTemplatePage('media-center/media-galleries', 'media-center/media-galleries', edge, templateMediaGallery, result.data.allContentfulMediaGallery.edges, {}, result.data)
			);


			result.data.allContentfulEvent.edges.forEach(edge => {
				let relatedEvents = result.data.allContentfulEvent.edges.filter(event => {
					let result = false;
					try {
						result =
							edge.node.node_locale === event.node.node_locale &&
							event.node.contentful_id !== edge.node.contentful_id &&
							edge.node.filterVerticalCategory.slug === event.node.filterVerticalCategory.slug;
					} catch (e) {
						result = false;
					}
					return result;
				});
				createPageWithVerticalInfo('events', 'events', edge, templateEvent, result.data.allContentfulEvent.edges, result.data, { upcomingPageEvents: relatedEvents });
			});

			result.data.allContentfulEcss.edges.forEach(edge => {
				let relatedEvents = result.data.allContentfulEcss.edges.filter(event => {
					let result = false;
					try {
						result =
							edge.node.node_locale === event.node.node_locale &&
							event.node.contentful_id !== edge.node.contentful_id &&
							edge.node.filterVerticalCategory.slug === event.node.filterVerticalCategory.slug;
					} catch (e) {
						result = false;
					}
					return result;
				});
				createPageWithVerticalInfo('education-city-speaker-series', 'education-city-speaker-series', edge, templateEcss, result.data.allContentfulEcss.edges, result.data, { upcomingPageEvents: relatedEvents });
			});

            result.data.allContentfulPageWorldCup.edges.forEach(edge => createOverviewPage('', '', edge, templateWorldCup, result.data.allContentfulPageWorldCup.edges, result.data));

			const dir = path.resolve(`./static/forms`);

			result.data.allContentfulModuleForm.edges.forEach(edge => {
				if (edge.node.formBody) {
					const templateForm = `
					<html style="display: table;">
						<head>
							<script type="text/javascript" src="iframeResizer.contentWindow.min.js"></script>
						</head>
						<body class="custom-form">
							${JSON.parse(edge.node.formBody.raw).content[0].content[0].value}
							<link rel="stylesheet" href="../form-style/FormModule.css">
						</body>
					</html>
				`;
					fs.writeFileSync(`${dir}/form-${edge.node.id}.html`, templateForm, (err) => {
						console.error('Error writing template');
						if (err) throw err;
					});
				}
			});
			
			result.data.allContentfulRedirection.edges.forEach((edge) => {
				if(edge.node.toPath) {
					createRedirect({
						fromPath: edge.node.fromPath,
						toPath: edge.node.toPath.toPath,
						isPermanent: edge.node.isPermanent,
						force: edge.node.force
					});
				}
			});

			createHomeAndSearchPage(result.data.allContentfulEvent.edges, result.data.allContentfulPageArticle.edges);
			resolve();
		});
	});
};

function prefixNodeLocale(node) {
	return node.node_locale === 'ar-QA' ? '/ar/' : `/`;
}

function makePath(pathPrefix, prefix, slug) {
	return `${prefix}${pathPrefix}${slug}`;
}

function findAlternateLanguageVersion(currNode, allNodes, pathPrefix) {
	const alternateLanguageNode = allNodes.find(edge => edge.node.contentful_id === currNode.contentful_id && edge.node.node_locale !== currNode.node_locale);
	if (alternateLanguageNode && alternateLanguageNode.node.slug) {
		return makePath(pathPrefix, prefixNodeLocale(alternateLanguageNode.node), alternateLanguageNode.node.slug);
	}
	return null;
}

exports.onCreateWebpackConfig = ({ stage, actions, getConfig, loaders }) => {
    if (getConfig().mode === "production") {
      actions.setWebpackConfig({
        devtool: false,
      });
    }
    if (stage === "build-javascript" || stage === "develop") {
      const config = getConfig();
      const miniCssExtractPlugin = config.plugins.find(
        (plugin) => plugin.constructor.name === "MiniCssExtractPlugin"
      );
      if (miniCssExtractPlugin) {
        miniCssExtractPlugin.options.ignoreOrder = true;
      }
      actions.replaceWebpackConfig(config);
    }
};

exports.createResolvers = ({ createResolvers }) =>
	createResolvers({
		// node type we want to extend
		ContentfulFilterArticleTag: {
			// name of the field we want to add
			pageArticles: {
				// we return an array of other articles
				type: '[ContentfulPageArticle]',
				// let's allow to specify number of articles returned
				args: { limit: 'Int' },

				async resolve(
					source, // the node we extend
					args,
					// collection of helpers
					// including access to internal store - nodeModel
					ctx
				) {
					let { limit = Number.MAX_SAFE_INTEGER } = args
					let articles = await ctx.nodeModel.getNodesByIds({ids: source['page: article___NODE']});
					if (articles) {
						articles.sort((a, b) => {
							return new Date(b.date) - new Date(a.date);
						});
					}

					return (articles || []).slice(0, limit || 20)
				}
			}
		},// node type we want to extend
		ContentfulFilterArticleType: {
			// name of the field we want to add
			pageArticles: {
				// we return an array of other articles
				type: '[ContentfulPageArticle]',
				// let's allow to specify number of articles returned
				args: { limit: 'Int' },

				async resolve(
					source, // the node we extend
					args,
					// collection of helpers
					// including access to internal store - nodeModel
					ctx
				) {
					let { limit = Number.MAX_SAFE_INTEGER } = args

					let articles = await ctx.nodeModel.getNodesByIds({ids: source['page: article___NODE']});

					if (articles) {
						articles.sort((a, b) => {
							return new Date(b.date) - new Date(a.date);
						});
					}

					return (articles || []).slice(0, limit || 20)
				}
			}
		}
	});

    if(!process.env.NETLIFY) {
        exports.onPreBootstrap = ({ actions }) => {
            const redirects = fs.readFileSync("./static/_redirects").toString()
            for (const line of redirects.split("\n")) {
              if (line.trim().length > 0) {
                const [fromPath, toPath] = line.trim().split(/\s+/)
                actions.createRedirect({
                  fromPath,
                  toPath: toPath.replace(':splat', '*'),
                  isPermanent: true,
                  force: true,
                  redirectInBrowser: true
                })
              }
            }
            console.log(`success create redirects from _redirects`)
        }
    }