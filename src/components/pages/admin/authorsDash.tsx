import { DocumentData, FirestoreError, Query } from '@firebase/firestore-types';
import { DialogContent, DialogContentText } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import React, { FC, Fragment, MouseEvent, useCallback, useContext, useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import Zoom from 'react-medium-image-zoom';
import { Link, Redirect } from 'react-router-dom';
import { authorRef, authorsRef, countRef } from '../../../config/firebase';
import icon from '../../../config/icons';
import { app, getInitials, handleFirestoreError, normalizeString, normURL, timeSince } from '../../../config/shared';
import SnackbarContext from '../../../context/snackbarContext';
import useToggle from '../../../hooks/useToggle';
import { AuthorModel, CurrentTarget } from '../../../types';
import CopyToClipboard from '../../copyToClipboard';
import PaginationControls from '../../paginationControls';

type OrderByType = Record<'type' | 'label', string>;

const limitBy: number[] = [15, 25, 50, 100, 250, 500];

const orderBy: OrderByType[] = [  
  { type: 'lastEdit_num', label: 'Data ultima modifica' }, 
  { type: 'lastEditByUid', label: 'Modificato da' },
  { type: 'displayName', label: 'Nominativo' }, 
  { type: 'sex', label: 'Sesso' },
  { type: 'photoURL', label: 'Foto' }
];

let itemsFetch: (() => void) | undefined;

interface AuthorsDashProps {
  onToggleDialog: (id?: string) => void;
}

interface StateModel {
  count: number;
  desc: boolean;
  firstVisible: DocumentData | null;
  isOpenDeleteDialog: boolean;
  items: AuthorModel[];
  lastVisible: DocumentData | null;
  limitByIndex: number;
  limitMenuAnchorEl?: Element;
  loading: boolean;
  orderByIndex: number;
  orderMenuAnchorEl?: Element;
  page: number;
  redirectTo: string;
  selectedId: string;
}

const initialState: StateModel = {
  count: 0,
  desc: true,
  firstVisible: null,
  isOpenDeleteDialog: false,
  items: [],
  lastVisible: null,
  limitByIndex: 0,
  limitMenuAnchorEl: undefined,
  loading: true,
  orderByIndex: 0,
  orderMenuAnchorEl: undefined,
  page: 1,
  redirectTo: '',
  selectedId: '',
};

const AuthorsDash: FC<AuthorsDashProps> = ({ onToggleDialog }: AuthorsDashProps) => {
  const [count, setCount] = useState<StateModel['count']>(initialState.count);
  const [desc, onToggleDesc] = useToggle(initialState.desc);
  const [firstVisible, setFirstVisible] = useState<StateModel['firstVisible']>(initialState.firstVisible);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState<StateModel['isOpenDeleteDialog']>(initialState.isOpenDeleteDialog);
  const [items, setItems] = useState<StateModel['items']>(initialState.items);
  const [lastVisible, setLastVisible] = useState<StateModel['lastVisible']>(initialState.lastVisible);
  const [limitMenuAnchorEl, setLimitMenuAnchorEl] = useState<StateModel['limitMenuAnchorEl']>(initialState.limitMenuAnchorEl);
  const [limitByIndex, setLimitByIndex] = useState<number>(initialState.limitByIndex);
  const [orderMenuAnchorEl, setOrderMenuAnchorEl] = useState<StateModel['orderMenuAnchorEl']>(initialState.orderMenuAnchorEl);
  const [orderByIndex, setOrderByIndex] = useState<StateModel['orderByIndex']>(initialState.orderByIndex);
  const [page, setPage] = useState<StateModel['page']>(initialState.page);
  const [redirectTo, setRedirectTo] = useState<StateModel['redirectTo']>(initialState.redirectTo);
  const [selectedId, setSelectedId] = useState<StateModel['selectedId']>(initialState.selectedId);
  const [loading, setLoading] = useState<StateModel['loading']>(initialState.loading);

  const { openSnackbar } = useContext(SnackbarContext);

  const limit: number = limitBy[limitByIndex];
  const order: OrderByType = orderBy[orderByIndex];

  const fetcher = useCallback(() => {
    const ref: Query<DocumentData> = authorsRef.orderBy(order.type, desc ? 'desc' : 'asc').limit(limit);

    setLoading(true);
    itemsFetch = ref.onSnapshot((snap: DocumentData): void => {
      if (!snap.empty) {
        const items: AuthorModel[] = [];
        snap.forEach((item: DocumentData): number => items.push(item.data()));
        setFirstVisible(snap.docs[0]);
        setItems(items);
        setLastVisible(snap.docs[snap.size - 1]);
      } else {
        setFirstVisible(initialState.firstVisible);
        setItems(initialState.items);
        setLastVisible(initialState.lastVisible);
      }
      setLoading(false);
      setPage(initialState.page);
    }, (err: Error): void => {
      console.warn(err);
    });
  }, [desc, limit, order.type]);

  const fetch = (e: MouseEvent): void => {
    const prev: boolean = (e.currentTarget as CurrentTarget).dataset?.direction === 'prev';
    const ref: Query<DocumentData> = authorsRef.orderBy(order.type, desc === prev ? 'asc' : 'desc').limit(limit);
    const paginatedRef: Query<DocumentData> = ref.startAfter(prev ? firstVisible : lastVisible);

    itemsFetch = paginatedRef.onSnapshot((snap: DocumentData): void => {
      if (!snap.empty) {
        const items: AuthorModel[] = [];
        snap.forEach((item: DocumentData): number => items.push(item.data()));
        setFirstVisible(snap.docs[prev ? snap.size - 1 : 0]);
        setItems(prev ? items.reverse() : items);
        setLastVisible(snap.docs[prev ? 0 : snap.size - 1]);
        setPage(prev ? page - 1 : ((page * limit) > count) ? page : page + 1);
      } else {
        setFirstVisible(initialState.firstVisible);
        setItems(initialState.items);
        setPage(initialState.page);
        setLastVisible(initialState.lastVisible);
      }
      setLoading(false);
    }, (err: Error): void => {
      console.warn(err);
    });
  };

  useEffect(() => {
    countRef('authors').get().then((fullSnap: DocumentData): void => {
      if (fullSnap.exists) {
        setCount(fullSnap.data()?.count);
        fetcher();
      } else {
        setCount(initialState.count);
      }
    }).catch((err: FirestoreError): void => {
      openSnackbar(handleFirestoreError(err), 'error');
    });
  }, [fetcher, openSnackbar]);

  useEffect(() => () => {
    itemsFetch?.();
  }, []);

  const onOpenOrderMenu = (e: MouseEvent): void => setOrderMenuAnchorEl(e.currentTarget);
  const onChangeOrderBy = (i: number): void => {
    setOrderByIndex(i);
    setOrderMenuAnchorEl(undefined);
    setPage(initialState.page);
  };
  const onCloseOrderMenu = (): void => setOrderMenuAnchorEl(undefined);

  const onOpenLimitMenu = (e: MouseEvent): void => setLimitMenuAnchorEl(e.currentTarget);
  const onChangeLimitBy = (i: number): void => {
    setLimitByIndex(i);
    setLimitMenuAnchorEl(undefined);
    setPage(initialState.page);
  };
  const onCloseLimitMenu = (): void => setLimitMenuAnchorEl(undefined);

  const onView = ({ id }: { id: string }): void => setRedirectTo(id);

  const onEdit = ({ id }: { id: string }): void => onToggleDialog(id);

  const onLock = ({ id, state }: { id: string; state: boolean }): void => {
    if (state) {
      // console.log(`Locking ${id}`);
      authorRef(id).update({ edit: false }).then(() => {
        openSnackbar('Elemento bloccato', 'success');
      }).catch(err => openSnackbar(handleFirestoreError(err), 'error'));
    } else {
      // console.log(`Unlocking ${id}`);
      authorRef(id).update({ edit: true }).then(() => {
        openSnackbar('Elemento sbloccato', 'success');
      }).catch(err => openSnackbar(handleFirestoreError(err), 'error'));
    }
  };

  const onDeleteRequest = ({ id }: { id: string }): void => {
    setIsOpenDeleteDialog(true);
    setSelectedId(id);
  };

  const onCloseDeleteDialog = (): void => {
    setIsOpenDeleteDialog(false);
    setSelectedId('');
  };

  const onDelete = (): void => {
    setIsOpenDeleteDialog(false);
    authorRef(selectedId).delete().then((): void => {
      openSnackbar('Elemento cancellato', 'success');
    }).catch(err => openSnackbar(handleFirestoreError(err), 'error'));
  };

  if (redirectTo) return (
    <Redirect to={`/author/${redirectTo}`} />
  );

  const orderByOptions = orderBy.map((option: OrderByType, index: number) => (
    <MenuItem
      key={option.type}
      disabled={index === -1}
      selected={index === orderByIndex}
      onClick={() => onChangeOrderBy(index)}>
      {option.label}
    </MenuItem>
  ));

  const limitByOptions = limitBy.map((option: number, index: number) => (
    <MenuItem
      key={option}
      disabled={index === -1}
      selected={index === limitByIndex}
      onClick={() => onChangeLimitBy(index)}>
      {option}
    </MenuItem>
  ));

  const skeletons = [...Array(limit)].map((_, i: number) => <li key={i} className='skltn dash' />);

  const itemsList = loading ? skeletons : !items ? (
    <li className='empty text-center'>Nessun elemento</li>
  ) : (
    items.map(({ bio, displayName, edit, lastEdit_num, lastEditBy, lastEditByUid, photoURL, sex }: AuthorModel) => (
      <li key={displayName} className={`avatar-row ${edit ? '' : 'locked'}`}>
        <div className='row'>
          <div className='col-auto hide-xs avatar-container'>
            <Avatar className='avatar'>
              {photoURL ? (
                <Zoom overlayBgColorEnd='rgba(var(--canvasClr), .8)' zoomMargin={10}>
                  <img alt={displayName} src={photoURL} className='avatar thumb' />
                </Zoom>
              ) : getInitials(displayName)}
            </Avatar>
          </div>
          <div className='col-6 col-sm-4 col-lg-2' title={displayName}><CopyToClipboard text={displayName}/></div>
          <div className='col-1'><button type='button' className='btn xs flat' title={sex === 'm' ? 'uomo' : 'donna'}>{sex}</button></div>
          <div className='col hide-lg' title={bio}>{bio}</div>
          <Link to={`/dashboard/${lastEditByUid}`} title={lastEditByUid} className='col col-sm-2 col-lg-1'>{lastEditBy}</Link>
          <div className='col col-sm-2 col-lg-1 text-right'>
            <div className='timestamp'>{timeSince(lastEdit_num)}</div>
          </div>
          <div className='absolute-row right btns xs'>
            <button type='button' className='btn icon green' onClick={() => onView({ id: normURL(displayName) })}>{icon.eye}</button>
            <button type='button' className='btn icon primary' onClick={() => onEdit({ id: normalizeString(displayName) })}>{icon.pencil}</button>
            <button type='button' className={`btn icon ${edit ? 'secondary' : 'flat' }`} onClick={() => onLock({ id: normalizeString(displayName), state: edit })} title={edit ? 'Blocca' : 'Sblocca'}>{icon.lock}</button>
            <button type='button' className='btn icon red' onClick={() => onDeleteRequest({ id: normalizeString(displayName) })}>{icon.close}</button>
          </div>
        </div>
      </li>
    ))
  );

  const sitemapData: string[][] = items.map((item: AuthorModel): string[] => ([
    `<url> <loc>${app.url}/author/${normURL(item.displayName)}</loc> </url>`
  ]));

  return (
    <Fragment>
      <div className='head nav'>
        <div className='row'>
          <div className='col'>
            <span className='counter hide-md'>{`${items.length || 0} di ${count || 0}`}</span>
            <button
              type='button'
              className='btn sm flat counter last'
              disabled={!items.length}
              onClick={onOpenLimitMenu}
            >
              {limitBy[limitByIndex]} <span className='hide-xs'>per pagina</span>
            </button>
            <Menu 
              className='dropdown-menu'
              anchorEl={limitMenuAnchorEl} 
              open={Boolean(limitMenuAnchorEl)} 
              onClose={onCloseLimitMenu}>
              {limitByOptions}
            </Menu>
          </div>
          {Boolean(items.length) && (
            <div className='col-auto'>
              <CSVLink data={sitemapData} className='counter' filename='sitemap_authors.csv'>Sitemap</CSVLink>
              <button
                type='button'
                className='btn sm flat counter'
                onClick={onOpenOrderMenu}
              >
                <span className='hide-xs'>Ordina per</span> {orderBy[orderByIndex].label}
              </button>
              <button
                type='button'
                className={`btn sm flat counter icon rounded ${desc ? 'desc' : 'asc'}`}
                title={desc ? 'Ascendente' : 'Discendente'}
                onClick={onToggleDesc}
              >
                {icon.arrowDown}
              </button>
              <Menu 
                className='dropdown-menu'
                anchorEl={orderMenuAnchorEl} 
                open={Boolean(orderMenuAnchorEl)} 
                onClose={onCloseOrderMenu}>
                {orderByOptions}
              </Menu>
            </div>
          )}
        </div>
      </div>
      
      <ul className='table dense nolist font-sm'>
        <li className='avatar-row labels'>
          <div className='row'>
            <div className='col-auto hide-xs'><div className='avatar hidden' title='avatar' /></div>
            <div className='col-6 col-sm-4 col-lg-2'>Nominativo</div>
            <div className='col-1'>Sesso</div>
            <div className='col hide-lg'>Bio</div>
            <div className='col col-sm-2 col-lg-1'>Modificato da</div>
            <div className='col col-sm-2 col-lg-1 text-right'>Modificato</div>
          </div>
        </li>
        {itemsList}
      </ul>

      <PaginationControls 
        count={count} 
        fetch={fetch}
        forceVisibility
        limit={limit}
        page={page}
      />

      {isOpenDeleteDialog && (
        <Dialog
          open={isOpenDeleteDialog}
          keepMounted
          onClose={onCloseDeleteDialog}
          aria-labelledby='delete-dialog-title'
          aria-describedby='delete-dialog-description'>
          <DialogTitle id='delete-dialog-title'>Procedere con l&apos;eliminazione?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Ricordati di rimuovere il riferimento all&apos;autore nei singoli libri.
            </DialogContentText>
          </DialogContent>
          <DialogActions className='dialog-footer flex no-gutter'>
            <button type='button' className='btn btn-footer flat' onClick={onCloseDeleteDialog}>Annulla</button>
            <button type='button' className='btn btn-footer primary' onClick={onDelete}>Procedi</button>
          </DialogActions>
        </Dialog>
      )}
    </Fragment>
  );
};

export default AuthorsDash;