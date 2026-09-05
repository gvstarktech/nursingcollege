import { useRef, useEffect, useState, type ReactNode } from 'react';

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  threshold?: number;
  duration?: number;
}

export function FadeIn({ children, className = '', delay = 0, direction = 'up', threshold = 0.1, duration = 600 }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const translate = {
    up: 'translateY(32px)',
    down: 'translateY(-32px)',
    left: 'translateX(32px)',
    right: 'translateX(-32px)',
    none: 'none',
  }[direction];

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : translate,
        transition: `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

interface StaggerProps {
  children: ReactNode[];
  className?: string;
  staggerDelay?: number;
  baseDelay?: number;
  direction?: 'up' | 'left' | 'right' | 'none';
  threshold?: number;
}

export function StaggerChildren({ children, className = '', staggerDelay = 100, baseDelay = 0, direction = 'up', threshold = 0.1 }: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const translate = { up: 'translateY(28px)', left: 'translateX(28px)', right: 'translateX(-28px)', none: 'none' }[direction];

  return (
    <div ref={ref} className={className}>
      {children.map((child, i) => (
        <div
          key={i}
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'none' : translate,
            transition: `opacity 600ms cubic-bezier(0.22, 1, 0.36, 1) ${baseDelay + i * staggerDelay}ms, transform 600ms cubic-bezier(0.22, 1, 0.36, 1) ${baseDelay + i * staggerDelay}ms`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
