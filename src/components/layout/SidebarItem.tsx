import { NavLink } from 'react-router-dom';
import type { Icon } from '@phosphor-icons/react';

interface SidebarItemProps {
  label: string;
  Icon: Icon;
  expanded: boolean;
  to:string;
}

export function SidebarItem({
  label,
  Icon,
  to,
  expanded
}: SidebarItemProps) {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center gap-4 px-4 h-12 ${
            isActive ? 'active' : ''
          }`
        }
      >
        {({ isActive }) => (
          <>
            <Icon
              size={22}
              weight={isActive ? 'fill' : 'regular'}
            />

            {expanded && <span>{label}</span>}
          </>
        )}
      </NavLink>
    </li>
  );
}