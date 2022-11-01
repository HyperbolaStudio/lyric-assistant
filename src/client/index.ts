import '@material/mwc-button';
import '@material/mwc-dialog';
import '@material/mwc-icon-button';
import '@material/mwc-textfield';
import '@material/mwc-top-app-bar-fixed';
import '@material/mwc-select';
import '@material/mwc-checkbox';
import '@material/mwc-radio';
import '@material/mwc-list';
import '@material/mwc-list/mwc-check-list-item';
import '@material/mwc-circular-progress';
import '@material/mwc-snackbar';

import { Button } from '@material/mwc-button';
import { TextField } from '@material/mwc-textfield';
import { Select } from '@material/mwc-select';
import { List } from '@material/mwc-list';
import { CircularProgress } from '@material/mwc-circular-progress';

export const apiHost = 'https://lyric-api.myxrcrs.cn';
export const ncmPrefix = 'https://music.163.com/#/song?id='

export let queryButton = document.getElementById('btn-query') as Button;
export let libraryForm = document.getElementById('select-library') as Select;
export let vowelForm = document.getElementById('form-vowel') as TextField;
export let vowelModeForm = document.getElementById('select-vowel-mode') as TextField;
export let wordIncludeForm = document.getElementById('form-word-include') as TextField;
export let wordIncludeModeForm = document.getElementById('select-word-include-mode') as Select;
export let wordExcludeForm = document.getElementById('form-word-exclude') as TextField;
export let wordExcludeModeForm = document.getElementById('select-word-exclude-mode') as Select;
export let queryNumberForm = document.getElementById('form-turns') as TextField;
export let accessKeyForm = document.getElementById('form-accesskey') as TextField;
export let circularProgress = document.getElementById('result-progress') as CircularProgress;
export let resultError = document.getElementById('result-error') as HTMLDivElement;
export let resultList = document.getElementById('result-list') as List;
export let useThirdPartyApiCheckbox = document.getElementById('check-use-3rd-party-api') as CheckListItem;
export let apiUriForm = document.getElementById('form-api-uri') as TextField;
export let queryCountField = document.getElementById('query-count') as HTMLDivElement;

import './autosave';
import './core';
import { CheckListItem } from '@material/mwc-list/mwc-check-list-item';
