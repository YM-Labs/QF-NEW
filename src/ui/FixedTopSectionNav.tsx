import * as React from 'react';

import * as styles from './FixedTopSectionNav.module.scss';
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin';
import { Sine, gsap } from 'gsap/dist/gsap.min';
import { zeroPad } from '../utils/StringUtils';
import { FormattedMessage } from 'react-intl';

const initialState = { activeSectionIndex: 0, nextSectionIndex: 1, visible: false };
type State = Readonly<typeof initialState>;

export class FixedTopSectionNav extends React.Component<{ sections: any[] }, State> {
	readonly state: State = initialState;

	private sections: HTMLElement[] = [];
	private sectionStarts: number[] = [];
	private currSection = 0;

	private active = false;
	private inited = false;

	private currScroll = 0;

	private scrollToHandler = event => {
		if (event) {
			event.preventDefault();
			const hash = event.target.getAttribute('href');
			gsap.to(window, { scrollTo: { y: hash, autoKill: false }, ease: Sine.easeInOut });
		}
	};

	private handleScroll = () => {
		this.currSection = 0;
		this.currScroll = window.scrollY;
		this.sectionStarts.forEach((offset, index) => {
			if (this.currScroll >= offset) {
				this.currSection = index;
			}
		});
		if (this.currScroll > 500) {
			if (this.state.visible === false) {
				this.setState({ visible: true });
			}
		} else if (this.state.visible === true) {
			this.setState({ visible: false });
		}
		if (this.state.activeSectionIndex !== this.currSection) {
			this.setState({ activeSectionIndex: this.currSection });
            this.setState({ nextSectionIndex: this.currSection + 1 });
		}
	};

	private getOffsetTopForElement(target: HTMLElement): number {
		let offset = 0;
		while (target) {
			offset += target.offsetTop;
			//@ts-ignore:
			target = target.offsetParent;
		}
		return offset;
	}

	private init = (value: boolean) => {
		this.inited = value;
		if (value === true) {
			window.addEventListener('scroll', this.handleScroll);
		} else {
			window.removeEventListener('scroll', this.handleScroll);
		}
	};

	private resizeListener = () => {
		this.active = window.innerWidth >= 0;
		if (this.active) {
			if (!this.inited) {
				this.init(true);
			}
			this.sectionStarts = this.sections.map(section => {
				return this.getOffsetTopForElement(section) - window.innerHeight;
			});
			this.handleScroll();
		} else if (this.inited) {
			this.init(false);
		}
	};

    componentDidUpdate(): void {
        if(document.querySelector('html') && document.querySelector('html').classList.contains('megamenuOpen') && this.state.visible !== false) {
            this.setState({
                visible: false
            })
        }
    }

	componentDidMount() {
		gsap.registerPlugin(ScrollToPlugin);
		window.addEventListener('resize', this.resizeListener);
        window.addEventListener('scroll', this.resizeListener);
		//@ts-ignore:
		this.sections = this.props.sections.map((section, index) => {
			return document.getElementById('section-' + (index + 1));
		});
		this.resizeListener();
		setTimeout(this.resizeListener, 0);
		if (this.active && !this.inited) {
			this.init(true);
		}
	}

	componentWillUnmount() {
		if (this.inited) {
			this.init(false);
		}
		window.removeEventListener('resize', this.resizeListener);
	}

    truncate(input) {
        if (input.length > 15) {
           return input.substring(0, 15) + '...';
        }
        return input;
    };

    isMobile = () => {
        return typeof window !== 'undefined' && window.innerWidth <= 768;
    }

    callMouseOver = () => {
        if(!this.isMobile)
        document.getElementById("upNextTexts").style.display = "none";
    }
    
    callMouseOut = () => {
        if(!this.isMobile)  
        document.getElementById("upNextTexts").style.display = "inline";    
    }

	public render() {
		return (
			<div id='fixedTopSectionNav' data-swiftype-index="false" className={`${styles.wrapper} ${this.state.visible ? ' ' + styles.visible : ''} container-padding`}>
				<div className={styles.sectionWrapper}>
                    <div className={styles.activeSection}>
                        <span className={styles.introText}>
                            <FormattedMessage id='you_are_reading' />
                        </span>
                        <span className={styles.currentSection}>
                            {zeroPad(this.state.activeSectionIndex + 1)}. {this.props.sections[this.state.activeSectionIndex].title}
                        </span>
                    </div>

                    <div className={styles.upNext}>
                        {
                            this.state.nextSectionIndex !== this.props.sections.length && (
                                <>
                                    <span id='upNextTexts' className={`${styles.upNextText}`}>
                                        <FormattedMessage id='up_next' />
                                    </span>
                                    <span className={styles.nextSection} onMouseOver={this.callMouseOver} onMouseOut={this.callMouseOut}>
                                        {zeroPad(this.state.nextSectionIndex + 1)}. {this.props.sections[this.state.nextSectionIndex].title}
                                        &nbsp;
                                        <svg width="12" height="8" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10.91.38l.73.68-5.6 6.07L.41 1.06l.74-.68 4.87 5.28z" fill="#11362A" fillRule="nonzero" />
                                        </svg>
                                        <ul>
                                            {this.props.sections.map((module, index) => {
                                                return (
                                                    <li key={module.id}>
                                                        <a onClick={this.scrollToHandler} className={`text-style-link-1 ${index === this.state.activeSectionIndex ? styles.active : ''}`} href={`#section-${index + 1}`}>
                                                            {zeroPad(index + 1)}. {module.title}
                                                        </a>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </span>
                                </>
                            )
                        }
                    </div>
                </div>
			</div>
		);
	}
}