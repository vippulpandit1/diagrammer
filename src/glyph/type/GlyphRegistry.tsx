import { NetworkServerProperties } from './network/NetworkServerProperties';
export const glyphRegistry = {
    'network-server': {
        icon: 'server',
        name: 'Network Server',
        description: 'A server in a network diagram',
        defaultProps: {
            width: 80,
            height: 100,
            data: {
                ip: '192.168.1.1'
            }
        },
        propertiesComponent: NetworkServerProperties // Reference to the properties component
    },
    'network-router': {
        icon: 'router',
        name: 'Network Router',
        description: 'A router in a network diagram',
        defaultProps: {
            width: 80,
            height: 80,
            data: {
                model: 'RTX-1000'
            }
        },
        propertiesComponent: 'NetworkRouterProperties' // Reference to the properties component
    },
    'network-switch': {
        icon: 'switch',
        name: 'Network Switch',
        description: 'A network switch',
        defaultProps: {
            width: 80,
            height: 60,
            data: {
                ports: 24
            }
        },
        propertiesComponent: 'NetworkSwitchProperties' // Reference to the properties component
    },
}