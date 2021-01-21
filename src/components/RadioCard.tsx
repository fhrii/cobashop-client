import { Box, useRadio } from '@chakra-ui/react';
import { FC } from 'react';

const RadioCard: FC = ({ children, ...props }) => {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        bg="white"
        _checked={{
          bg: 'yellow.400',
          color: 'black',
          borderColor: 'yellow.400',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        px={5}
        py={3}
      >
        {children}
      </Box>
    </Box>
  );
};

export default RadioCard;
