/*
 *  CheckPwnedPassword
 *  Author:  Alexan Mardigian
 *  Version: 1.0
 *  Copyright 2021, Alexan Mardigian, All rights reserved.
*/

import React from 'react';
import { registerRootComponent } from 'expo';
import CheckPwnedPassword from './components/CheckPwnedPassword';

export default function App() {
  return (
    <CheckPwnedPassword />
  );
}

registerRootComponent(App);
