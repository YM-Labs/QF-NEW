import * as React from 'react';
import * as styles from './QFBrandAudit.module.scss';
import { FormattedMessage } from 'react-intl';
import ViewableMonitor from './ui/ViewableMonitor';

class QFBrandAudit extends React.Component {

    render() {
		return (
            <div id="qfBrandAuditModule">
                <ViewableMonitor>
                    <div className={`${styles.wrapper} module-margin`}>
                        <div className={`${styles.innerWrapper} container-padding`}>
                            <div className={styles.box}>
                                <h2 className='text-style-h2'>
                                    <FormattedMessage id={'qf_brand_audit_heading'} />
                                </h2>
                                <p>
                                    <FormattedMessage id={'qf_brand_audit_content'} />
                                </p>
                                <a target='_blank' href={'https://survey18.toluna.com/wix/p9137204.aspx?sname=1736266PN2&surveytype=1&src=99&enparams=gol&ids=WEBP8'} data-swiftype-index="false" className={`text-style-body ${styles.ctaLink}`}>
                                    <FormattedMessage id={'qf_brand_audit_cta'} />
                                </a>
                            </div>
                        </div>
                    </div>
                </ViewableMonitor>
            </div>
		);
	}
}

export default QFBrandAudit