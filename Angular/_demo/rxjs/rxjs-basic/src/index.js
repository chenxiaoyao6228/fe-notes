import { Observable } from 'rxjs';
import { of } from 'rxjs';

const source$ = of(1, 2, 3);
source$.subscribe(console.log);