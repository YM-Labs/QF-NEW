import * as React from 'react';
import * as styles from './ModuleMediaNumberedTextList.module.scss';
import { Component } from 'react';
import { ContentfulModuleMediaNumberedTextListFragment } from '../../gatsby-queries';
import { graphql } from 'gatsby';
import ModuleVideoYouTube from './ModuleVideoYouTube';
import ModuleVideoEmbedded from './ModuleVideoEmbedded';
import { GatsbyImageWrapper } from '../ui/GatsbyImageWrapper';
import UIPopupOver from '../../ui/UIPopupOver'

const initialState = { activeIndex: 0, showPopup: false, title: null, description: null };
type State = Readonly<typeof initialState>;

class ModuleMediaNumberedTextList extends Component<{ data: ContentfulModuleMediaNumberedTextListFragment }, State> {
	readonly state: State = initialState;

    togglePopup = (e, title, description) => {    
		e.preventDefault();
        this.setState({
            title: title,
            description: description,
            showPopup: !this.state.showPopup
        })

        var overlay = typeof document !== 'undefined' && document.createElement('div');
        if(!this.state.showPopup) {
            overlay.className = 'overlay';
            overlay.id = 'bg__overlay';
            document.querySelector('body').appendChild(overlay);
        } else {
            const overlay = document.getElementById('bg__overlay');
            overlay.remove();
        }
    }

	render() {
		if (this.props.data.mediaNumberedTextListTitle) {
			return (
                <div className={'module-margin'}>
                    {
                            <UIPopupOver 
                                title={this.state.title}
                                description={this.state.description}
                                closePopup={this.togglePopup}
                                showPopup={this.state.showPopup}
                            />
                    }
                    {this.props.data.mediaNumberedTextListTitle.childMarkdownRemark && (
                        <div className={`text-style-quote`}
                                dangerouslySetInnerHTML={{ __html: this.props.data.mediaNumberedTextListTitle.childMarkdownRemark.html }} />
                    )}
                    <div className={styles.wrapper}>
                        {this.props.data.video && (this.props.data.video.__typename === 'ContentfulModuleVideoYouTube' ? <ModuleVideoYouTube data={this.props.data.video} /> :
                            <ModuleVideoEmbedded data={this.props.data.video} />)}
                            {
                                !this.props.data.video && (
                                        // @ts-ignore
                                        <GatsbyImageWrapper alt={this.props.data.image.title} image={this.props.data.image} />
                                    )
                            }
                        <div className={styles.listWrapper}>
                            {this.props.data.listItems.map((item, index) => {
                                return <div className={styles.textWrapper + (index === this.state.activeIndex ? ' ' + styles.active : '')} key={item.id + index}>
                                    <span className={styles.sectionNumber}>0{(index + 1)}</span>
                                    {
                                        // @ts-ignore
                                        <div className={styles.descWrapper} onClick={(e) => this.togglePopup(e, item.title.title, item.description.description)}>
                                            <h2>
                                                {
                                                    // @ts-ignore
                                                    item.title.title
                                                }
                                            </h2>
                                            {
                                                // @ts-ignore
                                                <div className={styles.desc} dangerouslySetInnerHTML={{ __html: item.calloutText }} />
                                            }
                                        </div>
                                    }
                                </div>;
                            })}
                        </div>
                    </div>
                </div>
			);
		} else {
			return <span />;
		}
	}
}

export default ModuleMediaNumberedTextList;

export const query = graphql`
	fragment ContentfulModuleMediaNumberedTextListFragment on ContentfulModuleMediaNumberedTextList {
		id
		mediaNumberedTextListTitle {
			childMarkdownRemark {
				html
			}
		}
		video {
			... on ContentfulModuleVideoYouTube {
				__typename
				...ContentfulModuleVideoYouTubeFragment
			}
			... on ContentfulModuleVideoEmbedded {
				__typename
				...ContentfulModuleVideoEmbeddedFragment
			}
		}
		image {
			title
			gatsbyImageData(
                placeholder: NONE
                width: 960
                height: 740
                quality: 85
              )
		}
		listItems {
			id
            title {
                title
            }
            calloutText
            description {
                description
            }
            image {
                title
                thumb: gatsbyImageData(
                    placeholder: NONE
                    width: 120
                    height: 120
                    quality: 85
                    )
            }
            ctaTextOptional
            ctaLinkOptional
		}
	}
`;