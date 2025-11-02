// @ts-expect-error - createSystem and defaultConfig exist at runtime but not in TypeScript definitions
import { createSystem, defaultConfig } from '@chakra-ui/react';
import { colors } from './foundations/colors.js';
import { Button } from './components/button.js';

export const theme = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors,
    },
    components: {
      Button,
    },
  },
});
