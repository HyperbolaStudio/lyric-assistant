import { convertVowelMode, convertWordMode, QueryRequest, Vowel } from './declarations';
import * as path from 'path';
import { logger } from './logger';
import { invokeQuery } from './invokeQuery';
import { CircularProgress as MwcCircularProgress } from "@material/mwc-circular-progress";
import { List } from '@material/mwc-list';
import { queryButton, libraryForm, vowelForm, vowelModeForm, wordIncludeForm, wordIncludeModeForm, wordExcludeForm, wordExcludeModeForm, queryNumberForm, accessKeyForm, resultList, ncmPrefix } from '.';
import { ResultSection } from './ResultSection';

if(queryButton)queryButton.onclick = async ()=>{
    let allValid = true;
    for(let elm of [libraryForm, vowelForm, vowelModeForm, wordIncludeForm, wordIncludeModeForm, wordExcludeForm, wordExcludeModeForm, queryNumberForm, accessKeyForm]){
        if(!elm.validity.valid){
            elm.reportValidity();
            allValid = false;
        }
    }
    if(allValid){
        ResultSection.clearResult();
        ResultSection.CircularProgress.show();
        try{
            let res = await invokeQuery(parseQuery());
            ResultSection.CircularProgress.hide();
            resultList.append(...res.map(entry=>{
                let item = document.createElement('mwc-list-item');
                item.twoline = true;
                item.setAttribute('entry-data', JSON.stringify(entry));
                let firstLine = document.createElement('span');
                firstLine.textContent = entry.line;
                item.appendChild(firstLine);
                let secondLine = document.createElement('span');
                secondLine.textContent = [entry.pinyin, entry.title, entry.author].join(' - ');
                secondLine.slot = 'secondary';
                item.appendChild(secondLine);
                item.onclick = ()=>{
                    logger.dialog(
                        '详细信息',
                        [`歌词：${entry.line}`,`拼音：${entry.pinyin}`,`韵尾：${entry.vowel}`,`歌名：${entry.author}`,`作者：${entry.author}`],
                        {label: 'OK', action: ()=>{}},
                        entry.id ? {label: '访问网易云音乐', action: ()=>{window.open(ncmPrefix+entry.id, '_blank')}} : undefined
                    )
                }
                return item;
            }));
        }catch(e){
            ResultSection.clearResult();
            ResultSection.showError(e);
        }
    }
}

function parseQuery(){
    let query: QueryRequest = {
        library: libraryForm.value,
        vowel: vowelForm.value.split(' ').filter(v=>v) as Vowel[],
        vowelMode: convertVowelMode(vowelModeForm.value),
        wordInclude: wordIncludeForm.value.split(' ').filter(v=>v),
        wordIncludeMode: convertWordMode(wordIncludeModeForm.value),
        wordExclude: wordExcludeForm.value.split(' ').filter(v=>v),
        wordExcludeMode: convertWordMode(wordExcludeModeForm.value),
        queryNumber: parseInt(queryNumberForm.value),
        accessKey: accessKeyForm.value,
    }
    return query;
}