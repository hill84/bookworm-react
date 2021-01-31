import React, { FC } from 'react';
import { HistoryType, LocationType } from '../../types';
import NoMatch from '../noMatch';

interface NoMatchProps {
  history: HistoryType;
  location: LocationType;
}

const NoMatchPage: FC<NoMatchProps> = ({ history, location }: NoMatchProps) => (
  <NoMatch history={history} location={location} />
);

export default NoMatchPage;