import Avatar from '@material-ui/core/Avatar';
import MenuItem from '@material-ui/core/MenuItem';
import React, { forwardRef, ForwardRefRenderFunction, Ref } from 'react';
import { Link } from 'react-router-dom';
import icon from '../config/icons';
import { getInitials, timeSince } from '../config/shared';
import { NoteModel } from '../types';

interface NoteMenuItemProps {
  index: number;
  item?: NoteModel;
  animation: boolean;
}

const NoteMenuItem: ForwardRefRenderFunction<HTMLLIElement, NoteMenuItemProps> = ({
  index = 0,
  item,
  animation = true,
}: NoteMenuItemProps, ref: Ref<HTMLLIElement>) => {
  if (!item) return null;

  return (
    <MenuItem key={item.nid} style={animation ? { animationDelay: `${(index + 1) / 10  }s`, } : { animation: 'none' }} ref={ref}> 
      <div className='row'>
        <div className='col-auto'>
          {(item.photoURL || (item.tag && (item.tag.indexOf('follow') > -1 || item.tag.indexOf('like') > -1))) ? (
            <Link to={`/dashboard/${item.createdByUid}`} className='bubble'>
              <Avatar className='image avatar' alt={item.createdBy}>
                {item.photoURL ? <img src={item.photoURL} alt='' /> : item.createdBy ? getInitials(item.createdBy) : undefined}
              </Avatar>
            </Link>
          ) : (
            <span className='icon'>{icon.bell}</span>
          )}
        </div>
        <div className='col text'>
          <div dangerouslySetInnerHTML={{ __html: item.text }} />
        </div>
        <div className='col-auto date'>{timeSince(item.created_num)}</div>
      </div>
    </MenuItem>
  );
};

export default forwardRef(NoteMenuItem);