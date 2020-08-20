import React from 'react';
import styled from 'styled-components';

const LeftMenuContain = styled.div`
  svg {
    fill: #ffb866;
  }
`;

function LeftMenu() {
  return (
    <LeftMenuContain>
      <span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 18 18"
        >
          <path
            id="ic_dashboard_24px"
            d="M3,13h8V3H3Zm0,8h8V15H3Zm10,0h8V11H13ZM13,3V9h8V3Z"
            transform="translate(-3 -3)"
          />
        </svg>
      </span>
    </LeftMenuContain>
  );
}

export default LeftMenu;