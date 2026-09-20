import { useRef, useState } from 'react';
import type { ReactNode } from 'react';

type PageTransitionFrame = {
  children: ReactNode;
  pathname: string;
};

type UsePageTransitionStateProps = PageTransitionFrame;

export function usePageTransitionState(props: UsePageTransitionStateProps) {
  const [displayedPathname, setDisplayedPathname] = useState(props.pathname);

  const displayedChildrenRef = useRef<ReactNode>(props.children);

  const latestPathnameRef = useRef(props.pathname);

  latestPathnameRef.current = props.pathname;

  if (displayedPathname === props.pathname) {
    displayedChildrenRef.current = props.children;
  }

  const waitingForExit = displayedPathname !== props.pathname;

  const handleExitComplete = () => {
    setDisplayedPathname(latestPathnameRef.current);
  };

  return {
    children: waitingForExit ? displayedChildrenRef.current : props.children,
    pathname: displayedPathname,
    waitingForExit,
    handleExitComplete,
  };
}
