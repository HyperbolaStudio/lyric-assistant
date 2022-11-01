import { Vowel, VowelMode } from "../common/PayloadUtils";

export function matchSimilarVowels(vowels: Vowel[], mode: VowelMode){
    let s = new Set<Vowel>(vowels);
    if(mode == VowelMode.Same)return [...s];
    else{
        for(let x of vowels){

            if(x == 'i')s.add('v');
            if(x == 'v')s.add('i');

            if(x == 'ou')s.add('o');
            if(x == 'o')s.add('ou');

            if(x == 'ei')s.add('^e');
            if(x == '^e')s.add('ei');

            if(x == 'n')s.add('ing');
            if(x == 'ing')s.add('n');

            if(x == 'en')s.add('eng');
            if(x == 'eng')s.add('en');

            if(x == 'an')s.add('ang');
            if(x == 'ang')s.add('an');

        }
        return [...s];
    }
}