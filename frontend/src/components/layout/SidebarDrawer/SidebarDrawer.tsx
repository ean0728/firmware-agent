import { useRef, type ReactNode } from 'react';
import { useDialogFocus } from '../../../hooks/useDialogFocus';
import styles from './SidebarDrawer.module.css';

interface SidebarDrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function SidebarDrawer({ open, onClose, children }: SidebarDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useDialogFocus(open, panelRef, onClose);

  if (!open) return null;

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label="主导航"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
