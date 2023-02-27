import * as React from 'react';
import Link from 'gatsby-link';
import SelectLanguage from './SelectLanguage';

import * as styles from './Header.module.scss';
import Hamburger from './Hamburger';
import Search from './Search/Search';
import { globalsQueryAndLayout_entities, globalsQueryAndLayout_places, globalsQueryAndLayout_programs, MobileMenuFragment } from '../gatsby-queries';
import { MainMenu } from './MainMenu/MainMenu';
import { MobileMenu } from './MobileMenu/MobileMenu';
import { WrappedComponentProps, injectIntl } from 'react-intl';
import UIAlert from '../ui/UIAlert';
import DarkModeToggle from '../ui/DarkModeToggle';

const initialState = { menuOpen: false, menuInit: false };
type State = Readonly<typeof initialState>;

class Header extends React.Component<
	{
		programs: globalsQueryAndLayout_programs;
		places: globalsQueryAndLayout_places;
		entities: globalsQueryAndLayout_entities;
		menuData: MobileMenuFragment[];
		langs: any[];
		footerCopyrightMessage: string;
		alternateURL: string;
		currPageTitle: string;
		pageTitle?: string;
		location: any;
		bilingual?: boolean;
        topBarInfo?: any;
	} & WrappedComponentProps,
	State
> {
	readonly state: State = initialState;
	private refMenu: MobileMenu;

	constructor(props) {
		super(props);

		if (typeof window !== 'undefined') {
			window.addEventListener('hashchange', this.hashChangeHandler);
		}
	}

    resizeHandler = () => {
        const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
        let path = this.props.location.pathname;
		const isFrontPage = path === '/' || path === '/ar' || path === '/ar/';
        if(isMobile) {
            document.getElementById("background").style.height = '60px';
        } else if(isFrontPage) {
            document.getElementById("background").style.height = '61px';
        } else {
            let subMenu = document.getElementById("subMenu");
            if(document.getElementById('menu'))
            document.getElementById("background").style.height = document.getElementById('menu').clientHeight + (typeof(subMenu) !== 'undefined' && subMenu!== null ? 10 : 0) + 'px';
        }

        this.setState({ menuInit: isMobile });
        if(this.state.menuOpen) {
            this.setState({ menuOpen: false });
            document.documentElement.style.overflowY = 'scroll';
        }
    }

    componentDidUpdate(prevProps): void {
        if(this.props.location.pathname !== prevProps.location.pathname) {
            this.resizeHandler()
        }
    }

	componentDidMount(): void {
		setTimeout(this.hashChangeHandler, 0);
        this.resizeHandler()
        window.addEventListener('resize', this.resizeHandler);

        document.addEventListener('userway:init_completed', function (event) {
            // @ts-ignore
            var instance = event.detail.userWayInstance
            instance.iconVisibilityOff()
        })

        document.addEventListener('userway:render_completed', function () {
            let userwayIcon = document.getElementById('accessibilityWidget')
            userwayIcon.style.display = 'flex'
        })

        this.scrollEventThrottle((scrollPos, previousScrollPos) => {
            var fixedTopSectionNav = document.getElementById('fixedTopSectionNav')
            if (previousScrollPos > scrollPos && scrollPos > 0) {
                document.getElementById("wrapper").style.top = "0";
                document.getElementById("background").style.top = "0";
                if(fixedTopSectionNav)
                fixedTopSectionNav.style.top = "-9999.0rem";
            } else if(scrollPos < 60) {
                document.getElementById("wrapper").style.top = "0";
                document.getElementById("background").style.top = "0";
            } else {
                let path = this.props.location.pathname;
                const isFrontPage = path === '/' || path === '/ar';

                if(isFrontPage) {
                    document.getElementById("wrapper").style.top = "0";
                    document.getElementById("background").style.top = "0";
                } else {
                    if(fixedTopSectionNav)
                    fixedTopSectionNav.style.top = "0";
                    
                    document.getElementById("wrapper").style.top = "-9999.0rem";
                    document.getElementById("background").style.top = "-9999.0rem";
                }
            }
        });
	}

    private scrollEventThrottle = (fn) => {
        let last_known_scroll_position = 0;
        let ticking = false;
        window.addEventListener("scroll", function () {
          let previous_known_scroll_position = last_known_scroll_position;
          last_known_scroll_position = window.scrollY;
          if (!ticking) {
            window.requestAnimationFrame(function () {
              fn(last_known_scroll_position, previous_known_scroll_position);
              ticking = false;
            });
            ticking = true;
          }
        });
    }

	private hashChangeHandler = () => {
		if (window.location.hash && window.location.hash.indexOf('#map') === 0) {
			if (!this.state.menuOpen) {
				this.refMenu.instantOpen = true;
				this.setState({ menuOpen: true });
			}
			setTimeout(() => {
                this.refMenu.openMap();
			}, 0);
		}
	};

    private mapClickHandler = (e) => {
        e.preventDefault();
        if (!this.state.menuOpen) {
            this.refMenu.instantOpen = true;
            this.setState({ menuOpen: true });
        }
        setTimeout(() => {
            this.refMenu.openMap();
        }, 0);
	};

	private closeHandler = event => {
		if (event) {
			const href = event.target.getAttribute('href');
			if (href && href.indexOf('#') === 0) {
				event.preventDefault();
			}
		}
        // @ts-ignore
        document.querySelectorAll('.toggleOptions').forEach( x=> x.setAttribute("aria-expanded", "false"));
		if (this.state.menuOpen) {
			this.setState({ menuOpen: false });
            document.getElementById('NavigationBg') && document.getElementById('NavigationBg').classList.remove("menu-open")
		} else {
            document.documentElement.style.overflowY = 'scroll';
        }
	};

	private toggleHandler = event => {
		if (event) {
			event.preventDefault();
		}

        this.setState({
            menuOpen: !this.state.menuOpen
        }, () => {
            if(this.state.menuOpen) {
                document.getElementById('NavigationBg') && document.getElementById('NavigationBg').classList.add("menu-open")
                document.getElementById('progress-container') && document.getElementById('progress-container').classList.add("inMenu")
                document.documentElement.style.overflowY = 'hidden';
            } else {
                document.getElementById('NavigationBg') && document.getElementById('NavigationBg').classList.remove("menu-open")
                document.getElementById('progress-container') && document.getElementById('progress-container').classList.remove("inMenu")
                document.documentElement.style.overflowY = 'scroll';
            }
        });
	};

    private isTapStory = () => {
		const splitLocation = this.props.location.pathname.split("/").filter(split => split != "")
        if(this.props.langs[1].selected)
            splitLocation.pop()
		return splitLocation.includes("tap") && splitLocation.length >= 3
	}

    private handleAccessibilityWidget = (event) => {
        if (event) {
			event.preventDefault();
		}
        // @ts-ignore
        typeof UserWay !== 'undefined' && UserWay.widgetOpen()
    }

	render() {
		const currLanguage = this.props.langs[1].selected ? this.props.langs[1] : this.props.langs[0];
		return (
			<div id='wrapper' className={`${styles.wrapper}`}>
				<div className={styles.background} id="background" />
                {
                    !this.isTapStory() && (
                    this.state.menuInit ? (
                        <>
                            <MobileMenu
                                ref={ref => (this.refMenu = ref)}
                                programs={this.props.programs}
                                places={this.props.places}
                                entities={this.props.entities}
                                closeHandler={this.closeHandler}
                                open={this.state.menuOpen}
                                footerCopyrightMessage={this.props.footerCopyrightMessage}
                                currLanguage={currLanguage}
                                data={this.props.menuData}
                                intl={this.props.intl}
                                id="mobilemenu"
                                alternateURL={this.props.alternateURL}
                                langs={this.props.langs}
                                location={this.props.location}
                            >
                            </MobileMenu>
                            <Hamburger toggleHandler={this.toggleHandler} />
                        </>

                    ) : (
                        <>
                            <MobileMenu
                                ref={ref => (this.refMenu = ref)}
                                programs={this.props.programs}
                                places={this.props.places}
                                entities={this.props.entities}
                                closeHandler={this.closeHandler}
                                open={this.state.menuOpen}
                                footerCopyrightMessage={this.props.footerCopyrightMessage}
                                currLanguage={currLanguage}
                                data={this.props.menuData}
                                intl={this.props.intl}
                                id="mobilemenu"
                                alternateURL={this.props.alternateURL}
                                langs={this.props.langs}
                                location={this.props.location}
                            >
                            </MobileMenu>
                            <MainMenu
                                programs={this.props.programs}
                                places={this.props.places}
                                entities={this.props.entities}
                                handleMap={this.mapClickHandler}
                                closeHandler={this.closeHandler}
                                open={this.state.menuOpen}
                                footerCopyrightMessage={this.props.footerCopyrightMessage}
                                currLanguage={currLanguage}
                                data={this.props.menuData}
                                intl={this.props.intl}
                                id="mainmenu-desktop"
                                location={this.props.location}
                            >
                            </MainMenu>
                            <Hamburger toggleHandler={this.toggleHandler} />
                        </>
                    ))
                }
				<div className={styles.fixedWrapper} id="fixedWrapper">
					<Link
						title={this.props.intl.formatMessage({ id: 'headerlogotitle' })}
						tabIndex={0}
						aria-label={this.props.intl.formatMessage({ id: 'headerlogoarialabel' })}
						className={styles.logo}
						to={this.props.langs[1].selected ? '/ar' : '/'}
					/>
					{!this.isTapStory() && (
						<button className={`${styles.accessibilityWidget}`} id="accessibilityWidget" onClick={this.handleAccessibilityWidget}>
							<span>{this.props.intl.formatMessage({ id: 'accessibility' })}</span>
							<svg className={styles.accessibilityIcon} width="22px" height="22px" viewBox="0 0 22 22" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
								<title>accessibility_icon</title>
								<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
									<g id="Group" transform="translate(0.800000, 0.800000)">
										<g transform="translate(4.263565, 1.973684)" className={styles.line} fill-rule="nonzero">
											<circle id="Oval" cx="5.60485624" cy="2.17105263" r="2.17105263"></circle>
											<path d="M0.407487816,5.78947368 L3.4338036,7.5 L3.4338036,10.1315789 L1.65748782,14.6052632 C1.46011939,15.0657895 1.59169834,15.6578947 2.05222466,15.9210526 C2.57854045,16.25 3.30222466,15.9868421 3.49959308,15.4605263 L5.60485624,10.3289474 L6.06538255,10.3289474 L8.10485624,15.3947368 C8.30222466,15.8552632 8.76275097,16.1842105 9.28906676,16.0526316 C9.88117203,15.9210526 10.2101194,15.2631579 10.012751,14.6710526 L8.17064571,10.1315789 L8.17064571,7.5 L11.131172,5.78947368 C11.3943299,5.65789474 11.5916983,5.32894737 11.5916983,5 L11.5916983,5 C11.5916983,4.34210526 10.8680141,3.88157895 10.2759089,4.21052632 L8.10485624,5.39473684 L3.49959308,5.39473684 L1.32854045,4.21052632 C0.736435184,3.88157895 0.0127509734,4.27631579 0.0127509734,5 L0.0127509734,5 C-0.0530385003,5.32894737 0.144329921,5.65789474 0.407487816,5.78947368 Z" id="Path"></path>
										</g>
										<circle id="Oval" className={styles.circle} stroke-width="0.75" stroke-linecap="round" stroke-linejoin="round" cx="10" cy="10" r="10"></circle>
									</g>
								</g>
							</svg>
						</button>
						)
                	}
                    { !this.state.menuInit && <DarkModeToggle /> }
					{this.props.bilingual !== false && (
						<div className={styles.languageToggleWrapper}>
							<SelectLanguage
								isSearch={this.props.currPageTitle === 'Search' || this.props.currPageTitle === 'بحث' ? true : false}
								inMenu={false}
								alternateURL={this.props.alternateURL}
								langs={this.props.langs}
							/>
						</div>
					)}
				</div>
                {
                    (!this.state.menuOpen && !this.isTapStory()) && (
                        <Search currLanguage={currLanguage} id="currLanguage" />
                    )
                }
				{
                    this.props.topBarInfo && (
                        // @ts-ignore
                        !this.isTapStory() && <UIAlert content={this.props.topBarInfo}></UIAlert>
                    )
				}
			</div>
		);
	}
}

export default injectIntl(Header);
