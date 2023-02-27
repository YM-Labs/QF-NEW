import React from 'react';
import * as styles from './CheckboxField.module.scss';
import { graphql } from 'gatsby';

const CheckboxField = (data: any) => {
    return (
        <div className={`${styles.wrapper}`}>
            <div className="bx--checkbox-wrapper">
                <input type="checkbox" className="bx--checkbox" id={data.data.uniqueId} defaultChecked={data.data.checked} {...data.register(data.data.uniqueId)} />
                <label htmlFor={data.data.uniqueId} className="bx--checkbox-label">
                    <span className="bx--checkbox-label-text" dir="auto">
                        {data.data.title}
                    </span>
                </label>
            </div>
        </div>
    );
}

export default CheckboxField;

export const query = graphql`
	fragment ContentfulFormCheckboxFieldFragment on ContentfulFormCheckboxField {
		title
        uniqueId
        required
        checked
        __typename
	}
`;