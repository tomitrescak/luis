export interface ITheme {
  sideBarColor: string;
  backgroundColor: string;
  textColor: string;
  isDark: boolean;
}

export const lightTheme: ITheme = {
  sideBarColor: '#fbfbfb',
  backgroundColor: 'white',
  textColor: 'black',
  isDark: false
};

export const darkTheme: ITheme = {
  sideBarColor: '#333',
  backgroundColor: '#444',
  textColor: '#eee!important',
  isDark: true
};
