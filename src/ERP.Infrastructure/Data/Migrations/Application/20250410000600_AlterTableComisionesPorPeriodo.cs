using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ERP.Infrastructure.Data.Migrations.Application
{
    /// <inheritdoc />
    public partial class AlterTableComisionesPorPeriodo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ComisionPeriodo");

            migrationBuilder.CreateTable(
                name: "ComisionesPorPeriodo",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdAgente = table.Column<int>(type: "int", nullable: false),
                    Periodo = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ComisionPersonal = table.Column<double>(type: "float", nullable: false),
                    ComisionCompartida = table.Column<double>(type: "float", nullable: false),
                    TotalComisionPagada = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ComisionesPorPeriodo", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ComisionesPorPeriodo");

            migrationBuilder.CreateTable(
                name: "ComisionPeriodo",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ComisionCompartida = table.Column<double>(type: "float", nullable: false),
                    ComisionPersonal = table.Column<double>(type: "float", nullable: false),
                    IdAgente = table.Column<int>(type: "int", nullable: false),
                    Periodo = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Total = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ComisionPeriodo", x => x.Id);
                });
        }
    }
}
