import * as React from 'react';
import { Component } from 'react';
import * as styles from './ModuleEventsTextbox.module.scss';
// @ts-ignore
import { ContentfulModuleEventsTextboxFragment } from '../gatsby-queries';
import { EventPreview } from '../Previews/EventPreview';
import { graphql } from 'gatsby';

// @ts-ignore
class ModuleEventsTextbox extends Component<{ data: ContentfulModuleEventsTextboxFragment; }> {
	render() {
		return (
            <>
                <div className={'container no-gutters'}>
                    <div className={`module-margin-small ${styles.wrapper} w-100`}>
                        <div className={styles.events}>
                            <h2 className='text-style-h2'>{this.props.data.title}</h2>
                            <div className={styles.eventsWrapper}>
                                {this.props.data.events.map((item) => {
                                        return (
                                            <EventPreview className={''} data={item} newLayout={true} rangeDate={true} />
                                        );
                                    })
                                }
                            </div>
                        </div>
                        <div className={styles.textboxWrapper}>
                            {this.props.data.textbox.titleOptional && <h2 className='text-style-h2'>{this.props.data.textbox.titleOptional.titleOptional}</h2>}
                            <div
                                className={`text-style-body ${styles.body} ${!this.props.data.textbox.isFullWidth && styles.maxWidth}`}
                                dangerouslySetInnerHTML={{ __html: this.props.data.textbox.body?.childMarkdownRemark?.html }}
                            />
                        </div>
                    </div>
                </div>
			</>
		);
	}
}

export default ModuleEventsTextbox;

export const query = graphql`
	fragment ContentfulModuleEventsTextboxFragment on ContentfulModuleEventsTextbox {
		id
		title
        events {
            ...ContentfulEventPreviewFragment
        }
		textbox {
			...ContentfulModuleOneColumnTextFragment
		}
	}
`;
