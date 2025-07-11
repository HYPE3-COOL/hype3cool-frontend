import { AgentCharacter, StatusType, User } from '@/types/types';

export const INITIAL_STATUS: StatusType = 'idle';

export const iconMap = {
    expand: 'icon-expand',
    globe: 'icon-globe',
    twitter: 'icon-x-twitter',
    telegram: 'icon-telegram-no-bg',
    connect: 'icon-chain',
    shrink: 'icon-shrink',
    discord: 'icon-discord',
    dexscreener: 'icon-dexscreener',
};

export const iconLabelMap = {
    expand: 'Solscan',
    globe: 'Website',
    twitter: 'Twitter',
    telegram: 'Telegram',
    connect: 'Solscan',
    shrink: 'Token',
    discord: 'Discord',
    dexscreener: 'Dexscreener',
};

// 0 to 6 , make them as constants
export const DEFAULT_USER_PROFILE_PIC = Array.from({ length: 8 }).map((_, index) => `/assets/images/avatar${index}.png`);

export const MINIMUM_CHAT_BALANCE = 1;

export const TARGET_FUNDING_AMOUNT = 85; // 85 SOL
export const MINIMUM_WEB2_BALANCE = 0.1; // minimum balance to activate account for web2 users

export const EmptyUser: User = {
    _id: null,
    uid: 0,
    username: '',
    displayName: '',
    image: '',
    walletAddresses: [],
    linkedAccounts: [],
    isNewUser: false,
    isCreator: false,
    isAdmin: false,
    twitter: {
        id: '',
        name: '',
        username: '',
        image: '',
    },
    // oauthProvider: '',
    createdAt: null,
    updatedAt: null,
};

export const EmptyCharacter: AgentCharacter = {
    name: '',
    intro: '',
    bio: '',
    lore: '',
    knowledge: '',
    topics: '',
    style: '',
    chat: '',
    posts: '',
    adjectives: '',
    language: 'en',
    withHashTags: false,
};

export const PAGE_LINKS = {
    HOME: '/',
    TOKEN: '/token',
    USER: '/user',
    AGENT: '/agent',
    CREATOR: '/creator',
    AGENT_CREATE: '/agent-create',
    TOKEN_CREATE: '/token-create',
    SITE_TWITTER_URL: 'https://x.com/hype3dotcool',
    SITE_TELEGRAM_URL: 'https://t.me/hype3dotcool',
    SITE_DEXSCREENER_URL: 'https://dexscreener.com/solana/9iQFnxrDDMFrhLx2pYJCDeqN3wFuaBimQkUnZQHNpump',
    HOW_ITS_WORK_URL: 'https://hype3-cool.gitbook.io/hype3.cool',
    TERMS_URL: 'https://hype3-cool.gitbook.io/hype3.cool/terms-and-policy/terms',
};

export const DIALOG_NAMES = {
    NEW_USER: 'new-user',
    UPDATE_USERNAME: 'update-username',
    UPLOAD_IMAGE: 'upload-image',
    PRESALE: 'presale',
    AGENT_X_CREDENTIALS: 'agent-x-credentials',
    AGENT_SOCIAL: 'agent-social',
    WITHDRAW: 'withdraw',
};

export enum PlanType {
    TRIAL = 'trial',
    MONTHLY = 'monthly',
}

// export const AGENT_LIST_FILTERS = [
//     { name: 'All agents', value: '' },
//     { name: 'Tokens only', value: 'lp' },
// ];

export const AGENT_LIST_FILTERS = {
    ALL: '',
    TOKEN: 'lp',
} as const;


export type AgentListFilter = typeof AGENT_LIST_FILTERS[keyof typeof AGENT_LIST_FILTERS];