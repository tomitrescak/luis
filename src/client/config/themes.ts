export interface ITheme {
  sideBarColor: "red" | "orange" | "yellow" | "olive" | "green" | "teal" | "blue" | "violet" | "purple" | "pink" | "brown" | "grey" | "black";
  backgroundColor: string;
  textColor: string;
} 

export const lightTheme: ITheme = {
  sideBarColor: 'blue',
  backgroundColor: 'white', 
  textColor: 'black'
};

export const darkTheme: ITheme = {
  sideBarColor: 'black',
  backgroundColor: '#444',
  textColor: '#eee',
};