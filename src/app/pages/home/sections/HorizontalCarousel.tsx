import { useEffect, useRef, ReactNode, MutableRefObject } from 'react';
import { CarouselWrapper, CarouselArrow, CarouselTrack } from '../HomePage.styles';

const AUTO_SCROLL_INTERVAL_MS = 3500;
const AUTO_SCROLL_STEP_PX = 196;
const ARROW_SCROLL_PX = 200;

interface Props {
  children: ReactNode;
  isDraggingRef?: MutableRefObject<boolean>;
  ariaLabelPrev?: string;
  ariaLabelNext?: string;
  autoScroll?: boolean;
}

export default function HorizontalCarousel({
  children, isDraggingRef, ariaLabelPrev = 'Anterior', ariaLabelNext = 'Siguiente',
  autoScroll = true,
}: Props) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const internalDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);

  const setDragging = (v: boolean) => {
    internalDragging.current = v;
    if (isDraggingRef) isDraggingRef.current = v;
  };

  useEffect(() => {
    if (!autoScroll) return;
    const interval = setInterval(() => {
      if (!internalDragging.current && carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 4) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          carouselRef.current.scrollBy({ left: AUTO_SCROLL_STEP_PX, behavior: 'smooth' });
        }
      }
    }, AUTO_SCROLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [autoScroll]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setDragging(true);
    dragStartX.current = e.pageX - (carouselRef.current?.offsetLeft ?? 0);
    dragScrollLeft.current = carouselRef.current?.scrollLeft ?? 0;
    carouselRef.current?.classList.add('dragging');
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!internalDragging.current) return;
    e.preventDefault();
    const x = e.pageX - (carouselRef.current?.offsetLeft ?? 0);
    const walk = (x - dragStartX.current) * 1.5;
    if (carouselRef.current) carouselRef.current.scrollLeft = dragScrollLeft.current - walk;
  };

  const handleMouseUp = () => {
    setDragging(false);
    carouselRef.current?.classList.remove('dragging');
  };

  const scrollBy = (dir: 'left' | 'right') => {
    carouselRef.current?.scrollBy({
      left: dir === 'right' ? ARROW_SCROLL_PX : -ARROW_SCROLL_PX,
      behavior: 'smooth',
    });
  };

  return (
    <CarouselWrapper>
      <CarouselArrow $side="left" onClick={() => scrollBy('left')} aria-label={ariaLabelPrev}>
        <span className="material-symbols-outlined" aria-hidden="true">chevron_left</span>
      </CarouselArrow>
      <CarouselTrack
        ref={carouselRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {children}
      </CarouselTrack>
      <CarouselArrow $side="right" onClick={() => scrollBy('right')} aria-label={ariaLabelNext}>
        <span className="material-symbols-outlined" aria-hidden="true">chevron_right</span>
      </CarouselArrow>
    </CarouselWrapper>
  );
}
