#!/usr/bin/env python3
"""Generate T7 Software Cost Estimation PDF for OctoTask (Spanish)."""

from __future__ import annotations

from pathlib import Path

from fpdf import FPDF
from fpdf.enums import XPos, YPos
from pypdf import PdfReader, PdfWriter

COVER_PDF = Path("/Users/jdelatorre/Downloads/T7-Estimate the cost of your software project (Israel).pdf")
OUTPUT_PDF = Path(__file__).resolve().parent / "T7-Estimacion_Costo_OctoTask.pdf"
CONTENT_PDF = Path(__file__).resolve().parent / "_t7_content_temp.pdf"


class T7PDF(FPDF):
    def header(self) -> None:
        if self.page_no() == 1:
            return
        self.set_font("Helvetica", "I", 9)
        self.set_text_color(100, 100, 100)
        self.cell(
            0,
            8,
            "T7 - Estimacion del costo del proyecto de software | OctoTask",
            new_x=XPos.LMARGIN,
            new_y=YPos.NEXT,
        )

    def footer(self) -> None:
        if self.page_no() == 1:
            return
        self.set_y(-12)
        self.set_font("Helvetica", "I", 9)
        self.set_text_color(100, 100, 100)
        self.cell(0, 8, f"Pagina {self.page_no()}", align="C")

    def section_title(self, title: str) -> None:
        self.ln(3)
        self.set_font("Helvetica", "B", 12)
        self.set_text_color(20, 20, 20)
        self.multi_cell(0, 6, title)
        self.ln(1)

    def body_text(self, text: str) -> None:
        self.set_x(self.l_margin)
        self.set_font("Helvetica", "", 10)
        self.set_text_color(30, 30, 30)
        self.multi_cell(0, 5.5, text)
        self.ln(1)

    def bold_line(self, text: str) -> None:
        self.set_x(self.l_margin)
        self.set_font("Helvetica", "B", 10)
        self.multi_cell(0, 5.5, text)
        self.ln(1)

    def bullet(self, text: str) -> None:
        self.set_x(self.l_margin)
        self.set_font("Helvetica", "", 10)
        self.multi_cell(0, 5.5, f"  - {text}")

    def simple_table(self, col_widths: tuple[int, ...], rows: list[tuple[str, ...]], header: bool = True) -> None:
        with self.table(col_widths=col_widths, first_row_as_headings=header, repeat_headings=True) as table:
            for row in rows:
                table.row(row)


def build_content_pdf() -> None:
    pdf = T7PDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.set_margins(18, 18, 18)
    pdf.add_page()

    pdf.set_font("Helvetica", "B", 15)
    pdf.multi_cell(0, 7, "Estimacion del costo del proyecto de software")
    pdf.ln(1)
    pdf.set_font("Helvetica", "", 11)
    pdf.multi_cell(
        0,
        6,
        "Proyecto: OctoTask - Plataforma de gestion de tareas SCRUM (Programa Oracle MTDR)",
    )
    pdf.ln(2)

    pdf.section_title("1. Objetivo")
    pdf.body_text(
        "El presente documento estima de forma retrospectiva el costo del desarrollo del "
        "proyecto OctoTask, utilizando la metodologia agil basada en Story Points, velocidad "
        "del equipo y asignacion de recursos, conforme a la guia del tema T7 (Software Cost "
        "Estimation) del curso Software Systems Planning (Gpo 101)."
    )

    pdf.section_title("2. Descripcion del proyecto")
    pdf.body_text(
        "OctoTask es una aplicacion web de gestion de tareas y sprints para equipos de "
        "desarrollo. Combina un frontend React embebido en un backend Spring Boot 3 / Java 17, "
        "con persistencia en Oracle Autonomous Database y despliegue en Oracle Cloud "
        "Infrastructure (OKE + OCIR). El sistema atiende dos roles principales: Project "
        "Manager y Developer."
    )
    pdf.body_text(
        "Alcance estimado (producto completo): autenticacion, tablero Kanban, CRUD de tareas, "
        "roles y permisos, analitica por sprint, bot de Telegram con IA (OCIbotGemini), "
        "politicas de seguridad (2FA y bloqueo), notificaciones, CI/CD y despliegue en la nube."
    )
    pdf.body_text(
        "Referencias: workspace.dsl, doc/arch/0001-arch-decision-1.md, "
        "doc/arch/0002-arch-decision-2.md, OCTOTask_User_Manual.md."
    )

    pdf.section_title("3. Metodologia")
    pdf.body_text(
        "Los Story Points (SP) miden esfuerzo relativo, complejidad e incertidumbre; no equivalen "
        "directamente a horas. Se utilizo la secuencia de Fibonacci (1, 2, 3, 5, 8, 13, 21...) "
        "para asignar puntos a cada funcionalidad."
    )
    pdf.body_text(
        "La conversion a costo sigue la cadena: Story Points totales -> velocidad del equipo "
        "-> numero de sprints -> duracion en semanas -> costo semanal del equipo -> factor de "
        "contingencia (20%)."
    )

    pdf.section_title("4. Asignacion de Story Points por funcionalidad")
    sp_rows = [
        ("Funcionalidad", "SP", "Descripcion"),
        ("Login y registro de usuarios", "3", "Pantallas de acceso, validacion y creacion de cuenta"),
        ("Backend e integracion con base de datos", "13", "API REST Spring Boot, capas y Oracle ADB"),
        ("Tablero Kanban (Task Dashboard)", "8", "Columnas Late/Pending/In Progress/Completed"),
        ("CRUD de tareas", "5", "Crear, editar y eliminar tareas con asignacion y prioridad"),
        ("Roles y permisos", "8", "Admin ve tareas del equipo; developer ve tareas propias"),
        ("Analitica y KPIs por sprint", "13", "Graficas Recharts, metricas de equipo y rendimiento"),
        ("Bot de Telegram con IA (OCIbotGemini)", "21", "Consultas en lenguaje natural sobre tareas"),
        ("CI/CD y despliegue en OCI", "13", "Docker, OKE, Terraform, pipeline GitHub Actions"),
        ("Seguridad (2FA, bloqueo, auditoria)", "8", "Controles de acceso y politicas de seguridad"),
        ("Notificaciones in-app", "5", "Alertas de tareas, plazos y actividad del equipo"),
        ("Documentacion y refinamiento UI", "5", "Manual de usuario, especificaciones y rediseño UI"),
    ]
    pdf.simple_table((52, 12, 116), sp_rows)
    pdf.ln(2)
    pdf.bold_line("Total de Story Points del proyecto: 102 SP")

    pdf.section_title("5. Velocidad del equipo (retrospectiva)")
    pdf.body_text(
        "OctoTask se desarrollo en cuatro sprints de dos semanas cada uno, dentro de un "
        "programa academico de aproximadamente cinco meses calendario. La velocidad se "
        "calculo con base en los entregables completados por sprint:"
    )
    velocity_rows = [
        ("Sprint", "SP completados", "Entregables principales"),
        ("Sprint 1", "21", "Diseno de arquitectura, autenticacion, esquema BD"),
        ("Sprint 2", "24", "CRUD de tareas, tablero Kanban, roles basicos"),
        ("Sprint 3", "28", "Analitica, filtros avanzados, bot Telegram OCIbotGemini"),
        ("Sprint 4", "29", "Despliegue OCI, CI/CD, manual de usuario, refinamiento UI"),
    ]
    pdf.simple_table((22, 28, 130), velocity_rows)
    pdf.ln(1)
    pdf.body_text(
        "Velocidad promedio = (21 + 24 + 28 + 29) / 4 = 25.5 SP por sprint "
        "(aproximadamente 26 SP/sprint)."
    )

    pdf.section_title("6. Estimacion de duracion")
    pdf.body_text("Datos del proyecto:")
    pdf.bullet("Total de Story Points: 102 SP")
    pdf.bullet("Velocidad promedio del equipo: 26 SP por sprint")
    pdf.bullet("Duracion de cada sprint: 2 semanas")
    pdf.ln(1)
    pdf.body_text("Numero de sprints requeridos:")
    pdf.bold_line("102 / 26 = 3.92 sprints  ~  4 sprints")
    pdf.body_text("Duracion estimada del desarrollo en sprints:")
    pdf.bold_line("4 sprints x 2 semanas = 8 semanas de desarrollo activo")
    pdf.body_text(
        "Nota retrospectiva: el proyecto academico OctoTask transcurrio en aproximadamente "
        "5 meses calendario (enero-mayo 2026), incluyendo actividades del programa MTDR, "
        "revisiones con coach, ceremonias Scrum y entregables documentales fuera del tiempo "
        "productivo de sprint."
    )

    pdf.section_title("7. Estimacion del costo del equipo")
    pdf.body_text("Supuestos de recursos:")
    pdf.bullet("Tamano del equipo: 5 estudiantes desarrolladores")
    pdf.bullet("Costo mensual por persona: $25,000 MXN")
    pdf.bullet("Moneda: pesos mexicanos (MXN)")
    pdf.ln(1)
    pdf.bold_line("Costo mensual del equipo: 5 x $25,000 = $125,000 MXN / mes")
    pdf.bold_line("Costo semanal del equipo: $125,000 / 4 = $31,250 MXN / semana")
    pdf.bold_line("Costo base (8 semanas de sprint): $31,250 x 8 = $250,000 MXN")
    pdf.bold_line("Costo calendario (5 meses): $125,000 x 5 = $625,000 MXN")

    pdf.section_title("8. Factor de contingencia")
    pdf.body_text(
        "Se aplica un factor del 20% para cubrir incertidumbre, cambios de requisitos, "
        "integracion con servicios cloud (OCI, Telegram, Gemini) e imprevistos tecnicos."
    )
    pdf.bold_line("Costo base + 20% (metodologia SP): $250,000 x 1.20 = $300,000 MXN")
    pdf.bold_line("Costo calendario + 20%: $625,000 x 1.20 = $750,000 MXN")

    pdf.section_title("9. Resumen de la estimacion")
    summary_rows = [
        ("Concepto", "Valor"),
        ("1. Total Story Points", "102 SP"),
        ("2. Velocidad promedio", "26 SP / sprint"),
        ("3. Duracion del sprint", "2 semanas"),
        ("4. Sprints estimados", "4 sprints"),
        ("5. Tiempo de desarrollo (sprints)", "8 semanas"),
        ("6. Costo mensual del equipo", "$125,000 MXN"),
        ("7. Costo base (metodologia SP)", "$250,000 MXN"),
        ("8. Costo final con 20% contingencia (SP)", "$300,000 MXN"),
        ("9. Costo calendario real (5 meses)", "$625,000 MXN"),
        ("10. Costo calendario + contingencia", "$750,000 MXN"),
    ]
    pdf.simple_table((120, 60), summary_rows)

    pdf.section_title("10. Conclusion")
    pdf.body_text(
        "La estimacion basada en Story Points y velocidad del equipo proyecta un costo de "
        "desarrollo activo de $300,000 MXN (incluyendo contingencia) para completar 102 Story "
        "Points en cuatro sprints. Esta cifra refleja el esfuerzo de desarrollo medido en "
        "capacidad de sprint."
    )
    pdf.body_text(
        "Desde una perspectiva retrospectiva de costo real del proyecto academico, considerando "
        "cinco meses calendario de participacion del equipo completo a $25,000 MXN por persona, "
        "el costo total asciende a $750,000 MXN con contingencia."
    )
    pdf.body_text(
        "El proceso completo demuestra la logica Story Points -> Velocidad -> Sprints -> "
        "Tiempo -> Costo, aplicada al caso real OctoTask con evidencia documental del repositorio "
        "y la arquitectura del sistema."
    )

    pdf.output(str(CONTENT_PDF))


def merge_with_cover() -> None:
    cover_reader = PdfReader(str(COVER_PDF))
    content_reader = PdfReader(str(CONTENT_PDF))
    writer = PdfWriter()
    writer.add_page(cover_reader.pages[0])
    for page in content_reader.pages:
        writer.add_page(page)
    with OUTPUT_PDF.open("wb") as f:
        writer.write(f)
    CONTENT_PDF.unlink(missing_ok=True)


if __name__ == "__main__":
    build_content_pdf()
    merge_with_cover()
    print(f"Generated: {OUTPUT_PDF}")
