import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react';
import { translate } from '@docusaurus/Translate';
import { useHistory, useLocation } from '@docusaurus/router';
import styles from './styles.module.css';

const FALLBACK_ID = '__docusaurus_skipToContent_fallback';

/** Mantém o alvo focável: remover tabindex imediatamente faz o Chromium perder o foco. */
export default function SkipToContent(): ReactNode {
  const region = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const history = useHistory();
  const previousPath = useRef(location.pathname);
  const label = translate({
    id: 'theme.common.skipToMainContent',
    message: 'Skip to main content',
    description: 'The skip to content label used for keyboard navigation',
  });

  useEffect(() => {
    const changed = previousPath.current !== location.pathname;
    previousPath.current = location.pathname;
    if (changed && history.action === 'PUSH' && !location.hash) region.current?.focus();
  }, [history, location.pathname, location.hash]);

  function skip(event: MouseEvent<HTMLAnchorElement>) {
    const target = document.querySelector<HTMLElement>('main') ?? document.getElementById(FALLBACK_ID);
    if (target) {
      event.preventDefault();
      target.setAttribute('tabindex', '-1');
      target.focus();
    }
  }

  return (
    <div ref={region} role="region" aria-label={label} tabIndex={-1}>
      <a className={styles.skipLink} href={`#${FALLBACK_ID}`} onClick={skip}>{label}</a>
    </div>
  );
}
