import { accessKeyForm, libraryForm, queryNumberForm, vowelForm, vowelModeForm, wordExcludeForm, wordExcludeModeForm, wordIncludeForm, wordIncludeModeForm } from ".";
import { Vowel, convertVowelMode, convertWordMode } from "./declarations";

let suspendSaving = true;

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
    suspendSaving = false;
})();

for(let elm of document.getElementsByClassName('modify-trigger')){
    (elm as any).onchange = ()=>{
        if(!suspendSaving){
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
            }
            for(let p in data){
                localStorage.setItem(p, data[p]);
            }
        }
    }
}