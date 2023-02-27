import * as React from 'react';
import * as styles from './Section.module.scss';
import { graphql } from 'gatsby';

const Section = (data: any) => {
	return (
        <section className={`${styles.wrapper} text-style-h3`}>
            {data.data.title}
        </section>
    )
}

export default Section;

export const query = graphql`
	fragment ContentfulFormSectionFragment on ContentfulFormSection {
		title
        uniqueId
        __typename
	}
`;