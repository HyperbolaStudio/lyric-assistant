import { accessKeyForm, apiUriForm, libraryForm, queryNumberForm, useThirdPartyApiCheckbox, vowelForm, vowelModeForm, wordExcludeForm, wordExcludeModeForm, wordIncludeForm, wordIncludeModeForm } from ".";
import { Vowel, convertVowelMode, convertWordMode } from "../common/PayloadUtils";

export let suspendSaving = {suspendSaving: true};

(()=>{
    libraryForm.value = localStorage.getItem('library') ?? '';
    vowelForm.value = localStorage.getItem('vowel') ?? '';
    vowelModeForm.value = localStorage.getItem('vowelMode') ?? '';
    wordIncludeForm.value = localStorage.getItem('wordInclude') ?? '';
    wordIncludeModeForm.value = localStorage.getItem('wordIncludeMode') ?? '';
    wordExcludeForm.value = localStorage.getItem('wordExclude') ?? '';
    wordExcludeModeForm.value = localStorage.getItem('wordExcludeMode') ?? '';
    queryNumberForm.value = localStorage.getItem('queryNumber') ?? '';
    accessKeyForm.value = localStorage.getItem('accessKey') ?? '';
    useThirdPartyApiCheckbox.selected = localStorage.getItem('useThirdPartyApi') == 'true';
    apiUriForm.value = localStorage.getItem('apiUri') ?? '';
    suspendSaving.suspendSaving = false;
})();
export let func = async()=>{
    return new Promise<void>((resolve,reject)=>{
        if(!suspendSaving.suspendSaving)setTimeout(()=>{
            let data: Record<string, string> = {
                library: libraryForm.value,
                vowel: vowelForm.value,
                vowelMode: vowelModeForm.value,
                wordInclude: wordIncludeForm.value,
                wordIncludeMode: wordIncludeModeForm.value,
                wordExclude: wordExcludeForm.value,
                wordExcludeMode: wordExcludeModeForm.value,
                queryNumber: queryNumberForm.value,
                accessKey: accessKeyForm.value,
                useThirdPartyApi: useThirdPartyApiCheckbox.selected.toString(),
                apiUri: apiUriForm.value,
            };
            for(let p in data){
                localStorage.setItem(p, data[p]);
            }
            resolve();
        }, 10);
        else resolve();
    });
    
}
for(let elm of document.getElementsByClassName('modify-trigger') as any){
    if(typeof(elm.selected) == 'boolean'){
        elm.onclick = func;
    }else{
        console.log(elm.tagName);
        elm.onchange = func;
    }
}