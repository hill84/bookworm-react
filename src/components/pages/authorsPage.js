import Avatar from '@material-ui/core/Avatar';
import React from 'react';
import { Link } from 'react-router-dom';
import { authorsRef } from '../../config/firebase';
import { numberType } from '../../config/types';
import { getInitials } from '../../config/shared';
import { skltn_bubbleRow } from '../skeletons';
import { icon } from '../../config/icons';

export default class AuthorsPage extends React.Component {
	state = {
    items: null,
    count: 0,
    desc: true,
    limit: this.props.limit || 50,
    loading: true,
    page: 1
  }

  static propTypes = {
    limit: numberType
  }

  componentDidMount(prevState) {
    this.fetch();
  }

  fetch = () => { 
    const { desc, limit } = this.state;
    authorsRef.orderBy('photoURL', desc ? 'desc' : 'asc').limit(limit).get().then(snap => {
      if (!snap.empty) {
        const items = [];
        snap.forEach(item => items.push(item.data()));
        this.setState({ 
          count: snap.docs.length,
          items,
          loading: false
        });
      } else {
        this.setState({ 
          count: 0,
          items: null,
          loading: false
        });
      }
    }).catch(error => console.warn(error));
  }
	
	render() {
    const { count, items, limit, loading, page } = this.state;

    if (!loading && !items) {
      return <div className="info-row empty text-center">Non ci sono ancora autori.</div>;
    }

		return (
      <div className="container" id="authorsComponent">
        <div className="card flat">
          <div className="head nav" role="navigation">
            <span className="counter last title primary-text">Autori</span> {count !== 0 && <span className="count hide-xs">({count})</span>} 
            {!loading && count > 0 &&
              <div className="pull-right">
                <button 
                  disabled={page < 2 && 'disabled'} 
                  className="btn sm clear prepend" 
                  onClick={() => this.fetch('prev')} title="precedente">
                  {icon.chevronLeft()}
                </button>
                <button 
                  disabled={page > (count / limit) && 'disabled'} 
                  className="btn sm clear append" 
                  onClick={() => this.fetch('next')} title="successivo">
                  {icon.chevronRight()}
                </button>
              </div>
            }
          </div>

          <div className="bubbles boxed shelf-row hoverable-items">
            {loading ? skltn_bubbleRow : items.map((item, index) => 
              <Link to={`/author/${item.displayName}`} key={item.displayName} style={{animationDelay: `${index/10}s`}} className="card dark bubble">
                <Avatar className="avatar centered" src={item.photoURL} alt={item.displayName}>{!item.photoURL && getInitials(item.displayName)}</Avatar>
                <div className="title">{item.displayName}</div>
              </Link>
            )}
          </div>
        </div>
      </div>
		);
	}
}