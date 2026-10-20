import {useState, type ReactNode} from 'react';
import Reveal from './Reveal';

type View = {label: string; src: string; alt: string};

export default function FeatureShowcase({id, title, description, groupLabel, views, reverse = false}: {
  id: string;
  title: string;
  description: string;
  groupLabel: string;
  views: readonly View[];
  reverse?: boolean;
}): ReactNode {
  const [selected, setSelected] = useState(0);
  const image = views[selected];
  return (
    <section className={`pt-showcase${reverse ? ' pt-showcase--reverse' : ''}`} aria-labelledby={id}>
      <Reveal className="pt-container pt-showcase-inner">
        <div className="pt-showcase-copy">
          <h3 id={id}>{title}</h3>
          <p>{description}</p>
        </div>
        <div className="pt-showcase-media">
          <div className="pt-showcase-frame">
            <img src={image.src} width="1280" height="800" alt={image.alt} loading="lazy" decoding="async" />
          </div>
          <div className="pt-view-options" role="group" aria-label={groupLabel}>
            {views.map((view, index) => (
              <button type="button" key={view.src} aria-pressed={index === selected}
                onClick={() => setSelected(index)}>{view.label}</button>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
