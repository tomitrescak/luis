import React from 'react';
import { Luis } from 'luis';

// LUIS: import tests
const { snapshots, report } = require('./summary');

// LUIS: setup component
export default function LuisRoute() {
  return (
    <Luis
      options={{
        snapshots,
        report,
        loadTests: () => {
          require('**.test');
        }
      }}
    />
  );
}
