import { ID } from '@netdjw/ddata-core';

export interface CasefileStatusInterface {
  id: ID;
  name: string;
  color: string;
}

export interface CasefileUserInterface {
  name: string;
  image?: { src: string };
}

export interface CasefileCompanyInterface {
  name: string;
  phone?: string;
  email?: string;
}

/**
 * The fields of a casefile what the kanban and the date separated list views display.
 */
export interface CasefileInterface {
  id: ID;
  name?: string;
  description?: string;
  status_id?: ID | null;
  status?: CasefileStatusInterface | null;
  priority?: { color: string };
  owner?: CasefileUserInterface;
  responsible_user?: CasefileUserInterface;
  company?: CasefileCompanyInterface;
  /**
   * Estimated time in `H:mm:ss` format.
   */
  estimated_time?: string;
  /**
   * ISO date (`2026-01-15`) or date-time (`2026-01-15T12:00:00Z`) string.
   */
  deadline?: string | null;
}
