import { inject, Injectable } from '@angular/core';
import { forkJoin, Observable, of, switchMap, take, throwError } from 'rxjs';
import { ActivoTi } from '../models/activo-ti.model';
import { Sede } from '../models/sede.model';
import {
  TicketCreatePayload,
  TicketSoporte,
  TicketUpdatePayload
} from '../models/ticket-soporte.model';
import { VisitaTecnica } from '../models/visita-tecnica.model';
import { generateYearlyCode } from '../utils/code-generator.util';
import { calculateSlaDeadline } from '../utils/sla.util';
import {
  canAssignTicket,
  canCancelTicket,
  canCloseTicket,
  canCreateTicketForActivo,
  canCreateTicketForSede,
  canEditTicket,
  canMoveTicketToReview,
  canResolveTicket
} from '../utils/ticket-rules.util';
import { JsonServerApiService } from './json-server-api.service';

@Injectable({ providedIn: 'root' })
export class TicketsService {
  private readonly api = inject(JsonServerApiService);

  getAll(): Observable<TicketSoporte[]> {
    return this.api.list<TicketSoporte>('tickets');
  }

  getById(id: number): Observable<TicketSoporte> {
    return this.api.getById<TicketSoporte>('tickets', id);
  }

  create(payload: TicketCreatePayload): Observable<TicketSoporte> {
    return forkJoin({
      tickets: this.getAll().pipe(take(1)),
      sede: this.api.getById<Sede>('sedes', payload.sedeId).pipe(take(1)),
      activo: this.resolveActivo(payload.activoId)
    }).pipe(
      switchMap(({ tickets, sede, activo }) => {
        if (!canCreateTicketForSede(sede)) {
          return throwError(() => new Error('La sede no puede registrar tickets nuevos.'));
        }

        if (!canCreateTicketForActivo(activo)) {
          return throwError(
            () => new Error('No se puede registrar un ticket para un activo fuera de servicio o de baja.')
          );
        }

        return this.api.create<TicketSoporte>('tickets', {
          ...payload,
          codigo: generateYearlyCode(
            'TKT',
            tickets.map((ticket) => ticket.codigo)
          ),
          fechaRegistro: new Date().toISOString(),
          fechaLimiteAtencion: calculateSlaDeadline(payload.prioridad),
          estado: 'REGISTRADO',
          tecnicoAsignadoId: null,
          solucionResumen: null,
          fechaCierre: null
        });
      })
    );
  }

  update(id: number, payload: TicketUpdatePayload): Observable<TicketSoporte> {
    return forkJoin({
      ticket: this.getById(id).pipe(take(1)),
      activo: this.resolveActivo(payload.activoId)
    }).pipe(
      switchMap(({ ticket, activo }) => {
        if (!canEditTicket(ticket)) {
          return throwError(() => new Error('El ticket ya no puede editarse en su estado actual.'));
        }

        if (!canCreateTicketForActivo(activo)) {
          return throwError(
            () => new Error('No se puede asociar un activo fuera de servicio o dado de baja.')
          );
        }

        return this.api.update<TicketSoporte>('tickets', id, {
          ...ticket,
          ...payload,
          fechaLimiteAtencion: calculateSlaDeadline(payload.prioridad, new Date(ticket.fechaRegistro))
        });
      })
    );
  }

  moveToReview(id: number): Observable<TicketSoporte> {
    return this.getById(id).pipe(
      take(1),
      switchMap((ticket) => {
        if (!canMoveTicketToReview(ticket)) {
          return throwError(() => new Error('El ticket solo puede pasar a revisión desde REGISTRADO.'));
        }

        return this.api.patch<TicketSoporte>('tickets', id, { estado: 'EN_REVISION' });
      })
    );
  }

  assign(id: number, tecnicoAsignadoId: number): Observable<TicketSoporte> {
    return this.getById(id).pipe(
      take(1),
      switchMap((ticket) => {
        if (!canAssignTicket(ticket)) {
          return throwError(() => new Error('El ticket solo puede asignarse desde EN_REVISION.'));
        }

        return this.api.patch<TicketSoporte>('tickets', id, {
          tecnicoAsignadoId,
          estado: 'ASIGNADO'
        });
      })
    );
  }

  resolve(id: number, solucionResumen: string): Observable<TicketSoporte> {
    return forkJoin({
      ticket: this.getById(id).pipe(take(1)),
      visitas: this.api.list<VisitaTecnica>('visitas', { ticketId: id }).pipe(take(1))
    }).pipe(
      switchMap(({ ticket, visitas }) => {
        if (!solucionResumen.trim()) {
          return throwError(() => new Error('La solución es obligatoria para resolver el ticket.'));
        }

        if (!canResolveTicket(ticket, visitas)) {
          return throwError(
            () => new Error('El ticket requiere una visita finalizada con solución antes de resolverse.')
          );
        }

        return this.api.patch<TicketSoporte>('tickets', id, {
          estado: 'RESUELTO',
          solucionResumen: solucionResumen.trim()
        });
      })
    );
  }

  close(id: number): Observable<TicketSoporte> {
    return this.getById(id).pipe(
      take(1),
      switchMap((ticket) => {
        if (!['ASIGNADO', 'EN_ATENCION', 'RESUELTO'].includes(ticket.estado)) {
          return throwError(() => new Error('El ticket solo puede cerrarse desde una atencion activa o resuelta.'));
        }

        return this.api.patch<TicketSoporte>('tickets', id, {
          estado: 'CERRADO',
          fechaCierre: new Date().toISOString()
        });
      })
    );
  }

  cancel(id: number): Observable<TicketSoporte> {
    return this.getById(id).pipe(
      take(1),
      switchMap((ticket) => {
        if (!canCancelTicket(ticket)) {
          return throwError(() => new Error('El ticket ya no puede cancelarse.'));
        }

        return this.api.patch<TicketSoporte>('tickets', id, {
          estado: 'CANCELADO',
          fechaCierre: new Date().toISOString()
        });
      })
    );
  }

  patchState(id: number, payload: Partial<TicketSoporte>): Observable<TicketSoporte> {
    return this.api.patch<TicketSoporte>('tickets', id, payload);
  }

  private resolveActivo(activoId: number | null): Observable<ActivoTi | undefined> {
    if (!activoId) {
      return of(undefined);
    }

    return this.api.getById<ActivoTi>('activos', activoId);
  }
}
