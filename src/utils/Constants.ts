import { gsap } from 'gsap/dist/gsap.min';
import { CustomEase } from '../lib/gsap-bonus/CustomEase.min';
gsap.registerPlugin(CustomEase)

export const EASE_CUSTOM_IN_OUT = CustomEase.create('custom', 'M0,0 C0.6,0 0.1,1 1,1');
export const EASE_CUSTOM_IN = CustomEase.create('custom', 'M0,0,C0,0.6,0.1,1,1,1');
export const EASE_CUSTOM_OUT = CustomEase.create('custom', 'M0,0,C0.6,0,1,0.1,1,1');
export const BASE_URL = 'https://qf.org.qa';

export const BLOB_ENDPOINT = 'BlobEndpoint=https://qfwebsitecdn.blob.core.windows.net/;QueueEndpoint=https://qfwebsitecdn.queue.core.windows.net/;FileEndpoint=https://qfwebsitecdn.file.core.windows.net/;TableEndpoint=https://qfwebsitecdn.table.core.windows.net/;SharedAccessSignature=sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2025-01-01T14:48:37Z&st=2019-05-28T06:48:37Z&spr=https,http&sig=28INH7YjuchdbvfsAnRg6nnjP11fjPRtFURm4eSqDu8%3D';
export const PPF_FILE_CONTAINER = 'ppf-art-contest';
export const PUE_25_SCHOLERSHIPS_FILE_CONTAINER = 'pue-25-scholarships';
export const EIU_ENDPOINT = 'https://prod-07.westeurope.logic.azure.com:443/workflows/cc6738d4be434706b876b180f0e77ab3/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=N8Xm3N7IH2B9kyWoHDmvFAdCPdn6EOLvDIfmOohR8Z8';
