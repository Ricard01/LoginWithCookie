import { MenuItem } from "./menu.model";

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENU',
        isTitle: true
    },
    {
        id: 2,
        label: 'DASHBOARD',
        icon: 'ph-gauge',
        subItems: [
            {
                id: 3,
                label: 'ANALYTICS',
                link: '/',
                parentId: 2
            },
            {
                id: 4,
                label: 'CRM',
                link: '/',
                parentId: 2
            },
            {
                id: 5,
                label: 'ECOMMERCE',
                link: '/',
                parentId: 2
            },
            {
                id: 6,
                label: 'LEARNING',
                link: '/',
                parentId: 2
            },
            {
                id: 7,
                label: 'REALESTATE',
                link: '/',
                parentId: 2
            }
        ]
    },
    {
        id: 8,
        label: 'APPS',
        isTitle: true
    },
    {
        id: 9,
        label: 'LOGIN',
        icon: 'ph-user-circle',
        link: '/login',
        parentId: 8
    },
    {
        id: 10,
        label: 'CHAT',
        icon: 'ph-chats',
        link: '/home',
        parentId: 8
    },
    {
        id: 11,
        label: 'EMAIL',
        icon: 'ph-envelope',
        link: '/',
        parentId: 8,
    },
    {
        id: 12,
        label: 'ECOMMERCE',
        icon: 'ph-storefront',
        parentId: 8,
        subItems: [
            {
                id: 13,
                label: 'PRODUCTS',
                link: '/',
                parentId: 12
            },
            {
                id: 13,
                label: 'PRODUCTGRID',
                link: '/',
                parentId: 12
            },
            {
                id: 14,
                label: 'PRODUCTDETAILS',
                link: '/',
                parentId: 12
            },
            {
                id: 15,
                label: 'CREATEPRODUCT',
                link: '/',
                parentId: 12
            },
            {
                id: 16,
                label: 'ORDERS',
                link: '/',
                parentId: 12
            },
            {
                id: 17,
                label: 'ORDEROVERVIEW',
                link: '/',
                parentId: 12
            },
            {
                id: 18,
                label: 'CUSTOMERS',
                link: '/',
                parentId: 12
            },
            {
                id: 19,
                label: 'SHOPPINGCART',
                link: '/',
                parentId: 12
            },
            {
                id: 20,
                label: 'CHECKOUT',
                link: '/',
                parentId: 12
            },
            {
                id: 21,
                label: 'SELLERS',
                link: '/',
                parentId: 12
            },
            {
                id: 22,
                label: 'SELLEROVERVIEW',
                link: '/',
                parentId: 12
            }
        ]
    },
    {
        id: 23,
        label: 'FILEMANAGER',
        icon: 'ph-folder-open',
        link: '/',
        parentId: 8,
    },
    {
        id: 24,
        label: 'LEARNING',
        icon: 'ph-graduation-cap',
        parentId: 8,
        subItems: [
            {
                id: 25,
                label: 'COURSES',
                parentId: 24,
                subItems: [
                    {
                        id: 26,
                        label: 'LISTVIEW',
                        link: '/',
                        parentId: 25
                    },
                    {
                        id: 27,
                        label: 'GRIDVIEW',
                        link: '/',
                        parentId: 25
                    },
                    {
                        id: 28,
                        label: 'CATEGORY',
                        link: '/',
                        parentId: 25
                    },
                    {
                        id: 29,
                        label: 'OVERVIEW',
                        link: '/',
                        parentId: 25
                    },
                    {
                        id: 30,
                        label: 'CREATECOURSE',
                        link: '/',
                        parentId: 25
                    },
                ]
            },
            {
                id: 31,
                label: 'STUDENTS',
                parentId: 24,
                subItems: [
                    {
                        id: 32,
                        label: 'MYSUBSCRIPTIONS',
                        link: '/',
                        parentId: 31
                    },
                    {
                        id: 33,
                        label: 'MYCOURSES',
                        link: '/',
                        parentId: 31
                    }
                ]
            },
            {
                id: 34,
                label: 'INSTRUCTORS',
                parentId: 24,
                subItems: [
                    {
                        id: 35,
                        label: 'LISTVIEW',
                        link: '/',
                        parentId: 34
                    },
                    {
                        id: 36,
                        label: 'GRIDVIEW',
                        link: '/',
                        parentId: 34
                    },
                    {
                        id: 37,
                        label: 'OVERVIEW',
                        link: '/',
                        parentId: 34
                    },
                    {
                        id: 38,
                        label: 'CREATEINSTRUCTOR',
                        link: '/',
                        parentId: 34
                    }
                ]
            },

        ]
    },
    {
        id: 39,
        label: 'INVOICES',
        icon: 'ph-file-text',
        parentId: 8,
        subItems: [
            {
                id: 40,
                label: 'LISTVIEW',
                link: '/',
                parentId: 39
            },
            {
                id: 41,
                label: 'OVERVIEW',
                link: '/',
                parentId: 39
            },
            {
                id: 42,
                label: 'CREATEINVOICE',
                link: '/',
                parentId: 39
            }
        ]
    },
    {
        id: 43,
        label: 'SUPPORTTICKETS',
        icon: 'ph-ticket',
        parentId: 8,
        subItems: [
            {
                id: 44,
                label: 'LISTVIEW',
                link: '/',
                parentId: 43
            },
            {
                id: 45,
                label: 'OVERVIEW',
                link: '/',
                parentId: 43
            }
        ]
    },
    {
        id: 46,
        label: 'REALESTATE',
        icon: 'ph-buildings',
        parentId: 8,
        subItems: [
            {
                id: 47,
                label: 'LISTINGGRID',
                link: '/',
                parentId: 46
            },
            {
                id: 48,
                label: 'LISTINGLIST',
                link: '/',
                parentId: 46
            },
            {
                id: 49,
                label: 'LISTINGMAP',
                link: '/',
                parentId: 46
            },
            {
                id: 50,
                label: 'PROPERTYOVERVIEW',
                link: '/',
                parentId: 46
            },
            {
                id: 51,
                label: 'AGENT',
                parentId: 46,
                subItems: [
                    {
                        id: 52,
                        label: 'LISTVIEW',
                        link: '/',
                        parentId: 51
                    },
                    {
                        id: 53,
                        label: 'GRIDVIEW',
                        link: '/',
                        parentId: 51
                    },
                    {
                        id: 54,
                        label: 'OVERVIEW',
                        link: '/',
                        parentId: 51
                    },
                ]
            },
            {
                id: 55,
                label: 'AGENCIES',
                parentId: 46,
                subItems: [
                    {
                        id: 56,
                        label: 'LISTVIEW',
                        link: '/',
                        parentId: 55
                    },
                    {
                        id: 57,
                        label: 'OVERVIEW',
                        link: '/',
                        parentId: 55
                    },
                ]
            },
            {
                id: 58,
                label: 'ADDPROPERTY',
                link: '/',
                parentId: 46
            },
            {
                id: 59,
                label: 'EARNINGS',
                link: '/',
                parentId: 46
            },
        ]
    },
    {
        id: 60,
        label: 'PAGES',
        isTitle: true
    },
    {
        id: 61,
        label: 'AUTHENTICATION',
        icon: 'ph-user-circle',
        subItems: [
            {
                id: 62,
                label: 'SIGNIN',
                link: '/',
                parentId: 61,
            },
            {
                id: 63,
                label: 'SIGNUP',
                link: '/',
                parentId: 61,
            },
            {
                id: 64,
                label: 'PASSWORDRESET',
                link: '/',
                parentId: 61,
            },
            {
                id: 65,
                label: 'PASSWORDCREATE',
                link: '/',
                parentId: 61,
            },
            {
                id: 66,
                label: 'LOCKSCREEN',
                link: '/',
                parentId: 61
            },
            {
                id: 67,
                label: 'LOGOUT',
                link: '/',
                parentId: 61
            },
            {
                id: 68,
                label: 'SUCCESSMESSAGE',
                link: '/',
                parentId: 61
            },
            {
                id: 69,
                label: 'TWOSTEPVERIFICATION',
                link: '/',
                parentId: 61
            },
            {
                id: 70,
                label: 'ERRORS',
                parentId: 61,
                subItems: [
                    {
                        id: 71,
                        label: '404ERROR',
                        link: '/',
                        parentId: 70
                    },
                    {
                        id: 72,
                        label: '500',
                        link: '/',
                        parentId: 70
                    },
                    {
                        id: 73,
                        label: '503',
                        link: '/',
                        parentId: 70
                    },
                    {
                        id: 74,
                        label: 'OFFLINE',
                        link: '/',
                        parentId: 70
                    },
                ]
            },
        ]
    },
    {
        id: 75,
        label: 'EXTRAPAGES',
        icon: 'ph-address-book',
        subItems: [
            {
                id: 76,
                label: 'STARTER',
                link: '/',
                parentId: 75
            },
            {
                id: 77,
                label: 'PROFILE',
                link: '/',
                parentId: 75,
            },
            {
                id: 78,
                label: 'PROFILESETTINGS',
                link: '/',
                parentId: 75,
            },
            {
                id: 79,
                label: 'CONTACTS',
                link: '/',
                parentId: 75
            },
            {
                id: 80,
                label: 'TIMELINE',
                link: '/',
                parentId: 75
            },
            {
                id: 81,
                label: 'FAQS',
                link: '/',
                parentId: 75
            },
            {
                id: 82,
                label: 'PRICING',
                link: '/',
                parentId: 75
            },
            {
                id: 83,
                label: 'MAINTENANCE',
                link: '/',
                parentId: 75
            },
            {
                id: 84,
                label: 'COMINGSOON',
                link: '/',
                parentId: 75
            },
            {
                id: 85,
                label: 'PRIVACYPOLICY',
                link: '/',
                parentId: 75
            },
            {
                id: 86,
                label: 'TERMS&CONDITIONS',
                link: '/',
                parentId: 75
            }
        ]
    },
    {
        id: 87,
        label: 'COMPONENTS',
        isTitle: true
    },
    {
        id: 88,
        label: 'BOOTSTRAPUI',
        icon: "ph-bandaids",
        subItems: [
            {
                id: 89,
                label: 'ALERTS',
                link: '/',
                parentId: 88
            },
            {
                id: 90,
                label: 'BADGES',
                link: '/',
                parentId: 88
            },
            {
                id: 91,
                label: 'BUTTONS',
                link: '/',
                parentId: 88
            },
            {
                id: 92,
                label: 'COLORS',
                link: '/',
                parentId: 88
            },
            {
                id: 93,
                label: 'CARDS',
                link: '/',
                parentId: 88
            },
            {
                id: 94,
                label: 'CAROUSEL',
                link: '/',
                parentId: 88
            },
            {
                id: 95,
                label: 'DROPDOWNS',
                link: '/',
                parentId: 88
            },
            {
                id: 96,
                label: 'GRID',
                link: '/',
                parentId: 88
            },
            {
                id: 97,
                label: 'IMAGES',
                link: '/',
                parentId: 88
            },
            {
                id: 98,
                label: 'TABS',
                link: '/',
                parentId: 88
            },
            {
                id: 99,
                label: 'ACCORDION&COLLAPSE',
                link: '/',
                parentId: 88
            },
            {
                id: 100,
                label: 'MODALS',
                link: '/',
                parentId: 88
            },
            {
                id: 102,
                label: 'PLACEHOLDERS',
                link: '/',
                parentId: 88
            },
            {
                id: 103,
                label: 'PROGRESS',
                link: '/',
                parentId: 88
            },
            {
                id: 104,
                label: 'NOTIFICATIONS',
                link: '/',
                parentId: 88
            },
            {
                id: 105,
                label: 'MEDIAOBJECT',
                link: '/',
                parentId: 88
            },
            {
                id: 106,
                label: 'EMBEDVIDEO',
                link: '/',
                parentId: 88
            },
            {
                id: 107,
                label: 'TYPOGRAPHY',
                link: '/',
                parentId: 88
            },
            {
                id: 108,
                label: 'LISTS',
                link: '/',
                parentId: 88
            },
            {
                id: 109,
                label: 'LINKS',
                link: '/',
                parentId: 88
            },
            {
                id: 110,
                label: 'GENERAL',
                link: '/',
                parentId: 88
            },
            {
                id: 111,
                label: 'UTILITIES',
                link: '/',
                parentId: 88
            },
        ]
    },
    {
        id: 112,
        label: 'ADVANCEUI',
        icon: "ph-stack-simple",
        subItems: [
            {
                id: 113,
                label: 'SWEETALERTS',
                link: '/',
                parentId: 112
            },

            {
                id: 115,
                label: 'SCROLLBAR',
                link: '/',
                parentId: 112
            },
            {
                id: 116,
                label: 'SWIPERSLIDER',
                link: '/',
                parentId: 112
            },
            {
                id: 117,
                label: 'RATTINGS',
                link: '/',
                parentId: 112
            },
            {
                id: 118,
                label: 'HIGHLIGHT',
                link: '/',
                parentId: 112
            },
            {
                id: 119,
                label: 'SCROLLSPY',
                link: '/',
                parentId: 112
            }
        ]
    },
    {
        id: 120,
        label: 'CUSTOMUI',
        badge: 'BADGE',
        icon: "ph-wrench",
        subItems: [
            {
                id: 121,
                label: 'RIBBONS',
                link: '/',
                parentId: 120
            },
            {
                id: 122,
                label: 'PROFILE',
                link: '/',
                parentId: 120
            },
            {
                id: 123,
                label: 'COUNTER',
                link: '/',
                parentId: 120
            }
        ]
    },
    {
        id: 124,
        label: 'WIDGETS',
        icon: "ph-paint-brush-broad",
        link: '/s'
    },
    {
        id: 125,
        label: 'FORMS',
        icon: 'ri-file-list-3-line',
        subItems: [
            {
                id: 126,
                label: 'BASICELEMENTS',
                link: '/',
                parentId: 125
            },
            {
                id: 127,
                label: 'FORMSELECT',
                link: '/',
                parentId: 125
            },
            {
                id: 128,
                label: 'CHECKBOXS&RADIOS',
                link: '/',
                parentId: 125
            },
            {
                id: 129,
                label: 'PICKERS',
                link: '/',
                parentId: 125
            },
            {
                id: 130,
                label: 'INPUTMASKS',
                link: '/',
                parentId: 125
            },
            {
                id: 131,
                label: 'ADVANCED',
                link: '/',
                parentId: 125
            },
            {
                id: 132,
                label: 'RANGESLIDER',
                link: '/',
                parentId: 125
            },
            {
                id: 133,
                label: 'VALIDATION',
                link: '/',
                parentId: 125
            },
            {
                id: 134,
                label: 'WIZARD',
                link: '/',
                parentId: 125
            },
            {
                id: 135,
                label: 'EDITORS',
                link: '/',
                parentId: 125
            },
            {
                id: 136,
                label: 'FILEUPLOADS',
                link: '/',
                parentId: 125
            },
            {
                id: 137,
                label: 'FORMLAYOUTS',
                link: '/',
                parentId: 125
            }
        ]
    },
    {
        id: 138,
        label: 'TABLES',
        icon: 'ph-table',
        subItems: [
            {
                id: 139,
                label: 'BASIC',
                link: '/',
                parentId: 138
            },
            {
                id: 140,
                label: 'GRIDJS',
                link: '/',
                parentId: 138
            },
            {
                id: 141,
                label: 'LISTJS',
                link: '/',
                parentId: 138
            }
        ]
    },
    {
        id: 142,
        label: 'CHARTS',
        icon: 'ph-chart-pie-slice',
        subItems: [
            {
                id: 143,
                label: 'LINE',
                link: '/',
                parentId: 142
            },
            {
                id: 144,
                label: 'AREA',
                link: '/',
                parentId: 142
            },
            {
                id: 145,
                label: 'COLUMN',
                link: '/',
                parentId: 142
            },
            {
                id: 146,
                label: 'BAR',
                link: '/',
                parentId: 142
            },
            {
                id: 147,
                label: 'MIXED',
                link: '/',
                parentId: 142
            },
            {
                id: 148,
                label: 'TIMELINE',
                link: '/',
                parentId: 142
            },
            {
                id: 148,
                label: 'RANGEAREA',
                link: '/',
                parentId: 142
            },
            {
                id: 148,
                label: 'FUNNEL',
                link: '/',
                parentId: 142
            },
            {
                id: 149,
                label: 'CANDLSTICK',
                link: '/',
                parentId: 142
            },
            {
                id: 150,
                label: 'BOXPLOT',
                link: '/',
                parentId: 142
            },
            {
                id: 151,
                label: 'BUBBLE',
                link: '/',
                parentId: 142
            },
            {
                id: 152,
                label: 'SCATTER',
                link: '/',
                parentId: 142
            },
            {
                id: 153,
                label: 'HEATMAP',
                link: '/',
                parentId: 142
            },
            {
                id: 154,
                label: 'TREEMAP',
                link: '/',
                parentId: 142
            },
            {
                id: 155,
                label: 'PIE',
                link: '/',
                parentId: 142
            },
            {
                id: 156,
                label: 'RADIALBAR',
                link: '/',
                parentId: 142
            },
            {
                id: 157,
                label: 'RADAR',
                link: '/',
                parentId: 142
            },
            {
                id: 158,
                label: 'POLARAREA',
                link: '/',
                parentId: 142
            },
        ]
    },
    {
        id: 159,
        label: 'ICONS',
        icon: 'ph-traffic-cone',
        subItems: [
            {
                id: 160,
                label: 'REMIX',
                link: '/',
                parentId: 159
            },
            {
                id: 161,
                label: 'BOXICONS',
                link: '/',
                parentId: 159
            },
            {
                id: 162,
                label: 'MATERIALDESIGN',
                link: '/',
                parentId: 159
            },
            {
                id: 163,
                label: 'BOOTSTRAP',
                link: '/',
                parentId: 159
            },
            {
                id: 164,
                label: 'PHOSPHOR',
                link: '/',
                parentId: 159
            }
        ]
    },
    {
        id: 165,
        label: 'MAPS',
        icon: 'ph-map-trifold',
        subItems: [
            {
                id: 166,
                label: 'GOOGLE',
                link: '/',
                parentId: 165
            },
            {
                id: 167,
                label: 'VECTOR',
                link: '/',
                parentId: 165
            },
            {
                id: 167,
                label: 'LEAFLET',
                link: '/',
                parentId: 165
            }
        ]
    },
    // {
    //     id: 168,
    //     label: 'MULTILEVEL',
    //     icon: 'bi bi-share',
    //     subItems: [
    //         {
    //             id: 169,
    //             label: 'MULTILEVELLEVEL1.1',
    //             parentId: 168
    //         },
    //         {
    //             id: 170,
    //             label: 'MULTILEVELLEVEL1.2',
    //             parentId: 168,
    //             subItems: [
    //                 {
    //                     id: 171,
    //                     label: 'MULTILEVELLEVEL1.LEVEL2.1',
    //                     parentId: 170
    //                 },
    //                 {
    //                     id: 172,
    //                     label: 'MULTILEVELLEVEL1.LEVEL2.2',
    //                     parentId: 170,
    //                     subItems: [
    //                         {
    //                             id: 173,
    //                             label: 'MULTILEVELLEVEL1.LEVEL2.LEVEL3.1',
    //                             parentId: 172
    //                         },
    //                         {
    //                             id: 174,
    //                             label: 'MULTILEVELLEVEL1.LEVEL2.LEVEL3.2',
    //                             parentId: 172,

    //                         }
    //                     ]
    //                 }
    //             ]
    //         }
    //     ]
    // }
]
