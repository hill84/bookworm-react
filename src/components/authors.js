import Avatar from '@material-ui/core/Avatar';
import React from 'react';
import { Link } from 'react-router-dom';
import { authorsRef } from '../config/firebase';
import { numberType, boolType } from '../config/types';
import { getInitials } from '../config/shared';
import { icon } from '../config/icons';
import { skltn_bubbleRow } from './skeletons';

export default class Authors extends React.Component {
	state = {
    items: null,
    count: 0,
    desc: true,
    limit: this.props.limit || 10,
    loading: true,
    page: 1,
    pagination: false,
    scrollable: true
  }

  static propTypes = {
    inView: boolType,
    limit: numberType,
    size: numberType
  }

  static defaultProps = {
    inView: true
  }

  componentDidMount() {
    this._isMounted = true;
    this.fetch();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate(prevProps, prevState) {
    const { limit, inView } = this.props;
    if (inView !== prevProps.inView || limit !== prevState.limit) {
      this.fetch();
    } 
  }

  fetch = () => { 
    const { inView } = this.props;
    const { desc, limit } = this.state;

    if (inView) {
      authorsRef.orderBy('photoURL', desc ? 'desc' : 'asc').limit(limit).get().then(snap => {
        if (!snap.empty) {
          const items = [];
          snap.forEach(item => items.push(item.data()));
          if (this._isMounted) {
            this.setState({ 
              count: snap.docs.length,
              items,
              loading: false
            });
          }
        } else {
          if (this._isMounted) {
            this.setState({ 
              count: 0,
              items: null,
              loading: false
            });
          }
        }
      }).catch(error => console.warn(error));
    }
  }
	
	render() {
    const { size } = this.props;
    const { count, desc, items, limit, loading, page, pagination, scrollable } = this.state;

    if (!loading && !items) {
      return <div className="info-row empty text-center">Non ci sono ancora autori.</div>;
    }

		return (
      <React.Fragment>
        <div className="head nav" role="navigation">
          <span className="counter last title primary-text">Autori</span> {count !== 0 && <span className="count hide-xs">({count})</span>} 
          {!loading && count > 0 &&
            <div className="pull-right">
              {(pagination && count > limit) || scrollable ?
                <Link to="/authors" className="btn sm flat counter">Vedi tutti</Link>
              :
                <button 
                  type="button"
                  className={`btn sm icon flat counter ${desc ? 'desc' : 'asc'}`} 
                  title={desc ? 'Ascendente' : 'Discendente'} 
                  onClick={this.onToggleDesc}>
                  {icon.arrowDown()}
                </button>
              }
              {pagination && count > limit &&
                <React.Fragment>
                  <button 
                    type="button"
                    disabled={page < 2 && 'disabled'} 
                    className="btn sm clear prepend" 
                    onClick={() => this.fetch('prev')} title="precedente">
                    {icon.chevronLeft()}
                  </button>
                  <button 
                    type="button"
                    disabled={page > (count / limit) && 'disabled'} 
                    className="btn sm clear append" 
                    onClick={() => this.fetch('next')} title="successivo">
                    {icon.chevronRight()}
                  </button>
                </React.Fragment>
              }
            </div>
          }
        </div>
        <div className="bubbles row shelf scrollable">
          {loading ? skltn_bubbleRow :
            <div className="shelf-row hoverable-items avatars-row">
              {items.map((item, index) => 
                <Link to={`/author/${item.displayName}`} key={item.displayName} style={{'--avatarSize': size, animationDelay: `${index/10}s`}} className="bubble col">
                  <Avatar className="avatar centered" src={item.photoURL} alt={item.displayName}>{!item.photoURL && getInitials(item.displayName)}</Avatar>
                  <div className="title">{item.displayName}</div>
                </Link>
              )}
            </div>
          }
        </div>
      </React.Fragment>
		);
	}
}