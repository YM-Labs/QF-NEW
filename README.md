# Qatar Foundation Website

## Tech Stack

-   GatsbyJS V3 static site project connected to a Contentful backend (https://app.contentful.com/spaces/lkrcd4k1l1zk/entries?id=iNglAMp8hGPnGHom).
-   All React components and JavaScript is authored in TypeScript, thus an IDE with support for TypeScript is highly recommended.
-   CSS is written as CSS Modules in SCSS-syntax.
-   Uses Prettier as a pre-commit hook to make sure all code is formatted correctly before committing.
-   The Github Repo is connected to Netlify and will trigger a build upon push to master.
-   Uses paid Google Maps API for the map.
-   Fonts are bought on fonts.com - https://www.fonts.com/web-projects?projectid=44b037c2-74e8-403c-9371-c27560d682e1 - the font tracking code is included in `src/html.js`

## Browser targets:

Latest version of Safari, Chrome, Edge and FireFox. Minor optimisations has been made to make it work in IE11.

## Search

Uses Swiftype for search, see here for meta-tags documentation: https://swiftype.com/documentation/site-search/crawler-features#meta_tags
Account: https://app.swiftype.com/engines/qatar-foundation/overview
The search index is currently updated on crawl every third day. When the site changes to a live url, it will need to be updated in swiftype to match.

## Running the project

Run `npm install`

Then check `package.json` - scripts section for available commands to run. The `npm run develop-watch` is the local-dev command.

## Generating TypeScript definition files for GraphQL queries:

All data from GraphQL queries generated automatically while building since migrating to Gatsby v3.

## Old Press-release:

In order keep the build time lower all old press releases are moved to static folder under "media-center" directory.
If there is any changes in the old press-release you need to do the following.
1) edit gatsby-node.js file modify the code "allContentfulPagePressRelease(filter: { csvPage: { eq: null } }, limit: 9999)" to allContentfulPagePressRelease(filter: { csvPage: { ne: null } }, limit: 9999)
2) run the build command and copy all files inside public -> media-center and public -> ar -> media-center to `static` folder.

## Further documentation

Since the project is based on GatsbyJS most documentation needed can be found at the official V3 docs: https://v3.gatsbyjs.org/docs/

###This site started as a fork of: https://github.com/mccrodp/gatsby-starter-contentful-i18n
Build on the [Using Contentful](https://github.com/gatsbyjs/gatsby/tree/master/examples/using-contentful) example site using the [i18n community plugin](https://github.com/angeloocana/gatsby-plugin-i18n), this starter repo shows a language switcher and the bilingual content only for the selected language (codes en-US and ar-QA).

Please take a look at the [issue queue](https://github.com/mccrodp/gatsby-contentful-i18n) to help out and feel free to submit PRs :).
