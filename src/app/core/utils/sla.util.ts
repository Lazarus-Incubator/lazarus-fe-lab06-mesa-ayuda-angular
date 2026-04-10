import { TicketPrioridad, TicketSoporte } from '../models/ticket-soporte.model';

const SLA_HOURS: Record<TicketPrioridad, number> = {
  BAJA: 48,
  MEDIA: 24,
  ALTA: 12,
  CRITICA: 4
};

export function calculateSlaDeadline(priority: TicketPrioridad, baseDate = new Date()): string {
  const result = new Date(baseDate);

  if (priority === 'CRITICA') {
    result.setDate(result.getDate() + 1);
    return result.toISOString();
  }

  result.setHours(result.getHours() + SLA_HOURS[priority]);
  return result.toISOString();
}

export function isTicketClosed(ticket: TicketSoporte): boolean {
  return ticket.estado === 'CERRADO' || ticket.estado === 'CANCELADO';
}

export function isTicketOpen(ticket: TicketSoporte): boolean {
  return !isTicketClosed(ticket);
}

export function isTicketOverdue(ticket: TicketSoporte, now = new Date()): boolean {
  return isTicketOpen(ticket) && new Date(ticket.fechaLimiteAtencion).getTime() < now.getTime();
}
