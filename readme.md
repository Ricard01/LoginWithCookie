on main folder 
dotnet ef migrations add Initial -p ERP.Infrastructure -s ERP.Api -o Data/Migrations -c ApplicationDbContext --verbose
dotnet ef migrations remove -p .\ERP.Infrastructure\ -s .\ERP.Api\  -c ApplicationDbContext --verbose