import { WordMode } from "../common/PayloadUtils";

export function patternizeWords(words: string[], mode: WordMode){
    switch(mode){
        case WordMode.Any: return words.map(v=>'%'+v+'%');
        case WordMode.Head: return words.map(v=>v+'%');
        case WordMode.Tail: return words.map(v=>'%'+v);
        case WordMode.Advanced: return words.map(v=>v);
    }
}