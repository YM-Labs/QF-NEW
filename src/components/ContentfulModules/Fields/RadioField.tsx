import React, { useState } from 'react';
import * as styles from './RadioField.module.scss';
import { graphql } from 'gatsby';
import { useIntl, FormattedMessage } from 'react-intl';

var apiConfig = 'https://prod-33.westeurope.logic.azure.com:443/workflows/247de822e0f84c33ab661b0190c2770b/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=y8uQujSIPq-Tjiy8M93YQca78H_uv9wWgJ9k0WcnIj8'

// @ts-ignore
const RadioField = (data: any, inPerson?: boolean, inPersonCapacity?: number, inPersonLimitReached?: boolean) => {
    const intl = useIntl();
    const [covidChekcbox, setCovidChekcbox] = useState(false)
    const [capacityReached, setCapacityReached] = useState(false)
    const [covidChekcboxChecked, setCovidChekcboxChecked] = useState(true)
    const err = data.errors[data.data.uniqueId]

    async function onChange(selected) {
        if(selected === intl.formatMessage({ id: 'In-person' })) {
            setCovidChekcbox(true);
            var payload = {
                "email": ''
            }
            await fetch(apiConfig, { 
                method: 'POST', 
                body: JSON.stringify(payload), 
                headers: {'Content-Type': 'application/json'}
            })
            .then((response) => {
                response.json().then((jsonResponse) => {
                        var keep = ['key', 'value'];
                        for(var i = 0;i < jsonResponse.value.length; i++) {
                            for(var key in jsonResponse.value[i]) {
                                if(keep.indexOf(key) === -1) delete jsonResponse.value[i][key];
                            }
                        }
                        if(jsonResponse.value[1]?.value <= data.inPersonCapacity) {
                            setCapacityReached(false)
                            data.callBack(false);
                            data.clearErrors('max-capacity-reached')
                        } else {
                            setCapacityReached(true)
                            data.callBack(true);
                            data.setError("max-capacity-reached", { type: 'custom', message: 'max-capacity-reached' });
                        }
                    });
            });
        } else {
            data.clearErrors('max-capacity-reached')
            setCovidChekcbox(false)
            data.callBack(false);
        }
    }

    const handleChange = (checked) => {
        if(checked) {
            setCovidChekcboxChecked(true);
        } else {
            setCovidChekcboxChecked(false)
        }
    }
    const register = data.register(data.data.uniqueId, { required: data.data.required });
    return (
        <div className={`${styles.wrapper}`} id={data.data.uniqueId}>
                <label className="bx--label">{data.data.title}</label>
                <div className="bx--form-item">
                    <div className="bx--radio-button-group">
                        {
                            data.data.options?.map((list, i) => {
                                return (
                                    <>
                                        <input id={data.data.uniqueId + "-" + list}
                                        onChange={
                                            (event) => {
                                                register.onChange(event);
                                                if(event.target.value !== '') {
                                                    data.setValue(data.data.uniqueId, event.target.value)
                                                } else {
                                                    data.setValue(data.data.uniqueId, null)
                                                }
                                                data.data.template === 'Covid-19 vaccination2' && onChange(event.target.value);
                                            }} value={list} className="bx--radio-button" type="radio" name={data.data.uniqueId} defaultChecked={i === 0 ? true : false} tabIndex={0} />
                                        <label htmlFor={data.data.uniqueId + "-" + list} className="bx--radio-button__label">
                                            <span className="bx--radio-button__appearance"></span>
                                            {list}
                                        </label>
                                    </>
                                )
                            })
                        }
                    </div>
                </div>
                { covidChekcbox && (
                    capacityReached ? (
                        <div className="form-error form-margin-top" id="capacity_error">
                            <FormattedMessage id='capacity_validation' />
                        </div>
                    ) : (
                        <div className="bx--checkbox-wrapper flex">
                            <input {...data.register('covid-19-vaccinated', { required: true } )} defaultChecked={true} type="checkbox" className="bx--checkbox" id='covid-19-vaccinated' name='covid-19-vaccinated' onChange={e => handleChange(e.target.checked)} />
                            <label htmlFor={'covid-19-vaccinated'} className="bx--checkbox-label">
                                <span className="bx--checkbox-label-text" dir="auto">
                                    <FormattedMessage id='vaccinated_statement' />
                                    {
                                    // @ts-ignore
                                    !covidChekcboxChecked && 
                                        <div className="requirement require">
                                            <FormattedMessage id='required_field' />
                                        </div>
                                    }
                                </span>
                            </label>
                        </div>
                    )
                    )
                }
            {err?.type === "required" && 
                <div className="requirement">
                    <FormattedMessage id='required_field' />
                </div>
            }
        </div>
    );
}

export default RadioField;

export const query = graphql`
	fragment ContentfulFormRadioFieldFragment on ContentfulFormRadioField {
		title
        uniqueId
        options
        template
        required
        __typename
	}
`;