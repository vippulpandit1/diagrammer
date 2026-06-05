import { NetworkServerProperties } from './network/NetworkServerProperties';
import { MCPProperties } from './mcp/MCPProperties';
import type { PropertyFieldConfig } from './ConfigDrivenProperties';
import type React from 'react';
import type { Glyph } from '../Glyph';

// ── Registry entry type ───────────────────────────────────────────────────────

export interface GlyphRegistryEntry {
  icon: string;
  name: string;
  description: string;
  defaultProps: {
    width: number;
    height: number;
    data?: Record<string, unknown>;
  };
  /**
   * A React component that renders a fully custom property panel.
   * Takes priority over `propertyFields` when both are present.
   */
  propertiesComponent?: React.FC<{ glyph: Glyph; onUpdate: (g: Glyph) => void }>;
  /**
   * Declarative field schema for the generic config-driven property panel.
   * Use this instead of `propertiesComponent` for simple key/value properties.
   */
  propertyFields?: PropertyFieldConfig[];
}

// ── Registry ─────────────────────────────────────────────────────────────────

export const glyphRegistry: Record<string, GlyphRegistryEntry> = {
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
        propertyFields: [
            { key: 'model',    label: 'Model',        type: 'text',   defaultValue: 'RTX-1000',   placeholder: 'e.g. RTX-1000' },
            { key: 'vendor',   label: 'Vendor',       type: 'text',   defaultValue: '',           placeholder: 'e.g. Cisco' },
            { key: 'ipv4',     label: 'IPv4 Address', type: 'text',   defaultValue: '',           placeholder: '192.168.1.1' },
            { key: 'ipv6',     label: 'IPv6 Address', type: 'text',   defaultValue: '',           placeholder: 'fe80::1' },
            { key: 'ports',    label: 'Ports',        type: 'number', defaultValue: 4,  min: 1, max: 128 },
            { key: 'managed',  label: 'Managed',      type: 'checkbox', defaultValue: true, placeholder: 'Managed device' },
            { key: 'notes',    label: 'Notes',        type: 'textarea', defaultValue: '', placeholder: 'Additional notes...' },
        ],
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
        propertyFields: [
            { key: 'model',    label: 'Model',        type: 'text',   defaultValue: '',  placeholder: 'e.g. Catalyst 2960' },
            { key: 'vendor',   label: 'Vendor',       type: 'text',   defaultValue: '',  placeholder: 'e.g. Cisco' },
            { key: 'ports',    label: 'Port Count',   type: 'number', defaultValue: 24,  min: 1, max: 512 },
            { key: 'speed',    label: 'Speed',        type: 'select', defaultValue: '1G',
              options: [
                { label: '100 Mbps', value: '100M' },
                { label: '1 Gbps',   value: '1G' },
                { label: '10 Gbps',  value: '10G' },
                { label: '25 Gbps',  value: '25G' },
                { label: '100 Gbps', value: '100G' },
              ]
            },
            { key: 'vlan',     label: 'VLAN ID',      type: 'number', defaultValue: 1,   min: 1, max: 4094 },
            { key: 'managed',  label: 'Managed',      type: 'checkbox', defaultValue: true, placeholder: 'Managed switch' },
            { key: 'notes',    label: 'Notes',        type: 'textarea', defaultValue: '', placeholder: 'Additional notes...' },
        ],
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
    // ── UML Sequence ────────────────────────────────────────────────────────
    'uml-sequence-actor':       { icon: 'actor',       name: 'Actor',       description: 'External actor in sequence diagrams',                      defaultProps: { width: 80,  height: 140 } },
    'uml-sequence-participant': { icon: 'participant', name: 'Participant', description: 'Participant/object with header and lifeline',               defaultProps: { width: 120, height: 220 } },
    'uml-sequence-lifeline':    { icon: 'lifeline',    name: 'Lifeline',    description: 'Dashed vertical lifeline for sequence interactions',       defaultProps: { width: 60,  height: 220 } },
    'uml-sequence-activation':  { icon: 'activation',  name: 'Activation',  description: 'Execution focus block over a participant lifeline',        defaultProps: { width: 80,  height: 180 } },
    'uml-sequence-message':     { icon: 'message',     name: 'Message',     description: 'Synchronous call/request arrow between participants',      defaultProps: { width: 180, height: 60 } },
    'uml-sequence-return':      { icon: 'return',      name: 'Return',      description: 'Dashed return/response arrow between participants',        defaultProps: { width: 180, height: 60 } },
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