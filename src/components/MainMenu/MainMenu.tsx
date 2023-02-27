import * as React from 'react';

import * as styles from './MainMenu.module.scss';
import { globalsQueryAndLayout_entities, globalsQueryAndLayout_places, globalsQueryAndLayout_programs, MainMenuFragment } from '../../gatsby-queries';
import { getActiveMenu, parseSecondaryMenus, SecondaryMenusParsed } from '../MobileMenu/MobileMenuHelpers';
import { MainMenuPreviewItem } from './MainMenuPreviewItem';
import { FormattedMessage, WrappedComponentProps } from 'react-intl';
import GatsbyLink from 'gatsby-link';
import { graphql } from 'gatsby';

const initialState = { activeMenuIndexes: new Array(5), selectedID: '', currentPreviewURL: '', menuData: null, mapListMode: true, hidePreviewWrapper: false, activeItem: null, isOptionsOpen: false, setInitOverflow: null, animate: 0 };
type State = Readonly<typeof initialState> & { menuData: { [key: string]: ResultItem } };

export type ResultItem = {
	contentful_id: string;
	title: string;
	phone: string;
	fax: string;
	email: string;
	node_locale: string;
	type: string[] | null;
	ct: string;
	entityDescription?: {
		entityDescription?: string;
	};
	subtitle?: {
		subtitle?: string;
	};
	filterEntity?: {
		slug: string;
		title: string;
	};
	filterVerticalCategory?: any;
	filterProgramType?: {
		title: string;
	};
	openingHours?: any;
	location: {
		contentful_id: string;
		placeName: string;
		placeAddress: string;
		placeLocation?: {
			lon: number;
			lat: number;
		};
	};
	heroImage?: any;
};

export class MainMenu extends React.Component<
	{
		programs: globalsQueryAndLayout_programs;
		places: globalsQueryAndLayout_places;
		entities: globalsQueryAndLayout_entities;
		data: MainMenuFragment[];
		currLanguage: any;
		open: boolean;
		footerCopyrightMessage: string;
		closeHandler: (event) => void;
		id?: any;
        location?: any;
        handleMap?: (event) => void;
	} & WrappedComponentProps,
	State
> {
	readonly state: State = initialState;
	//@ts-ignore:
	private refLogo: GatsbyLink;
	//@ts-ignore:
	private refMenuItemPreviewWrapper: HTMLDivElement;

	//@ts-ignore:
	private mobileMode = false;

	private activeMenu: MainMenuFragment;
    //@ts-ignore:
    private refMenuItemPreview: MainMenuPreviewItem;
    
	//For holding parsed sub menu data sets (see componentDidUpdate):
	private secondaryMenusData: SecondaryMenusParsed = [[], [], [], [], []]; //Needs to match the 3 verticals + map = 4

	constructor(props) {
		super(props);
		if (typeof window !== 'undefined') {
			fetch('/menupreviews.json')
            .then((resp) => resp.json())
            .then((response) => {
				this.setState({ menuData: response });
			});
		}

		this.activeMenu = getActiveMenu(this.props.data, this.props.currLanguage);
        parseSecondaryMenus(this.secondaryMenusData, this.props.currLanguage, this.props.programs, this.props.places, this.props.entities, this.activeMenu.mapCategories, this.props.intl);
	}

    componentDidMount(): void {
        const subMenuWrapper = typeof document !== 'undefined' && document.getElementById("subMenuWrapper");

        if(subMenuWrapper) {
            subMenuWrapper.setAttribute('data-wobble', '1')
            setTimeout(() => {
                subMenuWrapper.setAttribute('data-wobble', '0')
            }, 700);
        }

        this.setState({
            setInitOverflow: this.props.currLanguage.link === '/ar' ? 'left' : 'right'
        })
    }

    componentDidUpdate(prevProps): void {
        if(this.props.location.pathname !== prevProps.location.pathname) {
            // @ts-ignore
            typeof document !== 'undefined' && document.querySelectorAll('.toggleOptions').forEach( x=> x.setAttribute("aria-expanded", "false"));

            this.activeMenu = getActiveMenu(this.props.data, this.props.currLanguage);
            parseSecondaryMenus(this.secondaryMenusData, this.props.currLanguage, this.props.programs, this.props.places, this.props.entities, this.activeMenu.mapCategories, this.props.intl);

            if(typeof document !== 'undefined' && document.querySelector('.overlay_dark')) {
                document.querySelector('.overlay_dark').remove();
                document.getElementsByTagName("html")[0].style.overflowY = 'auto';
            }
        }
        typeof document !== 'undefined' && document.getElementById("close-megamenu") && document.getElementById("close-megamenu").addEventListener("click", this.handleClick);
    }

    // @ts-ignore
    private highlightParentMenu = (e) => {
        const currItem = e.target.querySelectorAll('ul > div#secondaryMenuList > li:first-child > a')[0]

        if(!e.target.dataset.activesubmenu) {
            if(currItem) {
                currItem.focus()
                currItem.click()
                currItem.className = styles.activeMenu
            }
        } else {
            document.getElementById(e.target.dataset.activesubmenu).click()
        }
    }

    private setActiveClass = (e) => {
        const parentItems = e.target.parentNode.parentNode.children
        e.target.parentNode.parentNode.parentNode.parentNode.setAttribute('data-activesubmenu', e.target.dataset.id)
        
        for (var i = 0; i < parentItems.length; i++) {
            parentItems[i].removeAttribute('id')
            if(parentItems[i].querySelector('a'))
            parentItems[i].querySelector('a').className = ''
        }
        if(e.target.nodeName === 'A') {
            e.target.className = styles.activeMenu
        } else {
            return true
        }

        e.target.parentNode.setAttribute("id", "active")
    }

    private tertiaryMenuItemClicked = (event) => {
		const dataLink = event.target.getAttribute('data-link')
		if (!dataLink && event) {
			event.preventDefault();
		}
		// const menuItemIndex = parseInt(event.target.dataset.index);
		const menuItemID = event.target.dataset.id + (this.props.currLanguage.link === '/ar' ? '___ar-QA' : '');
		if (menuItemID) {
			this.setState({ selectedID: menuItemID, currentPreviewURL: event.target.getAttribute('href') });
		}
		
		if (dataLink) {
			document.getElementById("close-menu").click();
			this.setState({ hidePreviewWrapper: true });
		} else {
		}
	};
        
    private toggleOptions = (e, megaMenu) => {
        var elem = e.target.tagName === 'path' ? e.target.parentElement.parentElement : e.target.tagName === 'svg' ? e.target.parentElement : e.target
        var x = elem.getAttribute("aria-expanded")
        if(x !== null) {
            var overlay = typeof document !== 'undefined' && document.createElement('div');
            var theSpan = typeof document !== 'undefined' && document.createElement("span"); 
            theSpan.id = 'close-megamenu'
            theSpan.className = 'closeMegamenu'
            
            if (x == "true") {
                x = "false"
                if(document.querySelector('.overlay_dark')) {
                    document.querySelector('.overlay_dark').remove();
                    document.getElementsByTagName("html")[0].style.overflowY = 'auto';
                }
                document.documentElement.classList.remove('megamenuOpen');
            } else {
                x = "true"
                if(megaMenu) {
                    overlay.className = 'overlay_dark';
                    if(!document.querySelector('.overlay_dark')) {
                        overlay.appendChild(theSpan); 
                        document.querySelector('body').appendChild(overlay);
                        document.getElementsByTagName("html")[0].style.overflowY = 'hidden';
                    }
                    document.documentElement.classList.add('megamenuOpen');
                }
            }
            // @ts-ignore
            document.querySelectorAll('.toggleOptions').forEach( x=> x.setAttribute("aria-expanded", "false"));
            elem.setAttribute("aria-expanded", x);
    
            if(megaMenu) {
                var activeItem = elem.nextElementSibling?.querySelectorAll('ul > div#secondaryMenuList > li#active > a')[0];
                if(activeItem) {
                    elem.nextElementSibling?.querySelectorAll('ul > div#secondaryMenuList > li#active > a')[0]?.click()
                } else {
                    elem.nextElementSibling?.querySelectorAll('ul > div#secondaryMenuList > li:first-child > a')[0]?.click()
                }
            }
        }
    };

    private handleClick = () => {
        document.querySelectorAll('.secondaryMenuClass').forEach( x=> x.animate([
              { height: `80%` },
              { height: `0%` }
            
            ], {
              duration: 300 //Dunno if can be Infinite
            }
            )
        );

        setTimeout(() => {
            // @ts-ignore
            document.querySelectorAll('.toggleOptions').forEach( x=> x.setAttribute("aria-expanded", "false"));
            if(document.querySelector('.overlay_dark')) {
                document.querySelector('.overlay_dark').remove();
                document.getElementsByTagName("html")[0].style.overflowY = 'auto';
                document.documentElement.classList.remove('megamenuOpen');
            }
        }, 300);
    }

	public render() {
        var pathArray = this.props.location.pathname.split('/');
        var subMenuPath = [
            { path: 'education/', index: 0, style: 'purple' }, 
            { path: '/education', index: 0, style: 'purple' },
            { path: 'ar/education/', index: 0, style: 'purple' }, 
            { path: '/ar/education', index: 0, style: 'purple' },
            { path: 'research/', index: 1, style: 'blue' }, 
            { path: '/research', index: 1, style: 'blue' },
            { path: 'ar/research/', index: 1, style: 'blue' }, 
            { path: '/ar/research', index: 1, style: 'blue' },
            { path: 'community/', index: 2, style: 'red' }, 
            { path: '/community', index: 2, style: 'red' },
            { path: 'ar/community/', index: 2, style: 'red' }, 
            { path: '/ar/community', index: 2, style: 'red' },
            { path: 'world-cup/', index: 3, style: 'orange' }, 
            { path: '/world-cup', index: 3, style: 'orange' },
            { path: 'ar/world-cup/', index: 3, style: 'orange' }, 
            { path: '/ar/world-cup', index: 3, style: 'orange' }
        ]

        let arrayIndex = this.props.currLanguage.link === '/ar' ? 2 : 1
        let arrayPos = this.props.currLanguage.link === '/ar' ? 3 : 2

		return (
			<>
                <div className={`${styles.wrapper} container-padding`}>
                    <div className={styles.content}>
                        <nav id='menu' data-color={subMenuPath.map(page => (page.path === this.props.location.pathname || (pathArray.length > arrayPos && page.path === '/' + pathArray[arrayIndex])) ? page.style : null).join('')} className={`${styles.menu} ${subMenuPath.map(page => (page.path === this.props.location.pathname || (pathArray.length > arrayPos && page.path === '/' + pathArray[arrayIndex])) ? styles[page.style] : null).join('')}`}>
                            <div className={styles.menu__wrapper}>
                                <ul id='menu__menu' className={styles.menu__menu}>
                                    {
                                        this.activeMenu.menuItems.map((menuItem, index) => {
                                            let path = '';
                                            let label = '';
                                            // @ts-ignore
                                            let id = menuItem.contentful_id ? menuItem.contentful_id : '';
                                            // @ts-ignore
                                            if (menuItem.node) {
                                                // @ts-ignore
                                                path = menuItem.node.path;
                                                // @ts-ignore
                                                label = menuItem.node.pageContext.title;
                                                // @ts-ignore
                                                id = menuItem.node.pageContext.id;
                                                // @ts-ignore
                                                link = menuItem.node.link;
                                            } else {
                                                // @ts-ignore
                                                path = menuItem.path ? menuItem.path : menuItem.filterVerticalCategory && menuItem.filterVerticalCategory.slug ? menuItem.filterVerticalCategory.slug + '/' + menuItem.slug : menuItem.slug;
                                                // @ts-ignore
                                                label = menuItem.label ? menuItem.label : menuItem.title;
                                            }
                                            if (path.indexOf('#') !== 0 && path.indexOf('/') !== 0) {
                                                path = '/' + path;
                                            }
                                            return (
                                                <li className='firstItem'>
                                                    <a
                                                        className={`${styles.menu__item} ${subMenuPath.some(page => (page.path === this.props.location.pathname || (pathArray.length > arrayPos && page.path === '/' + pathArray[arrayIndex])) && index === page.index) ? styles.activeSubMenu : ''}`}
                                                        data-index={index}
                                                        href={path}
                                                        tabIndex={0}
                                                        id={index === 0 && 'firstMenuItem'}
                                                        // @ts-ignore
                                                        onClick={() => this.setState({ animate: 1 })}
                                                    >
                                                        {
                                                            label
                                                        }
                                                    </a>
                                                </li>
                                            )
                                        })
                                    }
                                    <li className={`${styles.togglePrimaryMenu} firstItem`}>
                                        <a aria-expanded={false} className={`${styles.menu__item}`} onClick={e => this.toggleOptions(e, false)}>
                                            {
                                                <FormattedMessage id="more" />
                                            }
                                            <svg width="12" height="8" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M10.91.38l.73.68-5.6 6.07L.41 1.06l.74-.68 4.87 5.28z" fill="#000" fillRule="nonzero" />
                                            </svg>
                                        </a>
                                        <ul className={`${styles.primarySecondaryMenu}`}>
                                            {this.activeMenu.secondaryMenuItems.map((menuItem, index) => {
                                                    let isAbsoluteUrl = new RegExp('^(?:[a-z]+:)?//', 'i');
                                                    // @ts-ignore
                                                    let path = menuItem.path ? menuItem.path : menuItem.slug;
                                                    let idkt = menuItem && menuItem.id === 'idkt';
                                                    if (path && path.indexOf('#') !== 0 && path.indexOf('/') !== 0) {
                                                        path = isAbsoluteUrl.test(menuItem.path) ? path : '/' + path;
                                                    }
                                                    if(this.props.currLanguage.langKey === 'ar-QA') {
                                                        path = isAbsoluteUrl.test(path.substring(4)) ? path.substring(4) : path
                                                    }
                                                    
                                                    return (
                                                            <li
                                                                key={index}
                                                                // @ts-ignore
                                                                className={idkt ? 'firstMenuItem' : `secondaryMenuItem${index === 0 ? ' firstSecondaryItem' : menuItem.items && menuItem.items.length === 12 && menuItem.id === 'entities' ? ' firstSecondaryItem' : ''}`}
                                                            >
                                                                {
                                                                    <GatsbyLink
                                                                        activeClassName={styles.currentActivePageLink}
                                                                        data-index={index}
                                                                        className={''}
                                                                        to={path}
                                                                        onClick={path === '#map' ? this.props.handleMap : null}
                                                                    >
                                                                        {
                                                                        // @ts-ignore
                                                                        menuItem.title ? menuItem.title : menuItem.label}
                                                                    </GatsbyLink>
                                                                }
                                                            </li>
                                                    );
                                                })}
                                            </ul>
                                    </li>
                                </ul>
                            </div>
                            {
                                this.props.location.pathname !== '/' && subMenuPath.some(page => (page.path === this.props.location.pathname || (pathArray.length > arrayPos && page.path === '/' + pathArray[arrayIndex]))) && (
                                    <div id='subMenuWrapper' onAnimationEnd={() => this.setState({ animate: 0 })} data-wobble={this.state.animate} className={`${styles.menu__wrapper} ${subMenuPath.map(page => (page.path === this.props.location.pathname || (pathArray.length > arrayPos && page.path === '/' + pathArray[arrayIndex])) ? styles[page.style] : null).join('')}`} data-submenu-name="submenu1" data-overflowing={this.state.setInitOverflow}>
                                    <div id='subMenu' className={`${styles.menu__submenu}`}>
                                        <ul id='subMenuContents'>
                                            {
                                                this.activeMenu.menuItems.map((items, menuIndex) => {
                                                    if(subMenuPath.some(page => (page.path === this.props.location.pathname || (pathArray.length > arrayPos && page.path === '/' + pathArray[arrayIndex])) && menuIndex === page.index)) {
                                                        return (
                                                            <>
                                                            {
                                                            items.subpages.map((menuItem) => {
                                                                let isAbsoluteUrl = new RegExp('^(?:[a-z]+:)?//', 'i');
                                                                // @ts-ignore
                                                                let path = menuItem.path ? menuItem.path : menuItem.slug;
                                                                // @ts-ignore
                                                                let idkt = menuItem && menuItem.id === 'idkt';
                                                                if (path && path.indexOf('#') !== 0 && path.indexOf('/') !== 0) {
                                                                    // @ts-ignore
                                                                    path = isAbsoluteUrl.test(menuItem.path) ? path : '/' + path;
                                                                }
                                                                if(this.props.currLanguage.langKey === 'ar-QA') {
                                                                    path = isAbsoluteUrl.test(path?.substring(4)) ? path?.substring(4) : path
                                                                }
                                                                return (
                                                                    // @ts-ignore
                                                                    <li className={menuItem.subpages && styles.togglePrimaryMenu}>
                                                                        <GatsbyLink
                                                                            activeClassName={styles.currentActivePageLink}
                                                                            to={path === '/ar/undefined' ? null : path}
                                                                            className={styles.menu__item}
                                                                            onClick={this.handleClick}
                                                                        >
                                                                            {
                                                                                // @ts-ignore
                                                                                menuItem.label ? menuItem.label : menuItem.title
                                                                            }
                                                                            {
                                                                                // @ts-ignore
                                                                                menuItem.subpages && (
                                                                                    <svg width="12" height="8" xmlns="http://www.w3.org/2000/svg">
                                                                                        <path d="M10.91.38l.73.68-5.6 6.07L.41 1.06l.74-.68 4.87 5.28z" fill="#000" fillRule="nonzero" />
                                                                                    </svg>
                                                                                )
                                                                            }
                                                                        </GatsbyLink>
                                                                        {
                                                                             // @ts-ignore
                                                                             menuItem.subpages && (
                                                                                <ul className={`${styles.primarySecondaryMenu}`}>
                                                                                    {
                                                                                    // @ts-ignore
                                                                                    menuItem.subpages.map((menuItem, index) => {
                                                                                            let isAbsoluteUrl = new RegExp('^(?:[a-z]+:)?//', 'i');
                                                                                            // @ts-ignore
                                                                                            let path = menuItem.path ? menuItem.path : menuItem.slug;
                                                                                            let idkt = menuItem && menuItem.id === 'idkt';
                                                                                            if (path && path.indexOf('#') !== 0 && path.indexOf('/') !== 0) {
                                                                                                path = isAbsoluteUrl.test(menuItem.path) ? path : '/' + path;
                                                                                            }
                                                                                            if(this.props.currLanguage.langKey === 'ar-QA') {
                                                                                                path = isAbsoluteUrl.test(path.substring(4)) ? path.substring(4) : path
                                                                                                path = '/ar' + path
                                                                                            }
                                                                                            
                                                                                            return (
                                                                                                    <li
                                                                                                        key={index}
                                                                                                        // @ts-ignore
                                                                                                        className={idkt ? 'firstMenuItem' : `secondaryMenuItem${index === 0 ? ' firstSecondaryItem' : menuItem.items && menuItem.items.length === 12 && menuItem.id === 'entities' ? ' firstSecondaryItem' : ''}`}
                                                                                                    >
                                                                                                        {
                                                                                                            <GatsbyLink
                                                                                                                activeClassName={styles.currentActivePageLink}
                                                                                                                data-index={index}
                                                                                                                className={''}
                                                                                                                to={path}
                                                                                                            >
                                                                                                                {
                                                                                                                // @ts-ignore
                                                                                                                menuItem.title ? menuItem.slug === 'education/higher-education' ? this.props.currLanguage.langKey === 'ar-QA' ? 'التعليم العالي بمؤسسة قطر' : 'Universities and Programs' : menuItem.title : menuItem.label}
                                                                                                            </GatsbyLink>
                                                                                                        }
                                                                                                    </li>
                                                                                            );
                                                                                        })}
                                                                             </ul>
                                                                             )
                                                                        }
                                                                    </li>
                                                                );
                                                            })}
                                                            {
                                                            this.secondaryMenusData[menuIndex].map((menuItem, index) => {
                                                                var vertical = null
                                                                if(this.props.location.pathname === 'education/' || this.props.location.pathname === '/education' ||
                                                                this.props.location.pathname === 'ar/education/' || this.props.location.pathname === '/ar/education'
                                                                ) {
                                                                    vertical = <FormattedMessage id='Education' />
                                                                }
                                                                if(this.props.location.pathname === 'research/' || this.props.location.pathname === '/research' ||
                                                                this.props.location.pathname === 'ar/research/' || this.props.location.pathname === '/ar/research'
                                                                ) {
                                                                    vertical = <FormattedMessage id='Research' />
                                                                }
                                                                if(this.props.location.pathname === 'community/' || this.props.location.pathname === '/community' ||
                                                                this.props.location.pathname === 'ar/community/' || this.props.location.pathname === '/ar/community'
                                                                ) {
                                                                    vertical = <FormattedMessage id='Community' />
                                                                }
                                                                if(this.props.location.pathname === 'education-city-world-cup/' || this.props.location.pathname === '/education-city-world-cup' ||
                                                                this.props.location.pathname === 'ar/education-city-world-cup/' || this.props.location.pathname === '/ar/education-city-world-cup'
                                                                ) {
                                                                    vertical = null
                                                                }
                                                                let isAbsoluteUrl = new RegExp('^(?:[a-z]+:)?//', 'i');
                                                                // @ts-ignore
                                                                let path = menuItem.path ? menuItem.path : menuItem.slug;
                                                                if (path && path.indexOf('#') !== 0 && path.indexOf('/') !== 0) {
                                                                    // @ts-ignore
                                                                    path = isAbsoluteUrl.test(menuItem.path) ? path : '/' + path;
                                                                }
                                                                // @ts-ignore
                                                                if(this.props.currLang === 'ar-QA') {
                                                                    path = isAbsoluteUrl.test(path.substring(4)) ? path.substring(4) : path
                                                                }
                                                                
                                                                return (
                                                                    <li
                                                                        id={'submenu-' + index}
                                                                        key={index}
                                                                        data-item={this.state.activeItem}
                                                                        data-activesubmenu={null}
                                                                        // @ts-ignore
                                                                        className={`${styles.toggleSecondaryMenu} secondarySubMenu secondaryMenuItem${index === 0 ? ' firstSecondaryItem' : menuItem.items && menuItem.items.length === 12 && menuItem.id === 'entities' ? ' firstSecondaryItem' : ''}`}
                                                                    >
                                                                        <a
                                                                        aria-expanded={false}
                                                                        onClick={e => this.toggleOptions(e, true)}
                                                                        className={`${styles.menu__item} toggleOptions`}>
                                                                            { menuItem.title }
                                                                            <svg width="12" height="8" xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M10.91.38l.73.68-5.6 6.07L.41 1.06l.74-.68 4.87 5.28z" fill="#000" fillRule="nonzero" />
                                                                            </svg>
                                                                        </a>
                                                                        <ul id='secondaryMenuClass' className={`${styles.secondaryMenu} secondaryMenuClass container-padding`}>
                                                                            <h3 className={styles.secondaryMenuTitle}>{menuItem.title} {vertical && <FormattedMessage id='in_text' />} {vertical} ({menuItem.items.length})</h3>
                                                                            <div id='secondaryMenuList' className={styles.list}>
                                                                                {menuItem.items.map((item, index) => {
                                                                                    let path = item.node.path ? item.node.path : item.node.slug;
                                                                                    if(path === '/research/industry-development-and-knowledge-transfer') {
                                                                                        path = '/idkt'
                                                                                    } else if(path === '/ar/research/industry-development-and-knowledge-transfer') {
                                                                                        path = '/ar/idkt'
                                                                                    }
                                                                                    return (
                                                                                            <li
                                                                                                key={index}
                                                                                                className={styles.li}
                                                                                                onClick={this.setActiveClass}
                                                                                            >
                                                                                                {
                                                                                                    <GatsbyLink
                                                                                                        activeClassName={styles.currentActivePageLink}
                                                                                                        data-id={item.node.pageContext?.id}
                                                                                                        id={item.node.pageContext?.id}
                                                                                                        data-index={index}
                                                                                                        className={styles.secondaryMenuListLink}
                                                                                                        to={path}
                                                                                                        onClick={e => this.tertiaryMenuItemClicked(e)}
                                                                                                    >
                                                                                                        { item.node.pageContext?.title }
                                                                                                    </GatsbyLink>
                                                                                                }
                                                                                            </li>
                                                                                    );
                                                                                })}
                                                                            </div>
                                                                            {/* Prviews (level 3) wrapped:*/
                                                                                !this.state.hidePreviewWrapper && (
                                                                                    <div id='previewWrapper' ref={ref => (this.refMenuItemPreviewWrapper = ref)} className={`${styles.subMenusWrapper} ${styles.previewWrapper}`}>
                                                                                        <MainMenuPreviewItem
                                                                                            closeCallback={this.props.closeHandler}
                                                                                            currentLanguage={this.props.currLanguage.langKey}
                                                                                            menuData={this.state.menuData}
                                                                                            url={this.state.currentPreviewURL}
                                                                                            ref={ref => (this.refMenuItemPreview = ref)}
                                                                                            currentID={this.state.selectedID}
                                                                                            isDesktop={true}
                                                                                        />
                                                                                    </div>
                                                                                )
                                                                            }
                                                                            </ul>
                                                                    </li>
                                                                );
                                                            })}
                                                            </>
                                                        )
                                                    }
                                                })
                                            }
                                        </ul>
                                    </div>
                                </div>
                                )
                            }
                        </nav>
                    </div>
                </div>
			</>
		);
	}
}

export const query = graphql`
	fragment MainMenuFragment on ContentfulMenu {
		node_locale
		twitterLink
		instagramLink
		menuItems {
			id
			label
			path
			subpages {
				... on ContentfulPageEducationCitySpeakerSeries {
                    id
                    slug
                    title
                }
                ... on ContentfulPageVertical {
                    id
                    title
                    slug
                }
                ... on ContentfulMenuItem {
                    id
                    label
                    path
                    subpages {
                        ... on ContentfulPageVertical {
                            id
                            title
                            slug
                        }
                    }
                }
			}
            introText
		}
		secondaryMenuItems {
			id
			title
			path
		}
		mapCategories {
			title
			id
			references {
				contentful_id
				title
				slug
				filterVerticalCategory {
					title
					slug
				}
			}
		}
	}
`;
