export const horizonNavConfig = [
    {
        icon: 'tdesign:home',
        label: 'i18n-web-string.nav.home',
        href: '/',
        linkTarget: '_blank'
    },
    {
        icon: 'tdesign:system-components',
        label: 'i18n-web-string.nav.about-us',
        subItems: [
            { label: 'i18n-web-string.nav.about-us-sponsor', href: 'https://l.imc.re/sponsor', icon: 'tdesign:money', linkTarget: '_blank' },
            { label: 'i18n-web-string.nav.about-us-team', icon: 'tdesign:usergroup', href: '/about/team' },
            { label: 'i18n-web-string.nav.about-us-contact', href: '/about/contact', icon: 'tdesign:chat-bubble-smile' },
            { label: 'i18n-web-string.nav.about-us-join', href: '/about/join', icon: 'tdesign:thumb-up' },
        ]
    },
    {
        icon: 'tdesign:collage',
        label: 'i18n-web-string.nav.project',

    },
    {
        icon: 'tdesign:shrimp',
        label: 'i18n-web-string.nav.community',
        subItems: [
            {
                label: 'i18n-web-string.nav.terms',
                icon: 'tdesign:file',
                subItems: [
                    { label: 'i18n-web-string.nav.terms-server-rule', href: '/community/guidelines/contributing', icon: 'tdesign:file' },
                    { label: 'i18n-web-string.nav.terms-community-rule', href: '/community/guidelines/code-of-conduct', icon: 'tdesign:file' },
                    { label: 'i18n-web-string.nav.terms-privacy-rule', href: '/community/guidelines/community', icon: 'tdesign:file' },
                ]
            }
        ]
    },
    {
        icon: 'tdesign:folder-open',
        label: 'i18n-web-string.nav.blog',
        subItems: [
            { label: 'i18n-web-string.nav.blog', href: 'https://blog.imc.re', linkTarget: '_blank', icon: 'tdesign:bookmark-double' },
            { label: 'i18n-web-string.nav.blog-categories', href: 'https://blog.imc.re/categories', linkTarget: '_blank', icon: 'tdesign:catalog-1' },
            { label: 'i18n-web-string.nav.blog-archives', href: 'https://blog.imc.re/archives/', linkTarget: '_blank', icon: 'tdesign:collection' },
        ]
    }
];
