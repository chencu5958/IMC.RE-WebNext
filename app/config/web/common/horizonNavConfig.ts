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
            { label: 'Company', href: '/about/company', icon: 'tdesign:building', linkTarget: '_blank' },
            {
                label: 'Team',
                icon: 'tdesign:user',
                subItems: [
                    { label: 'Leadership', href: '/about/team/leadership', icon: 'tdesign:user', linkTarget: '_blank' },
                    { label: 'Engineering', href: '/about/team/engineering', icon: 'tdesign:code' },
                    { label: 'Design', href: '/about/team/design', icon: 'tdesign:palette' }
                ]
            },
            { label: 'Careers', href: '/about/careers', icon: 'tdesign:earth' }
        ]
    },
    {
        icon: 'tdesign:shrimp',
        label: 'i18n-web-string.nav.community',
        subItems: [
            { label: 'Forums', href: '/community/forums', icon: 'tdesign:chat' },
            {
                label: 'i18n-web-string.nav.terms',
                icon: 'tdesign:file',
                subItems: [
                    { label: 'Contributing', href: '/community/guidelines/contributing', icon: 'tdesign:file' },
                    { label: 'Code of Conduct', href: '/community/guidelines/code-of-conduct', icon: 'tdesign:file' },
                    { label: 'Community', href: '/community/guidelines/community', icon: 'tdesign:file' },
                ]
            }
        ]
    },
    {
        icon: 'tdesign:folder-open',
        label: 'i18n-web-string.nav.blog',
        href: '/blog',
        linkTarget: '_blank'
    }
];
