// ** MUI Imports
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

// ** Icons Imports
import Icon from '@mdi/react';
import { mdiTrendingUp, mdiCurrencyUsd, mdiDotsVertical, mdiCellphoneLink, mdiAccountOutline } from '@mdi/js';

const salesData = [
  {
    stats: '245k',
    title: 'Sales',
    color: 'primary',
    icon: <Icon path={mdiTrendingUp} size={1.75} />
  },
  {
    stats: '12.5k',
    title: 'Customers',
    color: 'success',
    icon: <Icon path={mdiAccountOutline} size={1.75} />
  },
  {
    stats: '1.54k',
    color: 'warning',
    title: 'Products',
    icon: <Icon path={mdiCellphoneLink} size={1.75} />
  },
  {
    stats: '$88k',
    color: 'info',
    title: 'Revenue',
    icon: <Icon path={mdiCurrencyUsd} size={1.75} />
  }
];

const renderStats = () => {
  return salesData.map((item, index) => (
    <Grid item xs={12} sm={3} key={index}>
      <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          variant='rounded'
          sx={{
            mr: 3,
            width: 44,
            height: 44,
            boxShadow: 3,
            color: 'common.white',
            backgroundColor: `${item.color}.main`
          }}
        >
          {item.icon}
        </Avatar>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='caption'>{item.title}</Typography>
          <Typography variant='h6'>{item.stats}</Typography>
        </Box>
      </Box>
    </Grid>
  ));
};

const MonthlyOverview = () => {
  return (
    <Card>
      <CardHeader
        title='Monthly Overview'
        action={
          <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
            <Icon path={mdiDotsVertical} size={1} color="currentColor" />
          </IconButton>
        }
        subheader={
          <Typography variant='body2'>
            <Box component='span' sx={{ fontWeight: 600, color: 'text.primary' }}>
              Total 48.5% growth
            </Box>{' '}
            😎 this month
          </Typography>
        }
        titleTypographyProps={{
          sx: {
            mb: 2.5,
            lineHeight: '2rem !important',
            letterSpacing: '0.15px !important'
          }
        }}
      />
      <CardContent sx={{ pt: theme => `${theme.spacing(3)} !important` }}>
        <Grid container spacing={[5, 0]}>
          {renderStats()}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default MonthlyOverview;