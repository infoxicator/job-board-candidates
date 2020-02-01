import React from 'react';
import { Route } from '@americanexpress/one-app-router';
import csp from '../csp';
import CandidatesList from './CandidatesList';

import '../styles/Deck.scss';

const JobBoardCandidates = () => (
  <React.Fragment>
    <div id="candidates-root">
      <CandidatesList />
    </div>
  </React.Fragment>
);

// Read about childRoutes: https://github.com/americanexpress/one-app#routing
JobBoardCandidates.childRoutes = () => ([
  <Route path="/" />,
]);

// Read about appConfig: https://github.com/americanexpress/one-app#appconfig
if (!global.BROWSER) {
  JobBoardCandidates.appConfig = {
    csp,
  };
}

export default JobBoardCandidates;
