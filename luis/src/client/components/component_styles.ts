import { initCss } from '@tomino/toolbelt';
import { ITheme } from '../config/themes';

export const { css } = initCss('luis-');

export const splitPane = (theme: ITheme) => css`
  /* name:split-container */
  background: ${theme.backgroundColor};
  color: ${theme.textColor}!important;

  .Resizer {
    background: #000;
    opacity: 0.2;
    z-index: 1;
    box-sizing: border-box;
    background-clip: padding-box;
  }
  .Resizer:hover {
    transition: all 2s easel;
  }
  .Resizer.horizontal {
    height: 11px;
    margin: -5px 0;
    border-top: 6px solid rgba(255, 255, 255, 0);
    border-bottom: 5px solid rgba(255, 255, 255, 0);
    cursor: row-resize;
    width: 100%;
  }
  .Resizer.horizontal:hover {
    border-top: 5px solid rgba(0, 0, 0, 0.5);
    border-bottom: 5px solid rgba(0, 0, 0, 0.5);
  }
  .Resizer.vertical {
    width: 11px;
    margin: 0 -5px;
    border-left: 5px solid rgba(255, 255, 255, 0);
    border-right: 5px solid rgba(255, 255, 255, 0);
    cursor: col-resize;
  }
  .Resizer.vertical:hover {
    border-left: 5px solid rgba(0, 0, 0, 0.5);
    border-right: 5px solid rgba(0, 0, 0, 0.5);
  }
  .SplitPane.horizontal {
    position: inherit!important as any;
  }
`;

export const content = css`
  /* name:content */
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  font-family: Lato;

  .m12 {
    margin: 12px !important;
  }
  .m6 {
    margin: 6px !important;
  }
`;

export const diff = css`
  max-height: 200px;
  overflow: auto;

  table {
    width: 100%;
    background: white;
    color: black;
  }

  .diff {
    border-collapse: collapse;
    white-space: pre-wrap;
  }

  .diff tbody {
    font-family: Courier, monospace;
    font-size: 11px;
  }
  .diff tbody th {
    background: #eed;
    font-size: 11px;
    font-weight: normal;
    border: 1px solid #bbc;
    color: #886;
    padding: 0.1em 0.4em 0.1em;
    text-align: right;
    vertical-align: top;
    width: 30px;
  }
  .diff thead {
    border-bottom: 1px solid #bbc;
    background: #efefef;
  }
  .diff thead th.texttitle {
    text-align: left;
    font-size: 11px;
  }
  .diff tbody td {
    padding-left: 0.4em;
    vertical-align: top;
  }
  .diff .empty {
    background-color: #ddd;
  }
  .diff .replace {
    background-color: #fd8;
  }
  .diff .delete {
    background-color: #e99;
  }
  .diff .skip {
    background-color: #efefef;
    border: 1px solid #aaa;
    border-right: 1px solid #bbc;
  }
  .diff .insert {
    background-color: #9e9;
  }
  .diff th.author {
    text-align: right;
    border-top: ˝1px solid #bbc;
    background: #efefef;
  }
`;
export const full = css`
  width: 100%;
  height: 100%;
`;

export const pane = (hideMenus: boolean) =>
  css`
    padding: 6px;
    position: absolute;
    overflow: auto;
    top: ${hideMenus ? '0px' : '42px'};
    bottom: 0;
    left: 0;
    right: 0;
  `;

export const timing = (color: string) =>
  css`
    /* name:timing */
    float: right;
    font-size: 10px;
    color: ${color};
    min-width: 40px;
    text-align: right;
  `;

export const floatShots = css`
  flex: 1 50px;
  min-width: 35px;
  text-align: left;
  margin-left: 5px;
`;
