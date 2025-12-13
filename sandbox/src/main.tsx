import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, Button as CkButton } from '@chakra-ui/react';
import { theme } from '../../src/theme';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider value={theme}>
      <div style={{ padding: 32 }}>
        <h1>Academia</h1>
        <CkButton variant="outline" disabled>
          Disabled Button
        </CkButton>
        <CkButton colorScheme="blueGray" size="lg" style={{ marginLeft: 16 }}>
          Normal Button
        </CkButton>
      </div>
    </ChakraProvider>
  </React.StrictMode>
);


