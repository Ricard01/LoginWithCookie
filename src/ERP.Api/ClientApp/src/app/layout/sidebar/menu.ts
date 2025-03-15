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
        label: 'Gastos',
        icon: 'ph-duotone ph-coins',
 
      subItems: [
        {
            id: 30,
            label: 'Todos',
            link: '/gastos',
            parentId: 46
        },
        {
            id: 51,
            label: 'Personales ',
            link: '/gastos-detalle',
            parentId: 46,
        },
     

    ]

    },
    {
        id: 4,
        label: 'Facturas NEW',
        icon: 'ph-duotone ph-invoice',
      link: '/facturas-list',

    },
    {
        id: 4,
        label: 'Facturas',
        icon: 'ph-duotone ph-invoice',
      link: '/facturas',

    },
    {
        id: 5,
        label: 'Comisiones',
        icon: 'ph-duotone ph-tip-jar',
        parentId: 8,
        subItems: [
            {
                id: 50,
                label: 'Comisiones Detalle',
                link: '/comisiones',
                parentId: 46
            },
            {
                id: 51,
                label: 'Comisiones Angie',
                link: '/comisiones-angie',
                parentId: 46,
            },
            {
                id: 51,
                label: 'Comisiones Ricardo',
                link: '/comisiones-ricardo',
                parentId: 46,
          
            }

        ]
    },
    {
        id: 6,
        label: 'Settings',
        icon: 'ph-duotone ph-wrench',
        parentId: 6,
        subItems: [
            {
                id: 1,
                label: 'Users',
                link: '/users',
                parentId: 6
            },
            {
                id: 2,
                label: 'Roles',
                link: '/roles',
                parentId: 6
            }
        ]
    },


]
