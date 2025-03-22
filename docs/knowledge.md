# 🧠 Tips PRO para convertirse en Senior Developer 

Este documento contiene aprendizajes, buenas prácticas y patrones que te ayudarán a escribir código más limpio, eficiente y con mentalidad de desarrollador senior.  
Se actualiza constantemente con situaciones reales encontradas en proyectos.

---

## 🔹 async vs await cuando devolvés una consulta directa

**TIP-PRO:**  
No uses `async`/`await` si **solo devolvés un `Task` directamente** sin hacer nada extra con el resultado.  
Esto evita un *overhead* innecesario y mantiene el código más limpio y fácil de leer.

### ✅ Correcto (no se necesita `async`)
```csharp
private Task<List<FacturasDto>> GetFacturasAsync()
{
    return _context.Documentos
        .AsNoTracking()
        .Select(d => new FacturasDto
        {
            Id = d.Id,
            Movimientos = d.Movimientos.Select(m => new MovimientoDto
            {
                IdMovimiento = m.IdMovimiento,
            }).ToList(),
        })
        .ToListAsync();
}
```
### 🚫 Incorrecto (usa `async` sin necesidad)
```csharp
private async Task<List<FacturasDto>> GetFacturasAsync()
{
    var entidades = await _context.Documentos.ToListAsync();

    var dtos = entidades.Select(d => new FacturaDto
    {
        Id = d.Id
    }).ToList();

    return dtos;
}
```

Más info: https://devblogs.microsoft.com/dotnet/configureawait-faq/



> 💡 **¿Cuándo sí usar `await`?**  
> Cuando necesitas procesar el resultado *después* del `await`, por ejemplo para mapear o modificar la data antes de devolverla.

---

## 🔹 async sí se necesita si hay lógica después del await

**TIP-PRO:**  
Usá `async/await` cuando necesitás **trabajar con el resultado** de un método asíncrono, por ejemplo: construir un objeto, aplicar una lógica adicional, validar datos, etc.

### ✅ Ejemplo correcto: se necesita `await`
```csharp
public async Task<FacturasVm> GetFacturasPendientes(DateTime periodo)
{
    var facturas = await GetFacturasAsync();


    return new FacturasVm
    {
        Facturas = facturas
    };
}
```

### 🚫 Incorrecto: intentar devolver un Task sin `await` (mala práctica)
```csharp
public Task<FacturasVm> GetFacturasPendientes(DateTime periodo)
{
    var task = GetFacturasAsync(...);
    return task.ContinueWith(t =>
        new FacturasVm { Facturas = t.Result });
}
```


## 🔹 async vs await cuando solo redirigís la tarea

**TIP-PRO:**  
Si tu método **no hace nada más que llamar y devolver un Task**, no necesitás usar `async/await`.  
Evitás agregar un `state machine` innecesario y tu código queda más limpio y eficiente.

### ✅ Correcto (sin `async` innecesario)
```csharp
public Task SincronizarGastosAsync(DateTime periodo)
{
    return GetAndSetGastosCompacAsync(periodo);
}
```

### 🚫 Incorrecto (usa `async` sin procesar nada)
```csharp
public async Task SincronizarGastosAsync(DateTime periodo)
{
    await GetAndSetGastosCompacAsync(periodo);
}
```

> 🔍 Cuando usás `await`, solo tiene sentido si hacés algo con el resultado o con la excepción.

---

