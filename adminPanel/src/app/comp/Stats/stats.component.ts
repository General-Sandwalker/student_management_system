import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables, ChartType, ChartConfiguration } from 'chart.js';
import { StatsService, ChartData } from '../../services/stats.service';

Chart.register(...registerables);

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
  constructor(private statsService: StatsService) { }

  deptChartData: ChartData | null = null;
  courseChartData: ChartData | null = null;
  passFailChartData: ChartData | null = null;

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  deptChartType: ChartType = 'bar';
  courseChartType: ChartType = 'doughnut';
  passFailChartType: ChartType = 'doughnut';

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.statsService.getDeptChartData().subscribe(data => {
      this.deptChartData = data;
    });

    this.statsService.getCourseChartData().subscribe(data => {
      this.courseChartData = data;
    });

    this.statsService.getPassFailChartData().subscribe(data => {
      this.passFailChartData = data;
    });
  }
}