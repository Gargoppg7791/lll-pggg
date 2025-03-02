import { Box } from '@mui/material';
import React from 'react';
import Icon from '@mdi/react';
import { mdiAccount } from '@mdi/js';

const CreateProuductDemo = () => {
  return (
    <Box className='text-black'>
      <Icon path={mdiAccount} size={1} color="black" />
    </Box>
  );
};

export default CreateProuductDemo