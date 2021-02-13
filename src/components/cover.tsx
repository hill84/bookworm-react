import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';
import React, { FC, useMemo } from 'react';
import { InView } from 'react-intersection-observer';
import icon from '../config/icons';
import { abbrNum, joinObj } from '../config/shared';
import '../css/cover.css';
import { BookModel, CoverModel } from '../types';
import Rating from './rating';

interface CoverProps {
  animationDelay?: boolean;
  bcid?: number;
  book?: BookModel | CoverModel;
  full?: boolean;
  index?: number;
  loading?: boolean;
  info?: boolean;
  page?: number;
  rating?: boolean;
  showMedal?: boolean;
  showReaders?: boolean;
}

const Cover: FC<CoverProps> = ({
  animationDelay: animationdelay = false,
  bcid,
  book,
  full,
  index = 0,
  info,
  loading = false,
  page,
  rating,
  showMedal = true,
  showReaders = false,
}: CoverProps) => {
  const joinedAuthors = useMemo((): string => book ? joinObj(book.authors) : '', [book]);
  const stringified_readers_num = useMemo((): string => abbrNum(book?.readers_num || 0), [book]);
  
  if (!book) return null;

  const cover: string = book.covers?.[0] || '';
  const delay: number = page && page > 1 ? 0 : index / 20;
  const hasBookmark: boolean = (book as CoverModel).readingState?.state_num === 2;
  const hasAward: boolean = (book.awards?.length || 0) > 0;
  const hasBcid: boolean = typeof bcid === 'number' && bcid > 0 && bcid < 1000;

  return (
    <div className='book'> 
      <InView triggerOnce rootMargin='130px'>
        {({ inView: inview, ref }) => (
          <div
            ref={ref}
            className='cover'
            title={book.title || undefined}
            style={{
              animationDelay: (animationdelay !== false) ? `${delay}s` : '',
              backgroundImage: inview ? cover ? `url(${cover}) ` : undefined : undefined,
            }}>
            {hasAward && showMedal && <div className='medal accent'>{icon.medal}</div>}
            {hasBcid && <div className='bookmark accent'><div>{bcid}</div></div>}
            {hasBookmark && <div className='bookmark' />}
            {(book as CoverModel).review?.text && <div className='cover-review'>Recensione</div>}
            {showReaders && book.readers_num ? <div className='readers-num'>{stringified_readers_num} {icon.account}</div> : ''}
            {loading ? <div aria-hidden='true' className='loader'><CircularProgress /></div> : <div className='overlay' />}
            {!cover && (
              <>
                <h2 className='title'>{book.title}</h2>
                {book.subtitle && <h3 className='subtitle'>{book.subtitle}</h3>}
                <span className='author'>{joinedAuthors}</span>
                {book.publisher && <span className='publisher'>{book.publisher}</span>}
              </>
            )}
          </div>
        )}
      </InView>
      {info !== false && (
        <div className='info'>
          <strong className='title'>{book.title}</strong>
          <span className='author'><span className='hide-sm'>di</span> {joinedAuthors}</span>
          {full && book.publisher && <span className='publisher'>{book.publisher}</span>}
          {(book as CoverModel).readingState?.state_num === 2 && ((book as CoverModel).readingState?.progress_num || 0) > 0 ? (
            <Tooltip title={`${(book as CoverModel).readingState?.progress_num}%`} placement='top'>
              <progress max='100' value={(book as CoverModel).readingState?.progress_num} />
            </Tooltip>
          ) : (book.rating_num || 0) > 0 && rating !== false && (
            <Rating ratings={{ rating_num: book.rating_num, ratings_num: book.ratings_num }} />
          )}
        </div>
      )}
    </div>
  );
};
 
export default Cover;