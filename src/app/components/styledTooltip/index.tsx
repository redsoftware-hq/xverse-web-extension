import React from 'react';
import { ITooltip, PlacesType, Tooltip } from 'react-tooltip';

interface Props extends ITooltip {
  anchorSelect: string;
  content: string;
  noArrow?: boolean;
}
export default function StyledTooltip(props: Props) {
  const style = {
    color: '#fff',
    fontFamily: 'MontRegular',
    fontSize: 14,
    borderRadius: '8px',
    boxShadow: '0px 6px 10px 0px rgba(0, 0, 0, 0.50)',
    border: '1px solid rgba(168, 185, 244, 0.15)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    padding: '6px 8px',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    background:
      'radial-gradient(489.09% 91.61% at 89.79% 22.85%, rgba(56, 60, 78, 0.20) 0%, rgba(13, 14, 18, 0.20) 100%), rgba(0, 0, 0, 0.80)',
  };
  const { anchorSelect, content, place, noArrow } = props;
  return (
    <Tooltip
      {...props}
      anchorSelect={`#${anchorSelect}`}
      content={content}
      place={place}
      noArrow={noArrow}
      style={style}
    />
  );
}
