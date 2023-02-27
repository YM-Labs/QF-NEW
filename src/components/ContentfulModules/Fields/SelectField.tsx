import React from 'react'
import * as styles from './SelectField.module.scss';
import { countriesEN, countriesAR } from '../../../data/countries';
import { GenderEN, GenderAR } from '../../../data/options';
import { useIntl, FormattedMessage } from 'react-intl';
import { graphql } from 'gatsby';

const SelectField = (data: any) => {
    const err = data.errors[data.data.uniqueId]
    const allCountries = data.currLang === 'ar-QA' ? countriesAR : countriesEN
    const allGender = data.currLang === 'ar-QA' ? GenderAR : GenderEN
    const intl = useIntl();
    const countriesList = allCountries.map(function (country) {
        return <option className="bx--select-option" value={country.value}>{country.label}</option>
    });
    const genderList = allGender.map(function (gender) {
        return <option className="bx--select-option" value={gender.value}>{gender.label}</option>
    });
    const selectList = data.data.selectOptions?.map(function (list) {
        return (
            <option className="bx--select-option" value={list}>{list}</option>
        )
    });
    const defaultOption = <option className="bx--select-option" value={""}>{ intl.formatMessage({ id: 'select_validation' }) }</option>
    const template = data.data.template
    let selectOptions = [defaultOption, selectList]
    if(template === 'Countries') {
        selectOptions = countriesList
    } else if(template === 'Gender') {
        selectOptions = genderList
    }

    const register = data.register(data.data.uniqueId, { required: data.data.required });

    return (
        <div className={`${styles.wrapper} ${data.data.listView && styles.fullWidth}`}>
            <div>
                <div className="bx--select">
                    <label className="bx--label">
                        {data.data.title}
                    </label>
                    <div className="bx--select-input__wrapper">
                        {
                            data.data.listView ? (
                                <div className={styles.listView}>
                                    {
                                        data.data.selectOptions?.map(function (list) {
                                            return (
                                                <div className={`bx--checkbox-wrapper ${styles.column}`}>
                                                    <input type="checkbox" className="bx--checkbox" id={list} value={list} {...data.register(`${data.data.uniqueId}`)} />
                                                    <label htmlFor={list} className="bx--checkbox-label">
                                                        <span className="bx--checkbox-label-text" dir="auto">
                                                            {list}
                                                        </span>
                                                    </label>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            ) : (
                                <>
                                    <select
                                    onChange={(e) => {
                                        register.onChange(e);
                                        if(e.target.value !== '') {
                                            data.setValue(data.data.uniqueId, e.target.selectedOptions[0].text)
                                        } else {
                                            data.setValue(data.data.uniqueId, null)
                                        }
                                    }}
                                    id={data.data.uniqueId} className="bx--select-input">
                                        {selectOptions}
                                    </select>  
                                    <svg focusable="false" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className="bx--select__arrow"><path d="M8 11L3 6 3.7 5.3 8 9.6 12.3 5.3 13 6z"></path>
                                    </svg>
                                </>
                            )
                        }
                    </div>
                    {err?.type === "required" && 
                            <div className="requirement">
                                <FormattedMessage id='required_field' />
                            </div>
                        }
                </div>
            </div>
        </div>
    );
}

export default SelectField;

export const query = graphql`
	fragment ContentfulFormSelectFieldFragment on ContentfulFormSelectField {
		title
        uniqueId
        selectOptions
        required
        template
        listView
        __typename
	}
`;