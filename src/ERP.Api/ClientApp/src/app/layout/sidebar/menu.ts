import { MenuItem } from "./menu.model";
// *** ICONS Phosphor https://phosphoricons.com/
// El id no afecta el orden.
export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENU',
        isTitle: true
    },
    {
        id: 2,
        label: 'Dashboard',
        icon: 'ph-gauge',
      link: '/',

    },
    {
        id: 4,
        label: 'Facturas',
        icon: 'ph-gauge',
      link: '/doctos',

    },

    {
        id: 3,
        label: 'Settings',
        icon: 'ph-wrench',
        parentId: 8,
        subItems: [
            {
                id: 4,
                label: 'Users',
                link: '/users',
                parentId: 12
            },
            {
                id: 5,
                label: 'Roles',
                link: '/roles',
                parentId: 12
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
                id: 51,
                label: 'AGENT',
                parentId: 46,
                subItems: [
                    {
                        id: 52,
                        label: 'LISTVIEW',
                        link: '/',
                        parentId: 51
                    }
                ]
            }

        ]
    },


]
