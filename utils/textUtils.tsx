import React from 'react';

// Utility to process line breaks from database
// Database stores literal string "\\n" which needs to be converted to actual line breaks

export const processLineBreaks = (text: string, isMobile: boolean = false) => {
  // Replace literal \n with actual newline, then split and map to JSX
  const normalizedText = text.replace(/\\n/g, '\n');
  
  // In mobile, replace newlines with spaces
  if (isMobile) {
    return normalizedText.replace(/\n/g, ' ');
  }
  
  return normalizedText.split('\n').map((line, i, arr) => (
    <span key={i}>
      {line}
      {i < arr.length - 1 && <br />}
    </span>
  ));
};

// For texts with placeholders like {число}, {жанр}, etc.
export const processTextWithPlaceholder = (
  text: string,
  placeholder: string,
  value: string | number,
  boldValue: boolean = true,
  boldClassName: string = "",
  isMobile: boolean = false
) => {
  // Replace literal \n with actual newline
  const normalizedText = text.replace(/\\n/g, '\n');
  
  if (!normalizedText.includes(placeholder)) {
    return processLineBreaks(text, isMobile);
  }

  const parts = normalizedText.split(placeholder);
  const boldClass = boldClassName ? `${boldClassName} font-bold` : "font-bold";
  
  // In mobile, replace newlines with spaces
  if (isMobile) {
    const beforeText = parts[0].replace(/\n/g, ' ');
    const afterText = parts[1] ? parts[1].replace(/\n/g, ' ') : '';
    
    return (
      <>
        {beforeText}
        {boldValue ? (
          <span className={boldClass}>{value}</span>
        ) : (
          <span>{value}</span>
        )}
        {afterText}
      </>
    );
  }
  
  return (
    <>
      {parts[0].split('\n').map((line, i, arr) => (
        <span key={`pre-${i}`}>
          {line}
          {i < arr.length - 1 && <br />}
        </span>
      ))}
      {boldValue ? (
        <span className={boldClass}>{value}</span>
      ) : (
        <span>{value}</span>
      )}
      {parts[1] && parts[1].split('\n').map((line, i, arr) => (
        <span key={`post-${i}`}>
          {line}
          {i < arr.length - 1 && <br />}
        </span>
      ))}
    </>
  );
};

// For texts with multiple placeholders
export const processTextWithMultiplePlaceholders = (
  text: string,
  replacements: Array<{ placeholder: string; value: string | number; bold?: boolean }>,
  defaultBoldClassName: string = "",
  isMobile: boolean = false
) => {
  // Replace literal \n with actual newline
  let processedText = text.replace(/\\n/g, '\n');
  
  // In mobile, replace newlines with spaces
  if (isMobile) {
    processedText = processedText.replace(/\n/g, ' ');
    
    // Replace each placeholder with value
    replacements.forEach((replacement) => {
      const valueStr = String(replacement.value);
      const boldClass = defaultBoldClassName ? `${defaultBoldClassName} font-bold` : "font-bold";
      const bold = replacement.bold !== undefined ? replacement.bold : true;
      
      if (bold) {
        processedText = processedText.replace(
          new RegExp(replacement.placeholder, 'g'),
          `<BOLD>${valueStr}</BOLD>`
        );
      } else {
        processedText = processedText.replace(
          new RegExp(replacement.placeholder, 'g'),
          valueStr
        );
      }
    });
    
    // Parse the text with bold markers
    const parts = processedText.split(/(<BOLD>.*?<\/BOLD>)/g);
    return (
      <>
        {parts.map((part, index) => {
          if (part.startsWith('<BOLD>')) {
            const value = part.replace(/<\/?BOLD>/g, '');
            const boldClass = defaultBoldClassName ? `${defaultBoldClassName} font-bold` : "font-bold";
            return <span key={index} className={boldClass}>{value}</span>;
          }
          return <span key={index}>{part}</span>;
        })}
      </>
    );
  }
  
  // Replace each placeholder with a unique marker
  const markers: Array<{ marker: string; value: string | number; bold: boolean }> = [];
  replacements.forEach((replacement, index) => {
    const marker = `__MARKER_${index}__`;
    markers.push({ 
      marker, 
      value: replacement.value, 
      bold: replacement.bold !== undefined ? replacement.bold : true 
    });
    processedText = processedText.replace(new RegExp(replacement.placeholder, 'g'), marker);
  });
  
  // Split by markers and build JSX
  const boldClass = defaultBoldClassName ? `${defaultBoldClassName} font-bold` : "font-bold";
  const parts: (string | JSX.Element)[] = [];
  let currentText = processedText;
  
  markers.forEach((markerInfo, index) => {
    const [before, ...rest] = currentText.split(markerInfo.marker);
    
    // Add text before marker
    if (before) {
      before.split('\n').forEach((line, i, arr) => {
        parts.push(<span key={`text-${index}-${i}`}>{line}</span>);
        if (i < arr.length - 1) parts.push(<br key={`br-${index}-${i}`} />);
      });
    }
    
    // Add marker value
    parts.push(
      markerInfo.bold ? (
        <span key={`marker-${index}`} className={boldClass}>{markerInfo.value}</span>
      ) : (
        <span key={`marker-${index}`}>{markerInfo.value}</span>
      )
    );
    
    // Update current text to remaining part
    currentText = rest.join(markerInfo.marker);
  });
  
  // Add any remaining text
  if (currentText) {
    currentText.split('\n').forEach((line, i, arr) => {
      parts.push(<span key={`final-${i}`}>{line}</span>);
      if (i < arr.length - 1) parts.push(<br key={`final-br-${i}`} />);
    });
  }
  
  return <>{parts}</>;
};