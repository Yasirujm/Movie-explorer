import React, { useEffect, useRef, useState } from 'react';
import './ScrollingTitle.css';

const ScrollingTitle = ({ title }) => {
  const wrapperRef = useRef(null);
  const textRef = useRef(null);
  const [shouldScroll, setShouldScroll] = useState(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const text = textRef.current;
    if (wrapper && text) {
      setShouldScroll(text.scrollWidth > wrapper.clientWidth);
    }
  }, [title]);

  return (
    <div className="scrolling-wrapper" ref={wrapperRef}>
      <span
        className={`scrolling-text ${shouldScroll ? 'animate' : ''}`}
        ref={textRef}
      >
        {title}
      </span>
    </div>
  );
};

export default ScrollingTitle;
