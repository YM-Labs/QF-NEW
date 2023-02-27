import { injectIntl } from 'react-intl';

const GetMessage = ({ id, params, intl }) => intl.formatMessage({ id, params });

export default injectIntl(GetMessage);