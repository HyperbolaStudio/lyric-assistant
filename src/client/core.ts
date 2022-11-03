import { convertVowelMode, convertWordMode, CorpusEntry, QueryRequest, Vowel } from '../common/PayloadUtils';
import { logger } from './logger';
import { invokeQuery } from './invokeQuery';
import { CircularProgress as MwcCircularProgress } from "@material/mwc-circular-progress";
import { List } from '@material/mwc-list';
import { queryButton, libraryForm, vowelForm, vowelModeForm, wordIncludeForm, wordIncludeModeForm, wordExcludeForm, wordExcludeModeForm, queryNumberForm, accessKeyForm, resultList, ncmPrefix, useThirdPartyApiCheckbox, apiUriForm } from '.';
import { ResultSection } from './ResultSection';
import { syncCorpusList } from './syncCorpusList';
import { func, suspendSaving } from './autosave';

(()=>{
    let f = useThirdPartyApiCheckbox.onclick;
    useThirdPartyApiCheckbox.onclick = null;
    useThirdPartyApiCheckbox.onclick = async()=>{
        if(f)await (f as any)();
        if(useThirdPartyApiCheckbox.selected == true){
            apiUriForm.style.display = '';
        }else{
            apiUriForm.style.display = 'none';
        }
    }
})();

(async()=>{
    console.log(1);
    let list: CorpusEntry[]|undefined = await syncCorpusList();
    if(!list)return;
    suspendSaving.suspendSaving = true;
    libraryForm.append(...list.map(entry=>{
        let elm = document.createElement('mwc-list-item');
        elm.value = entry.name;
        elm.textContent = entry.label;
        return elm;
    }));
    libraryForm.value = localStorage.getItem('library') ?? '';
    libraryForm.onchange = func;
    suspendSaving.suspendSaving = false;
})();

queryButton.onclick = async ()=>{
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
            resultList.append(...res.body.map(entry=>{
                let item = document.createElement('mwc-list-item');
                item.twoline = true;
                item.setAttribute('entry-data', JSON.stringify(entry));
                let firstLine = document.createElement('span');
                firstLine.textContent = entry.line;
                item.appendChild(firstLine);
                let secondLine = document.createElement('span');
                secondLine.textContent = [entry.pinyin, entry.title, entry.singer].join(' - ');
                secondLine.slot = 'secondary';
                item.appendChild(secondLine);
                item.onclick = ()=>{
                    logger.dialog(
                        '详细信息',
                        [`歌词：${entry.line}`,`拼音：${entry.pinyin}`,`韵尾：${entry.vowel}`,`歌名：${entry.title}`,`作者：${entry.singer}`],
                        {label: 'OK', action: ()=>{}},
                        entry.id ? {label: '访问网易云音乐', action: ()=>{window.open(ncmPrefix+entry.id, '_blank')}} : undefined
                    )
                }
                return item;
            }));
            ResultSection.showQueryCount(
                queryNumberForm.value, 
                res.body.length, 
                res.queryNumber.total, 
                res.queryNumber.available
            );
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