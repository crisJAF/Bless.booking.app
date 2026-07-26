export type ApiResponse<T> = {
  content?: T;
  Content?: T;
  message?: string;
  Message?: string;
  isSuccess?: boolean;
  IsSuccess?: boolean;
  success?: boolean;
  Success?: boolean;
};

export type LoginResponse = {
  token?: string;
  Token?: string;
};

export type Barbero = {
  barberoId?: number;
  BarberoId?: number;
  nombre?: string;
  Nombre?: string;
  especialidad?: string;
  Especialidad?: string;
};

export type Servicio = {
  servicioId?: number;
  ServicioId?: number;
  nombre?: string;
  Nombre?: string;
  descripcion?: string;
  Descripcion?: string;
  duracionMinutos?: number;
  DuracionMinutos?: number;
  precio?: number;
  Precio?: number;
};

export type HorarioDisponible = {
  horaDesde?: string;
  HoraDesde?: string;
  horaHasta?: string;
  HoraHasta?: string;
};

export type CitaRequest = {
  Nombre: string;
  Correo: string;
  Telefono: string;
  ServicioId: number;
  Fecha: string;
  Hora: string;
  BarberoID: number;
};

export type Reserva = {
  reservaId?: number;
  ReservaId?: number;
  nombreCliente?: string;
  NombreCliente?: string;
  nombreBarbero?: string;
  NombreBarbero?: string;
  nombreServicio?: string;
  NombreServicio?: string;
  fecha?: string;
  Fecha?: string;
  hora?: string;
  Hora?: string;
  estado?: string;
  Estado?: string;
};

export type Review = {
  author_name?: string;
  profile_photo_url?: string;
  rating?: number;
  text?: string;
  Text?: string;
  time?: number;
  Time?: number;
};
