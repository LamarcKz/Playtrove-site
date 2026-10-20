import {useEffect, useRef, useState, type ReactNode} from 'react';

type DemoVideoProps = {
  src: string;
  poster: string;
  label: string;
  playLabel: string;
  pauseLabel: string;
  failureText: string;
  caption: string;
};

/** A visibilidade só suspende a reprodução; a escolha de pausar é do visitante. */
export default function DemoVideo(props: DemoVideoProps): ReactNode {
  const videoRef = useRef<HTMLVideoElement>(null);
  const toggleRef = useRef<(() => void) | null>(null);
  const [playing, setPlaying] = useState(false);
  const [preload, setPreload] = useState<'none' | 'metadata'>('none');
  const [failed, setFailed] = useState(false);

  useEffect(() => { setFailed(false); setPlaying(false); }, [props.src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || failed) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let inView = false;
    let visitorPaused = false;
    let manualPlayback = false;
    let expectedPauses = 0;
    let automaticPlay = false;
    let playPending = false;
    let disposed = false;
    let intentRevision = 0;

    const shouldPlay = () => inView && !document.hidden && !visitorPaused
      && (!motion.matches || manualPlayback);

    const pauseAutomatically = () => {
      if (!video.paused) {
        expectedPauses += 1;
        video.pause();
      }
    };

    const sync = () => {
      if (disposed) return;
      setPreload(motion.matches && !manualPlayback ? 'none' : 'metadata');
      if (!shouldPlay()) {
        pauseAutomatically();
        return;
      }
      if (!video.paused || playPending) return;
      const attemptRevision = intentRevision;
      automaticPlay = true;
      playPending = true;
      void video.play().then(() => {
        playPending = false;
        if (disposed || !shouldPlay()) pauseAutomatically();
        else if (attemptRevision !== intentRevision) sync();
      }).catch(() => {
        playPending = false;
        automaticPlay = false;
        if (!disposed) {
          setPlaying(!video.paused);
          if (attemptRevision !== intentRevision && shouldPlay()) sync();
        }
      });
    };

    const onPlay = () => {
      if (!automaticPlay) {
        visitorPaused = false;
        manualPlayback = true;
      }
      automaticPlay = false;
      setPlaying(true);
      if (!shouldPlay()) pauseAutomatically();
    };
    const onPause = () => {
      if (expectedPauses > 0) expectedPauses -= 1;
      else {
        intentRevision += 1;
        visitorPaused = true;
        manualPlayback = false;
      }
      setPlaying(false);
    };
    const onError = () => setFailed(true);
    const requestSync = () => { intentRevision += 1; sync(); };
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('error', onError);
    document.addEventListener('visibilitychange', requestSync);
    motion.addEventListener('change', requestSync);

    toggleRef.current = () => {
      intentRevision += 1;
      if (video.paused) {
        visitorPaused = false;
        manualPlayback = true;
        sync();
      } else {
        visitorPaused = true;
        manualPlayback = false;
        pauseAutomatically();
      }
    };

    const observer = typeof IntersectionObserver === 'undefined' ? null
      : new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting && entry.intersectionRatio >= 0.1;
        requestSync();
      }, {threshold: [0, 0.1]});
    if (observer) observer.observe(video);
    else {
      inView = true;
      sync();
    }

    return () => {
      disposed = true;
      toggleRef.current = null;
      observer?.disconnect();
      document.removeEventListener('visibilitychange', requestSync);
      motion.removeEventListener('change', requestSync);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('error', onError);
      video.pause();
    };
  }, [props.src, failed]);

  return (
    <figure className="pt-product pt-container">
      <div className="pt-product-frame">
        {failed ? (
          <img className="pt-demo-poster" src={props.poster} width="1280" height="800" alt={props.label} />
        ) : (
          <video ref={videoRef} src={props.src} poster={props.poster}
            width="1280" height="800" aria-label={props.label}
            controls muted loop playsInline preload={preload} />
        )}
      </div>
      <figcaption className="pt-demo-caption">
        <span>{props.caption}</span>
        {failed ? <span className="pt-demo-failure" role="status">{props.failureText}</span> : (
          <button type="button" className="pt-demo-toggle" onClick={() => toggleRef.current?.()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
              {playing ? <><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></> : <path d="M7 4.5a1 1 0 0 1 1.5-.86l12 7.5a1 1 0 0 1 0 1.72l-12 7.5A1 1 0 0 1 7 19.5z" />}
            </svg>
            {playing ? props.pauseLabel : props.playLabel}
          </button>
        )}
      </figcaption>
    </figure>
  );
}
