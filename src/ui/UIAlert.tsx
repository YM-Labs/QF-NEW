import * as React from 'react';
import * as styles from './UIAlert.module.scss';
import { TweenMax } from 'gsap/dist/gsap.min';
import { EASE_CUSTOM_OUT } from '../utils/Constants';
import { BLOCKS, MARKS, INLINES } from "@contentful/rich-text-types"
import { renderRichText } from "gatsby-source-contentful/rich-text"

const initialState = { showAlertDialog: true };
type State = Readonly<typeof initialState>;

class UIAlert extends React.Component<{ content: any; } & State> {
	readonly state: State = initialState;

	private alertBanner;
	private currScroll = 0;
    private options = {
        renderMark: {
          [MARKS.BOLD]: text => <h4>{text}</h4>,
        },
        renderText: text => {
            return text.split('\n').reduce((children, textSegment, index) => {
                return [...children, index > 0 && <br key={index} />, textSegment];
            }, []);
        },
        renderNode: {
          // @ts-ignore
          [BLOCKS.PARAGRAPH]: (node, children) => children,
          [BLOCKS.EMBEDDED_ASSET]: node => {
            return (
              <>
                <h2>Embedded Asset</h2>
                <pre>
                  <code>{JSON.stringify(node, null, 2)}</code>
                </pre>
              </>
            )
          },
          [INLINES.HYPERLINK]: (node) => {
            return <a href={node.data.uri}>{node.content[0].value}</a>;
          },
        },
    }

	constructor(props) {
		super(props);
		this.closeAlertDialog = this.closeAlertDialog.bind(this);
	}

	private handleScroll = () => {
		this.currScroll = window.pageYOffset;
		if (this.currScroll > 75) {
			document.getElementById('background').style.position = 'fixed';
			document.getElementById('mainmenu').style.position = 'fixed';
			document.getElementById('fixedWrapper').style.position = 'fixed';
			document.getElementById('currLanguage').style.position = 'fixed';

			document.getElementById('background').style.top = '-75px';
			document.getElementById('mainmenu').style.top = '-75px';
			document.getElementById('fixedWrapper').style.top = '-75px';
			document.getElementById('currLanguage').style.top = '-75px';
			document.getElementById('searchWrapper').style.top = '-75px';
		} else {
			document.getElementById('background').style.position = 'absolute';
			document.getElementById('mainmenu').style.position = 'absolute';
			document.getElementById('fixedWrapper').style.position = 'absolute';
			document.getElementById('currLanguage').style.position = 'absolute';

			document.getElementById('background').style.top = '0px';
			document.getElementById('mainmenu').style.top = '0px';
			document.getElementById('fixedWrapper').style.top = '0px';
			document.getElementById('currLanguage').style.top = '0px';
			document.getElementById('searchWrapper').style.top = '0px';
		}
	};

	private showAlertDialog = () => {
		TweenMax.to(this.alertBanner, 1, { css: { marginTop: 75 }, ease: EASE_CUSTOM_OUT, force3D: true, delay: 0 });
		TweenMax.to('#background', 1, { css: { marginTop: 75 }, ease: EASE_CUSTOM_OUT, force3D: true, delay: 0 });
		TweenMax.to('#mainmenu', 1, { css: { marginTop: 75 }, ease: EASE_CUSTOM_OUT, force3D: true, delay: 0 });
		TweenMax.to('#fixedWrapper', 1, { css: { marginTop: 75 }, ease: EASE_CUSTOM_OUT, force3D: true, delay: 0 });
		TweenMax.to('#currLanguage', 1, { css: { marginTop: 75 }, ease: EASE_CUSTOM_OUT, force3D: true, delay: 0 });
		TweenMax.to('#searchWrapper', 1, { css: { marginTop: 75 }, ease: EASE_CUSTOM_OUT, force3D: true, delay: 0 });
		TweenMax.to('#siteWrapper', 1, { css: { marginTop: 75 }, ease: EASE_CUSTOM_OUT, force3D: true, delay: 0 });
	};

	private closeAlertDialog = event => {
		if (event.key == 'Enter') {
			document.getElementById('vidhomepagecontrols').getElementsByTagName('svg')[0].focus();
		}
		if (event.key != 'Tab') {
			if (event) {
				if (event.target.id == 'alertclosebutton') {
					event.preventDefault();
				}
				this.setState({
					showAlertDialog: false
				});
				TweenMax.to(this.alertBanner, 0.5, { css: { marginTop: '-75px' }, ease: EASE_CUSTOM_OUT, force3D: true, delay: 0.2 });
				TweenMax.to('#siteWrapper', 0.5, { css: { marginTop: 0 }, ease: EASE_CUSTOM_OUT, force3D: true, delay: 0.2 });
				TweenMax.to('#background', 0.5, { css: { marginTop: 0 }, ease: EASE_CUSTOM_OUT, force3D: true, delay: 0.2 });
				TweenMax.to('#mainmenu', 0.5, { css: { marginTop: 0 }, ease: EASE_CUSTOM_OUT, force3D: true, delay: 0.2 });
				TweenMax.to('#fixedWrapper', 0.5, { css: { marginTop: 0 }, ease: EASE_CUSTOM_OUT, force3D: true, delay: 0.2 });
				TweenMax.to('#currLanguage', 0.5, { css: { marginTop: 0 }, ease: EASE_CUSTOM_OUT, force3D: true, delay: 0.2 });
				TweenMax.to('#searchWrapper', 0.5, { css: { marginTop: 0 }, ease: EASE_CUSTOM_OUT, force3D: true, delay: 2 });

				document.getElementById('background').style.position = 'fixed';
				document.getElementById('mainmenu').style.position = 'fixed';
				document.getElementById('fixedWrapper').style.position = 'fixed';
				document.getElementById('currLanguage').style.position = 'fixed';
			}
		}
	};

	componentDidMount() {
		this.showAlertDialog();
		window.addEventListener('scroll', this.handleScroll);
	}

	componentDidUpdate() {
		if (!this.state.showAlertDialog) {
			window.removeEventListener('scroll', this.handleScroll);
		}
	}

	public render() {
		return (
			<div>
				{
					<div className={styles.alertWrapper} ref={div => (this.alertBanner = div)}>
						<div className={styles.innerWrapper}>
                            {
                                renderRichText(this.props.content, this.options)
                            }
                            <a
								title={'Close'}
								aria-label={'Close'}
								id="alertclosebutton"
								className={styles.closeButton}
								href="#close-alert"
								onKeyDown={this.closeAlertDialog.bind(this)}
								onClick={this.closeAlertDialog.bind(this)}
							/>
						</div>
					</div>
				}
			</div>
		);
	}
}

export default UIAlert;
