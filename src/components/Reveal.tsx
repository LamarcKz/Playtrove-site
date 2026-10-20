import {useEffect, useRef, type ReactNode} from 'react';

/** O conteúdo continua visível sem JavaScript ou suporte à observação. */
export default function Reveal({children, className = ''}: {children: ReactNode; className?: string}): ReactNode {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!element || motion.matches || typeof IntersectionObserver === 'undefined') return;
    const show = () => {
      element.classList.remove('is-pending');
      element.classList.add('is-visible');
    };
    if (element.getBoundingClientRect().top < window.innerHeight) return;
    element.classList.add('is-pending');
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        show();
        observer.disconnect();
      }
    }, {rootMargin: '0px 0px -32px 0px', threshold: 0});
    const onMotionChange = () => {
      if (motion.matches) {
        show();
        observer.disconnect();
      }
    };
    observer.observe(element);
    motion.addEventListener('change', onMotionChange);
    return () => {
      observer.disconnect();
      motion.removeEventListener('change', onMotionChange);
      element.classList.remove('is-pending');
    };
  }, []);
  return <div ref={ref} className={`pt-reveal ${className}`}>{children}</div>;
}
