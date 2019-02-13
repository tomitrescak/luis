import { style } from 'typestyle';

export const diff = style({
  $nest: {
    '& table': {
      width: '100%',
      background: 'white',
      color: 'black'
    },
    '& .diff': {
      borderCollapse: 'collapse',
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
      background: '#EFEFEF'
    },
    '& .diff thead th.texttitle': {
      textAlign: 'left',
      fontSize: '11px'
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

export const content = style({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  fontFamily: 'Lato'
});

export const full = style({
  width: '100%',
  height: '100%'
});

export const pane = (hideMenus: boolean) =>
  style({
    padding: '6px',
    position: 'absolute',
    overflow: 'auto',
    top: hideMenus ? 0 : 42,
    bottom: 0,
    left: 0,
    right: 0
  });

export const timing = (color: string) =>
  style({
    float: 'right',
    fontSize: '10px',
    color
  });
