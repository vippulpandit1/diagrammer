import { NetworkServerProperties } from './network/NetworkServerProperties';
import { MCPProperties } from './mcp/MCPProperties';

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
    'mcp-glyph': {
        icon: 'cube',
        name: 'MCP Glyph',
        description: 'A custom MCP glyph',
        defaultProps: {
            width: 120,
            height: 80,
            data: {
                customField: 'defaultValue'
            }
        },
        propertiesComponent: MCPProperties
    },
    // ── BPMN ──────────────────────────────────────────────────────────────────
    'bpmn-start-event':        { icon: 'circle',   name: 'Start Event',         description: 'BPMN start event',                defaultProps: { width: 60, height: 60 } },
    'bpmn-end-event':          { icon: 'circle',   name: 'End Event',           description: 'BPMN end event',                  defaultProps: { width: 60, height: 60 } },
    'bpmn-intermediate-event': { icon: 'circle',   name: 'Intermediate Event',  description: 'BPMN intermediate catch/throw',   defaultProps: { width: 60, height: 60 } },
    'bpmn-start-message':      { icon: 'envelope', name: 'Message Start',       description: 'Start event triggered by message',defaultProps: { width: 60, height: 60 } },
    'bpmn-end-message':        { icon: 'envelope', name: 'Message End',         description: 'End event sending a message',     defaultProps: { width: 60, height: 60 } },
    'bpmn-intermediate-timer': { icon: 'clock',    name: 'Timer Event',         description: 'Intermediate timer event',        defaultProps: { width: 60, height: 60 } },
    'bpmn-start-error':        { icon: 'alert',    name: 'Error Start',         description: 'Start event triggered by error',  defaultProps: { width: 60, height: 60 } },
    'bpmn-start-signal':       { icon: 'signal',   name: 'Signal Start',        description: 'Start event triggered by signal', defaultProps: { width: 60, height: 60 } },
    'bpmn-task':               { icon: 'rect',     name: 'Task',                description: 'Generic BPMN task',               defaultProps: { width: 120, height: 60 } },
    'bpmn-subprocess':         { icon: 'rect',     name: 'Sub-Process',         description: 'Collapsed sub-process',           defaultProps: { width: 120, height: 60 } },
    'bpmn-call-activity':      { icon: 'rect',     name: 'Call Activity',       description: 'Reusable call activity',          defaultProps: { width: 120, height: 60 } },
    'bpmn-user-task':          { icon: 'person',   name: 'User Task',           description: 'Task performed by a person',      defaultProps: { width: 120, height: 60 } },
    'bpmn-service-task':       { icon: 'gear',     name: 'Service Task',        description: 'Automated service task',          defaultProps: { width: 120, height: 60 } },
    'bpmn-send-task':          { icon: 'send',     name: 'Send Task',           description: 'Task that sends a message',       defaultProps: { width: 120, height: 60 } },
    'bpmn-receive-task':       { icon: 'receive',  name: 'Receive Task',        description: 'Task that receives a message',    defaultProps: { width: 120, height: 60 } },
    'bpmn-script-task':        { icon: 'script',   name: 'Script Task',         description: 'Automated script task',           defaultProps: { width: 120, height: 60 } },
    'bpmn-exclusive-gateway':  { icon: 'diamond',  name: 'Exclusive Gateway',   description: 'XOR gateway — one path taken',    defaultProps: { width: 60, height: 60 } },
    'bpmn-parallel-gateway':   { icon: 'diamond',  name: 'Parallel Gateway',    description: 'AND gateway — all paths taken',   defaultProps: { width: 60, height: 60 } },
    'bpmn-inclusive-gateway':  { icon: 'diamond',  name: 'Inclusive Gateway',   description: 'OR gateway — one or more paths',  defaultProps: { width: 60, height: 60 } },
    'bpmn-event-gateway':      { icon: 'diamond',  name: 'Event-Based Gateway', description: 'Gateway based on an event',       defaultProps: { width: 60, height: 60 } },
    'bpmn-data-object':        { icon: 'doc',      name: 'Data Object',         description: 'Data flowing through the process',defaultProps: { width: 50, height: 70 } },
    'bpmn-data-store':         { icon: 'db',       name: 'Data Store',          description: 'Persistent data store',           defaultProps: { width: 80, height: 70 } },
    'bpmn-pool':               { icon: 'pool',     name: 'Pool',                description: 'BPMN swimlane pool',              defaultProps: { width: 600, height: 160 } },
    'bpmn-lane':               { icon: 'lane',     name: 'Lane',                description: 'Lane within a pool',              defaultProps: { width: 600, height: 80 } },
}