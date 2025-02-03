import { MenuItem } from "./menu.model";
// *** ICONS Phosphor https://phosphoricons.com/
// El id no afecta el orden
export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENU',
        isTitle: true
    },
    {
        id: 2,
        label: 'Dashboard',
        icon: 'ph-duotone ph-gauge',
      link: '/',

    },
    {
        id: 3,
        label: 'Comisiones',
        icon: 'ph-duotone ph-tip-jar',
      link: '/comisiones',

    },
    {
        id: 3,
        label: 'Gastos',
        icon: 'ph-duotone ph-coins',
      link: '/gastos',

    },
    {
        id: 3,
        label: 'Facturas',
        icon: 'ph-duotone ph-invoice',
      link: '/facturas',

    },
 

    {
        id: 4,
        label: 'Settings',
        icon: 'ph-duotone ph-wrench',
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
        icon: 'ph-duotone ph-buildings',
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
