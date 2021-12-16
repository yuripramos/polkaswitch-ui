import React from 'react';

const balanceContext = React.createContext({});

const Provider = balanceContext.Provider;

export { balanceContext, Provider as BalanceProvider };
