export interface ColumnDefinition {
  key: string; // Clave de la columna (debe coincidir con la propiedad del objeto)
  header: string; // Encabezado de la columna
  format?: 'currency' | 'date' | 'default'; // Formato de la celda
  width?: string; // Ancho de la columna
  action?: (row: any) => void; // Función personalizada para acciones
}
