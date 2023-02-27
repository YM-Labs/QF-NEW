import { globalsQueryAndLayout_entities, globalsQueryAndLayout_places, globalsQueryAndLayout_programs, MainMenuFragment_mapCategories } from '../../gatsby-queries';
import GetMessage from '../../utils/GetMessage';

export function getActiveMenu(data: any[], currLanguage: any) {
	let result = data.filter(menuFragment => menuFragment.node_locale === currLanguage.langKey)[0];
	if (currLanguage.link === '/ar') {
		result.menuItems.forEach(menuItem => {
			menuItem.path = joinPath(currLanguage.link, menuItem.path);
			// menuItem.path = currLanguage.link + '/' + menuItem.path;

			menuItem.subpages?.forEach(menuItem => {
				menuItem.slug = joinPath(currLanguage.link, menuItem.slug);
			});
		});
		result.secondaryMenuItems.forEach(menuItem => {
			menuItem.path = joinPath(currLanguage.link, menuItem.path);
		});
	}
	return result;
}

function joinPath(firstPath: string, secondPath: string) {
	if (secondPath?.indexOf('#') === 0 || secondPath?.indexOf(firstPath) === 0) {
		return secondPath;
	}
	if (secondPath?.indexOf('/') === 0) {
		return firstPath + secondPath;
	} else {
		return firstPath + '/' + secondPath;
	}
}

export type SecondaryMenusParsed = { title: string; id: string; items: any[] }[][];

export function parseSecondaryMenus(
	secondaryMenusData: SecondaryMenusParsed,
	currLanguage: any,
	//@ts-ignore:
	programs: globalsQueryAndLayout_programs,
	places: globalsQueryAndLayout_places,
	entities: globalsQueryAndLayout_entities,
	mapCategories: MainMenuFragment_mapCategories[],
	intl: any = GetMessage
) {
	function languageFilter(item: any) {
		if (currLanguage.langKey === 'ar-QA') {
			return item.node.path.indexOf('/ar/') === 0;
		} else {
			return item.node.path.indexOf('/ar/') !== 0;
		}
	}

	const allEntities = [...entities.edges].filter(languageFilter);
	const allPlaces = [...places.edges].filter(languageFilter);

	const educationEntities = allEntities.filter(edge => edge.node.pageContext.vertical === 'education');
	const researchEntities = allEntities.filter(edge => edge.node.pageContext.vertical === 'research');
	const communityEntities = allEntities.filter(edge => edge.node.pageContext.vertical === 'community');

	const educationPlaces = allPlaces.filter(edge => edge.node.pageContext.vertical === 'education');
	const researchPlaces = allPlaces.filter(edge => edge.node.pageContext.vertical === 'research');
	const communityPlaces = allPlaces.filter(edge => edge.node.pageContext.vertical === 'community');

	var lang_prefix = currLanguage.link === '/ar' ? '/ar' : ''

    //@ts-ignore:
	const idkt_subpages = [
		{
			node: {
				pageContext: {
					id: "1VlF92QaRlvKliniStRZSS",
					title: intl.formatMessage({ id: 'overview' }),
					vertical: "research"
				},
				link: true,
				path: `${lang_prefix}/idkt`
			}
		},
		{
			node: {
				pageContext: {
					id: "5Ck3lib1IDEZFYqVgrjr8Y",
					title: intl.formatMessage({ id: 'for_industry' }),
					vertical: "research"
				},
				link: true,
				path: `${lang_prefix}/idkt/for-industry`
			}
		},
		{
			node: {
				pageContext: {
					id: "5wt4oraHzqabJI4J9fVfHK",
					title: intl.formatMessage({ id: 'for_researchers' }),
					vertical: "research"
				},
				link: true,
				path: `${lang_prefix}/idkt/for-researchers`
			}
		},
		{
			node: {
				pageContext: {
					id: "2aTm0IMJ1LzYrx6baqWR4B",
					title: intl.formatMessage({ id: 'for_entrepreneurs' }),
					vertical: "research"
				},
				link: true,
				path: `${lang_prefix}/idkt/for-entrepreneurs`
			}
		},
		{
			node: {
				pageContext: {
					id: "4KGxqPWwJz3ynaLnH9G6On",
					title: intl.formatMessage({ id: 'technologies' }),
					vertical: "research"
				},
				link: true,
				path: `${lang_prefix}/idkt/technologies`
			}
		},
		{
			node: {
				pageContext: {
					id: "1SicPn2WFgbtqTpzVOey7m",
					title: intl.formatMessage({ id: 'about' }),
					vertical: "research"
				},
				link: true,
				path: `${lang_prefix}/idkt/about`
			}
		},
		{
			node: {
				pageContext: {
					id: "1MbCJsGyeoZ6MDFVP70Izy",
					title: intl.formatMessage({ id: 'infobank' }),
					vertical: "research"
				},
				link: true,
				path: `${lang_prefix}/idkt/info-bank`
			}
		},
		{
			node: {
				pageContext: {
					id: "3I9TVsipoXaqLEx5tc4rDH",
					title: intl.formatMessage({ id: 'road_to_technology_transfer' }),
					vertical: "research"
				},
				link: true,
				path: `${lang_prefix}/idkt/road-to-technology-transfer`
			}
		}
	]

	//Education
	secondaryMenusData[0][0] = {
		title: intl.formatMessage({ id: 'Schools' }),
		id: 'school',
		items: educationEntities.filter(edge => edge.node.pageContext.type === 'school').sort((a, b) => a.node.pageContext.title.localeCompare(b.node.pageContext.title))
	};
	secondaryMenusData[0][1] = {
		title: intl.formatMessage({ id: 'Universities' }),
		id: 'university',
		items: educationEntities.filter(edge => edge.node.pageContext.type === 'university').sort((a, b) => a.node.pageContext.title.localeCompare(b.node.pageContext.title))
	};
	/*	secondaryMenusData[0][2] = {
		title: intl.formatMessage({ id: 'Programs' }),
		id: 'programs',
		items: programs.edges.filter(languageFilter).sort((a, b) => a.node.pageContext.title.localeCompare(b.node.pageContext.title))
	};*/
	/*
	secondaryMenusData[0][4] = { title: intl.formatMessage({ id: 'Places' }), id: 'places', items: educationPlaces.sort((a, b) => a.node.pageContext.title.localeCompare(b.node.pageContext.title)) };*/

	//Research
    /*
	secondaryMenusData[1][0] = { title: intl.formatMessage({ id: 'idkt_long' }), id: 'idkt', items: idkt_subpages };
    */
	secondaryMenusData[1][0] = { title: intl.formatMessage({ id: 'Entities' }), id: 'entities', items: researchEntities.sort((a, b) => a.node.pageContext.title.localeCompare(b.node.pageContext.title)) };

	//Community
	secondaryMenusData[2][0] = { title: intl.formatMessage({ id: 'Entities' }), id: 'entities', items: communityEntities.sort((a, b) => a.node.pageContext.title.localeCompare(b.node.pageContext.title)) };
	secondaryMenusData[2][1] = { title: intl.formatMessage({ id: 'Places' }), id: 'places', items: communityPlaces.sort((a, b) => a.node.pageContext.title.localeCompare(b.node.pageContext.title)) };

	//Map menu:
	secondaryMenusData[4][0] = { title: intl.formatMessage({ id: 'All' }), id: 'all', items: [...allEntities, ...allPlaces].sort((a, b) => a.node.pageContext.title.localeCompare(b.node.pageContext.title)) };
	secondaryMenusData[4][1] = {
		title: intl.formatMessage({ id: 'Education' }),
		id: 'education',
		items: [...educationEntities, ...educationPlaces].sort((a, b) => a.node.pageContext.title.localeCompare(b.node.pageContext.title))
	};
	secondaryMenusData[4][2] = {
		title: intl.formatMessage({ id: 'Research' }),
		id: 'research',
		items: [...researchEntities, ...researchPlaces].sort((a, b) => a.node.pageContext.title.localeCompare(b.node.pageContext.title))
	};
	secondaryMenusData[4][3] = {
		title: intl.formatMessage({ id: 'Community' }),
		id: 'community',
		items: [...communityEntities, ...communityPlaces].sort((a, b) => a.node.pageContext.title.localeCompare(b.node.pageContext.title))
	};

	mapCategories.forEach((category, index) => {
		secondaryMenusData[4][4 + index] = { title: category.title, id: category.id, items: [...category.references] };

		//add to the all list, but not if it's already in there:
		category.references.forEach(item => {
			const alreadyInArray = secondaryMenusData[4][0].items.findIndex(itemIn => itemIn.node.pageContext.id === item.contentful_id || itemIn.contentful_id === item.contentful_id);
			if (alreadyInArray === -1) {
				secondaryMenusData[4][0].items.push(item);
			}
		});
	});
}
