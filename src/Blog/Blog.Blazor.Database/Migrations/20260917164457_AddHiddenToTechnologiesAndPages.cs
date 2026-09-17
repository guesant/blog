using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Blog.Blazor.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddHiddenToTechnologiesAndPages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "hidden",
                table: "technologies",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "hidden",
                table: "pages",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "hidden",
                table: "technologies");

            migrationBuilder.DropColumn(
                name: "hidden",
                table: "pages");
        }
    }
}
