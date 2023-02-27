import * as React from 'react';
import * as styles from './TextAreaField.module.scss';
import { FormattedMessage } from 'react-intl';
import { graphql } from 'gatsby';

const TextAreaField = (data: any) => {
    const err = data.errors[data.data.uniqueId]
    let rules = {}
    if(data.data.required) {
        rules = { required: data.data.required }
    }

	return (
        <div className={`${styles.wrapper}`}>
            <div className="bx--text-area-wrapper">
                <div className="bx--text-area__field-outer-wrapper">
                    <div className="bx--text-area__field-wrapper">
                        <textarea
                            {...data.register(data.data.uniqueId, rules)}
                            id={data.data.uniqueId}
                            placeholder={data.data.title}
                            type="text"
                            className="bx--text-area two-column"
                            title={data.data.title}
                            aria-describedby={data.data.title}
                            rows={5}
                        />
                    </div>
                    {err?.message && 
                        <div className="requirement">
                            <FormattedMessage id={'email_validation'} />
                        </div>
                    }
                    {err?.type === "required" && 
                        <div className="requirement">
                            <FormattedMessage id={'required_field'} />
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default TextAreaField;

export const query = graphql`
	fragment ContentfulFormTextAreaFieldFragment on ContentfulFormTextAreaField {
		title
        uniqueId
        required
        __typename
	}
`;