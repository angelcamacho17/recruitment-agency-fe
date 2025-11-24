import { Component, Input, OnInit, ElementRef, ViewChild, AfterViewInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-activity-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
      <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Actividad Diaria (Últimos 30 días)</h3>
      <div class="relative" style="height: 250px;">
        <canvas #chartCanvas></canvas>
      </div>
    </div>
  `
})
export class ActivityChartComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() dailyActivity: any[] = [];
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  private chart: Chart | null = null;

  ngOnInit() {}

  ngAfterViewInit() {
    this.createChart();
  }

  ngOnChanges() {
    if (this.chart) {
      this.updateChart();
    }
  }

  createChart() {
    if (!this.chartCanvas || !this.dailyActivity) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const labels = this.dailyActivity.map(item => {
      const date = new Date(item.date);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    });

    const messagesData = this.dailyActivity.map(item => parseInt(item.messages_sent));
    const contactsData = this.dailyActivity.map(item => parseInt(item.unique_contacts));

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Mensajes Enviados',
            data: messagesData,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4
          },
          {
            label: 'Contactos Únicos',
            data: contactsData,
            borderColor: 'rgb(16, 185, 129)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 12,
              font: {
                size: 11
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              font: {
                size: 10
              }
            }
          },
          x: {
            ticks: {
              font: {
                size: 10
              },
              maxRotation: 45,
              minRotation: 45
            }
          }
        }
      }
    });
  }

  updateChart() {
    if (!this.chart || !this.dailyActivity) return;

    const labels = this.dailyActivity.map(item => {
      const date = new Date(item.date);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    });

    const messagesData = this.dailyActivity.map(item => parseInt(item.messages_sent));
    const contactsData = this.dailyActivity.map(item => parseInt(item.unique_contacts));

    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = messagesData;
    this.chart.data.datasets[1].data = contactsData;
    this.chart.update();
  }
}
