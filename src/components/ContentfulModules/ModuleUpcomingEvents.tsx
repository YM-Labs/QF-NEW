import * as React from 'react';
import { Component } from 'react';
import { ContentfulEventPreviewFragment, ContentfulModuleUpcomingEventsFragment } from '../../gatsby-queries';
import EventsList from '../EventsList';
import { graphql } from 'gatsby';

export default class ModuleUpcomingEvents extends Component<{ events?: ContentfulEventPreviewFragment[]; data: ContentfulModuleUpcomingEventsFragment; animationDirection: 1 | -1 }> {
	render() {
		return this.props.events && this.props.events.length > 0 ? <EventsList animationDirection={this.props.animationDirection} events={this.props.events} /> : null;
	}
}

export const query = graphql`
	fragment ContentfulModuleUpcomingEventsFragment on ContentfulModuleUpcomingEvents {
		title
		id
	}
`;
