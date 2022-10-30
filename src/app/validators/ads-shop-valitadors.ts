import { FormControl, ValidationErrors } from '@angular/forms';
export class AdsShopValitadors {

    // validando espaços vazio
    static notOnlyWhitespace(control: FormControl): ValidationErrors {
        // chegando sem tem espaço em branco
        if ((control.value != null) && (control.value.trim().length === 0)) {


            // validando , retornando erro
            return { 'notOnlyWhitespace': true} ;
            
        }
        else {
            // retorna um valor nulo
            return null;
        }

    }
}
