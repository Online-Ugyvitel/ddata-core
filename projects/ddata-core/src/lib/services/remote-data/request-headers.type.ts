import { HttpHeaders } from '@angular/common/http';

export type RequestHeaders = HttpHeaders | Record<string, string | Array<string>>;
