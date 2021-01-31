import React, { FC, useCallback, useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
import { enrichText } from '../config/shared';
import '../css/minifiableText.css';

interface MinifiableTextProps {
  defaultMinified?: boolean;
  forced?: boolean;
  maxChars?: number;
  rich?: boolean;
  source?: string;
  text: string;
  toggle?: boolean;
}

const MinifiableText: FC<MinifiableTextProps> = ({
  defaultMinified,
  forced = false,
  maxChars = 700,
  rich = false,
  source,
  text,
  toggle = false,
}: MinifiableTextProps) => {
  const [minified, setMinified] = useState<boolean>(defaultMinified === false ? defaultMinified : (text?.length > (maxChars || 700)));

  const minifyText = useCallback(() => {
    setMinified(text.length > maxChars);
  }, [maxChars, text]);

  useEffect(() => {
    minifyText();
  }, [minifyText]);

  useEffect(() => {
    setMinified(defaultMinified === false ? defaultMinified : (text?.length > (maxChars || 700)));
  }, [maxChars, text, defaultMinified]);

  const onMinify = (): void => setMinified(minified => !minified);

  const richText: string = enrichText(text);

  if (!text) return null;

  return (
    <>
      <span
        className={`minifiable ${minified ? 'minified' : 'expanded'}`}
        dangerouslySetInnerHTML={{ __html: rich ? richText : text }}
      />
      {source && (
        <span className='text-sm pull-right m-b-negative'>
          <a href='https://it.wikipedia.org/wiki/Licenze_Creative_Commons' target='_blank' rel='noopener noreferrer'>
            <span className='show-sm'>&copy;</span>
            <span className='hide-sm'>CC BY-SA</span>
          </a>&nbsp;
          <a href={source} target='_blank' rel='noopener noreferrer'>{source.includes('wikipedia') ? 'Wikipedia' : 'Fonte'}</a>
        </span>
      )}
      {((minified && !forced) || toggle) && <><br/><button type='button' className='link' onClick={onMinify}>{toggle && !minified ? 'Nascondi' : 'Mostra tutto'}</button></>}
    </>
  );
};
 
export default MinifiableText;