import * as React from 'react';
import * as styles from './InputField.module.scss';
import { FormattedMessage } from 'react-intl';
import { graphql } from 'gatsby';

const InputField = (data: any) => {
    const err = data.errors[data.data.uniqueId]
    let rules = {}
    if(data.data.required) {
        rules = { required: data.data.required }
    }
    if(data.data.type === 'Email') {
        rules = { ...rules, pattern: { 
                value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: "invalid"
            }
        }
    } else if(data.data.type === 'Phone') {
        rules = { ...rules, minLength: 6, maxLength: 12 }
    }

	return (
        <div className={`${styles.wrapper}`}>
            <div className="bx--text-input-wrapper">
                <label className="bx--label">
                    {data.data.title}
                </label>
                <div className="bx--text-input__field-outer-wrapper">
                    <div className="bx--text-input__field-wrapper">
                        <input
                            {...data.register(data.data.uniqueId, rules)}
                            id={data.data.uniqueId}
                            placeholder={data.data.title}
                            type="text"
                            className="bx--text-input two-column"
                            title={data.data.title}
                            aria-describedby={data.data.title}
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

export default InputField;

export const query = graphql`
	fragment ContentfulFormTextFieldFragment on ContentfulFormTextField {
		title
        uniqueId
        required
        type
        __typename
	}
`;