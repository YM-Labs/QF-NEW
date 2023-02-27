const languages = require("./src/data/languages");

const rssPageArticleQuery = (limit) => `
{
	allContentfulPageArticle(
            filter: {filterArticleTags: {elemMatch: {slug: {ne: "goals"}}}},
            sort: { order: DESC, fields: [date] }, 
            limit: ${limit}
        ){
		edges {
			node {
				title
				slug
				node_locale
				date
				introductionText {
					childMarkdownRemark {
						html
					}
				}
				filterVerticalCategory {
					title
				}
                filterArticleTags {
					slug
				}
				heroImage {
					file {
                        url
                    }
                }
				teaserImage {
                    file {
                        url
                    }
				}
                rssImage {
                    file {
                        url
                    }
				}
			}
		}
	}
}
`;

const rssPageEventQuery = (limit) => `
{
	allContentfulEvent(
            sort: { order: DESC, fields: [startDate] }, 
            limit: ${limit}
        ){
		edges {
			node {
				title
                startDate
                endDate
                slug
                node_locale
                description {
                    childMarkdownRemark {
                        html
                    }
                }
                filterVerticalCategory {
                    title
                }
                image {
                    file {
                        url
                    }
                }
			}
		}
	}
}
`;

const createRssPageArticle = (edge, site) => {
    return Object.assign({}, edge.node, {
      date: edge.node.date,
      title: edge.node.title,
      description:
        edge.node.introductionText &&
        edge.node.introductionText.childMarkdownRemark.html,
      url: `${edge.node.node_locale && site.siteMetadata.siteUrl}${
        edge.node.node_locale === "ar-QA" ? "/ar/stories/" : "/stories/"
      }${edge.node.slug}`,
      custom_elements: [
        {
          "content:encoded":
            edge.node.introductionText &&
            edge.node.introductionText.childMarkdownRemark.html,
        },
        { category: edge.node.filterVerticalCategory && edge.node.filterVerticalCategory.title },
        { teaser: edge.node.rssImage ? edge.node.rssImage.file.url : edge.node.teaserImage && edge.node.teaserImage.file.url },
      ],
      image_url: edge.node.rssImage ? "https:" + edge.node.rssImage.file.url : edge.node.heroImage && "https:" + edge.node.heroImage.file.url,
      enclosure: {
        url: edge.node.rssImage ? "https:" + edge.node.rssImage.file.url : edge.node.heroImage && "https:" + edge.node.heroImage.file.url,
        type: "image/jpeg",
      },
    });
  };

const createRssEvents = (edge, site) => {
    return Object.assign({}, edge.node, {
        date: edge.node.startDate,
        title: edge.node.title,
        description:
          edge.node.description &&
          edge.node.description.childMarkdownRemark.html,
        url: `${edge.node.node_locale && site.siteMetadata.siteUrl}${
          edge.node.node_locale === "ar-QA" ? "/ar/events/" : "/events/"
        }${edge.node.slug}`,
        custom_elements: [
          {
            "content:encoded":
              edge.node.description &&
              edge.node.description.childMarkdownRemark.html,
          },
          { category: edge.node.filterVerticalCategory && edge.node.filterVerticalCategory.title },
          { teaser: edge.node.image && edge.node.image.file.url },
        ],
        image_url: edge.node.image && "https:" + edge.node.image.file.url,
        enclosure: {
          url: edge.node.image && "https:" + edge.node.image.file.url,
          type: "image/jpeg",
        },
      });
  }; 

const config = {
  siteMetadata: {
    title: `Qatar Foundation`,
    languages,
    siteUrl: `https://www.qf.org.qa`,
  },
  partytownProxiedURLs: [
    `https://www.googletagmanager.com/gtm.js?id=GTM-MBDXSWG`,
    `https://www.googleadservices.com/pagead/conversion_async.js`,
    `https://static.ads-twitter.com/uwt.js`,
    `https://snap.licdn.com/li.lms-analytics/insight.min.js`,
    `https://connect.facebook.net/en_US/fbevents.js`,
    `https://www.google-analytics.com/analytics.js`,
    `https://snap.licdn.com/li.lms-analytics/insight.min.js`,
    `https://vars.hotjar.com/box-63c3a81830bf549dafe40b369003f751.html`
  ],
  plugins: [
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        additionalData: `@use "sass:math";@import "./src/styles/variables";@import "./src/styles/mixins";`,
      },
    },
    `gatsby-plugin-layout`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: "gatsby-plugin-i18n",
      options: {
        langKeyForNull: languages.defaultLangKey,
        langKeyDefault: languages.defaultLangKey,
        useLangKeyLayout: false,
      },
    },
    {
      resolve: `gatsby-source-contentful`,
      options: {
        spaceId: process.env.CONTENTFUL_SPACE_ID || '',
		accessToken: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN || process.env.CONTENTFUL_ACCESS_TOKEN || '',
		host: process.env.CONTENTFUL_HOST
      },
    },
    `gatsby-transformer-remark`,
    `gatsby-plugin-catch-links`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-typescript`,
    `gatsby-plugin-typescript-checker`,
    {
      resolve: "gatsby-plugin-sitemap",
      options: {
        excludes: [
          "/education/aisha-al-muftah-student-at-nu-q",
          "/about/profile/buthaina-al-nuami",
          "/about/profile/dr-ahmad-hasnah",
          "/about/profile/dr-mazen-jassim-jaidah",
          "/about/profile/eng-ghanim-hassan-al-ibrahim",
          "/about/profile/engineer-saad-ebrahim-al-muhannadi",
          "/about/profile/her-excellency-sheikha-al-mayassa-bint-hamad-al-thani",
          "/about/profile/his-excellency-dr-abdullah-bin-hussain-al-kubaisi",
          "/about/profile/his-excellency-dr-mohammed-saleh-al-sada",
          "/about/profile/his-excellency-sheikh-jassim-bin-abdulaziz-al-thani",
          "/about/profile/his-excellency-sheikh-mohammed-bin-hamad-al-thani",
          "/about/profile/machaille-al-naimi",
          "/about/profile/mayan-zebeib",
          "/about/profile/michael-mitchell",
          "/about/profile/mohammed-ali-kareeb",
          "/about/profile/omran-hamad-al-kuwari",
          "/about/profile/richard-o'kennedy",
          "/about/profile/sheikh-salman-bin-hassan-al-thani",
          "/ar/about/profile/buthaina-al-nuami",
          "/ar/about/profile/dr-ahmad-hasnah",
          "/ar/about/profile/dr-mazen-jassim-jaidah",
          "/ar/about/profile/eng-ghanim-hassan-al-ibrahim",
          "/ar/about/profile/engineer-saad-ebrahim-al-muhannadi",
          "/ar/about/profile/her-excellency-sheikha-al-mayassa-bint-hamad-al-thani",
          "/ar/about/profile/his-excellency-dr-abdullah-bin-hussain-al-kubaisi",
          "/ar/about/profile/his-excellency-dr-mohammed-saleh-al-sada",
          "/ar/about/profile/his-excellency-sheikh-jassim-bin-abdulaziz-al-thani",
          "/ar/about/profile/his-excellency-sheikh-mohammed-bin-hamad-al-thani",
          "/ar/about/profile/machaille-al-naimi",
          "/ar/about/profile/mayan-zebeib",
          "/ar/about/profile/michael-mitchell",
          "/ar/about/profile/mohammed-ali-kareeb",
          "/ar/about/profile/omran-hamad-al-kuwari",
          "/ar/about/profile/richard-o'kennedy",
          "/ar/about/profile/sheikh-salman-bin-hassan-al-thani",
        ],
        query: `
				{
					site {
                        siteMetadata {
                            siteUrl
                        }
                    }
                    allSitePage {
                        nodes {
                            path
                        }
                    }
                    allContentfulPagePressRelease(filter: { csvPage: {ne: null} }) {
                        nodes {
                            slug
                            node_locale
                        }
                    }
				}`,
        resolvePages: ({
          allSitePage,
          allContentfulPagePressRelease,
          site,
        }) => {
          const entries = [];
          allSitePage.nodes.map((node) => {
            node.url = site.siteMetadata.siteUrl + node.path;

            entries.push(node);
          });
          allContentfulPagePressRelease.nodes.map((node) => {
            let langPrefix = "/media-center/";
            if (node.node_locale === "ar-QA") {
              langPrefix = "/ar/media-center/";
            }

            node.url = site.siteMetadata.siteUrl + langPrefix + node.slug;
            node.path = node.slug;
            entries.push(node);
          });
          return entries;
        },
      },
    },
    `gatsby-plugin-remove-trailing-slashes`,
    {
      resolve: `gatsby-plugin-canonical-urls`,
      options: {
        siteUrl: `https://www.qf.org.qa`,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Qatar Foundation`,
        short_name: `QF`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#11362a`,
        display: `standalone`,
        icon: "src/assets/images/android-chrome-192x192.png",
      },
    },
    {
      resolve: "gatsby-plugin-feed",
      options: {
        setup(ref) {
          const ret = ref.query.site.siteMetadata;
          ret.allMarkdownRemark = ref.query.allMarkdownRemark;
          ret.generator = "QF Website: www.qf.org.qa";
          return ret;
        },
        query: `
				{
					site {
						siteMetadata {
							siteUrl
							site_url: siteUrl
						}
					}
				}
				`,
        feeds: [
          {
            serialize: ({ query: { site, allContentfulPageArticle } }) =>
              allContentfulPageArticle.edges.map((e) =>
                createRssPageArticle(e, site)
              ),
            query: rssPageArticleQuery(1000),
            output: "/rss.xml",
            title: "QF Stories RSS Feed",
          },
		  {
            serialize: ({ query: { site, allContentfulEvent } }) =>
            allContentfulEvent.edges.map((e) =>
                createRssEvents(e, site)
            ),
            query: rssPageEventQuery(100),
            output: "/events.xml",
            title: "QF Events RSS Feed",
          }	
        ],
      },
    },
    `gatsby-plugin-twitter`,
    {
      resolve: require.resolve(`./src/lib/gatsby-plugin-page-progress`),
      options: {
        height: 2,
        prependToBody: false,
        color: `#6BCDB2`,
        excludePaths: ["/", "/ar"],
      },
    },
    `gatsby-plugin-use-dark-mode`,
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /\.inline\.svg$/,
        },
      },
    },
    `gatsby-plugin-image`,
    {
      resolve: "gatsby-plugin-mailchimp",
      options: {
        endpoint:
          "https://qf.us17.list-manage.com/subscribe/post?u=b1da175100b69d4b652c62219&amp;id=e1e82b84d8",
      },
    },
    {
        resolve: "gatsby-plugin-codegen",
        options: {
            outputFlat: true,
            output: 'src/gatsby-queries.d.ts',
            localSchemaFile: 'gatsby-schema.json'
        }
    },
    `gatsby-plugin-split-css`,
  ],
};

if (process.env.NETLIFY) { 
    config.plugins.push(`gatsby-plugin-netlify`); 
} else {
    config.plugins.push(`gatsby-plugin-gatsby-cloud`); 
}

module.exports = config;
