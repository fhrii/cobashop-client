import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    mono: `'Menlo', monospace`,
    heading: `'Source Sans Pro', 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;`,
    body: `'Source Sans Pro', 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;`,
  },
});

export default theme;
