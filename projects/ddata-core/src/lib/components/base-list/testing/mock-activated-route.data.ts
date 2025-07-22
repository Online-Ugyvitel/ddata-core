import { of } from 'rxjs';

// Mock ActivatedRoute
export const mockActivatedRoute = {
  snapshot: {
    params: { id: '1' },
    queryParams: {},
    data: {}
  },
  params: of({ id: '1' }),
  queryParams: of({}),
  data: of({})
};