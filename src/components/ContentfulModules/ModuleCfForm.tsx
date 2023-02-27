import React, { useEffect, useState } from "react";
import "../../lib/carbon-components/scss/components/checkbox/_checkbox.scss";
import "../../lib/carbon-components/scss/components/select/_select.scss";
import "../../lib/carbon-components/scss/components/form/_form.scss";
import "../../lib/carbon-components/scss/components/text-input/_text-input.scss";
import * as styles from './ModuleCfForm.module.scss';
// @ts-ignore
import { ContentfulModuleCfFormFragment } from '../../gatsby-queries';
import InputField from './Fields/InputField'
import SelectField from './Fields/SelectField'
import CheckboxField from './Fields/CheckboxField'
import { useForm } from "react-hook-form";
import { BLOCKS, INLINES, MARKS } from "@contentful/rich-text-types";
import { renderRichText } from "gatsby-source-contentful/rich-text";
import { FormattedMessage } from 'react-intl';
import ViewableMonitor from '../ui/ViewableMonitor';
import htmr from 'htmr';
import { GatsbyImageWrapper } from '../ui/GatsbyImageWrapper';
import { graphql } from 'gatsby';
import "../../lib/carbon-components/scss/components/radio-button/_radio-button.scss";
import "../../lib/carbon-components/scss/components/text-area/_text-area.scss";
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin';
import { Sine, gsap } from 'gsap/dist/gsap.min';
import TextAreaField from './Fields/TextAreaField'
import RadioField from './Fields/RadioField'
import Section from './Fields/Section'

var _cookie = typeof document !== 'undefined' && document.cookie

const ModuleCfForm = (data: any) => {
    const { register, handleSubmit, setValue, setError, clearErrors, formState: { errors, isSubmitting } } = useForm();
    const [userInfo, setUserInfo] = useState([])
    const [inPersonLimitReached, setInPersonLimitReached] = useState(false)

    const onSubmit = async (formData) => {
        formData.subjectTitle = data.data.title
        formData.formId = data.data.uniqueId
        formData.userInfo = userInfo
        var isDocument = typeof document !== 'undefined'
        if(data.ecss) {
            const emailBody = htmr(isDocument && document.getElementById("emailTemplate")?.innerHTML);
            formData.email_body = emailBody
            formData.email_subject = data.subject
        }
        await fetch(data.data.submissionUrl, { 
            method: 'POST', 
            body: JSON.stringify(formData), 
            headers: {'Content-Type': 'application/json'}
        })
        .then(() => {
            var form = isDocument && document.getElementById(data.data.uniqueId);
            var thankYou = isDocument && document.getElementById(data.data.uniqueId + '-thankYouMessage');

            if(data.data.uniqueSubmission) {
                document.cookie = data.data.uniqueId + "=1";
                form.style.display = 'none'
                thankYou.style.display = 'block'
                gsap.to(window, { scrollTo: { y: '#' + data.data.uniqueId + '-thankYouMessage', offsetY: 105, autoKill: false }, ease: Sine.easeInOut });
            } else {
                form.style.display = 'none'
                thankYou.style.display = 'block'
                gsap.to(window, { scrollTo: { y: '#' + data.data.uniqueId + '-thankYouMessage', offsetY: 105, autoKill: false }, ease: Sine.easeInOut });
                if(data.ecss) {
                    thankYou.style.marginTop = '-30px'
                    document.getElementById("ecssFormHeading").style.display = 'none'
                    document.getElementById('poll').style.display = 'block'
                }
            }
        })
        .catch((err) => {
            console.log(err)
        })
    }

    const dir = data.languageCode === 'ar-QA' ? 'rtl' : 'ltr'
    const options = {
        renderMark: {
          [MARKS.BOLD]: text => <b>{text}</b>,
        },
        renderText: text => {
            return text.split('\n').reduce((children, textSegment, index) => {
                return [...children, index > 0 && <br key={index} />, textSegment];
            }, []);
        },
        renderNode: {
          // @ts-ignore
          [BLOCKS.PARAGRAPH]: (node, children) => <p style={{ Margin: '0', webkitTextSizeAdjust: 'none', msTextSizeAdjust: 'none', msoLineHeightRule: 'exactly', lineHeight: '21px', color: '#5f6062', fontSize: '14px'}} dir={dir}>{children}</p>,
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
            return <a href={node.data.uri} style={{ top: '10px', fontSize: '18px', position: 'relative' }}>{node.content[0].value}</a>;
          },
        },
    }

    useEffect(() => {
        gsap.registerPlugin(ScrollToPlugin);
        const cookie = ("; "+ _cookie).split("; " + data.data.uniqueId + "=").pop().split(";").shift()
        if(data.data.uniqueSubmission && cookie === '1') {
            var isDocument = typeof document !== 'undefined'
            var form = isDocument && document.getElementById(data.data.uniqueId);
            var thankYou = isDocument && document.getElementById('thankYouMessage');

            if(form) {
                form.style.display = 'none'
            }
            if(thankYou) {
                thankYou.style.display = 'block'
            }
        }

        const url = 'https://www.cloudflare.com/cdn-cgi/trace';
        fetch(url)
        .then(res => res.text())
        .then(response => {
            let obj = {};
            // @ts-ignore
            for (let entry of response.split('\n')) {
                let pair = entry.split('=');
                obj[pair[0]] = pair[1];
            }
            // @ts-ignore
            setUserInfo({ ip: obj["ip"], user_agent: obj["uag"], city: obj["colo"], country: obj["loc"] });
        })
        .catch(error => console.log(error));
    }, []);

    const inPersonLimitReachedCallBack = (data) => {
        setInPersonLimitReached(data)
    }

    return (
        <ViewableMonitor>
            <div className={`${styles.wrapper} module-margin-small`}>
                <form id={data.data.uniqueId} onSubmit={handleSubmit(onSubmit)} className={`${data.data.image && styles.imgColumn} bx--form`}>
                    <div className={`${styles.column} ${data.data.layout === '2 Column' ? styles.twoColumn : styles.oneColumn}`}>
                        {
                            data.data.image && (
                                <div>
                                    <GatsbyImageWrapper alt={data.data.image?.title} outerWrapperClassName={styles.desktopImage} image={data.data.image} />
                                </div>
                            )
                        }
                        <div className={styles.grid}>
                            {
                                // @ts-ignore
                                data.data.formFields.map((field, index) => {
                                    switch (field.__typename) {
                                        case "ContentfulFormTextField":
                                            return <InputField data={field} register={register} errors={errors} />;
                                        case "ContentfulFormSelectField":
                                            return <SelectField data={field} setValue={setValue} register={register} errors={errors} currLang={data.languageCode} />;
                                        case "ContentfulFormCheckboxField":
                                            return <CheckboxField data={field} register={register} />;
                                        case "ContentfulFormTextAreaField":
                                            return <TextAreaField data={field} register={register} errors={errors} />;
                                        case "ContentfulFormRadioField":
                                            return <RadioField data={field} setValue={setValue} register={register} setError={setError} clearErrors={clearErrors} errors={errors} currLang={data.languageCode} inPerson={data.inPerson} inPersonCapacity={data.inPersonCapacity} callBack={inPersonLimitReachedCallBack} />;  
                                        case "ContentfulFormSection":
                                        return <Section data={field} />; 
                                    }
                                })
                            }
                            {
                                // @ts-ignore
                                <button role="button" disabled={inPersonLimitReached || isSubmitting} className={`${styles.ctaLink} ${styles.submit} text-style-body bx--btn bx--btn--primary`} type="submit">
                                    {isSubmitting ? <span className={styles.submiting}><FormattedMessage id={'submiting'} /></span> : data.data.submitButtonText}
                                </button>
                            }
                        </div>
                    </div>
                </form>
                <div id={data.data.uniqueId + '-thankYouMessage'} data-uid={data.data.uniqueId} className={styles.download_wrapper}>
                    {data.data?.thankYouMessage?.raw && (
                        <div className={`module-margin-small text-style-body-module`}>
                            {renderRichText(data.data.thankYouMessage, options)}
                        </div>
                    )}
                </div>
            </div>
        </ViewableMonitor>
    );
}

export default ModuleCfForm;

export const query = graphql`
	fragment ContentfulModuleCfFormFragment on ContentfulModuleCfForm {
		title
		uniqueId
        layout
        image {
			title
			gatsbyImageData(
                placeholder: NONE
                width: 460
                height: 518
                quality: 85
            )
		}
        submitButtonText
        uniqueSubmission
        formFields {
            ... on ContentfulFormTextField {
              ...ContentfulFormTextFieldFragment
            }
            ... on ContentfulFormSelectField {
              ...ContentfulFormSelectFieldFragment
            }
            ... on ContentfulFormCheckboxField {
              ...ContentfulFormCheckboxFieldFragment
            }
            ... on ContentfulFormTextAreaField {
              ...ContentfulFormTextAreaFieldFragment
            }
            ... on ContentfulFormRadioField {
              ...ContentfulFormRadioFieldFragment
            }
            ... on ContentfulFormSection {
              ...ContentfulFormSectionFragment
            }
        }
        thankYouMessage {
            raw
        }
        submissionUrl
	}
`;