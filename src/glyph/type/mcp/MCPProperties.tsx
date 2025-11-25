import React from 'react';
import { Glyph } from '../../Glyph';


export const MCPProperties = ({
    glyph,
    onUpdate,
}: {
    glyph: Glyph;
    onUpdate: (glyph: Glyph) => void;
}) => (
    <div>
        <label>IP Address</label>
        <input
            type="text"
            value={glyph.data.ip}
            onChange={(e) => onUpdate({ ...glyph, data: { ...glyph.data, ip: e.target.value } })}
        />
    </div>
);