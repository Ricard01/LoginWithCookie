export interface ColumnDefinition {
  key: string; // Clave de la columna (debe coincidir con la propiedad del objeto)
  header: string; // Encabezado de la columna
  format?: 'currency' | 'date' | 'default'; // Formato de la celda
  width?: string; // Ancho de la columna (puede reemplazar class)
  input?: boolean; // 🔥 Indica si el campo es editable
  inputType?: 'text' | 'number' | 'date'; 
  formControlName?: string; // 🔥 Nombre del campo en FormGroup
  class?: string; // 🔥 Clase CSS opcional para personalizar el input
}
