import { style } from 'typestyle';

export const diff = style({
  $nest: {
    '& table': {
      width: '100%'
    },
    '& .diff': {
      borderCollapse: 'collapse',
      border: '1px solid darkgray',
      whiteSpace: 'pre-wrap'
    },
    '& .diff tbody': {
      fontFamily: 'Courier, monospace',
      fontSize: '11px'
    },
    '& .diff tbody th': {
      background: '#EED',
      fontSize: '11px',
      fontWeight: 'normal',
      border: '1px solid #BBC',
      color: '#886',
      padding: '.1em .4em .1em',
      textAlign: 'right',
      verticalAlign: 'top',
      width: '30px'
    },
    '& .diff thead': {
      borderBottom: '1px solid #BBC',
      background: '#EFEFEF',
    },
    '& .diff thead th.texttitle': {
      textAlign: 'left'
    },
    '& .diff tbody td': {
      paddingLeft: '.4em',
      verticalAlign: 'top'
    },
    '& .diff .empty': {
      backgroundColor: '#DDD'
    },
    '& .diff .replace': {
      backgroundColor: '#FD8'
    },
    '& .diff .delete': {
      backgroundColor: '#E99'
    },
    '& .diff .skip': {
      backgroundColor: '#EFEFEF',
      border: '1px solid #AAA',
      borderRight: '1px solid #BBC'
    },
    '& .diff .insert': {
      backgroundColor: '#9E9'
    },
    '& .diff th.author': {
      textAlign: 'right',
      borderTop: '˝1px solid #BBC',
      background: '#EFEFEF'
    }
  }
});
